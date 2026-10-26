'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Send } from 'lucide-react'
import { AVTOMATIZACIYA_SLUG, type AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { leadFormCopy } from '@/app/data/avtomatizaciya/lead-form-copy'
import { LeadForm } from '@/components/evolution/lead-form'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'
import { GlassPanel } from './motion'

// Заявка: текст прямо на небе, форма — стеклянной плашкой (без общего контейнера, 26.10).
// startedAt от монтирования: антибот-таймер роута отсчитывает от него (как в lead-section.tsx).
export function Lead({ copy }: { copy: AvtomatizaciyaCopy['lead'] }) {
  const [startedAt] = useState(() => Date.now())
  const form = leadFormCopy(copy)
  return (
    <section id="lead" className="mx-auto max-w-7xl scroll-mt-28 px-3 py-16 md:px-8 md:py-24">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col px-1 md:px-2 lg:col-span-5">
          <p className="micro text-muted-foreground">{copy.eyebrow}</p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-medium tracking-[-0.03em] md:text-[2.6rem]">{copy.title}</h2>
          <div className="my-6 h-px bg-foreground/15" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-[17px]">{copy.sub}</p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <TelegramLink
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition hover:opacity-85"
            >
              <Send className="size-4" aria-hidden />
              <span>{form.telegramCta}</span>
            </TelegramLink>
            <Link href={copy.brief.href} className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:gap-2.5">
              {copy.brief.label}
              <ArrowUpRight className="size-4 text-[#00b8db]" aria-hidden />
            </Link>
          </div>
        </div>
        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <GlassPanel className="rounded-[28px] p-5 md:p-8" delay={0.1}>
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
