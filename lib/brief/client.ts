import type { BriefSubmit } from './schema'
import type { SendStatus } from './state'

// Отправка брифа из браузера. Ответ сервера сводится к статусу экрана карты.

export type PostResult = Extract<SendStatus, 'sent' | 'failed' | 'rateLimited'>

export async function postBrief(body: BriefSubmit, fetchImpl: typeof fetch = fetch): Promise<PostResult> {
  try {
    const res = await fetchImpl('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 429) return 'rateLimited'
    const json = (await res.json().catch(() => null)) as { ok?: boolean } | null
    return res.ok && json?.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
