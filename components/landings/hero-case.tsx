import { angleForCase, type BlockKey, type CaseSlug } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy } from '@/app/data/landings'
import { CaseCard } from '@/components/evolution/case-card'

// Скелет C: главный кейс сразу после первого экрана (у quiz-first после квиза). Карточка
// та же, что в каруселях, чтобы «болело → стало» и характеристики читались одинаково везде.
// `block` выбирает угол системы под заголовок страницы; без него первый блок, как в карусели.
export function HeroCase({
  copy,
  slug,
  block,
}: {
  copy: NonNullable<LandingCopy['heroCase']>
  slug: CaseSlug
  block?: BlockKey
}) {
  const entry = angleForCase('ru', slug, block)
  const labels = evolutionData.ru.labels
  return (
    <section id="hero-case" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <div className="mt-8 max-w-3xl">
        <CaseCard entry={entry} lang="ru" labels={labels} />
      </div>
    </section>
  )
}
