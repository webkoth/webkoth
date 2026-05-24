'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export function AnimatedMetric({
  value,
  suffix,
  label,
  duration = 1200,
}: {
  value: number
  suffix: string
  label: string
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplayValue(value)
      return
    }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayValue(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value, duration])

  return (
    <div ref={ref} className="border-l-2 border-primary/40 pl-3">
      <div className="text-2xl font-bold tabular-nums md:text-3xl">
        {displayValue}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground md:text-sm">{label}</div>
    </div>
  )
}
