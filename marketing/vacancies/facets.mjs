// Матрица «запрос × отрасль» из фасета выдачи: hh отдаёт счётчики по отраслям вместе с поиском.
// Даёт отраслевой разрез без похода на страницу каждого работодателя.
// Запуск: node marketing/vacancies/facets.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchHtml, initialState, pause, searchUrl } from './hh.mjs'
import { ALL_QUERIES } from './queries.mjs'

const here = dirname(fileURLToPath(import.meta.url))

const industries = await (await fetch('https://api.hh.ru/industries', { headers: { 'User-Agent': 'webkoth-research/0.1' } })).json()
const name = new Map(industries.map((i) => [String(i.id), i.name]))

const matrix = {}
for (const q of ALL_QUERIES) {
  const html = await fetchHtml(searchUrl(q, 113))
  const d = html && initialState(html)
  const groups = d?.searchClusters?.industry?.groups
  if (!groups) { console.log(`нет фасета: ${q}`); await pause(); continue }
  const row = {}
  for (const g of Object.values(groups)) {
    const n = name.get(String(g.id))
    if (n && g.count) row[n] = g.count
  }
  matrix[q] = row
  const top = Object.entries(row).sort((a, b) => b[1] - a[1]).slice(0, 3)
  console.log(`${q}\n   ${top.map(([n, c]) => `${c} ${n.split(',')[0]}`).join(' | ')}`)
  await pause()
}

// Свод: сумма по отраслям без ИТ - именно там сидит заказчик, а не исполнитель.
const totals = {}
for (const row of Object.values(matrix))
  for (const [n, c] of Object.entries(row)) totals[n] = (totals[n] ?? 0) + c

console.log('\nОтрасли по сумме упоминаний во всех запросах:')
for (const [n, c] of Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 15))
  console.log(`${String(c).padStart(7)}  ${n}`)

writeFileSync(join(here, 'data', 'facets.json'), JSON.stringify({ matrix, totals }, null, 2))
console.log('\nсохранено: marketing/vacancies/data/facets.json')
