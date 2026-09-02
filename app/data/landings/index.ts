// app/data/landings/index.ts
import type { LandingSlug } from './types'

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

/** Лендинги живут в корне, латиницей: `/kontur`, `/finance`. */
export const landingPath = (slug: LandingSlug): string => `/${slug}`
