import { NextResponse, type NextRequest } from 'next/server'
import { buildMap } from '@/lib/brief/build-map'
import { deliverBrief } from '@/lib/brief/deliver'
import { buildInternal } from '@/lib/brief/internal'
import { briefFilename, renderMarkdown } from '@/lib/brief/render-markdown'
import { renderTelegramSummary } from '@/lib/brief/render-telegram'
import { briefSubmitSchema } from '@/lib/brief/schema'
import { sendTelegramDocument, sendTelegramMessage } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

// Приём брифа. Порядок защиты как у заявок (app/api/evolution/lead/route.ts):
// лимит → размер → JSON → zod → ловушка → время заполнения. Карту сервер строит сам:
// карте из браузера не доверяем. На сервере ничего не храним.

// Бриф заполняется минутами; быстрее минуты - бот.
const MIN_FILL_MS = 60_000
const MAX_BODY_CHARS = 64_000

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'

  const rl = rateLimitTake(`brief:${ip}`)
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
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const { answers, k, startedAtMs, website } = parsed.data

  // Ловушка и слишком быстрое заполнение: тихая двухсотка, бот не должен понять, что попался.
  if (website) return NextResponse.json({ ok: true }, { status: 200 })
  const now = Date.now()
  if (now - startedAtMs < MIN_FILL_MS) return NextResponse.json({ ok: true }, { status: 200 })

  const map = buildMap(answers)
  const internal = buildInternal(answers, map)
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
  if (result.via === 'chunks') console.warn('[brief] document rejected, delivered as text chunks')
  return NextResponse.json({ ok: true }, { status: 200 })
}
