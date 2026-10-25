'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'
import { GlassPanel, Reveal } from './motion'

// Первый экран как первый блок hubmarket.ru и заставка роликов: спокойный фон, одна циановая
// строка заголовка, одна циановая кнопка. Три цифры — в стеклянной полосе под кнопками.
export function Hero({ copy }: { copy: AvtomatizaciyaCopy['hero'] }) {
  const { open } = useLeadDialog()
  const at = copy.title.indexOf(copy.titleAccent)
  const head = at >= 0 ? copy.title.slice(0, at).trim() : copy.title
  const accent = at >= 0 ? copy.titleAccent : ''
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-8 md:pt-24 md:pb-20">
      <Reveal>
        <p className="inline-flex rounded-full bg-foreground/[0.06] px-3 py-1 text-sm font-medium text-muted-foreground">
          {copy.eyebrow}
        </p>
        <h1 className="mt-6 max-w-5xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-6xl lg:text-7xl">
          {head} {accent ? <span className="text-primary">{accent}</span> : null}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed md:text-2xl">{copy.sub}</p>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">{copy.proof}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => open()}>
            {copy.primaryCta}
          </Button>
          <TelegramLink
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground/[0.06] px-5 text-[15px] font-medium transition hover:bg-foreground/10"
          >
            <Send className="size-4 text-primary" aria-hidden />
            {copy.secondaryCta}
          </TelegramLink>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{copy.note}</p>
      </Reveal>
      <GlassPanel className="mt-14 p-2" delay={0.3}>
        <dl className="grid gap-2 sm:grid-cols-3">
          {copy.stats.map((s) => (
            // Подпись - термин (dt), цифра - значение (dd); column-reverse ставит цифру сверху,
            // а скринридер читает подпись один раз и перед цифрой.
            <div key={s.value} className="flex flex-col-reverse justify-end rounded-[22px] p-5 md:p-6">
              <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-2xl font-semibold tracking-[-0.02em] text-primary md:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </GlassPanel>
    </section>
  )
}
