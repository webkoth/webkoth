import {
  buildOwnerHtml,
  buildOwnerSubject,
  buildOwnerText,
  buildUserHtml,
  buildUserSubject,
  buildUserText,
  type OwnerEmailData,
  type UserEmailData,
} from './email-templates'

type ResendPayload = {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
}

async function resendSend(payload: ResendPayload): Promise<{ id: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not configured')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`resend ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json() as Promise<{ id: string }>
}

export async function sendOwnerEmail(d: OwnerEmailData): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM
  const to = process.env.OWNER_EMAIL
  if (!from || !to) throw new Error('RESEND_FROM or OWNER_EMAIL not configured')
  return resendSend({
    from,
    to: [to],
    reply_to: d.email,
    subject: buildOwnerSubject(d),
    html: buildOwnerHtml(d),
    text: buildOwnerText(d),
  })
}

export async function sendUserCopy(d: UserEmailData): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM
  const ownerEmail = process.env.OWNER_EMAIL
  if (!from || !ownerEmail) throw new Error('RESEND_FROM or OWNER_EMAIL not configured')
  return resendSend({
    from,
    to: [d.email],
    reply_to: ownerEmail,
    subject: buildUserSubject(),
    html: buildUserHtml(d),
    text: buildUserText(d),
  })
}
