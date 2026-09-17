import { NextResponse, type NextRequest } from 'next/server'
import { buildMap } from '@/lib/brief/build-map'
import { deliverBrief } from '@/lib/brief/deliver'
import { buildInternal, MIN_FILL_SECONDS } from '@/lib/brief/internal'
import { normalizeAnswers } from '@/lib/brief/normalize'
import { briefFilename, renderMarkdown } from '@/lib/brief/render-markdown'
import { renderTelegramSummary } from '@/lib/brief/render-telegram'
import { briefSubmitSchema } from '@/lib/brief/schema'
import { clientIp } from '@/lib/landing/client-ip'
import { rateLimitTake } from '@/lib/landing/rate-limit'
import { sendTelegramDocument, sendTelegramMessage } from '@/lib/landing/telegram'

// Приём брифа. Порядок защиты как у заявок (app/api/evolution/lead/route.ts):
// лимит → размер → JSON → zod → ловушка → пометка о быстром заполнении. Карту сервер строит сам:
// карте из браузера не доверяем. На сервере ничего не храним.

// Быстрее минуты похоже на бота, но живой продавец тоже бывает быстрым:
// такой бриф доставляем с пометкой, а решаем вручную.
const MIN_FILL_MS = MIN_FILL_SECONDS * 1000
const MAX_BODY_CHARS = 64_000

// Для лога ошибок валидации только пути полей: значения могут содержать имя и контакт.
function issuePaths(issues: readonly { path: readonly PropertyKey[] }[]): string {
  const paths = issues.map((i) => i.path.map((p) => String(p).replace(/[^\w-]/g, '?').slice(0, 40)).join('.'))
  return [...new Set(paths)].join(', ')
}

export async function POST(req: NextRequest) {
  const rl = rateLimitTake(`brief:${clientIp(req.headers)}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) } },
    )
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_CHARS) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = briefSubmitSchema.safeParse(body)
  if (!parsed.success) {
    // Подробности ошибок только в лог: браузер проверяет ответы сам до отправки, боту они подсказка.
    console.warn(`[brief] validation: ${issuePaths(parsed.error.issues)}`)
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 })
  }
  const { k, startedAtMs, website } = parsed.data

  // Ловушка: тихая двухсотка, бот не должен понять, что попался.
  // В лог только причина, без данных брифа.
  if (website) {
    console.warn('[brief] dropped: honeypot')
    return NextResponse.json({ ok: true }, { status: 200 })
  }
  const now = Date.now()
  const elapsedMs = now - startedAtMs
  // Начало в будущем значит, что часы устройства спешат: длительность неизвестна, пометки нет.
  const fillSeconds = elapsedMs >= 0 ? Math.floor(elapsedMs / 1000) : undefined
  if (elapsedMs >= 0 && elapsedMs < MIN_FILL_MS) {
    console.warn(`[brief] fast fill: ${fillSeconds} s`)
  }

  // Скрытые сменой ответа поля в карту и файл не идут.
  const answers = normalizeAnswers(parsed.data.answers)
  const map = buildMap(answers)
  const internal = buildInternal(answers, map, { fillSeconds })
  const nowDate = new Date(now)
  const result = await deliverBrief(
    {
      summary: renderTelegramSummary(answers, map, internal, k),
      filename: briefFilename(k, nowDate),
      markdown: renderMarkdown({ answers, map, internal, k, startedAtMs, now: nowDate }),
    },
    { sendDocument: sendTelegramDocument, sendMessage: sendTelegramMessage },
  )

  if (!result.ok) {
    console.warn(`[brief] delivery failed: ${result.error}`)
    return NextResponse.json({ ok: false, error: 'delivery' }, { status: 502 })
  }
  // Сводка дошла: лид у нас, даже если часть текста файла потерялась.
  if (result.partial) console.warn(`[brief] partial delivery: ${result.error}`)
  else if (result.via === 'chunks') console.warn('[brief] document rejected, delivered as text chunks')
  return NextResponse.json({ ok: true }, { status: 200 })
}
