'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Движение как в роликах finstock (content-factory/content/styles/finstock/visual.md, «Движение»):
// пружина без отскока damping 24 / stiffness 80 / mass 1; появление из 96 % размера,
// сдвиг 14 px и размытие 10 → 0 px. Стекло размытием не анимируем: у элемента с filter
// браузер перестаёт размывать то, что под ним, и стекло включается рывком.
export const SPRING = { type: 'spring', damping: 24, stiffness: 80, mass: 1 } as const

const VIEWPORT = { once: true, margin: '-80px' } as const

/** Текст и обычные блоки: проявляются из размытия. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Стеклянная панель: появляется сама, без размытия (см. выше). */
export function GlassPanel({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={cn('glass rounded-[28px]', className)}
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </Tag>
  )
}

/** Число докручивается до значения без перелёта, когда попадает на экран. */
export function CountUp({
  value,
  duration = 1100,
  format = (n: number) => n.toLocaleString('ru-RU'),
  className,
}: {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setShown(value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format(reduce ? value : Math.round(shown))}
    </span>
  )
}

/** Флаг «блок на экране» для иллюстраций, которые играют свою сцену один раз. */
export function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const seen = useInView(ref, VIEWPORT)
  const reduce = useReducedMotion()
  return { ref, seen: seen || Boolean(reduce), reduce: Boolean(reduce) }
}
