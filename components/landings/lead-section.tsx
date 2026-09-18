'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy, LandingSlug } from '@/app/data/landings'
import { LeadForm } from '@/components/evolution/lead-form'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'

// Форма внизу страницы, как в финале главной, но с источником лендинга.
// startedAt считается от монтирования: антибот-таймер роута отсчитывает от него.
// Telegram рядом с формой, как в финале и в модалке: часть людей пишет, а не заполняет.
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
          <TelegramLink
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-muted md:text-sm"
          >
            <Send className="size-3.5 text-primary" aria-hidden />
            <span>{form.telegramCta}</span>
          </TelegramLink>
        </div>
        {/* id="form": по нему липкая кнопка прячется, когда форма на экране (sticky-cta.tsx). */}
        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <LeadForm
            copy={form}
            lang="ru"
            startedAt={startedAt}
            source={{ landing: slug }}
            fields={copy.fields}
            fieldsNote={copy.fieldsNote}
          />
        </div>
      </div>
    </section>
  )
}
