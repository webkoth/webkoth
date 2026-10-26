'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CalendarCheck, Clock, Package, Send } from 'lucide-react'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'
import { SPRING } from './motion'
import { AgentScheme } from './agent-scheme'

// Первый экран по референсу собственника 26.10 (Boltshift): на широком экране текст слева и живая
// схема агента справа (схема заходит под текст), на узком — всё по центру столбиком. Цвета finstock. Главная кнопка — циан finstock со свечением.

const STAT_ICONS = [Clock, Package, CalendarCheck] as const

export function Hero({ copy, exampleLabel }: { copy: AvtomatizaciyaCopy['hero']; exampleLabel: string }) {
  const { open } = useLeadDialog()
  const reduce = useReducedMotion()
  const at = copy.title.indexOf(copy.titleAccent)
  const head = at >= 0 ? copy.title.slice(0, at).trim() : copy.title
  const accent = at >= 0 ? copy.titleAccent : ''
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { ...SPRING, delay },
        }

  return (
    <section id="hero" className="relative isolate">
      {/* Циановое свечение за схемой: по центру на узких экранах, справа — на широких. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[38%] left-1/2 -z-10 h-[620px] w-[min(1100px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_184_219/.22),transparent)] xl:top-1/2 xl:left-[74%] xl:w-[900px] xl:-translate-y-1/2"
      />
      {/* До 1280 px — всё по центру столбиком. С 1280 px — текст слева, схема справа (слово
          собственника 26.10); схема сдвинута влево и заходит под текст, текст лежит поверх. */}
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-16 text-center md:px-8 md:pt-20 md:pb-24 xl:grid xl:min-h-[calc(100svh-var(--header-h,5rem))] xl:max-w-[1640px] xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-0 xl:px-12 xl:pt-6 xl:pb-12 xl:text-left 2xl:px-16">
        <div className="relative z-10">
          <motion.p className="micro text-muted-foreground" {...enter(0)}>
            {copy.eyebrow}
          </motion.p>
          <motion.h1
            className="mx-auto mt-5 max-w-4xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance md:text-6xl xl:mx-0 xl:max-w-[640px] xl:text-[3.5rem] 2xl:max-w-[820px] 2xl:text-[4.4rem]"
            {...enter(0.05)}
          >
            {head} {accent ? <span className="text-primary">{accent}</span> : null}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg xl:mx-0 xl:max-w-[520px] 2xl:max-w-[680px] 2xl:text-[19px]"
            {...enter(0.15)}
          >
            {copy.sub} {copy.proof}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-3 xl:justify-start" {...enter(0.25)}>
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-[0_0_0_1px_rgb(255_255_255/.25)_inset,0_10px_30px_-6px_rgb(0_184_219/.6)] transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {copy.primaryCta}
            </button>
            <TelegramLink
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition hover:opacity-85"
            >
              <Send className="size-4 text-primary" aria-hidden />
              {copy.secondaryCta}
            </TelegramLink>
          </motion.div>
          <motion.p className="micro mt-4 text-muted-foreground" {...enter(0.3)}>
            30 минут · бесплатно · без обязательств
          </motion.p>
          <motion.dl
            className="mx-auto mt-12 hidden max-w-[640px] grid-cols-3 gap-6 text-left xl:mx-0 xl:grid"
            {...enter(0.4)}
          >
            <Stats stats={copy.stats} />
          </motion.dl>
        </div>

        <div className="mt-14 text-left md:mt-16 xl:mt-0 xl:-ml-4 2xl:-ml-24">
          <AgentScheme exampleLabel={exampleLabel} />
        </div>

        <motion.dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 text-left md:mt-14 xl:hidden" {...enter(0.4)}>
          <Stats stats={copy.stats} />
        </motion.dl>
      </div>
    </section>
  )
}

function Stats({ stats }: { stats: AvtomatizaciyaCopy['hero']['stats'] }) {
  return (
    <>
      {stats.map((s, i) => {
        const Icon = STAT_ICONS[i]
        return (
          <div key={s.value} className="flex flex-col-reverse justify-end">
            <dt className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs md:text-[13px]">{s.label}</dt>
            <dd className="flex items-center gap-1.5 text-lg font-medium tracking-[-0.01em] md:text-[1.4rem]">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              {s.value}
            </dd>
          </div>
        )
      })}
    </>
  )
}
