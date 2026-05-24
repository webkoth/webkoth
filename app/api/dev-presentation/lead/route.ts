import { NextResponse, type NextRequest } from 'next/server'
import { leadSchema, type AiSummary } from '@/lib/dev-presentation/schemas'
import { callSummary } from '@/lib/dev-presentation/ai-client'
import { sendOwnerEmail, sendUserCopy } from '@/lib/dev-presentation/resend'
import { sendTelegramMessage, escapeHtml } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

const MIN_FILL_MS = 1500
const SUMMARY_TIMEOUT_MS = 4000

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // 1. Rate limit
  const rl = rateLimitTake(`devlead:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)),
        },
      },
    )
  }

  // 2. Parse JSON
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'validation' },
      { status: 400 },
    )
  }

  // 3. Zod
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // 4. Honeypot — silent 200
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true, aiSummary: null }, { status: 200 })
  }

  // 5. Min fill time — silent 200
  if (Date.now() - parsed.data.filledAtMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, aiSummary: null }, { status: 200 })
  }

  const { name, phone, email, message } = parsed.data

  // 6. AI summary — race against 4s timeout
  const summaryPromise = callSummary({ name, message })
    .then((r) => r.result)
    .catch((err) => {
      console.warn('[devlead] summary failed:', err instanceof Error ? err.message : err)
      return null
    })
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), SUMMARY_TIMEOUT_MS),
  )
  const aiSummary: AiSummary | null = await Promise.race([
    summaryPromise,
    timeoutPromise,
  ])

  // 7. Fan out: owner email, user copy, telegram backup
  const telegramText = buildTelegramText({ name, phone, email, message, ip, aiSummary })

  const [ownerRes, userRes, telegramRes] = await Promise.allSettled([
    sendOwnerEmail({ name, phone, email, message, ip, aiSummary }),
    sendUserCopy({ name, email, message }),
    sendTelegramMessage(telegramText),
  ])

  const ownerOk = ownerRes.status === 'fulfilled'
  const userOk = userRes.status === 'fulfilled'

  if (!ownerOk) {
    console.error(
      '[devlead] owner email failed:',
      ownerRes.status === 'rejected' ? ownerRes.reason : '',
    )
    return NextResponse.json(
      { ok: false, error: 'delivery' },
      { status: 502 },
    )
  }

  if (!userOk) {
    console.warn(
      '[devlead] user copy failed:',
      userRes.status === 'rejected' ? userRes.reason : '',
    )
    return NextResponse.json(
      {
        ok: true,
        partial: true,
        missing: ['user_copy'],
        aiSummary,
      },
      { status: 200 },
    )
  }

  if (telegramRes.status === 'rejected' || (telegramRes.status === 'fulfilled' && !telegramRes.value.ok)) {
    // Telegram is backup-only — log but don't fail
    console.warn('[devlead] telegram backup failed (non-fatal)')
  }

  return NextResponse.json({ ok: true, aiSummary }, { status: 200 })
}

function buildTelegramText(d: {
  name: string
  phone: string
  email: string
  message: string
  ip: string
  aiSummary: AiSummary | null
}): string {
  const aiLine = d.aiSummary
    ? `<b>🤖 AI:</b> ${escapeHtml(d.aiSummary.intent)} · ${escapeHtml(d.aiSummary.urgency)}\n<i>${escapeHtml(d.aiSummary.tldr)}</i>\n\n`
    : ''
  return (
    `<b>📨 [dev-presentation] New lead</b>\n\n` +
    aiLine +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Телефон:</b> ${escapeHtml(d.phone)}\n` +
    `<b>Email:</b> ${escapeHtml(d.email)}\n` +
    `<b>IP:</b> ${escapeHtml(d.ip)}\n\n` +
    `<b>Сообщение:</b>\n${escapeHtml(d.message)}`
  )
}
