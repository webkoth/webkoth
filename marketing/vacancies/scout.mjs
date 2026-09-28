// Разведка объёма до сбора: сколько вакансий отдаёт поиск по каждому запросу и гео.
// Запуск: node marketing/vacancies/scout.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchHtml, initialState, pause, searchUrl } from './hh.mjs'
import { ALL_QUERIES, AREAS, QUERIES } from './queries.mjs'

const here = dirname(fileURLToPath(import.meta.url))

async function total(text, area) {
  const html = await fetchHtml(searchUrl(text, area))
  const d = html && initialState(html)
  const vs = d?.vacancySearchResult
  if (!vs) return { total: null, months: {} }
  const months = {}
  for (const v of vs.vacancies ?? []) {
    const t = String(v.publicationTime?.$ ?? v.publicationTime ?? '').slice(0, 7)
    if (t) months[t] = (months[t] ?? 0) + 1
  }
  return { total: vs.totalResults, months }
}

const group = (q) =>
  QUERIES.yadro.includes(q) ? 'ядро' : QUERIES.shirokie.includes(q) ? 'широкие' : 'прикладные'

const rows = []
console.log('== Россия ==')
for (const q of ALL_QUERIES) {
  const { total: n, months } = await total(q, 113)
  rows.push({ query: q, group: group(q), area: 113, total: n })
  console.log(`${String(n).padStart(6)}  ${group(q).padEnd(11)} ${q}   ${JSON.stringify(months)}`)
  await pause()
}

console.log('\n== СНГ, ядро ==')
for (const [id, name] of Object.entries(AREAS)) {
  if (id === '113') continue
  let sum = 0
  for (const q of ['LLM', '"искусственный интеллект"']) {
    const { total: n } = await total(q, id)
    rows.push({ query: q, group: group(q), area: Number(id), total: n })
    sum += n ?? 0
    await pause()
  }
  console.log(`${String(sum).padStart(6)}  ${name} (LLM + «искусственный интеллект»)`)
}

writeFileSync(join(here, 'scout.json'), JSON.stringify(rows, null, 2))
console.log('\nсохранено: marketing/vacancies/scout.json')
