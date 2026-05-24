import nodemailer, { type Transporter } from 'nodemailer'
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

let cachedTransporter: Transporter | null = null

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '465', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error('SMTP not configured: SMTP_HOST, SMTP_USER, SMTP_PASS required')
  }
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  })
  return cachedTransporter
}

type SendArgs = {
  from: string
  to: string
  replyTo?: string
  subject: string
  text: string
  html: string
}

async function smtpSend(a: SendArgs): Promise<{ id: string }> {
  const info = await getTransporter().sendMail({
    from: a.from,
    to: a.to,
    replyTo: a.replyTo,
    subject: a.subject,
    text: a.text,
    html: a.html,
  })
  return { id: info.messageId }
}

export async function sendOwnerEmail(d: OwnerEmailData): Promise<{ id: string }> {
  const from = process.env.SMTP_FROM
  const to = process.env.OWNER_EMAIL
  if (!from || !to) throw new Error('SMTP_FROM or OWNER_EMAIL not configured')
  return smtpSend({
    from,
    to,
    replyTo: d.email,
    subject: buildOwnerSubject(d),
    html: buildOwnerHtml(d),
    text: buildOwnerText(d),
  })
}

export async function sendUserCopy(d: UserEmailData): Promise<{ id: string }> {
  const from = process.env.SMTP_FROM
  const ownerEmail = process.env.OWNER_EMAIL
  if (!from || !ownerEmail) throw new Error('SMTP_FROM or OWNER_EMAIL not configured')
  return smtpSend({
    from,
    to: d.email,
    replyTo: ownerEmail,
    subject: buildUserSubject(),
    html: buildUserHtml(d),
    text: buildUserText(d),
  })
}
