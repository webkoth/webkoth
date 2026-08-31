// Чистая логика вердикта AIAS: восемь вопросов схемы как таблица решений.
// Это осознанный вердикт по самому стандарту (В3: правило записывается полностью →
// код с тестами, без модели). Порядок и исходы повторяют diagrams/verdikt из
// репозитория стандарта один в один — квиз и схема не должны расходиться.

export type QuizInput = {
  /** В2 (ворота): есть пример правильного результата. */
  hasEtalon: boolean
  /** В8 (ворота): данные существуют и доступны (API/база, качество известно). */
  dataReady: boolean
  /** В0–В1: шаг нужен и достаточно частый/дорогой. */
  useful: 'no' | 'rare' | 'yes'
  /** В3: записывается ли правило полностью (тест: таблица решений). */
  rule: 'full' | 'freeInput' | 'judgment'
  /** В4: насколько дёшево проверить результат (только для rule=judgment). */
  check: 'auto' | 'quick' | 'expert'
  /** В7: укладывается ли в один прогон (~10 шагов, без человека посередине). */
  singleRun: boolean
  /** В6: что шаг меняет снаружи. */
  sideEffect: 'read' | 'notify' | 'write'
  /** В5: есть ли необратимое действие (деньги, документы, публикация). */
  irreversible: boolean
  /** В5 (ворота): есть ли персональные данные. */
  personalData: boolean
}

export type VerdictForm =
  | 'stopEtalon'
  | 'stopData'
  | 'f0'
  | 'f1'
  | 'f3'
  | 'f4'
  | 'f1f2'
  | 'split'
  | 'f5'

export type VerdictFlag = 'irreversible' | 'personalData' | 'rope'

export type Autonomy = { collect: 'A5'; analyze: 'A5'; decide: 'A1'; act: 'A2' | 'A4' | 'A5' }

export type Verdict = {
  form: VerdictForm
  /** Профиль автономии по стадиям — только для форм с моделью в рантайме (F4/F5). */
  autonomy?: Autonomy
  flags: VerdictFlag[]
}

// Автономия «действия» от побочного эффекта: write стартует с утверждения,
// notify — «сделал и сообщил», read — молча. Необратимое прижимает к A2 всегда.
function actLevel(input: QuizInput): Autonomy['act'] {
  if (input.irreversible || input.sideEffect === 'write') return 'A2'
  if (input.sideEffect === 'notify') return 'A4'
  return 'A5'
}

function flagsOf(input: QuizInput, withRope: boolean): VerdictFlag[] {
  const flags: VerdictFlag[] = []
  if (input.irreversible) flags.push('irreversible')
  if (input.personalData) flags.push('personalData')
  if (withRope && actLevel(input) === 'A2') flags.push('rope')
  return flags
}

export function decideVerdict(input: QuizInput): Verdict {
  // Ярус ворот: любое «нет» прекращает разбор — форма не выбирается.
  if (!input.hasEtalon) return { form: 'stopEtalon', flags: flagsOf(input, false) }
  if (!input.dataReady) return { form: 'stopData', flags: flagsOf(input, false) }

  // Взвешивание.
  if (input.useful === 'no') return { form: 'f0', flags: [] }
  if (input.useful === 'rare') return { form: 'f1', flags: flagsOf(input, false) }

  if (input.rule === 'full') return { form: 'f3', flags: flagsOf(input, false) }
  if (input.rule === 'freeInput') {
    return {
      form: 'f4',
      autonomy: { collect: 'A5', analyze: 'A5', decide: 'A1', act: actLevel(input) },
      flags: flagsOf(input, true),
    }
  }

  // Суждение: проверяемость решает, кому оно достаётся.
  if (input.check === 'expert') return { form: 'f1f2', flags: flagsOf(input, false) }
  if (!input.singleRun) return { form: 'split', flags: flagsOf(input, false) }

  return {
    form: 'f5',
    autonomy: { collect: 'A5', analyze: 'A5', decide: 'A1', act: actLevel(input) },
    flags: flagsOf(input, true),
  }
}
