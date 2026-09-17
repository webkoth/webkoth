import { z } from 'zod'
import { deepList } from './deep'
import { briefAnswersSchema } from './schema'
import { SEND_STATUSES, STEP_KEYS, type BriefState } from './state'

// Черновик брифа в localStorage. Хранилище может быть недоступно (приватный режим,
// запрет сайта, превышение квоты): любая ошибка превращается в статус, а не в падение.
// Версия в ключе: изменилась схема - старый черновик считается устаревшим.

export const STORAGE_KEY = 'webkoth-brief-v1'

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const storedSchema = z.object({
  version: z.literal(1),
  step: z.enum(STEP_KEYS),
  deepIndex: z.number().int().min(0),
  startedAtMs: z.number().int().positive(),
  answers: briefAnswersSchema,
  send: z.enum(SEND_STATUSES),
})

export type LoadResult =
  | { status: 'empty' }
  | { status: 'ok'; state: BriefState }
  | { status: 'outdated' }
  | { status: 'unavailable' }

export function browserStorage(): Store | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadState(store: Store | undefined): LoadResult {
  if (!store) return { status: 'unavailable' }
  let raw: string | null
  try {
    raw = store.getItem(STORAGE_KEY)
  } catch {
    return { status: 'unavailable' }
  }
  if (raw === null) return { status: 'empty' }
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { status: 'outdated' }
  }
  const parsed = storedSchema.safeParse(json)
  if (!parsed.success) return { status: 'outdated' }
  const state = parsed.data
  // Номер подробного шага не выходит за список разбираемых процессов, иначе экран пустой.
  const deepIndex = Math.min(state.deepIndex, Math.max(0, deepList(state.answers).length - 1))
  // Перезагрузка посреди отправки: чем она кончилась, неизвестно, даём отправить ещё раз.
  const send = state.send === 'sending' ? 'failed' : state.send
  return { status: 'ok', state: { ...state, deepIndex, send } }
}

export function saveState(store: Store | undefined, state: BriefState): boolean {
  if (!store) return false
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState(store: Store | undefined): void {
  try {
    store?.removeItem(STORAGE_KEY)
  } catch {
    // хранилище недоступно: чистить нечего
  }
}
