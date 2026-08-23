'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

// Тонкая полоса прогресса чтения под шапкой: scaleX от 0 до 1 по scrollYProgress.
// Пружина сглаживает рывки; при reduced-motion — без пружины.
export function ReadingProgress({ label }: { label: string }) {
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 })

  return (
    <motion.div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-primary"
      style={{ scaleX: reduce ? scrollYProgress : spring }}
    />
  )
}
