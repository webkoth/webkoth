import { PageBackground } from '@/components/landing/page-background'
import { SectionReveal } from '@/components/landing/section-reveal'
import { Hero } from '@/components/marketplaces/hero'
import { VideoQuestions } from '@/components/marketplaces/video-questions'
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
      </main>
    </>
  )
}
