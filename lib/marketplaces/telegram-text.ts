import { escapeHtml } from '@/lib/landing/telegram'
import {
  CATALOG_LABELS,
  MARKETPLACE_LABELS,
  ROLE_LABELS,
  type LeadEmailData,
} from './email'

// Telegram sendMessage жёстко ограничен 4096 символами: на превышение он отвечает
// 400, а не обрезает сам. Схема разрешает комментарий до 4000 символов, escapeHtml
// раздувает каждый «&» до «&amp;» — вместе с шапкой это легко перебивает лимит.
// Молчаливая потеря Telegram-канала критична: он существует именно потому, что
// RU-хостинг режет исходящий SMTP (README.md), и на упавшем релее длинный
// комментарий превратил бы восстановимый partial в 502 и потерянный лид.
const TELEGRAM_MAX_CHARS = 4096
const COMMENT_BUDGET = 2500
const TRUNCATION_NOTE = '\n\n<i>Комментарий обрезан, полный текст — в письме.</i>'
const COMMENT_HEADER = '\n\n<b>Комментарий:</b>\n'

// Режем уже экранированную строку (иначе экранирование раздуло бы результат
// обратно за лимит), поэтому на срезе может остаться половина сущности — «&am».
// Хвостовой «&» без «;» убираем: битая сущность роняет разбор HTML на стороне
// Telegram. После escapeHtml любой «&» — начало сущности, так что проверки
// последнего вхождения достаточно.
function trimDanglingEntity(s: string): string {
  const lastAmp = s.lastIndexOf('&')
  if (lastAmp === -1) return s
  return s.slice(lastAmp).includes(';') ? s : s.slice(0, lastAmp)
}

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

  if (!d.comment) return base

  const escaped = escapeHtml(d.comment)
  // Бюджет 2500 символов, но не больше того, что реально осталось от 4096:
  // имя и контакт тоже экранируются и могут раздуться.
  const room = Math.max(
    0,
    Math.min(
      COMMENT_BUDGET,
      TELEGRAM_MAX_CHARS - base.length - COMMENT_HEADER.length - TRUNCATION_NOTE.length - 1,
    ),
  )

  if (escaped.length <= room) return `${base}${COMMENT_HEADER}${escaped}`

  const cut = trimDanglingEntity(escaped.slice(0, room))
  return `${base}${COMMENT_HEADER}${cut}…${TRUNCATION_NOTE}`
}
