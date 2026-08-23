import { evolutionBlockOrder, evolutionData } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParticleField } from './particle-field'
import { HeaderNav } from './header-nav'
import { Hero } from './hero'
import { BlockSection } from './block-section'
import { HubmarketCase } from './hubmarket-case'
import { Roadmap } from './roadmap'
import { Finale } from './finale'
import { Footer } from './footer'
import { StickyCta } from './sticky-cta'
import { JsonLdEvolution } from './json-ld'
import { HtmlLang } from './html-lang'
import { LeadDialogProvider } from './lead-dialog'
import { BeforeAfterExhibit, DataFlowExhibit, LaunchTableExhibit, SharesExhibit } from './exhibits'
import { FragmentsToStructure } from './animations/fragments-to-structure'
import { FogToDashboard } from './animations/fog-to-dashboard'
import { NoiseToSignal } from './animations/noise-to-signal'
import { Conveyor } from './animations/conveyor'
import { TimelineCompress } from './animations/timeline-compress'
import { CellsGrid } from './animations/cells-grid'

// Главная страница в обеих локалях: RU — `/`, EN — `/en`. Порядок: hero →
// шесть шагов → именованный кейс → «От идеи до прода» → финал с формой.
// LeadDialogProvider держит одну модалку с формой для всех CTA страницы.
export function EvolutionPage({ lang }: { lang: Lang }) {
  const data = evolutionData[lang]
  const a = data.animations
  const navItems = evolutionBlockOrder.map((key) => ({
    id: data.blocks[key].id,
    label: data.blocks[key].slogan,
  }))

  return (
    <>
      <HtmlLang lang={lang} />
      <JsonLdEvolution data={data} />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang={lang}>
          <main className="relative z-[1] min-h-screen" lang={lang}>
            <HeaderNav lang={lang} brand={data.brand} nav={data.nav} labels={data.labels} items={navItems} />

            <Hero data={data.hero} />

            <BlockSection
              stepKey="system"
              block={data.blocks.system}
              labels={data.labels}
              animation={<FragmentsToStructure copy={a.fragments} />}
            />
            <BlockSection
              stepKey="money"
              block={data.blocks.money}
              labels={data.labels}
              animation={<FogToDashboard copy={a.fog} />}
            />
            <BlockSection
              stepKey="decisions"
              block={data.blocks.decisions}
              labels={data.labels}
              animation={<NoiseToSignal copy={a.noise} />}
              exhibit={<DataFlowExhibit data={data.exhibits.dataFlow} />}
            />
            <BlockSection
              stepKey="automation"
              block={data.blocks.automation}
              labels={data.labels}
              animation={<Conveyor copy={a.conveyor} />}
              exhibit={<BeforeAfterExhibit data={data.exhibits.beforeAfter} />}
            />
            <BlockSection
              stepKey="speed"
              block={data.blocks.speed}
              labels={data.labels}
              animation={<TimelineCompress copy={a.timeline} />}
              exhibit={<LaunchTableExhibit data={data.exhibits.launchTable} labels={data.labels} />}
            />
            <BlockSection
              stepKey="resources"
              block={data.blocks.resources}
              labels={data.labels}
              animation={<CellsGrid copy={a.cells} />}
              exhibit={<SharesExhibit data={data.exhibits.shares} />}
            />

            <HubmarketCase data={data.hubmarket} />
            <Roadmap data={data.roadmap} />

            <Finale data={data.finale} labels={data.labels} animation={a.sprouts} lang={lang} />

            <Footer data={data} />

            <StickyCta label={data.nav.cta} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
