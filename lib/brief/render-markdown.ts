import { colorShort, deliverCopy, offerCopy } from '@/app/data/brief/copy'
import { deepQuestions, goalsQuestions, nowQuestions, optionLabel, shopQuestions, type QuestionDef } from '@/app/data/brief/questions'
import { casePath } from '@/app/data/cases'
import type { BriefInternal } from './internal'
import { answerText, answerValues } from './labels'
import type { BriefMap, MapItem } from './map-types'
import { formatHours } from './priority'
import type { BriefAnswers } from './schema'

// Полный файл брифа для нас (спека, 9.3): флаги, ответы, вердикты по шагам, что уточнить,
// ступень и исходные ответы JSON-блоком для /task-verdict.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'

function moscow(d: Date) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '00'
  return { y: get('year'), m: get('month'), d: get('day'), hh: get('hour'), mm: get('minute') }
}

export function briefFilename(k: string | undefined, now: Date): string {
  const t = moscow(now)
  return `brief-${k ?? 'nolabel'}-${t.y}-${t.m}-${t.d}-${t.hh}${t.mm}.md`
}

const bullets = (xs: readonly string[]) => (xs.length > 0 ? xs.map((x) => `- ${x}`) : ['- нет'])

// Многострочный текст селлера цитатой под пунктом: его строки не станут заголовками
// файла и не закроют блок JSON.
const quote = (text: string) => text.split(/\r\n|\r|\n/).map((l) => (l ? `  > ${l}` : '  >'))

function general(qs: readonly QuestionDef[], a: BriefAnswers): string[] {
  return qs
    .filter((q) => !q.showIf || q.showIf(a))
    .flatMap((q) => {
      // Рассказ о пилоте многострочный: в пункте подпись варианта, сам рассказ цитатой.
      const story =
        q.other?.field === 'aiTried' && answerValues(q, a).includes(q.other.trigger) ? a.aiTried?.trim() : undefined
      if (story) return [`- ${q.title} ${answerText(q, { ...a, aiTried: undefined })}:`, ...quote(story)]
      return [`- ${q.title} ${answerText(q, a) ?? 'нет ответа'}`]
    })
}

function itemLines(item: MapItem, a: BriefAnswers, isStart: boolean): string[] {
  const out = [`### ${item.label}${isStart ? ` (${deliverCopy.start})` : ''}`, '']
  out.push(
    `- Часы: ${formatHours(item.hours)} ч/нед; вернуть ≈ ${item.returnedHours.toFixed(1)} ч/нед; приоритет ${item.priority.toFixed(2)} (часы × доля вердикта × пригодность)`,
  )
  if (item.status === 'pending' || !item.verdict || !item.input) {
    out.push(`- ${deliverCopy.noDeep}`)
    return out
  }
  const d = a.deepAnswers[item.processId] ?? {}
  for (const q of deepQuestions) {
    if (q.showIf && !q.showIf(d)) continue
    out.push(`- ${q.title} ${optionLabel(q, d[q.id]) ?? 'нет ответа'}`)
  }
  out.push(`- Вход вердикта: \`${JSON.stringify(item.input)}\``)
  const au = item.verdict.autonomy
  out.push(
    `- Вердикт: ${item.verdict.form}` +
      (au ? `; автономия: сбор ${au.collect} · анализ ${au.analyze} · решение ${au.decide} · действие ${au.act}` : '') +
      (item.verdict.flags.length > 0 ? `; флаги: ${item.verdict.flags.join(', ')}` : ''),
  )
  out.push(`- Цепочка: ${item.chain.map((s) => `${s.label} [${colorShort[s.color]}]`).join(' → ')}`)
  for (const b of item.branches) out.push(`- Ветка: ${b.when} → ${b.step.label} [${colorShort[b.step.color]}]`)
  for (const note of [...(item.outcome?.notes ?? []), ...(item.entryNote ? [item.entryNote] : [])]) {
    out.push(`- Пометка: ${note}`)
  }
  for (const p of item.prepare) out.push(`- Подготовить: ${p}`)
  if (item.readyMade) {
    out.push(`- Готовое: ${item.readyMade.text}${item.readyMade.alreadyUsing ? ' (уже пользуются похожим)' : ''}`)
  }
  for (const l of item.library) out.push(`- Библиотека: [${l.label}](${l.href})`)
  for (const c of item.cases) out.push(`- Кейс: ${BASE_URL}${casePath('ru', c)}`)
  return out
}

export type MarkdownInput = {
  answers: BriefAnswers
  map: BriefMap
  internal: BriefInternal
  k?: string
  startedAtMs: number
  now: Date
}

export function renderMarkdown({ answers: a, map, internal, k, startedAtMs, now }: MarkdownInput): string {
  const t = moscow(now)
  const elapsedMs = now.getTime() - startedAtMs
  // Начало позже отправки: часы устройства спешат, длительность не посчитать.
  const filled = elapsedMs < 0 ? 'неизвестно (часы устройства)' : `${Math.max(1, Math.round(elapsedMs / 60_000))} мин`
  return [
    `# Бриф: ${a.name ?? ''}`,
    '',
    `- Контакт: ${a.contact ?? ''}`,
    `- Дата: ${t.d}.${t.m}.${t.y} ${t.hh}:${t.mm} МСК`,
    `- Заполнение: ${filled}`,
    `- Метка: ${k ?? 'нет'}`,
    '',
    '## 1. Флаги',
    '',
    ...bullets(internal.flags),
    '',
    '## 2. Магазин и стадия',
    '',
    `- Стадия: ${map.stage.forUs}`,
    ...general(shopQuestions, a),
    ...general(nowQuestions, a),
    '',
    '## 3. Разобранные процессы',
    '',
    ...(map.items.length > 0
      ? map.items.flatMap((i) => [...itemLines(i, a, i.processId === map.startId), ''])
      : ['- нет', '']),
    ...(map.startFallback ? [`Старта нет, начать с порядка: ${map.startFallback.text}`, ''] : []),
    '## 4. Уточнить на созвоне',
    '',
    ...bullets(internal.clarify),
    '',
    '## 5. Отмечены, но не разобраны',
    '',
    ...bullets(map.notDeep.map((n) => `${n.label}: ${formatHours(n.hours)} ч/нед`)),
    '',
    '## 6. Цели и рамки',
    '',
    ...general(goalsQuestions, a),
    ...(a.notes?.trim() ? ['- Что ещё важно знать:', ...quote(a.notes.trim())] : ['- Что ещё важно знать: нет']),
    '',
    '## 7. Ступень',
    '',
    `- ${offerCopy[internal.offer]}`,
    `- Итог по разобранным процессам: ≈ ${formatHours(map.totalReturnedHours)} ч/нед`,
    '',
    '## 8. Ответы (JSON для /task-verdict)',
    '',
    // Тильды, а не обратные кавычки: JSON.stringify экранирует переносы, строка «~~~~»
    // внутри блока невозможна, а «```» из текста селлера блок не закроет.
    '~~~~json',
    JSON.stringify(a, null, 2),
    '~~~~',
    '',
  ].join('\n')
}
