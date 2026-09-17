import { deliverCopy } from '@/app/data/brief/copy'
import { escapeHtml } from '@/lib/landing/telegram'

// Доставка брифа (спека, 9.4): документ с подписью; если прокси не пропустил multipart,
// та же сводка сообщением и файл текстом по частям. Лимит сообщения Telegram 4096,
// берём с запасом под теги <pre>.

export const TELEGRAM_CHUNK = 3900

type SendResult = { ok: boolean; error?: string }
export type BriefTransport = {
  sendDocument: (filename: string, content: string, caption: string) => Promise<SendResult>
  sendMessage: (text: string) => Promise<SendResult>
}
export type BriefDelivery = { ok: boolean; via?: 'document' | 'chunks'; error?: string }

/**
 * Экранированный текст частями не длиннее limit. Сущность «&amp;» и суррогатная пара
 * не рвутся; части из одних пробелов и переносов не отправляются: Telegram их не примет.
 */
export function chunkEscaped(raw: string, limit = TELEGRAM_CHUNK): string[] {
  const parts: string[] = []
  const push = (part: string) => {
    if (part.trim()) parts.push(part)
  }
  let current = ''
  for (const line of raw.split('\n')) {
    let piece = escapeHtml(line) + '\n'
    while (piece.length > limit) {
      push(current)
      current = ''
      let cut = limit
      const amp = piece.lastIndexOf('&', cut - 1)
      if (amp > cut - 5) cut = amp
      const code = piece.charCodeAt(cut - 1)
      if (code >= 0xd800 && code <= 0xdbff) cut -= 1
      if (cut <= 0) cut = limit
      push(piece.slice(0, cut))
      piece = piece.slice(cut)
    }
    if (current.length + piece.length > limit) {
      push(current)
      current = ''
    }
    current += piece
  }
  push(current)
  return parts
}

export async function deliverBrief(
  p: { summary: string; filename: string; markdown: string },
  t: BriefTransport,
): Promise<BriefDelivery> {
  const doc = await t.sendDocument(p.filename, p.markdown, p.summary)
  if (doc.ok) return { ok: true, via: 'document' }

  const head = await t.sendMessage(`${p.summary}\n\n<i>${escapeHtml(deliverCopy.documentFailed)}</i>`)
  if (!head.ok) return { ok: false, error: `document: ${doc.error}; message: ${head.error}` }
  for (const part of chunkEscaped(p.markdown)) {
    const r = await t.sendMessage(`<pre>${part}</pre>`)
    if (!r.ok) return { ok: false, error: `document: ${doc.error}; chunk: ${r.error}` }
  }
  return { ok: true, via: 'chunks' }
}
