'use client'

import { motion } from 'framer-motion'
import { Cog } from 'lucide-react'
import { useReveal } from './use-reveal'

// Блок 6. Сетка ячеек-операций, плотно заполненная фигурками людей. При входе
// в viewport большинство ячеек переходят в режим «авто» (цвет, значок системы),
// фигурки высвобождаются и собираются у ячеек с пометкой «рост». Люди не
// исчезают — они переходят на работу, которую нельзя автоматизировать.

const W = 480
const H = 300
const COLS = 7
const ROWS = 4
const CELL = 46
const GAP = 6
const X0 = 24
const Y0 = 44
const GROWTH_X = X0 + COLS * (CELL + GAP) + 14

// Эти операции остаются за людьми (индексы в сетке 7×4).
const KEEP = new Set([3, 9, 12, 18, 22, 26])
// Раскладка фигурок внутри ячейки «рост» — до шести в каждой.
const CLUSTER = [
  [-12, -9],
  [0, -9],
  [12, -9],
  [-12, 9],
  [0, 9],
  [12, 9],
]

const cellAt = (i: number) => ({
  x: X0 + (i % COLS) * (CELL + GAP),
  y: Y0 + Math.floor(i / COLS) * (CELL + GAP),
})

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({ i, ...cellAt(i), keep: KEEP.has(i) }))

// Высвобождённые фигурки распределяются по четырём ячейкам роста по кругу.
let freedCounter = 0
const FIGURES = CELLS.map((c) => {
  const cx = c.x + CELL / 2
  const cy = c.y + CELL / 2
  if (c.keep) return { i: c.i, sx: cx, sy: cy, tx: cx, ty: cy, freed: false, order: 0 }
  const n = freedCounter++
  const row = n % ROWS
  const slot = Math.floor(n / ROWS)
  const [ox, oy] = CLUSTER[slot % CLUSTER.length]
  return {
    i: c.i,
    sx: cx,
    sy: cy,
    tx: GROWTH_X + CELL / 2 + ox,
    ty: Y0 + row * (CELL + GAP) + CELL / 2 + oy,
    freed: true,
    order: n / Math.max(1, COLS * ROWS - KEEP.size),
  }
})

function Person() {
  return (
    <g className="fill-foreground">
      <circle cx={0} cy={-5.5} r={3.4} />
      <path d="M-6 7.5Q-6 0 0 0Q6 0 6 7.5Z" />
    </g>
  )
}

export function CellsGrid() {
  const { ref, active, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Сетка операций: большинство ячеек переходят в режим «авто», люди из них переходят к ячейкам роста"
    >
      {/* Ячейки операций */}
      {CELLS.map((c) => (
        <g key={c.i}>
          <rect x={c.x} y={c.y} width={CELL} height={CELL} rx={8} className="fill-card stroke-border" />
          {!c.keep ? (
            <>
              <motion.rect
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
                rx={8}
                className="fill-primary/12 stroke-primary/45"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={tr(0.6, 0.5 + FIGURES[c.i].order * 1.1)}
              />
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={tr(0.6, 0.9 + FIGURES[c.i].order * 1.1)}
                style={{ originX: `${c.x + CELL / 2}px`, originY: `${c.y + CELL / 2}px` }}
              >
                <Cog x={c.x + CELL / 2 - 9} y={c.y + CELL / 2 - 9} size={18} className="text-primary" strokeWidth={1.8} />
              </motion.g>
            </>
          ) : null}
        </g>
      ))}

      {/* Ячейки роста */}
      <text x={GROWTH_X + CELL / 2} y={Y0 - 14} textAnchor="middle" className="fill-primary font-mono text-[9px] uppercase tracking-[0.18em]">
        рост
      </text>
      {Array.from({ length: ROWS }, (_, r) => (
        <rect
          key={r}
          x={GROWTH_X}
          y={Y0 + r * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx={8}
          fill="none"
          className="stroke-primary/60"
          strokeDasharray="4 4"
        />
      ))}

      {/* Люди: из ячеек «авто» — к росту */}
      {FIGURES.map((f) => (
        <motion.g
          key={f.i}
          initial={{ x: f.sx, y: f.sy, scale: 1 }}
          animate={active && f.freed ? { x: f.tx, y: f.ty, scale: 0.72 } : { x: f.sx, y: f.sy, scale: 1 }}
          transition={tr(1.2, 0.6 + f.order * 1.1)}
        >
          <Person />
        </motion.g>
      ))}

      {/* Легенда */}
      <g transform={`translate(${X0} ${Y0 + ROWS * (CELL + GAP) + 26})`}>
        <rect x={0} y={-9} width={14} height={14} rx={3} className="fill-primary/12 stroke-primary/45" />
        <Cog x={2} y={-7} size={10} className="text-primary" strokeWidth={2} />
        <text x={20} y={2} className="fill-muted-foreground text-[9.5px]">
          делает система
        </text>
        <g transform="translate(118 0)">
          <g transform="translate(7 -1) scale(0.8)">
            <Person />
          </g>
          <text x={20} y={2} className="fill-muted-foreground text-[9.5px]">
            остаётся людям — и переходит в рост
          </text>
        </g>
      </g>
    </svg>
  )
}
