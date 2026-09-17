import type { ProcessId } from './ids'
import type { MapItem, OfferStep } from './map-types'
import type { BriefAnswers } from './schema'
import { ledgerHeadOnly } from './to-quiz-input'

// Какую ступень предложить (спека, 7.6). Первое сработавшее правило. Цены здесь нет:
// цену называет человек.

export function offerStepOf(a: BriefAnswers, items: readonly MapItem[], startId: ProcessId | undefined): OfferStep {
  if (a.aiNow === 'triedFailed') return 'pilot'
  const withoutData = items.filter((i) => i.verdict?.form === 'stopData').length
  if (withoutData >= 2 || ledgerHeadOnly(a)) return 'audit'
  if (startId && a.implementer !== 'nobody') return 'firstProcess'
  return 'review'
}
