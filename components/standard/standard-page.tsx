import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, FileDown } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { evolutionBlockOrder, evolutionData, homePath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import {
  AIAS_DIAGRAM_PATH,
  AIAS_PDF_PATH,
  AIAS_REPO_URL,
  standardData,
} from '@/app/data/standard'
import { verdictPath, verdictQuizData } from '@/app/data/standard-quiz'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { HtmlLang } from '@/components/evolution/html-lang'
import { CaseSection } from '@/components/cases/case-section'
import { CaseCtaButton } from '@/components/cases/case-cta-button'

// Страница стандарта AIAS: витрина канонического репозитория, не его копия.
// Тексты и ссылки - в app/data/standard.ts; схема и PDF отдаются из public,
// чтобы страница не зависела от доступности GitHub.
export function StandardPage({ lang }: { lang: Lang }) {
  const data = evolutionData[lang]
  const s = standardData[lang]
  const anchorBase = homePath(lang)
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = evolutionBlockOrder.map((key) => ({
    id: data.blocks[key].id,
    label: data.blocks[key].slogan,
  }))
  const externalLink =
    'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-foreground/80 transition hover:text-primary'

  return (
    <>
      <HtmlLang lang={lang} />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang={lang}>
          <main className="relative z-[1] min-h-screen" lang={lang}>
            <HeaderNav
              lang={lang}
              brand={data.brand}
              owner={data.footer.owner}
              nav={data.nav}
              labels={data.labels}
              items={navItems}
              llmMarkdown={llmMarkdown}
              anchorBase={anchorBase}
            />

            <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
              <nav aria-label={data.brand}>
                <Link
                  href={anchorBase}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  {data.brand}
                </Link>
              </nav>

              <header className="mt-8 max-w-3xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {s.eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{s.title}</h1>
                <p className="mt-5 text-base text-muted-foreground md:text-lg">{s.lead}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.badges.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-l-2 border-border pl-4 text-sm text-muted-foreground">
                  {s.aiNote}
                </p>
                {s.langNote ? (
                  <p className="mt-3 text-sm text-muted-foreground">{s.langNote}</p>
                ) : null}
              </header>

              <CaseSection title={s.contents.title}>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {s.contents.cards.map((card) => (
                    <article
                      key={card.title}
                      className="flex flex-col rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm"
                    >
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {card.text}
                      </p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 ${externalLink}`}
                      >
                        {card.linkLabel}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    </article>
                  ))}
                </div>
              </CaseSection>

              <CaseSection title={s.diagram.title}>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {s.diagram.note}
                </p>
                <Link href={verdictPath(lang)} className={`mt-3 ${externalLink}`}>
                  {verdictQuizData[lang].pageLinkLabel}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm">
                  <iframe
                    src={AIAS_DIAGRAM_PATH}
                    title={s.diagram.iframeTitle}
                    loading="lazy"
                    className="h-[560px] w-full bg-white md:h-[680px]"
                  />
                </div>
              </CaseSection>

              <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="min-w-0 lg:col-span-8">
                  <CaseSection title={s.start.title} className="mt-0">
                    <ol className="mt-4 space-y-3">
                      {s.start.steps.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed">
                          <span className="font-mono text-xs text-muted-foreground">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CaseSection>
                </div>
                <div className="min-w-0 lg:col-span-4">
                  <aside className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.guide.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.guide.text}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={`${AIAS_REPO_URL}/blob/main/guide/gid-vladelca-v1.2.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={externalLink}
                      >
                        {s.guide.readLabel}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                      <a href={AIAS_PDF_PATH} className={externalLink} download>
                        {s.guide.pdfLabel}
                        <FileDown className="size-3.5" aria-hidden />
                      </a>
                    </div>
                    <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                      {s.start.offer}
                    </p>
                    <CaseCtaButton label={data.nav.cta} />
                  </aside>
                </div>
              </div>
            </div>

            <Footer data={data} />
            <StickyCta label={data.nav.cta} mobileOnly />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
