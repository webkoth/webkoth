import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { evolutionBlockOrder, evolutionData, homePath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, anglesForBlock, getCase, type CaseSlug } from '@/app/data/cases'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { BeforeAfterExhibit } from '@/components/evolution/exhibits'
import { HtmlLang } from '@/components/evolution/html-lang'
import { CaseDiagram } from './case-diagram'
import { CaseEffects } from './case-effects'
import { CaseFacts } from './case-facts'
import { CasePainOutcome } from './case-pain-outcome'
import { CaseScreenshots } from './case-screenshots'
import { CaseSection } from './case-section'
import { CaseSiblings } from './case-siblings'
import { CaseValue } from './case-value'
import { JsonLdCase } from './json-ld-case'

// Страница системы: слева история, справа липкий паспорт. Порядок разделов -
// от «зачем» к «как»: болело/стало → эффект по шагам → польза бизнесу → схема →
// было/стало → интерфейс → устройство → кто ведёт → соседние кейсы шага.
// Заголовок вынесен над сеткой: на мобильном сетка схлопывается в колонку, и
// паспорт встаёт сразу под ним, а не в самом низу за всеми разделами.
export function CasePage({ lang, slug }: { lang: Lang; slug: CaseSlug }) {
  const data = evolutionData[lang]
  const { meta, copy } = getCase(lang, slug)
  // Якоря шагов и хлебная крошка ведут на главную своей локали: '/' для RU, '/en' для EN.
  const anchorBase = homePath(lang)
  const primaryBlock = meta.blocks[0]
  const backBlock = data.blocks[primaryBlock]
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = evolutionBlockOrder.map((key) => ({
    id: data.blocks[key].id,
    label: data.blocks[key].slogan,
  }))
  const siblings = anglesForBlock(lang, primaryBlock).filter((a) => a.slug !== slug)

  return (
    <>
      <HtmlLang lang={lang} />
      <JsonLdCase lang={lang} slug={slug} meta={meta} copy={copy} owner={data.footer.owner} />
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
              {/* Ссылка названа слоганом шага, и на слух это просто ещё одна
                  ссылка: направление задаёт подпись ориентира, стрелка рядом
                  декоративная. */}
              <nav aria-label={data.labels.caseBackAria}>
                <Link
                  href={`${anchorBase}#${backBlock.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  {backBlock.slogan}
                </Link>
              </nav>

              {/* max-w-3xl - ширина строки заголовка и лида: во всю сетку в 72 rem
                  они читались бы полотном. */}
              <header className="mt-8 max-w-3xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {CASE_KIND_LABELS[lang][meta.kind]} · {CASE_STATUS_LABELS[lang][meta.status]}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h1>
                <p className="mt-5 text-base text-muted-foreground md:text-lg">{copy.detail.lead}</p>
              </header>

              <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="min-w-0 lg:col-span-8">
                  <CasePainOutcome
                    pain={copy.angles[primaryBlock]!.pain}
                    outcome={copy.angles[primaryBlock]!.outcome}
                    painLabel={data.labels.casePain}
                    outcomeLabel={data.labels.caseOutcome}
                  />

                  <CaseEffects
                    effects={copy.detail.effects}
                    blocks={data.blocks}
                    title={data.labels.caseEffectsTitle}
                  />

                  <CaseValue items={copy.detail.value} title={data.labels.caseValueTitle} />

                  {/* Схема и вкладки идут через CaseSection, как остальные шесть
                      разделов: без заголовка обе рамки читались бы как безымянные
                      врезки между «что это даёт бизнесу» и «как устроено». */}
                  <CaseSection title={data.labels.caseDiagramTitle}>
                    <div className="mt-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
                      <CaseDiagram nodes={copy.detail.diagramNodes} note={copy.detail.diagramNote} />
                    </div>
                  </CaseSection>

                  {copy.detail.beforeAfter ? (
                    <CaseSection title={data.labels.caseBeforeAfterTitle}>
                      <div className="mt-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
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
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {copy.detail.how.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </CaseSection>

                  <CaseSection title={data.labels.caseOwnerTitle}>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.detail.owner}</p>
                  </CaseSection>

                  <CaseSiblings
                    items={siblings}
                    lang={lang}
                    labels={data.labels}
                    title={data.labels.caseSiblingsTitle}
                  />
                </div>

                {/* order-first - только до lg: в одну колонку паспорт идёт сразу за
                    заголовком. На широком экране порядок обычный: он справа. */}
                <div className="order-first min-w-0 lg:order-none lg:col-span-4">
                  <CaseFacts meta={meta} copy={copy} lang={lang} labels={data.labels} cta={data.nav.cta} />
                </div>
              </div>
            </div>

            <Footer data={data} />

            {/* Панель фактов - единственная CTA на первом экране, а до футера
                на 390 px остаётся около 4700 px без единой кнопки. Плавающая
                кнопка здесь видна сразу: прятаться ей не за что, hero и
                inline-формы на странице кейса нет. От lg она не нужна - там
                панель липкая, и её кнопка и так всё время на экране. */}
            <StickyCta label={data.nav.cta} mobileOnly />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
