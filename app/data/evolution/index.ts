import { ru } from './ru'
import { en } from './en'
import type { EvolutionData, Lang } from './types'

export type { EvolutionData, EvolutionBlock, Fact, HubNodeKey, HubNodeCopy, Lang, RoadmapStep } from './types'

export const evolutionData: Record<Lang, EvolutionData> = { ru, en }

export const evolutionBlockOrder = [
  'system',
  'money',
  'decisions',
  'automation',
  'speed',
  'resources',
] as const satisfies readonly (keyof EvolutionData['blocks'])[]

export const LANGS: readonly Lang[] = ['ru', 'en']

export const isLang = (v: unknown): v is Lang => v === 'ru' || v === 'en'

/** RU живёт в корне, EN — под `/en`. Один источник для ссылок, hreflang и переключателя. */
export const homePath = (lang: Lang): string => (lang === 'ru' ? '/' : '/en')

/** CV остаётся в `/[lang]/minasarkisyan` для обоих языков. */
export const cvPath = (lang: Lang): string => `/${lang}/minasarkisyan`
