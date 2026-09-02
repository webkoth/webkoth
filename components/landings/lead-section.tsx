'use client'

import { useState } from 'react'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy, LandingSlug } from '@/app/data/landings'
import { LeadForm } from '@/components/evolution/lead-form'

// Форма внизу страницы, как в финале главной, но с источником лендинга.
// startedAt считается от монтирования: антибот-таймер роута отсчитывает от него.
export function LeadSection({ copy, slug }: { copy: LandingCopy['lead']; slug: LandingSlug }) {
  const [startedAt] = useState(() => Date.now())
  const form = evolutionData.ru.finale.form
  return (
    <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-base text-muted-foreground">{copy.sub}</p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm copy={form} lang="ru" startedAt={startedAt} source={{ landing: slug }} />
        </div>
      </div>
    </section>
  )
}
