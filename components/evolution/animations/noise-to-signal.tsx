'use client'

import { motion } from 'framer-motion'
import { useReveal } from './use-reveal'
import type { AnimationCopy } from '@/app/data/evolution/types'
import { clamp, mulberry32 } from './seeded'

// Блок 3. Облако разбросанных точек — шум. При скролле сквозь него проступает
// чёткая линия тренда, выбросы гаснут, на линии загораются маркеры-решения.

const W = 480
const H = 300
const rnd = mulberry32(7)

const X0 = 44
const X1 = 446
const Y0 = 238
const Y1 = 60
const lineY = (x: number) => Y0 + (Y1 - Y0) * ((x - X0) / (X1 - X0))

const POINTS = Array.from({ length: 96 }, () => {
  const x = X0 + rnd() * (X1 - X0)
  const outlier = rnd() < 0.34
  const dy = outlier ? (rnd() - 0.5) * 180 : (rnd() - 0.5) * 30
  return {
    x,
    y: clamp(lineY(x) + dy, 16, H - 16),
    outlier,
    r: outlier ? 2.4 + rnd() * 1.2 : 2 + rnd() * 0.9,
    order: rnd(),
  }
})

const MARKERS = [112, 212, 312, 412].map((x) => ({ x, y: lineY(x) }))

export function NoiseToSignal({ copy }: { copy: AnimationCopy['noise'] }) {
  const { ref, active, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={copy.aria}
    >
      {/* Оси */}
      <line x1={X0 - 12} y1={Y0 + 18} x2={X1 + 10} y2={Y0 + 18} className="stroke-border" />
      <line x1={X0 - 12} y1={Y0 + 18} x2={X0 - 12} y2={Y1 - 24} className="stroke-border" />

      {/* Шум */}
      {POINTS.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          className={p.outlier ? 'fill-foreground' : 'fill-primary'}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: active ? (p.outlier ? 0.07 : 0.75) : 0.5 }}
          transition={tr(1.1, 0.5 + p.order * 0.9)}
        />
      ))}

      {/* Сигнал */}
      <motion.line
        x1={X0}
        y1={Y0}
        x2={X1}
        y2={Y1}
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={tr(1.5, 0.3)}
      />

      {/* Маркеры-решения */}
      {MARKERS.map((m, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={tr(0.55, 1.7 + i * 0.2)}
          style={{ originX: `${m.x}px`, originY: `${m.y}px` }}
        >
          <circle cx={m.x} cy={m.y} r={11} className="fill-primary/15 stroke-primary/50" />
          <circle cx={m.x} cy={m.y} r={4.5} className="fill-primary" />
        </motion.g>
      ))}
    </svg>
  )
}
