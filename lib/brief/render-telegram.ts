import { offerCopy } from '@/app/data/brief/copy'
import { optionLabel, shopQuestions } from '@/app/data/brief/questions'
import { escapeHtml } from '@/lib/landing/telegram'
import { categoryText, marketplacesText } from './labels'
import type { BriefMap } from './map-types'
import { formatHours } from './priority'
import type { BriefAnswers } from './schema'

// Короткое сообщение о брифе: подпись к документу в Telegram. Подпись ограничена
// 1024 символами, берём с запасом. Имя и контакт режем до экранирования, чтобы
// первая строка с <b> никогда не оказалась обрезанной посередине тега.

export const SUMMARY_MAX = 1000
const NAME_MAX = 60
const CONTACT_MAX = 80

const q = (id: 'sku' | 'ordersPerDay') => shopQuestions.find((x) => x.id === id)!

// Срез по длине может оставить половину сущности «&am»: битая сущность роняет
// разбор HTML на стороне Telegram.
function trimDanglingEntity(s: string): string {
  const amp = s.lastIndexOf('&')
  if (amp === -1) return s
  return s.slice(amp).includes(';') ? s : s.slice(0, amp)
}

export function renderTelegramSummary(a: BriefAnswers, map: BriefMap, k?: string): string {
  const start = map.items.find((i) => i.processId === map.startId)
  const startLine = start
    ? `Начать с: ${start.label} (≈ ${formatHours(start.returnedHours)} ч/нед)`
    : map.startFallback
      ? `Начать с порядка: ${map.startFallback.text}`
      : 'Начать с: обсудить на созвоне'
  const shop = [
    marketplacesText(a) || 'площадки не указаны',
    a.sku && a.sku !== 'unknown' ? `${optionLabel(q('sku'), a.sku)} артикулов` : undefined,
    a.ordersPerDay && a.ordersPerDay !== 'unknown'
      ? `${optionLabel(q('ordersPerDay'), a.ordersPerDay)} заказов в день`
      : undefined,
  ]
    .filter(Boolean)
    .join(' · ')

  const head = `<b>Бриф: ${escapeHtml((a.name ?? '').slice(0, NAME_MAX))} · ${escapeHtml((a.contact ?? '').slice(0, CONTACT_MAX))}</b>`
  const rest = [
    shop,
    startLine,
    `Ступень: ${offerCopy[map.offer]}`,
    `⚠ категория: ${categoryText(a)}, проверить по правилу 1.6`,
    ...(k ? [`метка: ${k}`] : []),
  ].map(escapeHtml)

  const text = [head, ...rest].join('\n')
  return text.length <= SUMMARY_MAX ? text : trimDanglingEntity(text.slice(0, SUMMARY_MAX))
}
