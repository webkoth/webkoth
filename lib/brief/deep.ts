import type { ProcessId } from './ids'
import type { BriefAnswers, DeepAnswers, DeepQuestionId } from './schema'

// Подробный разбор процессов: какие процессы разбираются и когда ответы полны.
// Отдельно от редьюсера, чтобы данные брифа и схема не тянули за собой состояние экрана.

export const MAX_DEEP = 3
const REQUIRED_DEEP: readonly DeepQuestionId[] = ['frequency', 'who', 'etalon', 'rule', 'risk', 'data']

/** Обязательные вопросы подробного шага, по порядку экрана. */
export function missingDeep(d: DeepAnswers): DeepQuestionId[] {
  const missing = REQUIRED_DEEP.filter((f) => d[f] === undefined)
  if (needsCheck(d) && d.check === undefined) missing.push('check')
  return missing
}

export function needsCheck(d: DeepAnswers): boolean {
  return d.rule === 'experience' || d.rule === 'unknown'
}

export function isDeepComplete(d: DeepAnswers | undefined): boolean {
  return d !== undefined && missingDeep(d).length === 0
}

/** Процессы для подробного разбора, в порядке отметки или выбора. */
export function deepList(a: BriefAnswers): ProcessId[] {
  const picked = a.picked.map((p) => p.id)
  if (picked.length <= MAX_DEEP) return picked
  return a.deepChoice.filter((id) => picked.includes(id)).slice(0, MAX_DEEP)
}
