import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isCaseSlug, type CaseSlug } from '@/app/data/cases'
import { SHOWN_CASE_SLUGS } from '@/app/data/avtomatizaciya'
import { CasePage } from '@/components/cases/case-page'
import { buildCaseMetadata } from '@/lib/evolution/metadata'

type Params = { lang: string; slug: string }

// С 25.10.2026 на сайте только кейсы направлений главной и только по-русски.
// Снятые кейсы и /en перенаправляет next.config.mjs; остальное - 404.
const isShown = (slug: string): slug is CaseSlug => isCaseSlug(slug) && (SHOWN_CASE_SLUGS as readonly string[]).includes(slug)

export const dynamicParams = false

export function generateStaticParams() {
  return SHOWN_CASE_SLUGS.map((slug) => ({ lang: 'ru', slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params
  if (lang !== 'ru' || !isShown(slug)) return {}
  return buildCaseMetadata(lang, slug)
}

export default async function Case({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params
  if (lang !== 'ru' || !isShown(slug)) notFound()
  return <CasePage lang={lang} slug={slug} />
}
