// app/data/landings/index.ts
import { kontur } from './kontur'
import { itDirector } from './it-director'
import { agent } from './agent'
import { finance } from './finance'
import type { LandingCopy, LandingSlug } from './types'

export type {
  FaqItem,
  LandingCopy,
  LandingMeta,
  LandingSkeleton,
  LandingSlug,
  LandingStep,
  PricingStep,
  QuizPreset,
  QuizPresetId,
  QuizQuestionKey,
} from './types'
export { LANDING_SLUGS, isLandingSlug, landingMeta } from './registry'
export { presetsForLanding, quizPresets, resolvePresetParam } from './presets'

export const landingCopy: Record<LandingSlug, LandingCopy> = {
  kontur,
  'it-director': itDirector,
  agent,
  finance,
}

/** Лендинги живут в корне, латиницей: `/kontur`, `/finance`. */
export const landingPath = (slug: LandingSlug): string => `/${slug}`
