import { NextResponse, type NextRequest } from 'next/server'
import { callPolish } from '@/lib/dev-presentation/ai-client'
import { polishSchema } from '@/lib/dev-presentation/schemas'
import { rateLimitTake } from '@/lib/landing/rate-limit'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const rl = rateLimitTake(`polish:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limit' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)),
        },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const parsed = polishSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  try {
    const result = await callPolish(parsed.data.text)
    return NextResponse.json({
      polished: result.result,
      provider: result.provider,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    if (msg.includes('401') || msg.includes('403')) {
      console.error('[ai/polish] misconfigured:', msg)
      return NextResponse.json({ error: 'ai_misconfigured' }, { status: 502 })
    }
    console.warn('[ai/polish] unavailable:', msg)
    return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 })
  }
}
