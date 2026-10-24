'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'

// Первый экран: заголовок для продавца, две кнопки и полоса из трёх цифр кейсов.
// Цифры и есть выразительный ход экрана: крупно, акцентным цветом, без иллюстраций.
export function Hero({ copy }: { copy: AvtomatizaciyaCopy['hero'] }) {
  const { open } = useLeadDialog()
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:px-8 md:pt-28 md:pb-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-3xl text-base text-muted-foreground md:text-xl">{copy.sub}</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => open()}>
          {copy.primaryCta}
        </Button>
        <TelegramLink
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:border-primary/50 hover:bg-muted"
        >
          <Send className="size-4 text-primary" aria-hidden />
          {copy.secondaryCta}
        </TelegramLink>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{copy.note}</p>
      <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {copy.stats.map((s) => (
          <div key={s.value} className="bg-background/80 p-6 backdrop-blur md:p-8">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-4xl font-bold tracking-tight text-primary md:text-5xl">{s.value}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
