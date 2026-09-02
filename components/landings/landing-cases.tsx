import { angleForCase, type CaseSlug } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy } from '@/app/data/landings'
import { CaseCard } from '@/components/evolution/case-card'
import { CaseCarousel } from '@/components/evolution/case-carousel'

// Карусель та же, что на главной; состав и порядок задаёт реестр лендинга.
export function LandingCases({ copy, slugs }: { copy: LandingCopy['cases']; slugs: readonly CaseSlug[] }) {
  const labels = evolutionData.ru.labels
  const items = slugs.map((slug) => angleForCase('ru', slug))
  return (
    <section id="cases" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <div className="mt-8">
        <CaseCarousel
          items={items.map((item) => (
            <CaseCard key={item.slug} entry={item} lang="ru" labels={labels} />
          ))}
          labels={{
            aria: `${labels.carouselAria}: ${copy.title}`,
            prev: labels.carouselPrev,
            next: labels.carouselNext,
            counter: labels.carouselCounter,
            goTo: labels.carouselGoTo,
          }}
        />
      </div>
    </section>
  )
}
