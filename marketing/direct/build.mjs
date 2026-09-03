// Генератор файлов импорта для Директ Коммандера из kampanii.mjs.
// Формат повторяет официальный шаблон example-v2.csv (55 колонок, разделитель «;», CRLF,
// UTF-8 без BOM): одна кампания на файл, первая строка группы «-», остальные «+».
// Запуск: node marketing/direct/build.mjs  → marketing/direct/dist/<кампания>.csv + summary.md
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COUNTER, NEGATIVES_COMMON, REGION, SITE, campaigns } from './kampanii.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, 'dist')
mkdirSync(out, { recursive: true })

// Колонки шаблона Коммандера в исходном порядке. Индексы с 1 совпадают с example-v2.csv.
const HEADER = [
  'Доп. объявление группы', 'Тип объявления', 'ID группы', 'Название группы', 'Номер группы', 'Тип кампании', 'Валюта',
  'ID фразы', 'Фраза (с минус-словами)', 'ID объявления',
  'Заголовок 1', 'Заголовок 2', 'Текст', // старый блок ТГО, не заполняем
  'Заголовок 1', 'Заголовок 2', 'Заголовок 3', 'Заголовок 4', 'Заголовок 5', 'Заголовок 6', 'Заголовок 7',
  'Текст 1', 'Текст 2', 'Текст 3',
  'Изображение 1', 'Изображение 2', 'Изображение 3', 'Изображение 4', 'Изображение 5',
  'Вертикальное видео 1', 'Вертикальное видео 2', 'Квадратное видео 1', 'Квадратное видео 2',
  'Горизонтальное видео 1', 'Горизонтальное видео 2', 'Статус модерации ассетов',
  'Ссылка', 'Отображаемая ссылка', 'Регион', 'Ставка', 'Ставка в сетях', 'Организация Яндекс Бизнеса',
  'Статус объявления', 'Статус фразы',
  'Заголовки быстрых ссылок', 'Описания быстрых ссылок', 'Адреса быстрых ссылок',
  'Параметр 1', 'Параметр 2', 'Метки', 'Изображение', 'Креатив', 'Статус модерации креатива',
  'Уточнения', 'Минус-фразы на группу', 'Возрастные ограничения',
]
const COL = Object.freeze({
  extra: 1, adType: 2, groupName: 4, groupNo: 5, campType: 6, currency: 7, phrase: 9,
  h: 14, // Заголовок 1 комбинаторного блока; далее +1 до 20
  t: 21, // Текст 1; далее +1 до 23
  link: 36, display: 37, region: 38, bid: 39, bidNet: 40,
  slTitles: 44, slDescs: 45, slHrefs: 46, labels: 49, callouts: 53, groupNeg: 54,
})

const LIMITS = { h: 56, word: 22, t: 81, display: 20, slTitle: 30, slDesc: 60, callout: 25, kwWords: 7, kwPerGroup: 200 }
const CAMPAIGN_TYPE = 'Единая перфоманс-кампания'
const AD_TYPE = 'Комбинаторное'
const DISPLAY = { kontur: 'контур-1С', 'it-director': 'ИТ-директор', agent: 'ИИ-агент-вердикт', finance: 'финансы-1С' }

const errors = []
const check = (cond, msg) => { if (!cond) errors.push(msg) }
const noDash = (s, where) => check(!/—/.test(s), `длинное тире: ${where}: ${s}`)

function utmLink(c, g) {
  const path = g.path ?? c.path
  const q = new URLSearchParams({ ...(c.query ?? {}), utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: c.utm.campaign, utm_content: g.slug })
  // Динамические параметры Директа не кодируем: {keyword} и {source} подставляет сам Директ.
  const term = c.kind === 'network' ? '{source}' : '{keyword}'
  return { base: `${SITE}${path}?${q.toString()}`, full: `${SITE}${path}?${q.toString()}&utm_term=${term}` }
}

function sitelinkHref(c, g, href) {
  const [p, anchor] = href.split('#')
  const q = new URLSearchParams({ ...(p === c.path ? c.query ?? {} : {}), utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: c.utm.campaign, utm_content: `${g.slug}-sitelink` })
  return `${SITE}${p}?${q.toString()}${anchor ? `#${anchor}` : ''}`
}

