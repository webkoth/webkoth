import { deepList, MAX_DEEP, missingDeep, needsCheck } from './deep'
import type { HoursBand, ProcessId } from './ids'
import {
  briefAnswersSchema,
  deepAnswersSchema,
  emptyAnswers,
  type BriefAnswers,
  type DeepAnswers,
  type DeepQuestionId,
} from './schema'

export { MAX_DEEP, deepList, isDeepComplete, needsCheck } from './deep'

// Состояние брифа и переходы между шагами. Чистые функции: компонент только
// рисует и диспатчит, проверка шагов и порядок экранов тестируются здесь.

export const STEP_KEYS = ['intro', 'shop', 'now', 'time', 'deep', 'goals', 'map'] as const
export type StepKey = (typeof STEP_KEYS)[number]

export const SEND_STATUSES = ['idle', 'sending', 'sent', 'failed', 'rateLimited'] as const
export type SendStatus = (typeof SEND_STATUSES)[number]

const DEFAULT_HOURS: HoursBand = '1to3'

export type BriefState = {
  version: 1
  step: StepKey
  deepIndex: number
  /** 0 - бриф ещё не начат. */
  startedAtMs: number
  answers: BriefAnswers
  send: SendStatus
}

/** Поля ответов, которые меняются одним действием setField. */
export type GeneralField = Exclude<keyof BriefAnswers, 'picked' | 'deepChoice' | 'deepAnswers' | 'consent'>

export type BriefAction =
  | { type: 'start'; now: number }
  | { type: 'reset' }
  | { type: 'restore'; state: BriefState }
  | { type: 'setField'; field: GeneralField; value: string | string[] | undefined }
  | { type: 'setConsent'; value: boolean }
  | { type: 'toggleProcess'; id: ProcessId }
  | { type: 'setHours'; id: ProcessId; hours: HoursBand }
  | { type: 'toggleDeepChoice'; id: ProcessId }
  | { type: 'setDeep'; id: ProcessId; field: DeepQuestionId; value: string | undefined }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; step: StepKey }
  | { type: 'send'; status: SendStatus }

export function initialState(startedAtMs: number): BriefState {
  return { version: 1, step: 'intro', deepIndex: 0, startedAtMs, answers: emptyAnswers(), send: 'idle' }
}

export function stepNumber(step: StepKey): number {
  return STEP_KEYS.indexOf(step)
}

export function invalidFields(s: BriefState): string[] {
  const a = s.answers
  switch (s.step) {
    case 'shop':
      return a.marketplaces.length === 0 ? ['marketplaces'] : []
    case 'time': {
      if (a.picked.length === 0) return ['picked']
      const out: string[] = []
      if (a.picked.length > MAX_DEEP && deepList(a).length === 0) out.push('deepChoice')
      if (a.picked.some((p) => p.id === 'custom') && !a.customLabel?.trim()) out.push('customLabel')
      return out
    }
    case 'deep': {
      const id = deepList(a)[s.deepIndex]
      if (!id) return []
      return missingDeep(a.deepAnswers[id] ?? {})
    }
    case 'goals': {
      const out: string[] = []
      if ((a.name ?? '').trim().length < 2) out.push('name')
      if ((a.contact ?? '').trim().length < 3) out.push('contact')
      if (!a.consent) out.push('consent')
      return out
    }
    default:
      return []
  }
}

function withAnswers(s: BriefState, answers: BriefAnswers): BriefState {
  return { ...s, answers }
}

function nextStep(s: BriefState): BriefState {
  const count = deepList(s.answers).length
  switch (s.step) {
    case 'intro':
      return { ...s, step: 'shop' }
    case 'shop':
      return { ...s, step: 'now' }
    case 'now':
      return { ...s, step: 'time' }
    case 'time':
      return count > 0 ? { ...s, step: 'deep', deepIndex: 0 } : { ...s, step: 'goals' }
    case 'deep':
      return s.deepIndex < count - 1 ? { ...s, deepIndex: s.deepIndex + 1 } : { ...s, step: 'goals' }
    case 'goals':
      return { ...s, step: 'map' }
    default:
      return s
  }
}

