import { evolutionData } from '@/app/data/evolution'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya, avtomatizaciyaPath, buildAvtomatizaciyaMarkdown } from '@/app/data/avtomatizaciya'
import { leadFormCopy } from '@/app/data/avtomatizaciya/lead-form-copy'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LandingCases } from '@/components/landings/landing-cases'
import { Faq } from '@/components/landings/faq'
import { Hero } from './hero'
import { Services } from './services'
import { Companies } from './companies'
import { How } from './how'
import { Pricing } from './pricing'
import { Lead } from './lead'

// Одна лента: первый экран → услуги → кейсы → компании → как работаем → цены → вопросы → заявка.
// Обёртка с классом dark держит страницу тёмной при любой теме сайта (спека, «Внешний вид»).
export function AvtomatizaciyaPage() {
  const c = avtomatizaciya
  const data = evolutionData.ru
  const navItems = [
    { id: 'services', label: c.nav.services },
    { id: 'cases', label: c.nav.cases },
    { id: 'companies', label: c.nav.companies },
    { id: 'pricing', label: c.nav.pricing },
    { id: 'faq', label: c.nav.faq },
  ]
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <HtmlLang lang="ru" />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider
          copy={leadFormCopy(c.lead)}
          lang="ru"
          defaultSource={{ landing: AVTOMATIZACIYA_SLUG }}
          fields={c.lead.fields}
          fieldsNote={c.lead.fieldsNote}
        >
          <main className="relative z-[1] min-h-screen" lang="ru">
            <HeaderNav
              lang="ru"
              brand={data.brand}
              owner={data.footer.owner}
              nav={{ ...data.nav, cta: c.nav.cta }}
              labels={data.labels}
              items={navItems}
              llmMarkdown={buildAvtomatizaciyaMarkdown()}
              anchorBase={avtomatizaciyaPath}
              minimal
            />
            <Hero copy={c.hero} />
            <Services copy={c.services} />
            <LandingCases copy={c.cases} slugs={c.cases.slugs} />
            <Companies copy={c.companies} />
            <How copy={c.how} />
            <Pricing copy={c.pricing} />
            <Faq copy={c.faq} />
            <Lead copy={c.lead} />
            <Footer data={data} />
            <StickyCta label={c.nav.cta} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </div>
  )
}
