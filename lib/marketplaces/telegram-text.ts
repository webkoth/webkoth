import { escapeHtml } from '@/lib/landing/telegram'
import {
  CATALOG_LABELS,
  MARKETPLACE_LABELS,
  ROLE_LABELS,
  type LeadEmailData,
} from './email'

export function buildLeadTelegramText(d: LeadEmailData): string {
  const base =
    `<b>📨 Заявка на разбор — /marketplaces</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Телефон:</b> ${escapeHtml(d.phone)}\n` +
    `<b>Контакт:</b> ${escapeHtml(d.contact)}\n` +
    `<b>Площадки:</b> ${escapeHtml(d.marketplaces.map((m) => MARKETPLACE_LABELS[m]).join(', '))}\n` +
    `<b>Каталог:</b> ${escapeHtml(CATALOG_LABELS[d.catalogSize])}\n` +
    `<b>Роль:</b> ${escapeHtml(ROLE_LABELS[d.role])}\n` +
    `<b>IP:</b> ${escapeHtml(d.ip)}`

  return d.comment ? `${base}\n\n<b>Комментарий:</b>\n${escapeHtml(d.comment)}` : base
}
