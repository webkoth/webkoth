'use client'

import { motion } from 'framer-motion'
import type { EvolutionData, RoadmapStep } from '@/app/data/evolution/types'
import { useReveal } from './animations/use-reveal'

// «От идеи до прода»: как выполняется план со страницы — четыре шага зигзагом
// вдоль центральной линии. Один раз проявляется при входе во viewport, в языке
// страницы: моно-номера шагов, карточки bg-card/70, без лишнего хрома.
function StepCard({ step }: { step: RoadmapStep }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{step.num}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight md:text-xl">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{step.body}</p>
      <p className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
        {step.pill}
      </p>
    </div>
  )
}

export function Roadmap({ data }: { data: EvolutionData['roadmap'] }) {
  const { ref, active, tr } = useReveal<HTMLDivElement>(0.15)

  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-title"
      className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24"
    >
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{data.eyebrow}</p>
        <h2 id="roadmap-title" className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          {data.title}
        </h2>
        <p className="mt-5 text-base text-muted-foreground md:text-lg">{data.sub}</p>
      </div>

      <div ref={ref} className="relative mt-12 md:mt-16">
        {/* Центральная линия — только на широких экранах; прорисовывается сверху вниз */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block"
          initial={{ height: 0 }}
          animate={{ height: active ? '100%' : 0 }}
          transition={tr(1.6, 0.1)}
        />

        <ol className="flex flex-col gap-8 md:gap-14">
          {data.steps.map((step, i) => {
            const left = i % 2 === 0
            return (
              <motion.li
                key={step.num}
                className="relative md:grid md:grid-cols-2 md:gap-16"
                initial={{ opacity: 0, y: 18 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={tr(0.7, 0.2 + i * 0.28)}
              >
                {/* Узел на линии */}
                <span
                  aria-hidden
                  className="absolute top-5 left-1/2 hidden size-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:block"
                />
                <div className={left ? 'md:pr-4' : 'md:col-start-2 md:pl-4'}>
                  <StepCard step={step} />
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
