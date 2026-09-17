// Откуда пришёл посетитель: метки рекламы из адреса первого и последнего входа.
// Без этого заявку нельзя связать с кампанией, группой и площадкой Директа и
// нельзя загрузить офлайн-конверсией (аудит 2026-09-17). Хранится в localStorage
// 30 дней; любые сбои хранилища (приватный режим, запрет) молча пропускаются:
// аналитика не должна ронять страницу и форму.

// utm_* и yclid плюс параметры, которые Директ дописывает через TrackingParams кампании.
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'placement',
  'source_type',
  'device',
  'region',
  'cid',
  'gid',
  'aid',
  'pid',
  'match',
] as const

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]

export type Touch = Partial<Record<AttributionKey, string>> & {
  /** Страница входа без параметров. */
  landing: string
  /** Момент входа, ISO. */
  at: string
}

export type Attribution = { first?: Touch; last?: Touch }

export const ATTRIBUTION_STORAGE_KEY = 'wk_attribution_v1'
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAX_VALUE = 200

const clean = (v: string) => v.replace(/[\r\n]+/g, ' ').trim().slice(0, MAX_VALUE)

/** Метки из адреса; null, если ни одной нет — тогда вход не рекламный и не перезаписывает прошлый. */
export function touchFromUrl(href: string, now: Date = new Date()): Touch | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const touch: Touch = { landing: clean(url.pathname), at: now.toISOString() }
  let found = false
  for (const key of ATTRIBUTION_KEYS) {
    const value = url.searchParams.get(key)
    if (value) {
      touch[key] = clean(value)
      found = true
    }
  }
  return found ? touch : null
}

const fresh = (t: Touch | undefined, now: Date): t is Touch =>
  !!t && now.getTime() - Date.parse(t.at) < ATTRIBUTION_TTL_MS

/** Новое состояние после входа: первое касание сохраняется, последнее обновляется. */
export function mergeTouch(prev: Attribution, touch: Touch | null, now: Date = new Date()): Attribution {
  const first = fresh(prev.first, now) ? prev.first : undefined
  const last = fresh(prev.last, now) ? prev.last : undefined
  if (!touch) return { first, last }
  return { first: first ?? touch, last: touch }
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const storage = (): StorageLike | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function readAttribution(now: Date = new Date(), store: StorageLike | null = storage()): Attribution {
  if (!store) return {}
  try {
    const raw = store.getItem(ATTRIBUTION_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Attribution) : {}
    return mergeTouch(parsed, null, now)
  } catch {
    return {}
  }
}

/** Запомнить метки текущего адреса. Вызывается при загрузке и смене страницы. */
export function captureAttribution(href: string, now: Date = new Date(), store: StorageLike | null = storage()): void {
  if (!store) return
  const touch = touchFromUrl(href, now)
  if (!touch) return
  try {
    const next = mergeTouch(readAttribution(now, store), touch, now)
    store.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // хранилище недоступно — заявка уйдёт без меток, это не повод ронять страницу
  }
}

type YmClientIdFn = (id: number, action: 'getClientID', cb: (clientId: string) => void) => void

/** ClientID посетителя в Метрике — ключ для офлайн-конверсий. Не ждёт дольше timeoutMs. */
export function getYmClientId(timeoutMs = 800): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(undefined)
    const id = Number(process.env.NEXT_PUBLIC_YM_ID)
    const ym = (window as unknown as { ym?: YmClientIdFn }).ym
    if (!id || typeof ym !== 'function') return resolve(undefined)
    const timer = setTimeout(() => resolve(undefined), timeoutMs)
    try {
      ym(id, 'getClientID', (clientId) => {
        clearTimeout(timer)
        resolve(clientId ? clean(String(clientId)) : undefined)
      })
    } catch {
      clearTimeout(timer)
      resolve(undefined)
    }
  })
}
