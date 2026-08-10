// Письма уходят через relay микросервиса hubmarket-ai (POST /api/email/send),
// потому что с этого хостинга исходящий SMTP (25/465/587) заблокирован.
// hubmarket-ai живёт на другом хостинге, где SMTP-egress работает.

export interface RelayBody {
  from: string
  to: string
  replyTo?: string
  subject: string
  text: string
  html: string
}

export async function relaySend(body: RelayBody): Promise<{ id: string }> {
  const url = process.env.AI_SERVICE_URL
  const token = process.env.AI_SERVICE_TOKEN
  if (!url || !token) {
    throw new Error('Email relay not configured: AI_SERVICE_URL and AI_SERVICE_TOKEN required')
  }
  const res = await fetch(`${url}/api/email/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`email relay ${res.status}: ${text.slice(0, 300)}`)
  }
  const json = (await res.json()) as {
    success: boolean
    messageId?: string
    error?: string
  }
  if (!json.success) {
    throw new Error(`email relay failed: ${json.error ?? 'unknown'}`)
  }
  return { id: json.messageId ?? 'unknown' }
}
