import { flagCopy } from '@/app/data/brief/copy'
import { clarifyFor, flagsFor } from './flags'
import type { BriefMap, OfferStep } from './map-types'
import { offerStepOf } from './offer-step'
import type { BriefAnswers } from './schema'

// Внутренняя часть брифа: ступень, флаги и «что уточнить» нужны только нам (файл и
// сообщение в Telegram). Строится на сервере рядом с картой и в браузер не уходит.

/** Бриф заполняется минутами; быстрее минуты похоже на бота, но такой бриф не теряем. */
export const MIN_FILL_SECONDS = 60

/** fastFillSeconds: заполнено быстрее минуты, проверить вручную. */
export type BriefInternal = { offer: OfferStep; flags: string[]; clarify: string[]; fastFillSeconds?: number }

export function buildInternal(a: BriefAnswers, map: BriefMap, opts?: { fillSeconds?: number }): BriefInternal {
  const s = opts?.fillSeconds
  const fast = s !== undefined && s >= 0 && s < MIN_FILL_SECONDS ? s : undefined
  const internal: BriefInternal = {
    offer: offerStepOf(a, map.items, map.startId),
    flags: [...(fast !== undefined ? [flagCopy.fastFill(fast)] : []), ...flagsFor(a)],
    clarify: clarifyFor(a, map.items),
  }
  return fast !== undefined ? { ...internal, fastFillSeconds: fast } : internal
}
