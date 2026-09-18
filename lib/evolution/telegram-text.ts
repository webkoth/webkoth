import { escapeHtml } from '@/lib/landing/telegram'
import { sourceLabel, type EvolutionLeadData } from './email'
import type { LeadAttribution } from './schemas'

// Telegram sendMessage ограничен 4096 символами и на превышение отвечает 400,
// а не обрезает сам. Ответ на вопрос допускает до 4000 символов, escapeHtml
// раздувает каждый «&» до «&amp;» - вместе с шапкой это перебивает лимит.
// Telegram здесь - страховочный канал на случай упавшего email-релея
// (RU-хостинг режет исходящий SMTP, README.md), терять его из-за длинного
// ответа нельзя.
const TELEGRAM_MAX_CHARS = 4096
const ANSWER_BUDGET = 2500
const TRUNCATION_NOTE = '\n\n<i>Ответ обрезан, полный текст - в письме.</i>'
const ANSWER_HEADER = '\n\n<b>Какую проблему хотят решить и что пробовали:</b>\n'
// Необязательное поле лендинга - до 200 символов, но экранирование раздувает «&» впятеро:
// шесть таких полей перебили бы лимит сообщения. Значение поля режем после экранирования.
const DETAIL_BUDGET = 250

// Режем уже экранированную строку, поэтому на срезе может остаться половина
// сущности - «&am». Хвостовой «&» без «;» убираем: битая сущность роняет разбор
// HTML на стороне Telegram.
function trimDanglingEntity(s: string): string {
  const lastAmp = s.lastIndexOf('&')
  if (lastAmp === -1) return s
  return s.slice(lastAmp).includes(';') ? s : s.slice(0, lastAmp)
}

// Поля лендинга сразу под контактом: «Какая 1С», «Площадки», «Оборот в месяц».
function detailLines(rows: EvolutionLeadData['details']): string {
  return (rows ?? [])
    .map((r) => {
      const value = escapeHtml(r.value)
      const clipped = value.length > DETAIL_BUDGET ? `${trimDanglingEntity(value.slice(0, DETAIL_BUDGET))}…` : value
      return `\n<b>${escapeHtml(r.label)}:</b> ${clipped}`
    })
    .join('')
}

type LeadTouch = NonNullable<LeadAttribution['last']>

// Одна строка на касание: откуда, какая кампания, группа, фраза, площадка, устройство и id Директа.
function touchLine(t: LeadTouch): string {
  const ids = [t.cid && `cid ${t.cid}`, t.gid && `gid ${t.gid}`, t.aid && `aid ${t.aid}`, t.pid && `pid ${t.pid}`]
  return [
    [t.utm_source, t.utm_medium].filter(Boolean).join('/'),
    t.utm_campaign && `кампания ${t.utm_campaign}`,
    t.utm_content && `группа ${t.utm_content}`,
    t.utm_term && `фраза ${t.utm_term}`,
    t.placement && `площадка ${t.placement}`,
    t.device,
    t.landing,
    ids.filter(Boolean).join(' '),
    t.at,
  ]
    .filter(Boolean)
    .join(' · ')
}

const sameTouch = (a?: LeadTouch, b?: LeadTouch) => !!a && !!b && a.at === b.at && a.landing === b.landing

// Блок атрибуции: без него заявку не связать с рекламой и не загрузить офлайн-конверсией.
export function attributionBlock(a?: LeadAttribution): string {
  const lines: string[] = []
  if (a?.last) lines.push(`<b>Последний вход:</b> ${escapeHtml(touchLine(a.last))}`)
  if (a?.first && !sameTouch(a.first, a.last)) lines.push(`<b>Первый вход:</b> ${escapeHtml(touchLine(a.first))}`)
  const yclid = a?.last?.yclid ?? a?.first?.yclid
  if (yclid) lines.push(`<b>yclid:</b> ${escapeHtml(yclid)}`)
  if (a?.clientId) lines.push(`<b>ClientID Метрики:</b> ${escapeHtml(a.clientId)}`)
  if (!a?.last && !a?.first) lines.unshift('<b>Реклама:</b> меток нет')
  return `\n\n${lines.join('\n')}`
}

export function buildLeadTelegramText(d: EvolutionLeadData): string {
  const base =
    `<b>🌱 Заявка на разбор - ${escapeHtml(sourceLabel(d.lang, d.source))}</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Контакт:</b> ${escapeHtml(d.contact)}` +
    detailLines(d.details) +
    `\n<b>IP:</b> ${escapeHtml(d.ip)}` +
    (d.consentAt ? `\n<b>Согласие на обработку ПДн:</b> ${escapeHtml(d.consentAt)}` : '') +
    attributionBlock(d.attribution)

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
