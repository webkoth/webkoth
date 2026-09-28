// Разбор корпуса: вакансия -> строки задач -> типы задач.
// Единица анализа - задача, не технология: стек не покупают.
// Считаем два числа на тип задачи: частоту упоминаний и медиану вилки (бюджет задачи в год).
// Запуск: node marketing/vacancies/analyze.mjs [--min=3]
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, 'data', 'vacancies.jsonl')

/** Заголовки, после которых идут задачи, и те, на которых блок задач кончается. */
const START = /^(чем предстоит заниматься|задачи|обязанности|что предстоит делать|что нужно делать|вам предстоит|что вы будете делать|основные задачи|функционал|зона ответственности)\b/i
const STOP = /^(требования|мы ожидаем|наши ожидания|что мы ждём|что мы ждем|ожидания от кандидата|что мы предлагаем|условия|мы предлагаем|будет плюсом|о нас|о компании|наш стек)\b/i

export function taskLines(description) {
  const lines = String(description ?? '')
    .split('\n')
    .map((s) => s.replace(/^[\s•·—\-–*]+/, '').trim())
    .filter(Boolean)
  const out = []
  let inside = false
  for (const l of lines) {
    if (STOP.test(l)) inside = false
    else if (START.test(l)) { inside = true; continue }
    else if (inside && l.length >= 20 && l.length <= 400) out.push(l)
  }
  // Без явных заголовков берём осмысленные строки целиком: часть работодателей пишет сплошняком.
  if (!out.length) for (const l of lines) if (l.length >= 30 && l.length <= 400) out.push(l)
  return out
}

/** Типы задач. Строится от домена webkoth: документы, отчётность, интеграции, звонки, агенты. */
export const TASKS = [
  { id: 'agents', label: 'ИИ-агенты и оркестрация', re: /(ai|ии|llm)[- ]?агент|agentic|оркестрац|multi-?agent|мультиагент|tool[- ]?use|автономн\w+ агент/i },
  { id: 'rag', label: 'RAG и поиск по документам', re: /\brag\b|retrieval|векторн\w+ (баз|поиск)|поиск по (документ|базе знаний)|база знаний|semantic search|эмбеддинг/i },
  { id: 'docs', label: 'Распознавание и разбор документов', re: /\bocr\b|распознаван\w+ (документ|текст|скан)|извлечен\w+ данных из документ|парсинг документ|первичн\w+ документ|счет[- ]?фактур|накладн/i },
  { id: 'reports', label: 'Отчётность и аналитика', re: /отчётност|отчетност|управленческ\w+ отчёт|управленческ\w+ отчет|дашборд|\bbi\b|витрин\w+ данных|аналитическ\w+ отчёт|сбор отчёт|формирован\w+ отчёт/i },
  { id: 'calls', label: 'Звонки, речь, транскрибация', re: /транскриб|распознаван\w+ речи|\bstt\b|\btts\b|синтез речи|анализ звонк|контрол\w+ качества звонк|речев\w+ аналитик|колл[- ]?центр/i },
  { id: 'support', label: 'Чат-боты и поддержка', re: /чат[- ]?бот|\bбот\b|автоматизац\w+ поддержк|перв\w+ лини|обращен\w+ клиент|телеграм[- ]?бот|операторов поддержки/i },
  { id: 'integr', label: 'Интеграции и 1С', re: /\b1с\b|интеграц\w+ (с|систем)|\bapi\b интеграц|обмен данными|erp|crm|битрикс|маркетплейс|wildberries|ozon/i },
  { id: 'copilot', label: 'Помощник сотрудника и генерация контента', re: /копилот|ассистент\w* сотрудник|генерац\w+ (контент|текст|описан)|копирайт|карточк\w+ товар|саммари|суммариз/i },
  { id: 'code', label: 'Кодогенерация и разработка', re: /кодогенерац|code[- ]?assist|автодополнен|ревью кода|генерац\w+ кода/i },
  { id: 'cv', label: 'Компьютерное зрение', re: /компьютерн\w+ зрен|computer vision|детекц\w+ объект|видеоаналитик|сегментац\w+ изображ|\bocr\b.{0,20}фото/i },
  { id: 'forecast', label: 'Прогнозирование и спрос', re: /прогнозирован|прогноз\w+ спрос|forecast|оптимизац\w+ запас|ценообразован|динамическ\w+ цен/i },
  { id: 'fraud', label: 'Антифрод, риски, скоринг', re: /антифрод|фрод|скоринг|кредитн\w+ риск|комплаенс|проверк\w+ контрагент|\baml\b/i },
  { id: 'recsys', label: 'Рекомендации и персонализация', re: /рекомендательн|recsys|персонализац|ранжирован/i },
  { id: 'hr', label: 'HR и подбор', re: /подбор персонал|резюме|\bhr\b[- ]?процесс|скрининг кандидат|адаптац\w+ сотрудник/i },
  { id: 'mlops', label: 'MLOps и инфраструктура моделей', re: /mlops|деплой модел|инференс|\bgpu\b|дообучен|fine[- ]?tun|квантизац|vllm|мониторинг модел/i },
  { id: 'data', label: 'Данные, разметка, датасеты', re: /разметк\w+ данных|датасет|dataset|очистк\w+ данных|\betl\b|дата[- ]?пайплайн|сбор данных/i },
  { id: 'eval', label: 'Оценка качества и промпты', re: /промпт|prompt|метрик\w+ качества (модел|ответ)|галлюцинац|\beval\b|бенчмарк/i },
]

