import { evolutionData } from '@/app/data/evolution'
import { landingCopy, landingMeta, landingPath, type LandingSlug } from '@/app/data/landings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LandingHero } from './landing-hero'
import { Symptoms } from './symptoms'
import { HeroCase } from './hero-case'
import { LandingQuiz } from './landing-quiz'
import { HowItWorks } from './how-it-works'
import { LandingCases } from './landing-cases'
import { PricingSteps } from './pricing-steps'
import { Faq } from './faq'
import { LeadSection } from './lead-section'

// Один скелет, два порядка (спека, секция 6). Порядок задаёт landingMeta.skeleton:
// symptoms-first: hero → симптомы → квиз → как работает → кейсы → цены → вопросы → заявка;
// case-first:     hero → главный кейс → как работает → квиз → кейсы → цены → вопросы → заявка.
export function LandingPage({ slug }: { slug: LandingSlug }) {
  const meta = landingMeta[slug]
  const copy = landingCopy[slug]
  const data = evolutionData.ru
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = [
    { id: 'quiz', label: copy.nav.quiz },
    { id: 'how', label: copy.nav.how },
    { id: 'cases', label: copy.nav.cases },
    { id: 'pricing', label: copy.nav.pricing },
    { id: 'faq', label: copy.nav.faq },
  ]

  const quiz = <LandingQuiz slug={slug} title={copy.hero.title} copy={copy.quiz} />
  const how = <HowItWorks copy={copy.how} note={copy.standardNote} />

  return (
    <>
      <HtmlLang lang="ru" />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang="ru">
          <main className="relative z-[1] min-h-screen" lang="ru">
            <HeaderNav
              lang="ru"
              brand={data.brand}
              owner={data.footer.owner}
              nav={{ ...data.nav, cta: copy.nav.cta }}
              labels={data.labels}
              items={navItems}
              llmMarkdown={llmMarkdown}
              anchorBase={landingPath(slug)}
            />

            <LandingHero copy={copy.hero} skeleton={meta.skeleton} />

            {meta.skeleton === 'symptoms-first' ? (
              <>
                {copy.symptoms ? <Symptoms copy={copy.symptoms} /> : null}
                {quiz}
                {how}
              </>
            ) : (
              <>
                {copy.heroCase && meta.heroCase ? <HeroCase copy={copy.heroCase} slug={meta.heroCase} /> : null}
                {how}
                {quiz}
              </>
            )}

            {/* Главный кейс уже показан выше, в карусели его не повторяем. */}
            <LandingCases copy={copy.cases} slugs={meta.cases.filter((c) => c !== meta.heroCase)} />
            <PricingSteps copy={copy.pricing} />
            <Faq copy={copy.faq} />
            <LeadSection copy={copy.lead} slug={slug} />

            <Footer data={data} />
            <StickyCta label={copy.nav.cta} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
