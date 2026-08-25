import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CASE_SLUGS, isCaseSlug } from '@/app/data/cases'
import { LANGS, isLang } from '@/app/data/evolution'
import { CasePage } from '@/components/cases/case-page'
import { buildCaseMetadata } from '@/lib/evolution/metadata'

type Params = { lang: string; slug: string }

// 13 систем x 2 локали = 26 статических страниц. Чужой язык или чужой слаг
// сюда попадают только запросом руками - на них 404, а не пустая страница.
export function generateStaticParams() {
  return LANGS.flatMap((lang) => CASE_SLUGS.map((slug) => ({ lang, slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang) || !isCaseSlug(slug)) return {}
  return buildCaseMetadata(lang, slug)
}

export default async function Case({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params
  if (!isLang(lang) || !isCaseSlug(slug)) notFound()
  return <CasePage lang={lang} slug={slug} />
}
