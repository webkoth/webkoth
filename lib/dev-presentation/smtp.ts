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
import { relaySend } from '@/lib/email-relay'

export async function sendOwnerEmail(d: OwnerEmailData): Promise<{ id: string }> {
  const from = process.env.SMTP_FROM
  const to = process.env.OWNER_EMAIL
  if (!from || !to) throw new Error('SMTP_FROM or OWNER_EMAIL not configured')
  return relaySend({
    from,
    to,
    replyTo: d.email,
    subject: buildOwnerSubject(d),
    text: buildOwnerText(d),
    html: buildOwnerHtml(d),
  })
}

export async function sendUserCopy(d: UserEmailData): Promise<{ id: string }> {
  const from = process.env.SMTP_FROM
  const ownerEmail = process.env.OWNER_EMAIL
  if (!from || !ownerEmail) throw new Error('SMTP_FROM or OWNER_EMAIL not configured')
  return relaySend({
    from,
    to: d.email,
    replyTo: ownerEmail,
    subject: buildUserSubject(),
    text: buildUserText(d),
    html: buildUserHtml(d),
  })
}
