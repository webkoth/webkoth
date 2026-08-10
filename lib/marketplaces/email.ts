import type { CatalogSize, MarketplaceId, Role } from './schemas'

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const MARKETPLACE_LABELS: Record<MarketplaceId, string> = {
  wb: 'Wildberries',
  ozon: 'Ozon',
  ym: 'Яндекс.Маркет',
}

export const CATALOG_LABELS: Record<CatalogSize, string> = {
  lt100: 'до 100 SKU',
  '100_1000': '100–1000 SKU',
  gt1000: 'больше 1000 SKU',
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  other: 'Другое',
}

export type LeadEmailData = {
  name: string
  phone: string
  contact: string
  marketplaces: MarketplaceId[]
  catalogSize: CatalogSize
  role: Role
  comment?: string
  ip: string
}

// Тема письма нарочно естественная: Timeweb SMTP помечает шаблоны вида
// "[marketplaces] new lead" как высоковероятный спам (README.md:95-98).
export function buildLeadSubject(d: LeadEmailData): string {
  return `Заявка на разбор от ${d.name}`
}

function marketplacesLine(d: LeadEmailData): string {
  return d.marketplaces.map((m) => MARKETPLACE_LABELS[m]).join(', ')
}

export function buildLeadText(d: LeadEmailData): string {
  const lines = [
    `👤 Имя:      ${d.name}`,
    `📞 Телефон:  ${d.phone}`,
    `💬 Контакт:  ${d.contact}`,
    `🛒 Площадки: ${marketplacesLine(d)}`,
    `📦 Каталог:  ${CATALOG_LABELS[d.catalogSize]}`,
    `🎭 Роль:     ${ROLE_LABELS[d.role]}`,
    `🌐 IP:       ${d.ip}`,
  ]
  if (d.comment) {
    lines.push('', 'Комментарий:', d.comment)
  }
  return lines.join('\n')
}

export function buildLeadHtml(d: LeadEmailData): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;width:110px">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`

  const commentBlock = d.comment
    ? `<div style="margin-top:20px">
    <div style="color:#666;font-size:13px;margin-bottom:8px">Комментарий</div>
    <div style="background:#f8f8f8;padding:14px 16px;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(d.comment)}</div>
  </div>`
    : ''

  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:18px">Заявка на разбор — /marketplaces</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${row('👤 Имя', d.name)}
    ${row('📞 Телефон', d.phone)}
    ${row('💬 Контакт', d.contact)}
    ${row('🛒 Площадки', marketplacesLine(d))}
    ${row('📦 Каталог', CATALOG_LABELS[d.catalogSize])}
    ${row('🎭 Роль', ROLE_LABELS[d.role])}
    ${row('🌐 IP', d.ip)}
  </table>
  ${commentBlock}
</body></html>`
}
