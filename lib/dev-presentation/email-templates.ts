import type { AiSummary } from './schemas'

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export type OwnerEmailData = {
  name: string
  phone: string
  email: string
  message: string
  ip: string
  aiSummary: AiSummary | null
}

export function buildOwnerSubject(d: OwnerEmailData): string {
  const intent = d.aiSummary?.intent ?? 'lead'
  return `[dev-presentation] ${intent}: ${d.name}`
}

export function buildOwnerText(d: OwnerEmailData): string {
  const lines: string[] = []
  if (d.aiSummary) {
    lines.push(
      `🤖 AI: интент ${d.aiSummary.intent.toUpperCase()} · срочность ${d.aiSummary.urgency.toUpperCase()}`,
      `   TL;DR: ${d.aiSummary.tldr}`,
      `   Suggested reply: ${d.aiSummary.suggested_reply}`,
      '',
    )
  }
  lines.push(
    `👤 Имя:     ${d.name}`,
    `📞 Телефон: ${d.phone}`,
    `✉️ Email:   ${d.email}`,
    `🌐 IP:      ${d.ip}`,
    '',
    `💬 Сообщение:`,
    d.message,
  )
  return lines.join('\n')
}

export function buildOwnerHtml(d: OwnerEmailData): string {
  const aiBlock = d.aiSummary
    ? `<div style="background:#f0f7ff;border-left:3px solid #3b82f6;padding:12px 16px;margin:0 0 16px;border-radius:6px;font-size:14px;line-height:1.5">
        <div style="font-weight:600;margin-bottom:6px">🤖 AI: интент ${escapeHtml(d.aiSummary.intent.toUpperCase())} · срочность ${escapeHtml(d.aiSummary.urgency.toUpperCase())}</div>
        <div><strong>TL;DR:</strong> ${escapeHtml(d.aiSummary.tldr)}</div>
        <div style="margin-top:6px"><strong>Suggested reply:</strong> ${escapeHtml(d.aiSummary.suggested_reply)}</div>
      </div>`
    : ''

  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:18px">[dev-presentation] новый лид</h2>
  ${aiBlock}
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:90px">👤 Имя</td><td style="padding:6px 0"><strong>${escapeHtml(d.name)}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">📞 Телефон</td><td style="padding:6px 0">${escapeHtml(d.phone)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">✉️ Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(d.email)}" style="color:#3b82f6">${escapeHtml(d.email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">🌐 IP</td><td style="padding:6px 0;font-family:monospace;font-size:13px">${escapeHtml(d.ip)}</td></tr>
  </table>
  <div style="margin-top:20px">
    <div style="color:#666;font-size:13px;margin-bottom:8px">💬 Сообщение:</div>
    <div style="background:#f8f8f8;padding:14px 16px;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(d.message)}</div>
  </div>
</body></html>`
}

export type UserEmailData = {
  name: string
  email: string
  message: string
}

export function buildUserSubject(): string {
  return 'Ваше сообщение получено — Минас Саркисян'
}

export function buildUserText(d: UserEmailData): string {
  return [
    `Здравствуйте, ${d.name}!`,
    '',
    'Спасибо за сообщение. Я получил ваш запрос и отвечу в течение 24ч',
    '(обычно быстрее — в рабочие часы за пару часов).',
    '',
    'Срочно? Telegram: https://t.me/abnorsky',
    '',
    'Ваше сообщение:',
    d.message
      .split('\n')
      .map((l) => `> ${l}`)
      .join('\n'),
    '',
    '— Минас Саркисян · webkoth.com',
  ].join('\n')
}

export function buildUserHtml(d: UserEmailData): string {
  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;line-height:1.6">
  <p style="margin:0 0 16px">Здравствуйте, <strong>${escapeHtml(d.name)}</strong>!</p>
  <p style="margin:0 0 16px">Спасибо за сообщение. Я получил ваш запрос и отвечу <strong>в течение 24ч</strong> (обычно быстрее — в рабочие часы за пару часов).</p>
  <p style="margin:0 0 24px">Срочно? Telegram: <a href="https://t.me/abnorsky" style="color:#3b82f6">@abnorsky</a></p>
  <div style="border-left:3px solid #e5e5e5;padding:8px 0 8px 16px;color:#666;font-size:14px">
    <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;color:#999">Ваше сообщение</div>
    <div style="white-space:pre-wrap">${escapeHtml(d.message)}</div>
  </div>
  <p style="margin:24px 0 0;color:#999;font-size:13px">— Минас Саркисян · <a href="https://webkoth.com" style="color:#3b82f6">webkoth.com</a></p>
</body></html>`
}
