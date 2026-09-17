import type { Metadata } from 'next'
import Link from 'next/link'
import { briefCopy } from '@/app/data/brief/copy'
import { CASE_SLUGS, casePath, casesCopy } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import { BriefPageClient } from '@/components/brief/brief-page-client'
import type { CaseLinks } from '@/components/brief/map-item'
import { Footer } from '@/components/evolution/footer'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LABEL_RE } from '@/lib/brief/ids'

// Бриф селлера: /brief?k=<метка>. Закрыт от поисковиков, ссылок с сайта нет:
// открываем после двух-трёх заполненных брифов (спека, раздел 4).

export const metadata: Metadata = {
  title: briefCopy.meta.title,
  description: briefCopy.meta.description,
  robots: { index: false, follow: false },
}

// Названия и адреса кейсов считаются на сервере: реестр кейсов большой, в клиент он не нужен.
const caseLinks: CaseLinks = Object.fromEntries(
  CASE_SLUGS.map((slug) => [slug, { title: casesCopy.ru[slug].title, href: casePath('ru', slug) }]),
)

export default async function BriefRoute({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k } = await searchParams
  const data = evolutionData.ru

  return (
    <>
      <HtmlLang lang="ru" />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8 print:hidden">
          <Link href="/" className="font-mono text-sm font-semibold transition hover:text-primary">
            {data.brand}
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {briefCopy.meta.headerLabel}
          </span>
        </header>
        <BriefPageClient k={typeof k === 'string' && LABEL_RE.test(k) ? k : undefined} caseLinks={caseLinks} />
        <div className="print:hidden">
          <Footer data={data} />
        </div>
      </main>
    </>
  )
}
