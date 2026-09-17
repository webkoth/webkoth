import { AGENT_EARLY_FITNESS, RETURN_SHARE } from '@/app/data/brief/coefficients'
import type { Verdict } from '@/lib/standard/verdict'
import type { ProcessId } from './ids'
import type { DynamicOutcome, MapItem, StageInfo } from './map-types'

// Часы и приоритет (спека, 7.4). Коэффициенты - допущения в coefficients.ts.

export function returnedHours(hours: number, outcome: DynamicOutcome): number {
  return hours * RETURN_SHARE[outcome.shareKey]
}

export function fitness(outcome: DynamicOutcome, verdict: Verdict, stage: StageInfo): number {
  if (outcome.color === 'skip') return 0
  // Агент не первым шагом, пока ИИ в компании не освоен (OpenAI, five AI value models).
  if (verdict.form === 'f5' && outcome.color !== 'human' && stage.early) return AGENT_EARLY_FITNESS
  return 1
}

/** По убыванию приоритета; Array.prototype.sort стабилен, равные сохраняют порядок выбора. */
export function sortByPriority(items: readonly MapItem[]): MapItem[] {
  return [...items].sort((a, b) => b.priority - a.priority)
}

/** Первый процесс, с которого начать: заполнен, приоритет > 0, цвет «сам» или «ИИ готовит». */
export function pickStart(sorted: readonly MapItem[]): ProcessId | undefined {
  return sorted.find(
    (i) => i.status === 'ready' && i.priority > 0 && (i.outcome?.color === 'auto' || i.outcome?.color === 'ai'),
  )?.processId
}

export function formatHours(n: number): string {
  return n < 1 ? '<1' : String(Math.round(n))
}
