import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { evolutionData } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, getCase, type CaseSlug } from '@/app/data/cases'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya, buildAvtomatizaciyaMarkdown } from '@/app/data/avtomatizaciya'
import { leadFormCopy } from '@/app/data/avtomatizaciya/lead-form-copy'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { BeforeAfterExhibit } from '@/components/evolution/exhibits'
import { HtmlLang } from '@/components/evolution/html-lang'
import { DirectionCaseCard } from '@/components/avtomatizaciya/directions'
import { CaseDiagram } from './case-diagram'
import { CaseFacts } from './case-facts'
import { CasePainOutcome } from './case-pain-outcome'
import { CaseScreenshots } from './case-screenshots'
import { CaseSection } from './case-section'
import { CaseValue } from './case-value'
import { JsonLdCase } from './json-ld-case'

// Страница кейса. С 25.10.2026 кейсы живут внутри направлений главной: хлебная крошка ведёт
// к своему направлению, соседи — другие кейсы того же направления, меню — разделы главной.
// Порядок разделов: болело/стало → польза → схема → было/стало → интерфейс → устройство →
// кто ведёт → соседние кейсы. Заголовок над сеткой: на мобильном паспорт встаёт сразу под ним.
export function CasePage({ lang, slug }: { lang: Lang; slug: CaseSlug }) {
  const data = evolutionData[lang]
  const c = avtomatizaciya
  const { meta, copy } = getCase(lang, slug)
  const primaryBlock = meta.blocks[0]
  const direction = c.directions.items.find((d) => d.cases.some((k) => k.slug === slug))
  const siblings = direction ? direction.cases.filter((k) => k.slug !== slug) : []
  const navItems = [
    { id: 'services', label: c.nav.services },
    { id: 'how', label: c.nav.how },
    { id: 'pricing', label: c.nav.pricing },
    { id: 'faq', label: c.nav.faq },
  ]

  return (
    <>
      <HtmlLang lang={lang} />
      <JsonLdCase lang={lang} slug={slug} meta={meta} copy={copy} owner={data.footer.owner} />
      <TooltipProvider delay={200}>
        <LeadDialogProvider
          copy={leadFormCopy(c.lead)}
          lang="ru"
          defaultSource={{ landing: AVTOMATIZACIYA_SLUG }}
          fields={c.lead.fields}
          fieldsNote={c.lead.fieldsNote}
        >
          <main className="relative z-[1] min-h-screen" lang={lang}>
            <HeaderNav
              lang={lang}
              brand={data.brand}
              owner={data.footer.owner}
              nav={{ ...data.nav, cta: c.nav.cta }}
              labels={data.labels}
              items={navItems}
              llmMarkdown={buildAvtomatizaciyaMarkdown()}
              anchorBase="/"
              minimal
            />

            <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
              <nav aria-label={data.labels.caseBackAria}>
                <Link
                  href={direction ? `/#${direction.id}` : '/#services'}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  {direction ? direction.label : c.nav.services}
                </Link>
              </nav>

              <header className="mt-8 max-w-3xl">
                <p className="micro text-muted-foreground">
                  {CASE_KIND_LABELS[lang][meta.kind]} · {CASE_STATUS_LABELS[lang][meta.status]}
                </p>
                <h1 className="mt-4 text-4xl leading-[1.06] font-semibold tracking-[-0.04em] text-balance md:text-[3.4rem]">{copy.title}</h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{copy.detail.lead}</p>
              </header>

              <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="min-w-0 lg:col-span-8">
                  <CasePainOutcome
                    pain={copy.angles[primaryBlock]!.pain}
                    outcome={copy.angles[primaryBlock]!.outcome}
                    painLabel={data.labels.casePain}
                    outcomeLabel={data.labels.caseOutcome}
                  />

                  <CaseValue items={copy.detail.value} title={data.labels.caseValueTitle} />

                  <CaseSection title={data.labels.caseDiagramTitle}>
                    <div className="glass mt-4 rounded-[28px] p-5">
                      <CaseDiagram nodes={copy.detail.diagramNodes} note={copy.detail.diagramNote} />
                    </div>
                  </CaseSection>

                  {copy.detail.beforeAfter ? (
                    <CaseSection title={data.labels.caseBeforeAfterTitle}>
                      <div className="glass mt-4 rounded-[28px] p-5">
                        <BeforeAfterExhibit
                          data={{
                            beforeTitle: data.labels.caseBeforeTitle,
                            before: copy.detail.beforeAfter.before,
                            afterTitle: data.labels.caseAfterTitle,
                            after: copy.detail.beforeAfter.after,
                          }}
                        />
                      </div>
                    </CaseSection>
                  ) : null}

                  <CaseScreenshots
                    shots={meta.screenshots}
                    captions={copy.detail.screenshots}
                    title={data.labels.caseScreensTitle}
                  />

                  <CaseSection title={data.labels.caseHowTitle}>
                    <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
                      {copy.detail.how.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </CaseSection>

                  <CaseSection title={data.labels.caseOwnerTitle}>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{copy.detail.owner}</p>
                  </CaseSection>

                  {siblings.length > 0 && direction ? (
                    <CaseSection title={c.directions.labels.siblings} className="mt-14">
                      <ul className="mt-4 grid gap-4 md:grid-cols-2">
                        {siblings.map((k, i) => (
                          <DirectionCaseCard key={k.slug} k={k} copy={c.directions} delay={0.08 * i} />
                        ))}
                      </ul>
                    </CaseSection>
                  ) : null}
                </div>

                <div className="order-first min-w-0 lg:order-none lg:col-span-4">
                  <CaseFacts meta={meta} copy={copy} lang={lang} labels={data.labels} cta={c.nav.cta} />
                </div>
              </div>
            </div>

            <Footer data={data} />
            <StickyCta label={c.nav.cta} mobileOnly />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