const num = (c) => (typeof c === 'number' ? c : null)
/** Вилка в год: берём середину, gross как есть. Это оценка бюджета задачи, не зарплата. */
function yearly(comp) {
  if (!comp) return null
  const from = num(comp.from), to = num(comp.to)
  if (!from && !to) return null
  const cur = comp.currencyCode ?? comp.currency ?? 'RUR'
  if (cur !== 'RUR' && cur !== 'RUB') return null
  const mid = from && to ? (from + to) / 2 : (from ?? to)
  return mid * 12
}
const median = (xs) => {
  const a = xs.filter((x) => x != null).sort((x, y) => x - y)
  return a.length ? a[Math.floor(a.length / 2)] : null
}

if (!existsSync(OUT)) {
  console.log('нет data/vacancies.jsonl - сначала проход B')
  process.exit(0)
}
const recs = readFileSync(OUT, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))

// Отрасль подшиваем из employers.jsonl по companyId: в записи вакансии её может не быть,
// если проход по работодателям шёл параллельно.
const EMP = join(here, 'data', 'employers.jsonl')
const IT = /информационные технологии|системная интеграция|интернет/i
const emp = new Map()
if (existsSync(EMP))
  for (const l of readFileSync(EMP, 'utf8').split('\n'))
    if (l.trim()) {
      const e = JSON.parse(l)
      emp.set(String(e.id), e)
    }
const industriesOf = (r) => emp.get(String(r.companyId))?.industries ?? r.industries ?? []
/** Заказчик - тот, у кого есть отрасль вне ИТ. Только ИТ - исполнитель, предмет разведки. */
const isCustomer = (r) => {
  const ind = industriesOf(r)
  if (!ind.length) return null
  return !ind.every((i) => IT.test(i))
}
const minCount = Number((process.argv.find((a) => a.startsWith('--min=')) ?? '--min=3').split('=')[1])

const stat = new Map(TASKS.map((t) => [t.id, { ...t, n: 0, companies: new Set(), salaries: [], examples: [] }]))
const seenAt = new Map()
let idx = 0
for (const r of recs) {
  idx += 1
  const lines = taskLines(r.description)
  const hay = lines.join('\n')
  for (const t of TASKS) {
    if (!t.re.test(hay)) continue
    const s = stat.get(t.id)
    s.n += 1
    if (r.company) s.companies.add(r.company)
    s.salaries.push(yearly(r.compensation))
    if (s.examples.length < 6) {
      const line = lines.find((l) => t.re.test(l))
      if (line) s.examples.push({ company: r.company, line: line.slice(0, 180) })
    }
    if (!seenAt.has(t.id)) seenAt.set(t.id, idx)
  }
}

const rows = [...stat.values()]
  .filter((s) => s.n >= minCount)
  .map((s) => ({
    id: s.id, label: s.label, n: s.n,
    share: +((100 * s.n) / recs.length).toFixed(1),
    companies: s.companies.size,
    medianYear: median(s.salaries),
    examples: s.examples,
  }))
  .sort((a, b) => b.n - a.n)

