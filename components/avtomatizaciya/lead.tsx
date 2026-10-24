'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { AVTOMATIZACIYA_SLUG, type AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { leadFormCopy } from '@/app/data/avtomatizaciya/lead-form-copy'
import { LeadForm } from '@/components/evolution/lead-form'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'

// startedAt от монтирования: антибот-таймер роута отсчитывает от него (как в lead-section.tsx).
export function Lead({ copy }: { copy: AvtomatizaciyaCopy['lead'] }) {
  const [startedAt] = useState(() => Date.now())
  const form = leadFormCopy(copy)
  return (
    <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{copy.sub}</p>
          <TelegramLink
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition hover:border-primary/50 hover:bg-muted"
          >
            <Send className="size-3.5 text-primary" aria-hidden />
            <span>{form.telegramCta}</span>
          </TelegramLink>
        </div>
        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <LeadForm
            copy={form}
            lang="ru"
            startedAt={startedAt}
            source={{ landing: AVTOMATIZACIYA_SLUG }}
            fields={copy.fields}
            fieldsNote={copy.fieldsNote}
          />
        </div>
      </div>
    </section>
  )
}
