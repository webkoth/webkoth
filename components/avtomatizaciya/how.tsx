'use client'

import { motion } from 'framer-motion'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { Reveal, SPRING, useSeen } from './motion'

// Три шага на линии: линия рисуется слева направо, точки шагов загораются по очереди
// (Timeline из роликов finstock). На телефоне шаги идут колонкой, линия вертикальная.
export function How({ copy }: { copy: AvtomatizaciyaCopy['how'] }) {
  const { ref, seen } = useSeen<HTMLOListElement>()
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="text-sm font-medium text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{copy.title}</h2>
      </Reveal>
      <ol ref={ref} className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        <motion.span
          aria-hidden
          className="absolute top-4 left-4 hidden h-px w-[calc(100%-2rem)] origin-left bg-primary/50 md:block"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: seen ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {copy.steps.map((s, i) => (
          <li key={s.title} className="relative">
            <motion.span
              aria-hidden
              className="relative z-[1] inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={seen ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
              transition={{ ...SPRING, delay: 0.2 + i * 0.4 }}
            >
              {i + 1}
            </motion.span>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em]">{s.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
