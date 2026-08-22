'use client'

import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { EASE } from './seeded'

/**
 * Сцена проигрывается один раз — когда блок входит во viewport.
 * При prefers-reduced-motion сразу показывается финальное состояние:
 * `active` = true с первого рендера, а `tr()` отдаёт нулевую длительность.
 */
export function useReveal<T extends Element = SVGSVGElement>(amount = 0.35) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, amount })
  const reduce = !!useReducedMotion()
  const active = reduce || inView

  const tr = (duration: number, delay = 0) =>
    reduce ? { duration: 0, delay: 0 } : { duration, delay, ease: EASE }

  return { ref, active, reduce, tr }
}