function prevStep(s: BriefState): BriefState {
  const count = deepList(s.answers).length
  switch (s.step) {
    case 'shop':
      return { ...s, step: 'intro' }
    case 'now':
      return { ...s, step: 'shop' }
    case 'time':
      return { ...s, step: 'now' }
    case 'deep':
      return s.deepIndex > 0 ? { ...s, deepIndex: s.deepIndex - 1 } : { ...s, step: 'time' }
    case 'goals':
      return count > 0 ? { ...s, step: 'deep', deepIndex: count - 1 } : { ...s, step: 'time' }
    case 'map':
      return { ...s, step: 'goals' }
    default:
      return s
  }
}

/** Номер подробного шага в пределах списка разбираемых процессов. */
function clampDeepIndex(index: number, answers: BriefAnswers): number {
  return Math.min(Math.max(0, index), Math.max(0, deepList(answers).length - 1))
}

/** Черновик с вводного экрана открывается с шага 1: вводный экран его и предлагает. */
function restored(saved: BriefState): BriefState {
  const step = saved.step === 'intro' ? 'shop' : saved.step
  const deepIndex = clampDeepIndex(saved.deepIndex, saved.answers)
  return step === saved.step && deepIndex === saved.deepIndex ? saved : { ...saved, step, deepIndex }
}

/** На шаге «Подробно» всегда есть процесс: без них шаг 3, номер в пределах списка. */
function withDeepInvariant(s: BriefState): BriefState {
  if (s.step !== 'deep') return s
  if (deepList(s.answers).length === 0) return { ...s, step: 'time', deepIndex: 0 }
  const deepIndex = clampDeepIndex(s.deepIndex, s.answers)
  return deepIndex === s.deepIndex ? s : { ...s, deepIndex }
}

export function briefReducer(s: BriefState, action: BriefAction): BriefState {
  return withDeepInvariant(reduce(s, action))
}

function reduce(s: BriefState, action: BriefAction): BriefState {
  const a = s.answers
  switch (action.type) {
    case 'start':
      return { ...initialState(action.now), step: 'shop' }
    case 'reset':
      return initialState(0)
    case 'restore':
      return restored(action.state)
    case 'setField':
      // Значение из интерфейса проверяется той же схемой, что и отправка: мусор в черновик не попадает.
      if (!briefAnswersSchema.shape[action.field].safeParse(action.value).success) return s
      return withAnswers(s, { ...a, [action.field]: action.value } as BriefAnswers)
    case 'setConsent':
      return withAnswers(s, { ...a, consent: action.value })
    case 'toggleProcess': {
      if (a.picked.some((p) => p.id === action.id)) {
        const deepAnswers = { ...a.deepAnswers }
        delete deepAnswers[action.id]
        return withAnswers(s, {
          ...a,
          picked: a.picked.filter((p) => p.id !== action.id),
          deepChoice: a.deepChoice.filter((id) => id !== action.id),
          deepAnswers,
        })
      }
      return withAnswers(s, { ...a, picked: [...a.picked, { id: action.id, hours: DEFAULT_HOURS }] })
    }
    case 'setHours':
      return withAnswers(s, {
        ...a,
        picked: a.picked.map((p) => (p.id === action.id ? { ...p, hours: action.hours } : p)),
      })
    case 'toggleDeepChoice': {
      if (a.deepChoice.includes(action.id)) {
        return withAnswers(s, { ...a, deepChoice: a.deepChoice.filter((id) => id !== action.id) })
      }
      if (a.deepChoice.length >= MAX_DEEP) return s
      return withAnswers(s, { ...a, deepChoice: [...a.deepChoice, action.id] })
    }
    case 'setDeep': {
      if (!deepAnswersSchema.shape[action.field].safeParse(action.value).success) return s
      const next = { ...(a.deepAnswers[action.id] ?? {}), [action.field]: action.value } as DeepAnswers
      if (!needsCheck(next)) delete next.check
      return withAnswers(s, { ...a, deepAnswers: { ...a.deepAnswers, [action.id]: next } })
    }
    case 'next':
      return nextStep(s)
    case 'back':
      return prevStep(s)
    case 'goto':
      return { ...s, step: action.step }
    case 'send':
      return { ...s, send: action.status }
  }
}
