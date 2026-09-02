// app/data/landings/types.ts
// Лендинги под кампании Директа. Язык-независимая часть - registry.ts,
// пресеты квиза - presets.ts, тексты - по файлу на страницу. Только RU.
import type { CaseSlug } from '@/app/data/cases'
import type { QuizInput, VerdictForm } from '@/lib/standard/verdict'

export type LandingSlug = 'kontur' | 'it-director' | 'agent' | 'finance'

/** A «симптомы первыми» или C «кейс первым» из спеки, секция 6. */
export type LandingSkeleton = 'symptoms-first' | 'case-first'

export type QuizPresetId =
  | 'kontur-stocks'
  | 'kontur-reports'
  | 'kontur-orders'
  | 'kontur-payouts'
  | 'it-access'
  | 'it-backups'
  | 'it-unknown'
  | 'it-vendors'
  | 'agent-inbox'
  | 'agent-reports'
  | 'agent-calls'
  | 'agent-content'
  | 'finance-pervichka'
  | 'finance-otchet'
  | 'finance-statements'
  | 'finance-payments'

export type LandingMeta = {
  slug: LandingSlug
  skeleton: LandingSkeleton
  /** Главный кейс для case-first; у symptoms-first его нет. */
  heroCase?: CaseSlug
  /** Порядок карусели. Минимум три, иначе карусель бессмысленна. */
  cases: readonly [CaseSlug, CaseSlug, CaseSlug, ...CaseSlug[]]
  presets: readonly [QuizPresetId, ...QuizPresetId[]]
  /** Имя кампании Директа: попадает в utm_campaign и в отчёты. */
  campaign: string
}

/** Ключи вопросов квиза, к которым пресет даёт подсказку. */
export type QuizQuestionKey = keyof QuizInput

export type QuizPreset = {
  id: QuizPresetId
  landing: LandingSlug
  /** «остатки склад ↔ площадки»: имя процесса для заявки и для кнопки выбора. */
  label: string
  /** Подсказки на языке аудитории; не заданные вопросы показывают общую подсказку квиза. */
  hints: Partial<Record<QuizQuestionKey, string>>
  /** Карточки библиотеки стандарта в результате; заменяют общие ссылки формы. */
  library: readonly { label: string; href: string }[]
}

export type LandingStep = { title: string; body: string }
export type PricingStep = { title: string; price: string; body: string }
export type FaqItem = { q: string; a: string }

export type LandingCopy = {
  meta: { title: string; description: string }
  /** Подписи якорей в шапке: квиз, как работает, кейсы, цены, вопросы. */
  nav: { quiz: string; how: string; cases: string; pricing: string; faq: string; cta: string }
  hero: { eyebrow: string; title: string; sub: string; primaryCta: string; secondaryCta: string }
  /** Только для symptoms-first. */
  symptoms?: { eyebrow: string; title: string; items: readonly [string, string, string, ...string[]] }
  /** Только для case-first: подпись над главным кейсом. */
  heroCase?: { eyebrow: string; title: string }
  quiz: {
    eyebrow: string
    title: string
    lead: string
    /** «Ответы никуда не уходят, пока вы не нажмёте кнопку». */
    disclaimer: string
    presetQuestion: string
    ownLabel: string
    ownPlaceholder: string
    ownSubmit: string
    /** «Что это значит для вас» под вердиктом, по форме. */
    meaning: Record<VerdictForm, string>
    cta: string
  }
  how: { eyebrow: string; title: string; steps: readonly [LandingStep, LandingStep, LandingStep, LandingStep] }
  standardNote: { title: string; standard: string; individual: string }
  cases: { eyebrow: string; title: string }
  pricing: { eyebrow: string; title: string; note: string; steps: readonly [PricingStep, ...PricingStep[]] }
  faq: { eyebrow: string; title: string; items: readonly [FaqItem, FaqItem, FaqItem, ...FaqItem[]] }
  lead: { eyebrow: string; title: string; sub: string }
}
