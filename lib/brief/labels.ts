import { processCatalog } from '@/app/data/brief/processes'
import { optionLabel, shopQuestions, type QuestionDef } from '@/app/data/brief/questions'
import type { ProcessId } from './ids'
import type { BriefAnswers } from './schema'

// Человеческие подписи ответов: для карты, сообщения в Telegram и файла.

export function processLabel(id: ProcessId, a: BriefAnswers): string {
  if (id === 'custom') return a.customLabel?.trim() || processCatalog.custom.label
  return processCatalog[id].label
}

export function answerValues(q: QuestionDef, a: BriefAnswers): string[] {
  const raw = a[q.id] as unknown
  if (typeof raw === 'string') return raw ? [raw] : []
  return Array.isArray(raw) ? (raw as string[]) : []
}

export function answerText(q: QuestionDef, a: BriefAnswers, separator = ', '): string | undefined {
  const values = answerValues(q, a)
  if (values.length === 0) return undefined
  return values
    .map((v) => {
      const label = optionLabel(q, v) ?? v
      if (q.other && v === q.other.trigger) {
        const extra = a[q.other.field]?.trim()
        return extra ? `${label}: ${extra}` : label
      }
      return label
    })
    .join(separator)
}

const question = (id: QuestionDef['id']) => shopQuestions.find((q) => q.id === id)!

export function marketplacesText(a: BriefAnswers): string {
  return answerText(question('marketplaces'), a, ' + ') ?? ''
}

export function categoryText(a: BriefAnswers): string {
  return answerText(question('category'), a) ?? 'не указана'
}
