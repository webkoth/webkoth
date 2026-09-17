import type { HoursBand } from '@/lib/brief/ids'
import type { ShareKey } from '@/lib/brief/map-types'

// Допущения карты. Оценки без замера: пересматриваем после трёх брифов по расхождению
// с тем, что выяснилось на созвонах (спека, раздел 14).

/** Часов в неделю для деления шкалы шага 3. */
export const HOURS_VALUE: Record<HoursBand, number> = {
  lt1: 0.5,
  '1to3': 2,
  '3to5': 4,
  '5to10': 7.5,
  '10plus': 12,
}

/** Какую долю часов процесса возвращает вердикт dynamic-шага. */
export const RETURN_SHARE: Record<ShareKey, number> = {
  f3: 0.9,
  aiAuto: 0.8,
  aiPrepares: 0.6,
  split: 0.5,
  human: 0.2,
  skip: 0,
}

/** Пригодность агента первым шагом на стадиях 0 и 1. */
export const AGENT_EARLY_FITNESS = 0.5

/** Реже раза в неделю и меньше стольких часов → «редко» (В1). */
export const RARE_HOURS_THRESHOLD = 1

/** «Уже есть готовое» старше стольких месяцев требует перепроверки. */
export const READY_MADE_MAX_AGE_MONTHS = 6
