import type { BriefSubmit } from './schema'
import type { SendStatus } from './state'

// Отправка брифа из браузера. Ответ сервера сводится к статусу экрана карты.

export type PostResult = Extract<SendStatus, 'sent' | 'failed' | 'rateLimited'>

// Сервер сам ждёт Telegram с повторами и паузами между частями; дольше полминуты
// экран «Отправляю карту…» висеть не должен: по таймауту даём отправить ещё раз.
const POST_TIMEOUT_MS = 30_000

// AbortSignal.timeout есть только с Safari 16: в старых браузерах запрос уходит без таймаута.
function timeoutSignal(): AbortSignal | undefined {
  return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(POST_TIMEOUT_MS)
    : undefined
}

export async function postBrief(body: BriefSubmit, fetchImpl: typeof fetch = fetch): Promise<PostResult> {
  try {
    const signal = timeoutSignal()
    const res = await fetchImpl('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    })
    if (res.status === 429) return 'rateLimited'
    const json = (await res.json().catch(() => null)) as { ok?: boolean } | null
    return res.ok && json?.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
