'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EvolutionData } from '@/app/data/evolution/types'
import { cn } from '@/lib/utils'
import { EASE } from './animations/seeded'
import { ProductionStack } from './production-stack'
import { useLeadDialog } from './lead-dialog'

// Hero — ровно один экран (100svh минус шапка; высоту шапки кладёт в --header-h
// сам HeaderNav). Десктоп: слева лозунг в две строки, подпись-замок, одно
// предложение и кнопка; справа — «живая» схема работающей системы; внизу по
// центру — индикатор «листай». Мобильный: первый экран — только текст и кнопка,
// схема идёт вторым экраном. Размер h1 привязан и к ширине, и к высоте окна,
// чтобы шесть строк заголовка влезали в 768px с запасом.
function ScrollCue({ hint, className }: { hint: string; className?: string }) {
  const reduce = !!useReducedMotion()
  return (
    <a
      href="#system"
      className={cn(
        'group items-center gap-2 text-xs text-muted-foreground transition hover:text-primary md:text-sm',
        className,
      )}
    >
      <motion.span
        className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-background/70"
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-4" aria-hidden />
      </motion.span>
      <span className="max-w-[28rem] text-balance lg:max-w-none">{hint}</span>
    </a>
  )
}

export function Hero({ data }: { data: EvolutionData['hero'] }) {
  const reduce = !!useReducedMotion()
  const { open } = useLeadDialog()
  const tr = (delay: number) => (reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE })

  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 md:px-8">
      {/* Классы высоты — литералами: Tailwind не видит собранные из строк имена. */}
      <div className="relative lg:grid lg:min-h-[calc(100svh-var(--header-h,6rem))] lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-14">
        <div className="relative flex min-h-[calc(100svh-var(--header-h,6rem))] flex-col justify-center py-12 lg:col-span-7 lg:min-h-0 lg:py-0">
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.22em] text-primary md:text-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.2)}
          >
            {data.seal}
          </motion.p>

          <h1 className="mt-5 text-[clamp(1.75rem,min(4.5vw,5.2svh),3.25rem)] leading-[1.1] font-bold tracking-tight text-balance">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(0.45)}
            >
              {data.line1}
            </motion.span>
            <motion.span
              className="mt-2 block md:mt-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(0.85)}
            >
              {data.line2}
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg text-muted-foreground md:mt-8 md:text-xl lg:text-2xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(1.3)}
          >
            {data.sub}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-10"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(1.6)}
          >
            {/* Button несёт whitespace-nowrap: на 320px длинная подпись даёт
                горизонтальный скролл, поэтому на узких экранах — во всю ширину. */}
            <Button
              size="lg"
              onClick={open}
              className="h-auto w-full px-6 py-3 text-base whitespace-normal sm:h-12 sm:w-auto sm:py-0 sm:whitespace-nowrap"
            >
              {data.cta}
              <ArrowRight aria-hidden />
            </Button>
          </motion.div>

          {/* Мобильный индикатор — внизу первого экрана */}
          <motion.div
            className="absolute inset-x-0 bottom-4 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tr(2.2)}
          >
            <ScrollCue hint={data.scrollHint} className="flex" />
          </motion.div>
        </div>

        <div className="pb-16 lg:col-span-5 lg:pb-0">
          <ProductionStack delay={reduce ? 0 : 1.9} copy={{ hint: data.stackHint, nodes: data.stackNodes }} />
        </div>

        {/* Десктопный индикатор — по центру низа экрана */}
        <motion.div
          className="absolute bottom-5 left-1/2 hidden w-max max-w-[90%] -translate-x-1/2 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tr(2.4)}
        >
          <ScrollCue hint={data.scrollHint} className="flex" />
        </motion.div>
      </div>
    </section>
  )
}
