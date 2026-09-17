import { clarifyFor, flagsFor } from './flags'
import type { BriefMap, OfferStep } from './map-types'
import { offerStepOf } from './offer-step'
import type { BriefAnswers } from './schema'

// Внутренняя часть брифа: ступень, флаги и «что уточнить» нужны только нам (файл и
// сообщение в Telegram). Строится на сервере рядом с картой и в браузер не уходит.

export type BriefInternal = { offer: OfferStep; flags: string[]; clarify: string[] }

export function buildInternal(a: BriefAnswers, map: BriefMap): BriefInternal {
  return {
    offer: offerStepOf(a, map.items, map.startId),
    flags: flagsFor(a),
    clarify: clarifyFor(a, map.items),
  }
}
