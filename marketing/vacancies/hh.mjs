// Доступ к hh.ru без API: страницы отдают состояние приложения в <template id="HH-Lux-InitialState">.
// API api.hh.ru/vacancies закрыт (403) и требует зарегистрированного приложения; справочники открыты.
// Ограничение источника: поиск отдаёт только последние ~30-45 дней. Архив читается по прямому id.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/** Один проход, иначе `&amp;#34;` превратится в кавычку. */
export const unescapeHtml = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(parseInt(e[1] === 'x' || e[1] === 'X' ? e.slice(2) : e.slice(1), e[1] === 'x' || e[1] === 'X' ? 16 : 10))
    return NAMED[e.toLowerCase()] ?? m
  })

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Пауза с разбросом: ровный ритм запросов виден как робот. */
export const pause = (base = 2000) => sleep(base + Math.floor(Math.random() * base * 0.5))

export class Blocked extends Error {}

export async function fetchHtml(url, { retries = 3 } = {}) {
  for (let i = 0; i <= retries; i++) {
    let res
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' } })
    } catch (e) {
      if (i === retries) throw e
      await sleep(5000 * (i + 1))
      continue
    }
    if (res.ok) return await res.text()
    if (res.status === 404) return null
    if (res.status === 403 || res.status === 429) {
      if (i === retries) throw new Blocked(`${res.status} на ${url}`)
      await sleep(15000 * (i + 1))
      continue
    }
    if (i === retries) throw new Error(`${res.status} на ${url}`)
    await sleep(5000 * (i + 1))
  }
}

export function initialState(html) {
  const m = html.match(/<template[^>]*id="HH-Lux-InitialState"[^>]*>([\s\S]*?)<\/template>/)
  if (!m) return null
  try {
    return JSON.parse(unescapeHtml(m[1]))
  } catch {
    return null
  }
}

export const searchUrl = (text, area, page = 0) =>
  `https://hh.ru/search/vacancy?text=${encodeURIComponent(text)}&area=${area}&page=${page}`

export const vacancyUrl = (id) => `https://hh.ru/vacancy/${id}`
