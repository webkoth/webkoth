'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Send } from 'lucide-react'
import { AVTOMATIZACIYA_SLUG, type AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { leadFormCopy } from '@/app/data/avtomatizaciya/lead-form-copy'
import { LeadForm } from '@/components/evolution/lead-form'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'
import { GlassPanel, Reveal } from './motion'

// startedAt от монтирования: антибот-таймер роута отсчитывает от него (как в lead-section.tsx).
export function Lead({ copy }: { copy: AvtomatizaciyaCopy['lead'] }) {
  const [startedAt] = useState(() => Date.now())
  const form = leadFormCopy(copy)
  return (
    <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="text-sm font-medium text-primary">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{copy.sub}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TelegramLink
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium transition hover:bg-foreground/10"
            >
              <Send className="size-3.5 text-primary" aria-hidden />
              <span>{form.telegramCta}</span>
            </TelegramLink>
          </div>
          <Link
            href={copy.brief.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2.5"
          >
            {copy.brief.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <GlassPanel className="p-5 md:p-8" delay={0.1}>
            <LeadForm
              copy={form}
              lang="ru"
              startedAt={startedAt}
              source={{ landing: AVTOMATIZACIYA_SLUG }}
              fields={copy.fields}
              fieldsNote={copy.fieldsNote}
            />
          </GlassPanel>
        </div>
      </div>
    </section>
  )
}
