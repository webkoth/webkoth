import { PageBackground } from '@/components/landing/page-background'
import { SectionReveal } from '@/components/landing/section-reveal'
import { Hero } from '@/components/marketplaces/hero'
import { VideoQuestions } from '@/components/marketplaces/video-questions'
import { DailyProcesses } from '@/components/marketplaces/daily-processes'
import { ToolsByMarketplace } from '@/components/marketplaces/tools-by-marketplace'
import { Packages } from '@/components/marketplaces/packages'
import { Cases } from '@/components/marketplaces/cases'
import { Security } from '@/components/marketplaces/security'
import { HowReviewWorks } from '@/components/marketplaces/how-review-works'
import { Faq } from '@/components/marketplaces/faq'
import { marketplacesData as data } from '@/app/data/marketplaces'

export default function MarketplacesPage() {
  return (
    <>
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <Hero data={data.hero} />
        <SectionReveal>
          <VideoQuestions data={data.video} />
        </SectionReveal>
        <SectionReveal>
          <DailyProcesses data={data.processes} />
        </SectionReveal>
        <SectionReveal>
          <ToolsByMarketplace data={data.tools} />
        </SectionReveal>
        <SectionReveal>
          <Packages data={data.packages} />
        </SectionReveal>
        <SectionReveal>
          <Cases data={data.cases} />
        </SectionReveal>
        <SectionReveal>
          <Security data={data.security} />
        </SectionReveal>
        <SectionReveal>
          <HowReviewWorks data={data.review} />
        </SectionReveal>
        <SectionReveal>
          <Faq data={data.faq} />
        </SectionReveal>
      </main>
    </>
  )
}
