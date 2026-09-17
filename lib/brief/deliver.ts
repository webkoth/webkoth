import { deliverCopy } from '@/app/data/brief/copy'
import { escapeHtml } from '@/lib/landing/telegram'

// Доставка брифа (спека, 9.4): документ с подписью; если прокси не пропустил multipart,
// та же сводка сообщением и файл текстом по частям. Лимит сообщения Telegram 4096,
// берём с запасом под теги <pre>.

export const TELEGRAM_CHUNK = 3900
// Пауза перед каждой частью: подряд без пауз Telegram режет поток сообщений в один чат.
export const CHUNK_PAUSE_MS = 350
// Общий дедлайн доставки от её начала: после него части текста не шлём, если сводка уже ушла.
// Худший случай на сервере около 35 с: документ 10 с (одна попытка), сводка до 12,6 с
// (две попытки по 6 с и пауза 0,6 с), последняя начатая до дедлайна часть до 12,6 с.
// Это меньше таймаута браузера 60 с (lib/brief/client.ts) и proxy_read_timeout nginx
// по умолчанию 60 с: продавец получает ответ, а не обрыв.
export const DELIVERY_DEADLINE_MS = 20_000

type SendResult = { ok: boolean; error?: string }
export type BriefTransport = {
  sendDocument: (filename: string, content: string, caption: string) => Promise<SendResult>
  sendMessage: (text: string) => Promise<SendResult>
  /** Пауза между сообщениями; в тестах подменяется. */
  sleep?: (ms: number) => Promise<void>
  /** Часы для дедлайна; в тестах подменяются. */
  now?: () => number
}
/** partial: сводка дошла, а часть текста файла нет. Лид не потерян, это не провал. */
export type BriefDelivery = { ok: boolean; via?: 'document' | 'chunks'; partial?: boolean; error?: string }

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

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
  const now = t.now ?? Date.now
  const startedAt = now()
  const doc = await t.sendDocument(p.filename, p.markdown, p.summary)
  if (doc.ok) return { ok: true, via: 'document' }

  const head = await t.sendMessage(`${p.summary}\n\n<i>${escapeHtml(deliverCopy.documentFailed)}</i>`)
  if (!head.ok) return { ok: false, error: `document: ${doc.error}; message: ${head.error}` }
  const sleep = t.sleep ?? defaultSleep
  const parts = chunkEscaped(p.markdown)
  for (const [i, part] of parts.entries()) {
    // Сводка уже ушла: лид у нас, остаток файла не стоит обрыва запроса у продавца.
    if (now() - startedAt >= DELIVERY_DEADLINE_MS) return { ok: true, via: 'chunks', partial: true, error: 'deadline' }
    await sleep(CHUNK_PAUSE_MS)
    const r = await t.sendMessage(`<pre>${part}</pre>`)
    if (!r.ok) {
      return { ok: true, via: 'chunks', partial: true, error: `document: ${doc.error}; chunk ${i + 1}/${parts.length}: ${r.error}` }
    }
  }
  return { ok: true, via: 'chunks' }
}
