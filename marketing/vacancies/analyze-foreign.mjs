// Зарубежный срез в тех же типах задач, что и российский - чтобы списки были сравнимы.
// Читается как опережающий индикатор по классам задач. Способы решения и цены не переносим.
// Запуск: node marketing/vacancies/analyze-foreign.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** id совпадают с TASKS из analyze.mjs. */
const TASKS_EN = [
  { id: 'agents', label: 'ИИ-агенты и оркестрация', re: /\bai agents?\b|agentic|orchestrat|multi-?agent|tool[- ]?use|autonomous agent/i },
  { id: 'rag', label: 'RAG и поиск по документам', re: /\brag\b|retrieval[- ]augmented|vector (db|database|search)|semantic search|embedding|knowledge base/i },
  { id: 'docs', label: 'Распознавание и разбор документов', re: /\bocr\b|document (processing|parsing|extraction|understanding|intelligence)|invoice|extract\w* data from document|idp\b/i },
  { id: 'reports', label: 'Отчётность и аналитика', re: /\bbi\b|business intelligence|dashboard|reporting|analytics platform|data warehouse|metrics layer/i },
  { id: 'calls', label: 'Звонки, речь, транскрибация', re: /transcri|speech[- ]to[- ]text|\bstt\b|\btts\b|voice ai|call (center|analytics|recording)|conversation intelligence/i },
  { id: 'support', label: 'Чат-боты и поддержка', re: /chat ?bot|customer (support|service) automation|help ?desk|ticket deflect|first[- ]line support/i },
  { id: 'integr', label: 'Интеграции и учётные системы', re: /\berp\b|\bcrm\b|salesforce|netsuite|sap\b|integration\w* with|api integration|data sync/i },
  { id: 'copilot', label: 'Помощник сотрудника и генерация контента', re: /copilot|assistant for|content generation|copywrit|summariz|drafting/i },
  { id: 'code', label: 'Кодогенерация и разработка', re: /code (generation|assistant|review)|coding agent|developer (tool|productivity)|autocomplete/i },
  { id: 'cv', label: 'Компьютерное зрение', re: /computer vision|object detection|image segmentation|video analytics|visual inspection/i },
  { id: 'forecast', label: 'Прогнозирование и спрос', re: /forecast|demand planning|inventory optimi|dynamic pricing|price optimi/i },
  { id: 'fraud', label: 'Антифрод, риски, скоринг', re: /fraud|risk scoring|credit risk|compliance automation|\bkyc\b|\baml\b/i },
  { id: 'recsys', label: 'Рекомендации и персонализация', re: /recommend\w* (system|engine)|personaliz|ranking model/i },
  { id: 'hr', label: 'HR и подбор', re: /recruit\w* (platform|product|software|tool|saas)|resume (pars|screen|match)|candidate (screening|matching|sourcing)|talent (acquisition|matching) (platform|software)|hiring (platform|software)/i },
  { id: 'mlops', label: 'MLOps и инфраструктура моделей', re: /mlops|model (serving|deployment|inference)|\bgpu\b|fine[- ]?tun|quantiz|vllm|inference (stack|engine)/i },
  { id: 'data', label: 'Данные, разметка, датасеты', re: /data (labeling|annotation|pipeline|engineering)|dataset|\betl\b|data quality/i },
  { id: 'eval', label: 'Оценка качества и промпты', re: /prompt engineer|\bevals?\b|hallucinat|benchmark\w* model|guardrail|observability for llm/i },
]

const recs = readFileSync(join(here, 'data', 'foreign.jsonl'), 'utf8')
  .split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.ai)

const byMonth = new Map()
const stat = new Map(TASKS_EN.map((t) => [t.id, { ...t, n: 0, months: new Map(), examples: [] }]))
for (const r of recs) {
  const m = r.month ?? (r.date ?? '').slice(0, 7)
  byMonth.set(m, (byMonth.get(m) ?? 0) + 1)
  for (const t of TASKS_EN) {
    if (!t.re.test(r.text)) continue
    const s = stat.get(t.id)
    s.n += 1
    s.months.set(m, (s.months.get(m) ?? 0) + 1)
    if (s.examples.length < 4) {
      const sent = r.text.split(/(?<=[.!?])\s+|\n/).find((x) => t.re.test(x))
      if (sent) s.examples.push(sent.trim().slice(0, 160))
    }
  }
}

const months = [...byMonth.keys()].filter(Boolean).sort()
const rows = [...stat.values()].filter((s) => s.n >= 3).sort((a, b) => b.n - a.n)
console.log(`Зарубежный срез: ${recs.length} объявлений с AI-сигналом, месяцы ${months.join(', ')}`)
console.log(`Объявлений по месяцам: ${months.map((m) => `${m}:${byMonth.get(m)}`).join('  ')}\n`)
console.log('Тип задачи'.padEnd(42) + 'упом.'.padStart(7) + 'доля'.padStart(7) + '   по месяцам')
for (const s of rows)
  console.log(
    s.label.padEnd(42) + String(s.n).padStart(7) + `${((100 * s.n) / recs.length).toFixed(0)}%`.padStart(7) +
    '   ' + months.map((m) => String(s.months.get(m) ?? 0).padStart(3)).join(' '),
  )

writeFileSync(join(here, 'data', 'tasks-foreign.json'), JSON.stringify(rows.map(({ re, months, ...r }) => ({ ...r, byMonth: Object.fromEntries(months) })), null, 2))
console.log('\nсохранено: marketing/vacancies/data/tasks-foreign.json')
