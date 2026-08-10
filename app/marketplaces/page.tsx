import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { PageBackground } from '@/components/landing/page-background'
import { SectionReveal } from '@/components/landing/section-reveal'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { ModeToggle } from '@/components/mode-toggle'
import { PaletteToggle } from '@/components/palette-toggle'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/marketplaces/hero'
import { VideoQuestions } from '@/components/marketplaces/video-questions'
import { DailyProcesses } from '@/components/marketplaces/daily-processes'
import { ToolsByMarketplace } from '@/components/marketplaces/tools-by-marketplace'
import { Packages } from '@/components/marketplaces/packages'
import { Cases } from '@/components/marketplaces/cases'
import { Security } from '@/components/marketplaces/security'
import { HowReviewWorks } from '@/components/marketplaces/how-review-works'
import { Faq } from '@/components/marketplaces/faq'
import { LeadForm } from '@/components/marketplaces/lead-form'
import { StickyCta } from '@/components/marketplaces/sticky-cta'
import { JsonLdService } from '@/components/marketplaces/json-ld-service'
import { contacts } from '@/lib/landing/contacts'
import { marketplacesData as data } from '@/app/data/marketplaces'

export default function MarketplacesPage() {
  return (
    <>
      <JsonLdService />
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              webkoth.com
            </Link>
            <div className="flex items-center gap-1">
              <PaletteToggle />
              <ModeToggle />
              {/* На 375px кнопка вместе с тогглами не влезает и даёт 17px
                  горизонтального скролла. На мобильном её работу делает StickyCta. */}
              <Button
                size="sm"
                className="ml-2 hidden sm:inline-flex"
                nativeButton={false}
                render={<a href="#form" />}
              >
                Разбор бесплатно
              </Button>
            </div>
          </div>
        </header>

        <Hero data={data.hero} />
        <SectionReveal><VideoQuestions data={data.video} /></SectionReveal>
        <SectionReveal><DailyProcesses data={data.processes} /></SectionReveal>
        <SectionReveal><ToolsByMarketplace data={data.tools} /></SectionReveal>
        <SectionReveal><Packages data={data.packages} /></SectionReveal>
        <SectionReveal><Cases data={data.cases} /></SectionReveal>
        <SectionReveal><Security data={data.security} /></SectionReveal>
        <SectionReveal><HowReviewWorks data={data.review} /></SectionReveal>
        <SectionReveal><Faq data={data.faq} /></SectionReveal>

        <section
          id="form"
          className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
        >
          <SectionLabel icon={MessageSquare}>09 · Заявка</SectionLabel>
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.form.title}</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {data.form.sub}{' '}
            <a href={contacts.telegram} className="text-primary hover:underline">
              {data.form.altChannel}
            </a>
            .
          </p>
          <div className="max-w-3xl">
            <LeadForm />
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Минас Саркисян
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="text-foreground/80 transition hover:text-primary">
                webkoth.com
              </Link>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition hover:text-primary"
              >
                Telegram
              </a>
            </div>
          </div>
        </footer>

        <StickyCta label="Разбор бесплатно" />
      </main>
    </>
  )
}
