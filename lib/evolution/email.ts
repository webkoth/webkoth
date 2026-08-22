const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export type EvolutionLeadData = {
  name: string
  contact: string
  answer: string
  ip: string
}

// Тема письма нарочно естественная: Timeweb SMTP помечает шаблоны вида
// "[evolution] new lead" как высоковероятный спам (README.md).
export function buildLeadSubject(d: EvolutionLeadData): string {
  return `Разбор ситуации — заявка от ${d.name}`
}

export function buildLeadText(d: EvolutionLeadData): string {
  return [
    `👤 Имя:     ${d.name}`,
    `💬 Контакт: ${d.contact}`,
    `🌐 IP:      ${d.ip}`,
    '',
    'Что уже пробовали с ИИ и что из этого работает:',
    d.answer,
    '',
    'Источник: /evolution',
  ].join('\n')
}

export function buildLeadHtml(d: EvolutionLeadData): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;width:110px">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`

  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:18px">Заявка на разбор — /evolution</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${row('👤 Имя', d.name)}
    ${row('💬 Контакт', d.contact)}
    ${row('🌐 IP', d.ip)}
  </table>
  <div style="margin-top:20px">
    <div style="color:#666;font-size:13px;margin-bottom:8px">Что уже пробовали с ИИ и что из этого работает</div>
    <div style="background:#f8f8f8;padding:14px 16px;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(d.answer)}</div>
  </div>
</body></html>`
}
