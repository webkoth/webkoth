'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { presetsForLanding, resolvePresetParam, type LandingCopy, type LandingSlug } from '@/app/data/landings'
import { VerdictQuiz } from '@/components/standard/verdict-quiz'

// `?p=` читается на клиенте, чтобы страница осталась статической. Suspense
// обязателен вокруг useSearchParams при статической сборке.
function QuizWithParams({ slug, title, copy }: { slug: LandingSlug; title: string; copy: LandingCopy['quiz'] }) {
  const params = useSearchParams()
  const initialPresetId = resolvePresetParam(slug, params.get('p'))
  return (
    <VerdictQuiz
      lang="ru"
      ctaLabel={copy.cta}
      landing={{ slug, title, copy, presets: presetsForLanding(slug), initialPresetId }}
    />
  )
}

export function LandingQuiz({ slug, title, copy }: { slug: LandingSlug; title: string; copy: LandingCopy['quiz'] }) {
  return (
    <section id="quiz" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
        <p className="mt-4 text-base text-muted-foreground">{copy.lead}</p>
        <p className="mt-2 text-xs text-muted-foreground">{copy.disclaimer}</p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <QuizWithParams slug={slug} title={title} copy={copy} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
