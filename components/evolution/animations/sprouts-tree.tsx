'use client'

import { motion } from 'framer-motion'
import { Gauge, LayoutGrid, Target, Users, Wallet, Workflow } from 'lucide-react'
import { useReveal } from './use-reveal'
import type { AnimationCopy } from '@/app/data/evolution/types'

// Финал. Четыре ростка: три увядают, четвёртый растёт и разворачивается в дерево,
// ветви которого — иконки шести предыдущих блоков. Вся страница собирается
// в один образ.

const W = 480
const H = 320
const GROUND = 286

const WILTED = [72, 150, 228]
const TREE_X = 348

const BRANCHES = [
  { d: `M${TREE_X + 1} 238 C ${TREE_X - 30} 228, ${TREE_X - 70} 224, ${TREE_X - 98} 204`, end: [TREE_X - 108, 198], Icon: LayoutGrid },
  { d: `M${TREE_X + 1} 238 C ${TREE_X + 30} 226, ${TREE_X + 56} 212, ${TREE_X + 76} 190`, end: [TREE_X + 86, 182], Icon: Wallet },
  { d: `M${TREE_X + 2} 206 C ${TREE_X - 22} 186, ${TREE_X - 52} 170, ${TREE_X - 74} 142`, end: [TREE_X - 84, 132], Icon: Target },
  { d: `M${TREE_X + 2} 206 C ${TREE_X + 26} 180, ${TREE_X + 46} 158, ${TREE_X + 60} 124`, end: [TREE_X + 66, 112], Icon: Workflow },
  { d: `M${TREE_X} 172 C ${TREE_X - 10} 140, ${TREE_X - 26} 112, ${TREE_X - 40} 86`, end: [TREE_X - 46, 74], Icon: Gauge },
  { d: `M${TREE_X} 160 C ${TREE_X + 8} 130, ${TREE_X + 18} 100, ${TREE_X + 30} 74`, end: [TREE_X + 36, 62], Icon: Users },
] as const

function Sprout({ className }: { className: string }) {
  return (
    <g className={className}>
      <path d="M0 0C0 -18 5 -30 0 -50" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      <ellipse cx={-8} cy={-30} rx={8} ry={4} transform="rotate(-28 -8 -30)" fill="currentColor" />
      <ellipse cx={8} cy={-40} rx={8} ry={4} transform="rotate(28 8 -40)" fill="currentColor" />
    </g>
  )
}

export function SproutsTree({ copy }: { copy: AnimationCopy['sprouts'] }) {
  const { ref, active, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={copy.aria}
    >
      <line x1={24} y1={GROUND} x2={W - 24} y2={GROUND} className="stroke-border" strokeWidth={1.5} />

      {/* Три захода, которые остановлены */}
      {WILTED.map((x, i) => (
        <motion.g
          key={x}
          initial={{ x, y: GROUND, rotate: 0 }}
          animate={active ? { x, y: GROUND, rotate: 38 + i * 6 } : { x, y: GROUND, rotate: 0 }}
          transition={tr(1.4, 0.3 + i * 0.25)}
          style={{ originX: '0px', originY: '0px' }}
        >
          <motion.g initial={{ opacity: 1 }} animate={{ opacity: active ? 0 : 1 }} transition={tr(1.2, 0.3 + i * 0.25)}>
            <Sprout className="text-primary" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: active ? 0.45 : 0 }} transition={tr(1.2, 0.3 + i * 0.25)}>
            <Sprout className="text-muted-foreground" />
          </motion.g>
          <text x={0} y={16} textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">
            {copy.attempt}{i + 1}
          </text>
        </motion.g>
      ))}

      {/* Четвёртый: росток остаётся у корня и становится стволом */}
      <g transform={`translate(${TREE_X} ${GROUND})`}>
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: active ? 0 : 1 }} transition={tr(0.6, 1.4)}>
          <Sprout className="text-primary" />
        </motion.g>
        <text x={0} y={16} textAnchor="middle" className="fill-primary font-mono text-[9px] font-semibold">
          {copy.attempt}4
        </text>
      </g>
      <motion.path
        d={`M${TREE_X} ${GROUND} C ${TREE_X - 3} 250, ${TREE_X + 5} 210, ${TREE_X} 160`}
        fill="none"
        className="stroke-primary"
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={tr(1.4, 1.3)}
      />

      {/* Ветви — шесть блоков страницы */}
      {BRANCHES.map((b, i) => {
        const [ex, ey] = b.end
        const Icon = b.Icon
        const labelRight = ex > TREE_X
        return (
          <g key={i}>
            <motion.path
              d={b.d}
              fill="none"
              className="stroke-primary"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={tr(0.9, 2.3 + i * 0.22)}
            />
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={tr(0.6, 2.9 + i * 0.22)}
              style={{ originX: `${ex}px`, originY: `${ey}px` }}
            >
              <circle cx={ex} cy={ey} r={17} className="fill-card stroke-primary" strokeWidth={1.8} />
              <Icon x={ex - 9} y={ey - 9} size={18} className="text-primary" strokeWidth={1.9} />
              <text
                x={labelRight ? ex + 24 : ex - 24}
                y={ey + 3.5}
                textAnchor={labelRight ? 'start' : 'end'}
                className="fill-muted-foreground text-[9.5px]"
              >
                {copy.branches[i]}
              </text>
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}
