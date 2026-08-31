import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LANGS, isLang } from '@/app/data/evolution'
import { StandardPage } from '@/components/standard/standard-page'
import { buildStandardMetadata } from '@/lib/evolution/metadata'

type Params = { lang: string }

// Страница стандарта: две локали, статически. Адрес без локали (/standard)
// редиректится на русскую версию в next.config.mjs, как CV и кейсы.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return buildStandardMetadata(lang)
}

export default async function Standard({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return <StandardPage lang={lang} />
}
