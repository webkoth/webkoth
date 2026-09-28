// Проход по работодателям: отрасль, размер, сайт, ИТ-аккредитация.
// Нужен, чтобы отделить заказчика (отраслевая компания) от исполнителя (ИТ, интегратор, продукт)
// и чтобы получить аутрич-список: у кого открыта AI-вакансия, тот уже заложил бюджет.
// Запуск: node marketing/vacancies/employers.mjs [--limit=2000]
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Blocked, fetchHtml, initialState, pause } from './hh.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const IDS = join(here, 'data', 'ids.json')
const OUT = join(here, 'data', 'employers.jsonl')
const limit = Number((process.argv.find((a) => a.startsWith('--limit=')) ?? '--limit=2000').split('=')[1])

const ids = JSON.parse(readFileSync(IDS, 'utf8'))
// Только зачищенный корпус: вакансии, где ИИ строят, а не упоминают (см. filter.py).
const KEPT = join(here, 'data', 'kept-ids.json')
const keep = existsSync(KEPT) ? new Set(JSON.parse(readFileSync(KEPT, 'utf8')).map(String)) : null
if (!keep) console.log('kept-ids.json нет - идём по всему корпусу')
const byCompany = new Map()
for (const r of Object.values(ids)) {
  if (keep && !keep.has(String(r.id))) continue
  if (!r.companyId) continue
  const c = byCompany.get(String(r.companyId)) ?? { id: String(r.companyId), name: r.company, vacancies: 0, queries: new Set() }
  c.vacancies += 1
  for (const q of r.queries) c.queries.add(q)
  byCompany.set(c.id, c)
}

const done = new Set()
if (existsSync(OUT))
  for (const l of readFileSync(OUT, 'utf8').split('\n')) if (l.trim()) done.add(String(JSON.parse(l).id))

// Отрасли приходят как {id, trl, items}: название лежит в trl.
const names = (x) => (Array.isArray(x) ? x : Object.values(x ?? {})).map((i) => i?.trl ?? i?.name).filter(Boolean)

// Больше открытых AI-вакансий - серьёзнее намерение, идём сверху.
const queue = [...byCompany.values()]
  .filter((c) => !done.has(c.id))
  .sort((a, b) => b.vacancies - a.vacancies)
  .slice(0, Math.max(0, limit - done.size))

console.log(`работодателей всего ${byCompany.size}, в очереди ${queue.length}, собрано ${done.size}`)
let n = 0
for (const c of queue) {
  let html
  try {
    html = await fetchHtml(`https://hh.ru/employer/${c.id}`)
  } catch (e) {
    if (e instanceof Blocked) { console.log(`остановлен: ${e.message}. Собрано ${done.size + n}`); break }
    throw e
  }
  const info = (html && initialState(html))?.employerInfo
  if (info && typeof info === 'object') {
    appendFileSync(
      OUT,
      JSON.stringify({
        id: c.id,
        name: info.name ?? c.name,
        industries: names(info.industries),
        size: info.sizeCategory ?? null,
        site: info.site?.href ?? info.site?.hostname ?? null,
        city: typeof info.address === 'string' ? info.address : (info.address?.city ?? null),
        itAccredited: Boolean(info.accreditedITEmployer),
        aiVacancies: c.vacancies,
        queries: [...c.queries],
      }) + '\n',
    )
  }
  n += 1
  if (n % 50 === 0) console.log(`${done.size + n} / ${done.size + queue.length}`)
  await pause(2000)
}
console.log(`готово: ${done.size + n}`)
