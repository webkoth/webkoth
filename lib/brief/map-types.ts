import type { CaseSlug } from '@/app/data/cases'
import type { QuizInput, Verdict } from '@/lib/standard/verdict'
import type { HoursBand, ProcessId } from './ids'

// Типы карты. Карта - результат buildMap: и для экрана селлера, и для файла нам.

/** Цвет шага для владельца (AIAS-01): сам, ИИ готовит, человек, не трогать. */
export type StepColor = 'auto' | 'ai' | 'human' | 'skip'

/** Ключ доли часов, которую возвращает dynamic-шаг (coefficients.ts). */
export type ShareKey = 'f3' | 'aiAuto' | 'aiPrepares' | 'split' | 'human' | 'skip'

/** Почему данные не готовы: ответ селлера, себестоимость или учёт «в голове». */
export type DataReason = 'data' | 'cost' | 'ledger'

export type DynamicOutcome = {
  color: StepColor
  caption: string
  notes: string[]
  shareKey: ShareKey
  /** Показывать ли шаг approval после dynamic-шага. */
  showApproval: boolean
}

export type MapStep = { label: string; color: StepColor; caption?: string }
export type MapBranch = { when: string; step: MapStep }
export type LinkRef = { label: string; href: string }
export type ReadyMadeView = { kind: 'cabinet' | 'service'; text: string; alreadyUsing: boolean }

export type MapItem = {
  processId: ProcessId
  label: string
  hoursBand: HoursBand
  /** Часов в неделю по шкале шага 3. */
  hours: number
  /** pending - подробности ещё не заполнены (живой черновик). */
  status: 'pending' | 'ready'
  input?: QuizInput
  verdict?: Verdict
  dataReason?: DataReason
  outcome?: DynamicOutcome
  returnedHours: number
  priority: number
  chain: MapStep[]
  branches: MapBranch[]
  why: string[]
  prepare: string[]
  entryNote?: string
  readyMade?: ReadyMadeView
  cases: readonly CaseSlug[]
  library: readonly LinkRef[]
}

export type StageKey = 'stage0' | 'stage1' | 'stage1to2' | 'stage1stuck' | 'unknown'
export type StageInfo = {
  key: StageKey
  label: string
  forUs: string
  /** Стадии 0 и 1: агент не предлагается первым шагом. */
  early: boolean
  stuckPilot: boolean
}

export type OfferStep = 'pilot' | 'audit' | 'firstProcess' | 'review'

export type BriefMap = {
  stage: StageInfo
  /** Разобранные процессы, по приоритету. */
  items: MapItem[]
  startId?: ProcessId
  startFallback?: { processId: ProcessId; text: string }
  totalReturnedHours: number
  notDeep: { processId: ProcessId; label: string; hours: number }[]
  offer: OfferStep
  flags: string[]
  clarify: string[]
}
