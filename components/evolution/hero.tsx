'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EvolutionData } from '@/app/data/evolution'
import { EASE } from './animations/seeded'

// Hero: полный лозунг в две строки, подпись-замок, одно предложение и одна кнопка.
// Текст проявляется синхронно с тем, как фоновые частицы стягиваются в сетку.
export function Hero({ data }: { data: EvolutionData['hero'] }) {
  const reduce = !!useReducedMotion()
  const tr = (delay: number) => (reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE })

  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-8 md:pt-28 md:pb-28">
      <motion.p
        className="font-mono text-xs uppercase tracking-[0.22em] text-primary md:text-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tr(0.2)}
      >
        {data.seal}
      </motion.p>

      <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-balance md:text-5xl md:leading-[1.08] lg:text-[3.4rem]">
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tr(0.45)}
        >
          {data.line1}
        </motion.span>
        <motion.span
          className="mt-2 block text-foreground/80 md:mt-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tr(0.85)}
        >
          {data.line2}
        </motion.span>
      </h1>

      <motion.p
        className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-2xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tr(1.3)}
      >
        {data.sub}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tr(1.6)}
      >
        {/* Button несёт whitespace-nowrap: на 320px длинная подпись даёт
            горизонтальный скролл, поэтому на узких экранах — во всю ширину. */}
        <Button
          size="lg"
          nativeButton={false}
          className="h-auto w-full px-6 py-3 text-base whitespace-normal sm:h-12 sm:w-auto sm:py-0 sm:whitespace-nowrap"
          render={<a href="#form" />}
        >
          {data.cta}
        </Button>
        <a
          href="#system"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowDown className="size-3.5" aria-hidden />
          {data.scrollHint}
        </a>
      </motion.div>
    </section>
  )
}
