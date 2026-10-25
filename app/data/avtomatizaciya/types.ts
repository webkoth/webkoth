// Тексты главной webkoth.com (оффер для продавцов маркетплейсов). Только RU.
// Компоненты тексты не содержат. Утверждено собственником 25.10.2026:
// business-os/portfolio/2026-10-25-webkoth-glavnaya-teksty.md.
import type { CaseSlug } from '@/app/data/cases'
import type { LandingCopy, LeadField } from '@/app/data/landings'

export type DirectionId = 'finance' | 'data' | 'stock' | 'ads' | 'content' | 'chat'

/** Живая иллюстрация блока: сюжеты из набора «Деньги и учёт» роликов finstock. */
export type IllustrationKind = 'waterfall' | 'reconcile' | 'stock' | 'summary' | 'card' | 'chat'

/** Кто заказчик кейса: свой магазин или небольшой продавец, либо торговая компания. */
export type CaseOwner = 'shop' | 'company'

export type DirectionCase = {
  slug: CaseSlug
  owner: CaseOwner
  title: string
  before: string
  after: string
}

export type Direction = {
  id: DirectionId
  /** Короткое имя направления: подпись над заголовком блока. */
  label: string
  title: string
  body: string
  illustration: IllustrationKind
  cases: readonly [DirectionCase, ...DirectionCase[]]
}

export type Step = { title: string; body: string }
export type Price = { title: string; price: string; body: string; highlight?: boolean }
export type Stat = { value: string; label: string }

export type AvtomatizaciyaCopy = {
  meta: { title: string; description: string }
  nav: { services: string; how: string; pricing: string; faq: string; cta: string }
  hero: {
    eyebrow: string
    title: string
    /** Часть заголовка, которая горит акцентом (одна циановая строка, как в роликах). */
    titleAccent: string
    sub: string
    /** Строка доверия под подзаголовком. */
    proof: string
    primaryCta: string
    secondaryCta: string
    note: string
    stats: readonly [Stat, Stat, Stat]
  }
  directions: {
    eyebrow: string
    title: string
    owners: Record<CaseOwner, string>
    labels: { before: string; after: string; more: string; example: string; siblings: string }
    items: readonly Direction[]
  }
  how: { eyebrow: string; title: string; steps: readonly Step[] }
  pricing: { eyebrow: string; title: string; items: readonly Price[] }
  faq: LandingCopy['faq']
  lead: {
    eyebrow: string
    title: string
    sub: string
    /** Подпись и подсказка главного вопроса формы вместо вопроса прежней главной. */
    answerLabel: string
    answerPlaceholder: string
    fieldsNote: string
    fields: readonly LeadField[]
    brief: { label: string; href: string }
  }
}