const nCust = recs.filter((r) => isCustomer(r) === true).length
const nExec = recs.filter((r) => isCustomer(r) === false).length
console.log(
  `Корпус: ${recs.length} вакансий, ${new Set(recs.map((r) => r.company)).size} компаний | ` +
    `заказчик ${nCust}, исполнитель ${nExec}, отрасль неизвестна ${recs.length - nCust - nExec}\n`,
)
console.log('Тип задачи'.padEnd(42) + 'вакансий'.padStart(9) + 'доля'.padStart(7) + 'компаний'.padStart(10) + 'медиана/год'.padStart(13))
for (const r of rows)
  console.log(
    r.label.padEnd(42) +
      String(r.n).padStart(9) +
      `${r.share}%`.padStart(7) +
      String(r.companies).padStart(10) +
      (r.medianYear ? `${(r.medianYear / 1e6).toFixed(2)} млн` : '—').padStart(13),
  )

// Задача x отрасль: только заказчики, ИТ-работодатели картину искажают.
const cross = new Map()
for (const r of recs) {
  if (isCustomer(r) !== true) continue
  const lines = taskLines(r.description).join('\n')
  for (const t of TASKS) {
    if (!t.re.test(lines)) continue
    for (const ind of industriesOf(r)) {
      if (IT.test(ind)) continue
      const key = ind.split(',')[0]
      const row = cross.get(key) ?? new Map()
      row.set(t.label, (row.get(t.label) ?? 0) + 1)
      cross.set(key, row)
    }
  }
}
if (cross.size) {
  console.log('\nЗадача x отрасль (только заказчики), топ по отраслям:')
  const sorted = [...cross.entries()].sort(
    (a, b) => [...b[1].values()].reduce((x, y) => x + y, 0) - [...a[1].values()].reduce((x, y) => x + y, 0),
  )
  for (const [ind, row] of sorted.slice(0, 12)) {
    const top = [...row.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
    console.log(`  ${ind.slice(0, 34).padEnd(35)} ${top.map(([l, c]) => `${l} ${c}`).join(' · ')}`)
  }
}

// Насыщение считаем по формулировкам, а не по своим же типам: типы предзаданы и насыщаются сразу.
// Ключ - биграмма основ слов из строки задачи; учитываем только те, что встречаются в корпусе >=3 раз.
const STOPW = new Set('и в на с по для не что как из от до за the and или а к у о при это его их наш ваш мы вы'.split(' '))
const stems = (line) =>
  line.toLowerCase().replace(/[^a-zа-яё0-9 ]/gi, ' ').split(/\s+/)
    .filter((w) => w.length > 3 && !STOPW.has(w)).map((w) => w.slice(0, 6))
const bigramsOf = (r) => {
  const set = new Set()
  for (const line of taskLines(r.description)) {
    const t = stems(line)
    for (let i = 0; i + 1 < t.length; i++) set.add(`${t[i]} ${t[i + 1]}`)
  }
  return set
}
const perVac = recs.map(bigramsOf)
const freq = new Map()
for (const s of perVac) for (const b of s) freq.set(b, (freq.get(b) ?? 0) + 1)
const solid = new Set([...freq.entries()].filter(([, c]) => c >= 3).map(([b]) => b))

const seen = new Set()
const curve = []
perVac.forEach((s, i) => {
  for (const b of s) if (solid.has(b)) seen.add(b)
  if ((i + 1) % 100 === 0) curve.push([i + 1, seen.size])
})
console.log(`\nНасыщение по формулировкам (устойчивых биграмм всего ${solid.size}):`)
console.log('  ' + curve.map(([a, b]) => `${a}:${b}`).join('  '))
for (let i = 1; i < curve.length; i++) {
  const growth = (100 * (curve[i][1] - curve[i - 1][1])) / curve[i - 1][1]
  if (i === curve.length - 1)
    console.log(`  прирост на последней сотне: ${growth.toFixed(1)}%${growth < 5 ? ' - насыщение достигнуто' : ' - сбор ещё даёт новое'}`)
}

writeFileSync(join(here, 'data', 'tasks.json'), JSON.stringify(rows, null, 2))
console.log('\nсохранено: marketing/vacancies/data/tasks.json')
