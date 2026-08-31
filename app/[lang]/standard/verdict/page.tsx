import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LANGS, isLang } from '@/app/data/evolution'
import { VerdictPage } from '@/components/standard/verdict-page'
import { buildVerdictMetadata } from '@/lib/evolution/metadata'

type Params = { lang: string }

// Квиз вердикта: две локали, статически, как страница стандарта.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return buildVerdictMetadata(lang)
}

export default async function Verdict({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return <VerdictPage lang={lang} />
}
