import { HOURS_VALUE, RARE_HOURS_THRESHOLD } from '@/app/data/brief/coefficients'
import type { ProcessEntry } from '@/app/data/brief/processes'
import type { QuizInput } from '@/lib/standard/verdict'
import type { HoursBand } from './ids'
import type { DataReason } from './map-types'
import type { BriefAnswers, DeepAnswers } from './schema'

// Ответы селлера о процессе → вход движка вердикта (спека, 7.1). Вопросы, на которые
// селлер не ответит (один прогон, эффект, персональные данные), берутся из каталога.

export function ledgerHeadOnly(a: BriefAnswers): boolean {
  return a.ledger.length > 0 && a.ledger.every((l) => l === 'head')
}

export function dataReasonOf(entry: ProcessEntry, d: DeepAnswers, a: BriefAnswers): DataReason | undefined {
  if (d.data === 'head' || d.data === 'unknown') return 'data'
  if (entry.facts.moneyData && a.costKnown === 'no') return 'cost'
  if (entry.facts.moneyData && ledgerHeadOnly(a)) return 'ledger'
  return undefined
}

export function toQuizInput(
  entry: ProcessEntry,
  d: DeepAnswers,
  hours: HoursBand,
  a: BriefAnswers,
): { input: QuizInput; dataReason?: DataReason } {
  const dataReason = dataReasonOf(entry, d, a)
  // Необратимость имеет смысл только там, где шаг пишет наружу: у read и notify
  // деньги двигают отдельные шаги человека, и «ИИ готовит» без утверждения не нужен.
  const writes = entry.facts.sideEffect === 'write'
  return {
    input: {
      hasEtalon: d.etalon === 'many' || d.etalon === 'few',
      dataReady: dataReason === undefined,
      useful: d.frequency === 'rare' && HOURS_VALUE[hours] < RARE_HOURS_THRESHOLD ? 'rare' : 'yes',
      rule: d.rule === 'sheet' ? 'full' : d.rule === 'readInput' ? 'freeInput' : 'judgment',
      check: d.check === 'instant' ? 'auto' : d.check === 'glance' ? 'quick' : 'expert',
      singleRun: entry.facts.singleRun,
      sideEffect: entry.facts.sideEffect,
      irreversible: writes && d.risk !== 'nothing',
      personalData: entry.facts.personalData,
    },
    dataReason,
  }
}
