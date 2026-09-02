import type { Lang } from '@/app/data/evolution/types'
import { ru, kindLabels as ruKindLabels, statusLabels as ruStatusLabels } from './ru'
import { en, kindLabels as enKindLabels, statusLabels as enStatusLabels } from './en'
import { CASE_SLUGS, caseMeta, type CaseSlug } from './registry'
import type { BlockKey, CaseAngle, CaseCopy, CaseKind, CaseMeta, CaseStatus } from './types'

export type { BlockKey, CaseAngle, CaseBar, CaseCopy, CaseDetail, CaseKind, CaseLinks, CaseMeta, CaseStatus, Chip, ChipIcon } from './types'
export { CASE_SLUGS, caseMeta } from './registry'
export type { CaseSlug, CasesCopy } from './registry'

export const casesCopy: Record<Lang, Record<CaseSlug, CaseCopy>> = { ru, en }

/** Подписи типа и статуса выводятся из `meta`, а не пишутся у каждой системы. */
export const CASE_KIND_LABELS: Record<Lang, Record<CaseKind, string>> = { ru: ruKindLabels, en: enKindLabels }
export const CASE_STATUS_LABELS: Record<Lang, Record<CaseStatus, string>> = { ru: ruStatusLabels, en: enStatusLabels }

/** Кейсы живут в `/[lang]/cases/[slug]` - тот же контур, что CV. */
export const casePath = (lang: Lang, slug: CaseSlug): string => `/${lang}/cases/${slug}`

/**
 * Хост для подписи внешней ссылки. URL() валится на строке без схемы, а это
 * серверный рендер: одна кривая ссылка в реестре уронила бы всю страницу.
 * Живёт рядом с `casePath`: оба - чистые помощники по строкам реестра, и читают
 * их одинаково карточка кейса и панель фактов - защита обязана быть одной.
 */
export function linkLabel(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    // Голого хоста мало, когда ссылка ведёт на раздел того же сайта: подпись
    // «webkoth.com» на странице webkoth.com не говорит читателю ничего. Путь
    // добавляем, только если он есть, - у ссылок на чужие продукты его нет.
    const path = pathname.replace(/\/+$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch {
    return url
  }
}

export const isCaseSlug = (v: unknown): v is CaseSlug =>
  typeof v === 'string' && (CASE_SLUGS as readonly string[]).includes(v)

export type BlockAngle = {
  slug: CaseSlug
  meta: CaseMeta
  copy: CaseCopy
  angle: CaseAngle
  /**
   * Остальные блоки той же системы - пометка связи называет их, а не только считает.
   * Пустой массив - нормальное состояние, а не край: система, показанная в одном
   * блоке, связывать не с чем. Такие есть в каждом блоке, и у них же
   * `detail.effects` длиной в одну строку.
   */
  otherBlocks: BlockKey[]
}

/** Карточки одного блока в порядке CASE_SLUGS. */
export function anglesForBlock(lang: Lang, block: BlockKey): BlockAngle[] {
  const copies = casesCopy[lang]
  const out: BlockAngle[] = []
  for (const slug of CASE_SLUGS) {
    // `as const` в реестре сужает `blocks` до кортежа литералов, а `includes`
    // тогда не принимает чужой блок. Здесь нужен широкий тип, а не литералы.
    const meta: CaseMeta = caseMeta[slug]
    if (!meta.blocks.includes(block)) continue
    const copy = copies[slug]
    const angle = copy.angles[block]
    if (!angle) continue
    out.push({ slug, meta, copy, angle, otherBlocks: meta.blocks.filter((b) => b !== block) })
  }
  return out
}

/**
 * Угол системы для лендинга: карусель лендинга показывает каждую систему один
 * раз, углом её первого блока. `blocks[0]` есть всегда, тип кортежа непустой.
 */
export function angleForCase(lang: Lang, slug: CaseSlug): BlockAngle {
  const meta = caseMeta[slug]
  const copy = casesCopy[lang][slug]
  const block = meta.blocks[0]
  const angle = copy.angles[block]
  if (!angle) throw new Error(`angleForCase: ${lang}/${slug} has no angle for ${block}`)
  return { slug, meta, copy, angle, otherBlocks: meta.blocks.filter((b) => b !== block) }
}

export function getCase(lang: Lang, slug: CaseSlug): { meta: CaseMeta; copy: CaseCopy } {
  return { meta: caseMeta[slug], copy: casesCopy[lang][slug] }
}