function csvCell(v) {
  const s = v == null ? '' : String(v)
  return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function rowFor({ extra, group, groupNo, phrase, ad, link, display, bid, bidNet, sitelinks, callouts, negatives }) {
  const r = new Array(HEADER.length).fill('')
  const set = (i, v) => { r[i - 1] = v }
  set(COL.extra, extra)
  set(COL.adType, AD_TYPE)
  set(COL.groupName, group)
  set(COL.groupNo, groupNo)
  set(COL.campType, CAMPAIGN_TYPE)
  set(COL.currency, 'RUB')
  set(COL.phrase, phrase)
  ad.headlines.forEach((h, i) => set(COL.h + i, h))
  ad.texts.forEach((t, i) => set(COL.t + i, t))
  set(COL.link, link)
  set(COL.display, display)
  set(COL.region, REGION)
  set(COL.bid, bid)
  set(COL.bidNet, bidNet)
  set(COL.slTitles, sitelinks.map((s) => s.title).join('||'))
  set(COL.slDescs, sitelinks.map((s) => s.desc).join('||'))
  set(COL.slHrefs, sitelinks.map((s) => s.href).join('||'))
  set(COL.callouts, callouts.join('||'))
  set(COL.groupNeg, negatives.join(', '))
  return r
}

// Комбинаторное объявление группы: все заголовки и тексты из вариантов объявлений.
function combinatorial(g, where) {
  const headlines = []
  const texts = []
  for (const a of g.ads) { headlines.push(a.h1); texts.push(a.text) }
  for (const a of g.ads) if (a.h2) headlines.push(a.h2)
  check(headlines.length <= 7, `${where}: больше 7 заголовков`)
  check(texts.length <= 3, `${where}: больше 3 текстов`)
  for (const h of headlines) {
    check(h.length <= LIMITS.h, `${where}: заголовок ${h.length} > ${LIMITS.h}: ${h}`)
    check(!h.split(/\s+/).some((w) => w.length > LIMITS.word), `${where}: слово длиннее ${LIMITS.word}: ${h}`)
    noDash(h, where)
  }
  for (const t of texts) { check(t.length <= LIMITS.t, `${where}: текст ${t.length} > ${LIMITS.t}: ${t}`); noDash(t, where) }
  return { headlines, texts }
}

const summary = []
let groupNo = 0
for (const c of campaigns) {
  const lines = []
  const pad = ';'.repeat(HEADER.length - 1)
  lines.push('example-new') // маркер формата из официального шаблона
  lines.push(`${c.name}${pad}`)
  lines.push(pad)
  lines.push(HEADER.join(';'))

  const display = DISPLAY[c.id] ?? DISPLAY[c.path?.slice(1)] ?? ''
  const campaignNegatives = [...NEGATIVES_COMMON, ...(c.negatives ?? [])]
  const bid = c.kind === 'network' ? '10' : '30'
  const bidNet = '10'
  let rows = 0
  let kws = 0

  for (const g of c.groups) {
    groupNo += 1
    const where = `${c.id}/${g.slug}`
    const ad = combinatorial(g, where)
    const disp = DISPLAY[g.slug] ?? display
    check(disp.length <= LIMITS.display, `${where}: отображаемая ссылка > ${LIMITS.display}`)
    const sitelinks = (g.sitelinks ?? c.sitelinks ?? []).map((s) => ({ ...s, href: sitelinkHref(c, g, s.href) }))
    const callouts = g.callouts ?? c.callouts ?? []
    check(sitelinks.length <= 8, `${where}: больше 8 быстрых ссылок`)
    for (const s of sitelinks) {
      check(s.title.length <= LIMITS.slTitle, `${where}: быстрая ссылка > ${LIMITS.slTitle}: ${s.title}`)
      check(s.desc.length <= LIMITS.slDesc, `${where}: описание быстрой ссылки > ${LIMITS.slDesc}: ${s.desc}`)
    }
    for (const co of callouts) check(co.length <= LIMITS.callout, `${where}: уточнение > ${LIMITS.callout}: ${co}`)
    check(g.keywords.length <= LIMITS.kwPerGroup, `${where}: больше 200 фраз`)
    const negatives = [...campaignNegatives, ...(g.negatives ?? [])]
    // Минус-слова не должны гасить собственные фразы группы.
    for (const k of g.keywords) {
      check(k.split(/\s+/).length <= LIMITS.kwWords, `${where}: фраза длиннее 7 слов: ${k}`)
      const kwWords = k.toLowerCase().split(/\s+/)
      for (const n of negatives) {
        const nw = n.toLowerCase().split(/\s+/)
        check(!nw.every((w) => kwWords.includes(w)), `${where}: минус-слово «${n}» гасит фразу «${k}»`)
      }
    }
    const { full: link } = utmLink(c, g)
    const phrases = [...g.keywords, '---autotargeting']
    phrases.forEach((phrase, i) => {
      lines.push(rowFor({ extra: i === 0 ? '-' : '+', group: g.name, groupNo, phrase, ad, link, display: disp, bid, bidNet, sitelinks, callouts, negatives }).map(csvCell).join(';'))
      rows += 1
    })
    kws += g.keywords.length
    summary.push({ campaign: c.name, group: g.name, kws: g.keywords.length, headlines: ad.headlines.length, texts: ad.texts.length, link })
  }
  writeFileSync(join(out, `${c.id}.csv`), lines.join('\r\n') + '\r\n', 'utf8')
  console.log(`${c.id}.csv: групп ${c.groups.length}, фраз ${kws}, строк ${rows}`)
}

if (errors.length) {
  console.error(`\nОшибки (${errors.length}):\n- ` + errors.join('\n- '))
  process.exit(1)
}

// Сводка для README и для сверки после импорта.
const md = [
  `# Сводка файлов импорта (счётчик Метрики ${COUNTER}, регион ${REGION})`,
  '',
  '| Кампания | Группа | Фраз | Заголовков | Текстов | Ссылка |',
  '|---|---|---:|---:|---:|---|',
  ...summary.map((s) => `| ${s.campaign} | ${s.group} | ${s.kws} | ${s.headlines} | ${s.texts} | ${s.link} |`),
  '',
]
writeFileSync(join(out, 'summary.md'), md.join('\n'), 'utf8')
console.log(`summary.md: ${summary.length} групп`)
