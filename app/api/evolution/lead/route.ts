import { NextResponse, type NextRequest } from 'next/server'
import { evolutionLeadSchema } from '@/lib/evolution/schemas'
import type { EvolutionLeadData } from '@/lib/evolution/email'
import { buildLeadTelegramText } from '@/lib/evolution/telegram-text'
import { settleReturning, summarize } from '@/lib/evolution/delivery'
import { sendTelegramMessage } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

const MIN_FILL_MS = 1500

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // 1. Rate limit
  const rl = rateLimitTake(`evolead:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) },
      },
    )
  }

  // 2. Parse JSON
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  // 3. Zod
  const parsed = evolutionLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // 4. Honeypot — тихая двухсотка, бот не должен понять, что попался
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // 5. Слишком быстрое заполнение — тоже тихая двухсотка
  if (Date.now() - parsed.data.filledAtMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const lead: EvolutionLeadData = {
    name: parsed.data.name,
    contact: parsed.data.contact,
    answer: parsed.data.answer,
    ip,
    lang: parsed.data.lang,
    source: parsed.data.source,
    // Схема уже отклонила заявку без согласия; фиксируем момент как доказательство.
    consentAt: new Date().toISOString(),
  }

  // 6. Один канал владельцу: Telegram. Почтовый канал через релей hubmarket-ai
  // отключён 2026-09-03: релей не логинится в SMTP, письма не уходили. Письмо
  // собирается в lib/evolution/email.ts, вернуть его - добавить второй settle* сюда.
  const deliveries = await Promise.all([
    settleReturning('telegram', sendTelegramMessage(buildLeadTelegramText(lead))),
  ])

  const result = summarize(deliveries)

  for (const d of deliveries) {
    if (!d.ok) console.warn(`[evolead] ${d.channel} failed: ${d.error}`)
  }

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'delivery' }, { status: 502 })
  }

  return NextResponse.json(
    result.partial ? { ok: true, partial: true, missing: result.missing } : { ok: true },
    { status: 200 },
  )
}
