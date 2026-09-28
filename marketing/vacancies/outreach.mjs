// Аутрич-список: компании с открытой AI-вакансией - это подтверждённый бюджет без исполнителя.
// Отсекаем ИТ и интеграторов (они исполнители, не клиенты) и гигантов (вне сегмента 10-200).
// Ранг: сколько позиций открыто x годовой бюджет позиции = сколько денег уже подписано под задачу.
// Запуск: node marketing/vacancies/outreach.mjs [--min-budget=1000000]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const data = (f) => join(here, 'data', f)
/** Прикладные запросы: задача описана языком бизнеса, а не стека. */
const APPLIED = new Set([
  '"распознавание документов"', '"автоматизация отчетности"', 'транскрибация', 'OCR', '"чат-бот"',
  '"автоматизация процессов" AND (ИИ OR AI OR LLM)', '1С AND (ИИ OR AI OR LLM)',
])
const minBudget = Number((process.argv.find((a) => a.startsWith('--min-budget=')) ?? '--min-budget=0').split('=')[1])

const employers = readFileSync(data('employers.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
const ids = JSON.parse(readFileSync(data('ids.json'), 'utf8'))
const kept = new Set(JSON.parse(readFileSync(data('kept-ids.json'), 'utf8')).map(String))

const IT = /информационные технологии|системная интеграция|интернет/i
/** Гиганты вне сегмента 10-200: у них своя разработка, подряд им не нужен. */
const GIANT = new Set(['largest', 'large'])
/**
 * Кадровые агентства публикуют вакансию за клиента: бюджет не их, писать им бессмысленно.
 * Отдельной отрасли под них у hh нет, все сидят в «Услугах для бизнеса», поэтому по названию.
 */
const STAFFING = /рекрут|кадров\w* агентств|кадровое|staff|подбор персонала|хантинг|headhunt|аутстафф|аутсорсинг персонала|\bhr\b|консалт\w* групп/i
/** Больше восьми открытых AI-позиций - это не компания на 10-200 человек. */
const TOO_BIG = 8

const rub = (c) => {
  if (!c) return null
  if ((c.currencyCode ?? c.currency ?? 'RUR') !== 'RUR' && (c.currencyCode ?? c.currency) !== 'RUB') return null
  const { from, to } = c
  return !from && !to ? null : from && to ? (from + to) / 2 : from ?? to
}
const median = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : null)

const vacByCompany = new Map()
for (const r of Object.values(ids)) {
  if (!kept.has(String(r.id)) || !r.companyId) continue
  const list = vacByCompany.get(String(r.companyId)) ?? []
  list.push(r)
  vacByCompany.set(String(r.companyId), list)
}

const rows = []
for (const e of employers) {
  const ind = e.industries ?? []
  if (ind.length && ind.every((i) => IT.test(i))) continue
  if (!ind.length && e.itAccredited) continue
  if (GIANT.has(e.size)) continue
  if (STAFFING.test(e.name ?? '')) continue
  const vac = vacByCompany.get(String(e.id)) ?? []
  if (!vac.length || vac.length > TOO_BIG) continue
  const sal = vac.map((v) => rub(v.compensation)).filter(Boolean)
  const med = median(sal)
  const budget = med ? med * 12 * vac.length : null
  if (minBudget && (!budget || budget < minBudget)) continue
  const qs = new Set(vac.flatMap((v) => v.queries))
  rows.push({
    company: e.name,
    is1C: qs.has('1С AND (ИИ OR AI OR LLM)'),
    isApplied: [...qs].some((q) => APPLIED.has(q)),
    industries: ind.filter((i) => !IT.test(i)),
    city: e.city,
    site: e.site,
    size: e.size,
    openAiVacancies: vac.length,
    medianMonth: med,
    yearBudget: budget,
    roles: [...new Set(vac.map((v) => v.name))].slice(0, 5),
  })
}

// Сначала те, к кому есть готовый оффер: 1С, потом прикладные, внутри - по подписанному бюджету.
rows.sort(
  (a, b) =>
    Number(b.is1C) - Number(a.is1C) ||
    Number(b.isApplied) - Number(a.isApplied) ||
    (b.yearBudget ?? 0) - (a.yearBudget ?? 0),
)
writeFileSync(data('outreach.json'), JSON.stringify(rows, null, 2))

const csv = [
  'Компания;1С;Прикладная;Отрасль;Город;Сайт;Размер;Открытых AI-вакансий;Медиана ₽/мес;Бюджет ₽/год;Роли',
  ...rows.map((r) =>
    [r.company, r.is1C ? 'да' : '', r.isApplied ? 'да' : '', r.industries.join(' / '), r.city ?? '', r.site ?? '',
     r.size ?? '', r.openAiVacancies, r.medianMonth ?? '', r.yearBudget ?? '', r.roles.join(' | ')]
      .map((x) => String(x).replace(/;/g, ',')).join(';'),
  ),
].join('\n')
writeFileSync(data('outreach.csv'), '﻿' + csv)

console.log(`Аутрич-список: ${rows.length} компаний-заказчиков\n`)
console.log('Компания'.padEnd(34) + 'вак.'.padStart(5) + '₽/мес'.padStart(10) + 'бюджет/год'.padStart(13) + '  отрасль')
for (const r of rows.slice(0, 25))
  console.log(
    r.company.slice(0, 33).padEnd(34) + String(r.openAiVacancies).padStart(5) +
    (r.medianMonth ? (r.medianMonth / 1000).toFixed(0) + 'к' : '—').padStart(10) +
    (r.yearBudget ? (r.yearBudget / 1e6).toFixed(1) + ' млн' : '—').padStart(13) +
    '  ' + (r.industries[0] ?? '').split(',')[0].slice(0, 34),
  )
console.log(`\nсохранено: data/outreach.json и data/outreach.csv`)
