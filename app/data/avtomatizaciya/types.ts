// Тексты одностраничника /avtomatizaciya. Только RU. Компоненты тексты не содержат.
import type { CaseSlug } from '@/app/data/cases'
import type { LandingCopy, LeadField } from '@/app/data/landings'

export type ServiceIcon = 'profit' | 'reports' | 'stock' | 'ads' | 'reviews' | 'chat' | 'agents' | 'photo'

export type Service = { icon: ServiceIcon; title: string; body: string }
export type CompanyTile = { id: 'kontur' | 'finance' | 'it-director' | 'training'; title: string; body: string; price: string; support: string }
export type Step = { title: string; body: string }
export type Price = { title: string; price: string; body: string }
export type Stat = { value: string; label: string }

export type AvtomatizaciyaCopy = {
  meta: { title: string; description: string }
  nav: { services: string; cases: string; companies: string; pricing: string; faq: string; cta: string }
  hero: {
    eyebrow: string
    title: string
    sub: string
    primaryCta: string
    secondaryCta: string
    note: string
    /** Три цифры из кейсов сайта: выразительный ход первого экрана. */
    stats: readonly [Stat, Stat, Stat]
  }
  services: { eyebrow: string; title: string; items: readonly Service[] }
  /** Тип карусели старых лендингов плюс состав кейсов. */
  cases: LandingCopy['cases'] & { slugs: readonly [CaseSlug, CaseSlug, CaseSlug, ...CaseSlug[]] }
  companies: { eyebrow: string; title: string; lead: string; items: readonly CompanyTile[] }
  how: { eyebrow: string; title: string; steps: readonly Step[]; standardLink: { label: string; href: string } }
  pricing: { eyebrow: string; title: string; note: string; items: readonly Price[] }
  faq: LandingCopy['faq']
  lead: {
    eyebrow: string
    title: string
    sub: string
    /** Подпись и подсказка главного вопроса формы вместо вопроса с главной сайта. */
    answerLabel: string
    answerPlaceholder: string
    fieldsNote: string
    fields: readonly LeadField[]
  }
}
