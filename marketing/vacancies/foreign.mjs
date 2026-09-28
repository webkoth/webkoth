// Зарубежный срез: опережающий индикатор, не целевой рынок.
// Источники открытые и без конфликта с ToS: Algolia API Hacker News (треды «Who is hiring»)
// и публичный JSON RemoteOK. Читаем как «какие задачи вообще существуют», не как «какой продукт делать».
// Запуск: node marketing/vacancies/foreign.mjs
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sleep } from './hh.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, 'data')
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })

const AI = /\b(llm|llms|gpt|rag|genai|gen ai|generative ai|ai agent|agents?|openai|anthropic|claude|embedding|vector db|fine-?tun|machine learning|\bml\b|nlp|computer vision)\b/i

const j = async (url) => (await fetch(url, { headers: { 'User-Agent': 'webkoth-research/0.1' } })).json()
const strip = (h) =>
  String(h ?? '')
    .replace(/<\/p>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .trim()

const threads = (await j('https://hn.algolia.com/api/v1/search_by_date?query=%22Ask+HN%3A+Who+is+hiring%22&tags=story&hitsPerPage=8')).hits
  .filter((h) => /Who is hiring\? \(/i.test(h.title ?? '') && (h.num_comments ?? 0) > 50)
  .slice(0, 4)

const hn = []
for (const t of threads) {
  const r = await j(`https://hn.algolia.com/api/v1/search?tags=comment,story_${t.objectID}&hitsPerPage=1000`)
  // Верхнеуровневые комментарии - это и есть объявления; ответы в ветках - шум.
  const posts = (r.hits ?? []).filter((h) => h.comment_text && String(h.parent_id) === String(t.objectID))
  for (const h of posts) {
    const text = strip(h.comment_text)
    if (text.length < 120) continue
    hn.push({ source: 'hn', thread: t.title, month: (t.created_at ?? '').slice(0, 7), id: h.objectID, ai: AI.test(text), text })
  }
  console.log(`HN ${t.title}: постов ${posts.length}, с AI-сигналом ${hn.filter((x) => x.thread === t.title && x.ai).length}`)
  await sleep(1000)
}

const rok = (await j('https://remoteok.com/api'))
  .filter((x) => x && x.position)
  .map((x) => ({
    source: 'remoteok',
    id: String(x.id),
    company: x.company,
    position: x.position,
    date: x.date,
    salary: x.salary_min || x.salary_max ? { min: x.salary_min, max: x.salary_max } : null,
    tags: x.tags ?? [],
    ai: AI.test(`${x.position} ${x.description} ${(x.tags ?? []).join(' ')}`),
    text: strip(x.description),
  }))
console.log(`RemoteOK: ${rok.length}, с AI-сигналом ${rok.filter((x) => x.ai).length}`)

const all = [...hn, ...rok]
writeFileSync(join(dataDir, 'foreign.jsonl'), all.map((x) => JSON.stringify(x)).join('\n') + '\n')
console.log(`\nвсего ${all.length}, из них с AI-сигналом ${all.filter((x) => x.ai).length} -> data/foreign.jsonl`)
