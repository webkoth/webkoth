'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from './use-reveal'
import type { AnimationCopy } from '@/app/data/evolution/types'

// Блок 2. Размытые обрывки отчётов в «тумане» стягиваются в один резкий экран
// движения средств. Финальный штрих — строка сверки, где второе число
// «доезжает» до первого, и строка подсвечивается.

const W = 480
const H = 300
const CARD = { x: 70, y: 34, w: 340, h: 232 }
const CX = CARD.x + CARD.w / 2
const CY = CARD.y + CARD.h / 2

const STRAYS = [
  { x: 22, y: 26, w: 118, h: 66, r: -7 },
  { x: 336, y: 18, w: 126, h: 74, r: 6 },
  { x: 48, y: 206, w: 146, h: 72, r: 4 },
]

const CHART = [0.55, 0.62, 0.48, 0.7, 0.66, 0.82, 0.78, 0.92]
const CHART_BOX = { x: CARD.x + 18, y: CARD.y + 92, w: CARD.w - 36, h: 66 }
const chartPoints = CHART.map((v, i) => ({
  x: CHART_BOX.x + (i / (CHART.length - 1)) * CHART_BOX.w,
  y: CHART_BOX.y + CHART_BOX.h - v * CHART_BOX.h,
}))
const chartPath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
const areaPath = `${chartPath} L${(CHART_BOX.x + CHART_BOX.w).toFixed(1)} ${CHART_BOX.y + CHART_BOX.h} L${CHART_BOX.x} ${CHART_BOX.y + CHART_BOX.h} Z`

// Цифры KPI и подписи — из данных страницы (иллюстративные, не из реальных данных клиента).
const RECON_FROM = 1_698_120
const RECON_TO = 1_705_850

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

function CountText({
  active,
  reduce,
  delay,
  duration,
  x,
  y,
}: {
  active: boolean
  reduce: boolean
  delay: number
  duration: number
  x: number
  y: number
}) {
  const [v, setV] = useState(RECON_FROM)

  useEffect(() => {
    // При reduced-motion финальное число отдаётся прямо из рендера — без эффекта.
    if (!active || reduce) return
    let raf = 0
    const t0 = performance.now() + delay * 1000
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)))
      const e = 1 - Math.pow(1 - t, 3)
      setV(Math.round(RECON_FROM + (RECON_TO - RECON_FROM) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduce, delay, duration])

  return (
    <text x={x} y={y} textAnchor="end" className="fill-foreground font-mono text-[11px] font-semibold tabular-nums">
      {fmt(reduce ? RECON_TO : v)}
    </text>
  )
}

export function FogToDashboard({ copy }: { copy: AnimationCopy['fog'] }) {
  const KPI = copy.kpi
  const { ref, active, reduce, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={copy.aria}
    >
      {/* Обрывки в тумане: едут к центру и растворяются в экране */}
      {STRAYS.map((s, i) => {
        const cx = s.x + s.w / 2
        const cy = s.y + s.h / 2
        return (
          <motion.g
            key={i}
            initial={{ x: 0, y: 0, rotate: s.r, opacity: 0.9, filter: 'blur(4px)' }}
            animate={
              active
                ? { x: CX - cx, y: CY - cy, rotate: 0, opacity: 0, filter: 'blur(0px)' }
                : { x: 0, y: 0, rotate: s.r, opacity: 0.9, filter: 'blur(4px)' }
            }
            transition={tr(1.5, 0.1 + i * 0.12)}
          >
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={8} className="fill-card stroke-border" />
            <rect x={s.x + 12} y={s.y + 14} width={s.w * 0.45} height={7} rx={3.5} className="fill-muted-foreground/40" />
            <rect x={s.x + 12} y={s.y + 30} width={s.w * 0.7} height={6} rx={3} className="fill-muted-foreground/25" />
            <rect x={s.x + 12} y={s.y + 44} width={s.w * 0.55} height={6} rx={3} className="fill-muted-foreground/25" />
            <rect x={s.x + s.w - 44} y={s.y + 14} width={32} height={7} rx={3.5} className="fill-primary/40" />
          </motion.g>
        )
      })}

      {/* Экран: из тумана — в резкость */}
      <motion.g
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={active ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
        transition={tr(1.3, 0.5)}
      >
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={12} className="fill-card stroke-border" strokeWidth={1.5} />
        <text x={CARD.x + 18} y={CARD.y + 26} className="fill-foreground text-[12px] font-semibold">
          {copy.title}
        </text>
        <text x={CARD.x + CARD.w - 18} y={CARD.y + 26} textAnchor="end" className="fill-muted-foreground font-mono text-[9px]">
          {copy.subtitle}
        </text>

        {KPI.map((k, i) => {
          const x = CARD.x + 18 + i * ((CARD.w - 36) / 3)
          return (
            <g key={k.label}>
              <text x={x} y={CARD.y + 52} className="fill-muted-foreground text-[9px]">
                {k.label}
              </text>
              <text x={x} y={CARD.y + 72} className="fill-foreground font-mono text-[14px] font-bold tabular-nums">
                {k.value}
              </text>
            </g>
          )
        })}

        {/* График: потоки сливаются в одну читаемую линию */}
        <motion.path
          d={areaPath}
          className="fill-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 0.12 : 0 }}
          transition={tr(1, 1.6)}
        />
        <motion.path
          d={chartPath}
          fill="none"
          className="stroke-primary"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={tr(1.3, 1.2)}
        />
        {chartPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            className="fill-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={tr(0.3, 1.2 + (i / chartPoints.length) * 1.3)}
          />
        ))}

        {/* Строка сверки: числа сходятся и подсвечиваются */}
        <motion.rect
          x={CARD.x + 12}
          y={CARD.y + 176}
          width={CARD.w - 24}
          height={40}
          rx={8}
          className="fill-primary/10 stroke-primary/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={tr(0.6, 3.2)}
        />
        <text x={CARD.x + 24} y={CARD.y + 192} className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.18em]">
          {copy.recon}
        </text>
        <text x={CARD.x + 24} y={CARD.y + 207} className="fill-muted-foreground text-[9px]">
          {copy.bank}
        </text>
        <text x={CARD.x + 140} y={CARD.y + 207} textAnchor="end" className="fill-foreground font-mono text-[11px] font-semibold tabular-nums">
          {fmt(RECON_TO)}
        </text>
        <text x={CARD.x + 176} y={CARD.y + 207} className="fill-muted-foreground text-[9px]">
          {copy.ledger}
        </text>
        <CountText active={active} reduce={reduce} delay={2.2} duration={1.0} x={CARD.x + 292} y={CARD.y + 207} />
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={tr(0.5, 3.25)}
          style={{ originX: `${CARD.x + CARD.w - 28}px`, originY: `${CARD.y + 196}px` }}
        >
          <circle cx={CARD.x + CARD.w - 28} cy={CARD.y + 196} r={9} className="fill-primary" />
          <path
            d={`M${CARD.x + CARD.w - 32.5} ${CARD.y + 196.5}l3 3 5.5-6`}
            fill="none"
            className="stroke-primary-foreground"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  )
}
