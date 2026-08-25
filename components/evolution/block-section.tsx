import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { anglesForBlock } from '@/app/data/cases'
import type { EvolutionBlock, EvolutionData, Lang } from '@/app/data/evolution/types'
import { CaseCard } from './case-card'
import { CaseCarousel, type CarouselLabels } from './case-carousel'
import { STEP_ICONS, type StepKey } from './step-icons'
import { StepChip } from './step-chip'

// Ритм блока: eyebrow → слоган → плашка симптома → 2–3 предложения → анимация
// → экспонат (только там, где он говорит сразу о нескольких системах)
// → карусель кейсов этого шага.
export function BlockSection({
  stepKey,
  block,
  labels,
  lang,
  animation,
  exhibit,
}: {
  stepKey: StepKey
  block: EvolutionBlock
  labels: EvolutionData['labels']
  lang: Lang
  animation: ReactNode
  exhibit?: ReactNode
}) {
  const Icon = STEP_ICONS[stepKey]
  const items = anglesForBlock(lang, stepKey)
  const carouselLabels: CarouselLabels = {
    // Каруселей на странице шесть, и подпись у всех одна: читатель,
    // идущий по списку регионов, услышал бы «Кейсы шага» шесть раз подряд
    // и не понял бы, какого шага. Слоган блока - его единственное имя.
    aria: `${labels.carouselAria}: ${block.slogan}`,
    prev: labels.carouselPrev,
    next: labels.carouselNext,
    counter: labels.carouselCounter,
    goTo: labels.carouselGoTo,
  }
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-title`}
      className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            <Icon className="size-4" aria-hidden />
            <span>{labels.step}</span>
            <StepChip>{block.step}</StepChip>
          </p>
          <h2 id={`${block.id}-title`} className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {block.slogan}
          </h2>

          {block.symptom ? (
            <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-destructive">
                <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                <span>{labels.symptom}</span>
              </div>
              <p>{block.symptom}</p>
            </div>
          ) : null}

          <div className="mt-5 space-y-4 text-base text-muted-foreground md:text-lg">
            {block.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-sm md:p-5">{animation}</div>
        </div>
      </div>

      {exhibit ? (
        <div className="mt-10 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:mt-14 md:p-6">{exhibit}</div>
      ) : null}

      <CaseCarousel
        labels={carouselLabels}
        items={items.map((item) => (
          <CaseCard key={item.slug} entry={item} lang={lang} labels={labels} />
        ))}
      />
    </section>
  )
}
