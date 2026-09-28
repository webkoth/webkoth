// Сбор корпуса вакансий с hh.ru в два прохода.
// A: поиск по словарю -> id и карточки (дешёво, ~250 запросов).
// B: страница каждой вакансии -> описание с задачами (дорого, ~2.5 c на штуку).
// Оба прохода возобновляемые: A пишет ids.json, B дописывает vacancies.jsonl и пропускает собранное.
// Запуск: node marketing/vacancies/collect.mjs [--stage=a|b|ab] [--limit=2500]
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Blocked, fetchHtml, initialState, pause, searchUrl, vacancyUrl } from './hh.mjs'
import { ALL_QUERIES, QUERIES } from './queries.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const IDS = join(here, 'data', 'ids.json')
const OUT = join(here, 'data', 'vacancies.jsonl')

const arg = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`))
  return a ? a.split('=')[1] : def
}
const stage = arg('stage', 'ab')
const limit = Number(arg('limit', 2500))
// Пауза настраивается: когда проходы идут параллельно, суммарный темп к hh держим прежним.
const PAUSE = Number(arg('pause', 2000))

const readJson = (p, def) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : def)

/** Отрасль работодателя из employers.jsonl: заказчик важнее исполнителя. */
const EMPLOYERS = join(here, 'data', 'employers.jsonl')
const IT = /информационные технологии|системная интеграция|интернет/i
function customers() {
  const m = new Map()
  if (!existsSync(EMPLOYERS)) return m
  for (const l of readFileSync(EMPLOYERS, 'utf8').split('\n')) {
    if (!l.trim()) continue
    const e = JSON.parse(l)
    const onlyIt = e.industries.length > 0 && e.industries.every((i) => IT.test(i))
    m.set(String(e.id), { customer: !onlyIt && !(e.industries.length === 0 && e.itAccredited), industries: e.industries })
  }
  return m
}
const CUST = customers()

/**
 * Приоритет описаний: сначала заказчик на прикладных словах, потом заказчик вообще,
 * ИТ-компании в конец - они предмет разведки, а не продажи.
 */
const priority = (r) => {
  const c = CUST.get(String(r.companyId))
  const isCustomer = c ? c.customer : true
  const applied = r.queries.some((q) => QUERIES.prikladnye.includes(q))
  const core = r.queries.some((q) => QUERIES.yadro.includes(q))
  if (isCustomer) return applied ? 0 : core ? 1 : 2
  return applied ? 3 : 4
}

async function stageA() {
  const ids = readJson(IDS, {})
  for (const q of ALL_QUERIES) {
    let page = 0
    let seen = 0
    for (;;) {
      const html = await fetchHtml(searchUrl(q, 113, page))
      const vs = (html && initialState(html))?.vacancySearchResult
      const list = vs?.vacancies ?? []
      if (!list.length) break
      for (const v of list) {
        const id = String(v.vacancyId)
        const rec = (ids[id] ??= {
          id,
          name: v.name,
          company: v.company?.visibleName ?? v.company?.name ?? null,
          companyId: v.company?.id ?? null,
          area: v.area?.name ?? null,
          compensation: v.compensation ?? null,
          published: v.publicationTime?.$ ?? null,
          queries: [],
        })
        if (!rec.queries.includes(q)) rec.queries.push(q)
      }
      seen += list.length
      page += 1
      if (page > 40 || seen >= (vs.totalResults ?? 0)) break
      await pause(1800)
    }
    writeFileSync(IDS, JSON.stringify(ids, null, 1))
    console.log(`A ${String(seen).padStart(5)}  ${q}   всего уникальных: ${Object.keys(ids).length}`)
    await pause(1800)
  }
  return ids
}

/** Описание приходит html-ом; списки задач держим построчно, они и есть предмет анализа. */
const toText = (html) =>
  String(html ?? '')
    .replace(/<\/(li|p|div|br|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
      e[0] === '#'
        ? String.fromCodePoint(parseInt(e[1].toLowerCase() === 'x' ? e.slice(2) : e.slice(1), e[1].toLowerCase() === 'x' ? 16 : 10))
        : { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[e.toLowerCase()] ?? m,
    )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

async function stageB(ids) {
  const done = new Set()
  if (existsSync(OUT))
    for (const line of readFileSync(OUT, 'utf8').split('\n'))
      if (line.trim()) done.add(String(JSON.parse(line).id))

  const KEPT = join(here, 'data', 'kept-ids.json')
  const keep = existsSync(KEPT) ? new Set(JSON.parse(readFileSync(KEPT, 'utf8')).map(String)) : null
  const queue = Object.values(ids)
    .filter((r) => !done.has(r.id) && (!keep || keep.has(String(r.id))))
    .sort((a, b) => priority(a) - priority(b) || b.queries.length - a.queries.length)
    .slice(0, Math.max(0, limit - done.size))

  const cust = queue.filter((r) => priority(r) <= 2).length
  console.log(`B в очереди ${queue.length} (у заказчиков ${cust}, у ИТ ${queue.length - cust}), уже собрано ${done.size}`)
  if (!CUST.size) console.log('  employers.jsonl пуст - приоритет по заказчику не применён')
  let n = 0
  for (const r of queue) {
    let html
    try {
      html = await fetchHtml(vacancyUrl(r.id))
    } catch (e) {
      if (e instanceof Blocked) {
        console.log(`B остановлен: ${e.message}. Собрано ${done.size + n}, запусти снова позже.`)
        return
      }
      throw e
    }
    const vv = (html && initialState(html))?.vacancyView
    if (vv && typeof vv === 'object') {
      const rec = {
        id: r.id,
        name: vv.name ?? r.name,
        company: vv.company?.visibleName ?? vv.company?.name ?? r.company,
        companyId: vv.company?.id ?? r.companyId,
        itAccredited: JSON.stringify(vv.company?.badges ?? '').includes('it-accreditation'),
        area: vv.area?.name ?? r.area,
        published: vv.publicationDate ?? r.published,
        compensation: vv.compensation ?? r.compensation,
        experience: vv.workExperience ?? null,
        employment: vv.employment ?? null,
        keySkills: vv.keySkills?.keySkill ?? [],
        queries: r.queries,
        industries: CUST.get(String(r.companyId))?.industries ?? [],
        isCustomer: CUST.get(String(r.companyId))?.customer ?? null,
        description: toText(vv.description),
      }
      appendFileSync(OUT, JSON.stringify(rec) + '\n')
    }
    n += 1
    if (n % 25 === 0) console.log(`B ${done.size + n} / ${done.size + queue.length}`)
    await pause(PAUSE)
  }
  console.log(`B готово: ${done.size + n}`)
}

const ids = stage.includes('a') ? await stageA() : readJson(IDS, {})
if (stage.includes('b')) await stageB(ids)
