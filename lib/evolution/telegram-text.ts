import { escapeHtml } from '@/lib/landing/telegram'
import { sourceLabel, type EvolutionLeadData } from './email'

// Telegram sendMessage ограничен 4096 символами и на превышение отвечает 400,
// а не обрезает сам. Ответ на вопрос допускает до 4000 символов, escapeHtml
// раздувает каждый «&» до «&amp;» — вместе с шапкой это перебивает лимит.
// Telegram здесь — страховочный канал на случай упавшего email-релея
// (RU-хостинг режет исходящий SMTP, README.md), терять его из-за длинного
// ответа нельзя.
const TELEGRAM_MAX_CHARS = 4096
const ANSWER_BUDGET = 2500
const TRUNCATION_NOTE = '\n\n<i>Ответ обрезан, полный текст — в письме.</i>'
const ANSWER_HEADER = '\n\n<b>Какую проблему хотят решить и что пробовали:</b>\n'

// Режем уже экранированную строку, поэтому на срезе может остаться половина
// сущности — «&am». Хвостовой «&» без «;» убираем: битая сущность роняет разбор
// HTML на стороне Telegram.
function trimDanglingEntity(s: string): string {
  const lastAmp = s.lastIndexOf('&')
  if (lastAmp === -1) return s
  return s.slice(lastAmp).includes(';') ? s : s.slice(0, lastAmp)
}

export function buildLeadTelegramText(d: EvolutionLeadData): string {
  const base =
    `<b>🌱 Заявка на разбор — ${escapeHtml(sourceLabel(d.lang))}</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Контакт:</b> ${escapeHtml(d.contact)}\n` +
    `<b>IP:</b> ${escapeHtml(d.ip)}`

  const escaped = escapeHtml(d.answer)
  const room = Math.max(
    0,
    Math.min(
      ANSWER_BUDGET,
      TELEGRAM_MAX_CHARS - base.length - ANSWER_HEADER.length - TRUNCATION_NOTE.length - 1,
    ),
  )

  if (escaped.length <= room) return `${base}${ANSWER_HEADER}${escaped}`

  const cut = trimDanglingEntity(escaped.slice(0, room))
  return `${base}${ANSWER_HEADER}${cut}…${TRUNCATION_NOTE}`
}
