'use client'

import { motion } from 'framer-motion'
import { useReveal } from './use-reveal'
import { mulberry32 } from './seeded'

// Блок 1. Россыпь обрывков (таблицы, сообщения, файлы) хаотично лежит по полю;
// при входе в viewport каждый обрывок едет на своё место в схеме приложения —
// шапка, боковое меню, карточки, таблица. Ничего не исчезает: мы не выбрасываем
// то, что есть, а упорядочиваем.

const W = 480
const H = 300
const rnd = mulberry32(11)

type Kind = 'table' | 'chat' | 'file' | 'sheet' | 'user' | 'lock'
const KINDS: Kind[] = ['table', 'chat', 'file', 'sheet', 'user', 'lock']

const FRAME = { x: 40, y: 30, w: 400, h: 240 }
const SIDEBAR_W = 112
const HEADER_H = 30

// Слоты: 3 в шапке, 7 в боковом меню, 4 в карточках, 4 в строках таблицы.
const SLOTS: { x: number; y: number }[] = [
  { x: FRAME.x + 20, y: FRAME.y + 15 },
  { x: FRAME.x + FRAME.w - 36, y: FRAME.y + 15 },
  { x: FRAME.x + FRAME.w - 16, y: FRAME.y + 15 },
  ...Array.from({ length: 7 }, (_, i) => ({ x: FRAME.x + 18, y: FRAME.y + 52 + i * 26 })),
  ...Array.from({ length: 4 }, (_, j) => ({
    x: FRAME.x + SIDEBAR_W + 22 + (j % 2) * 134,
    y: FRAME.y + 56 + Math.floor(j / 2) * 58,
  })),
  ...Array.from({ length: 4 }, (_, k) => ({ x: FRAME.x + SIDEBAR_W + 22, y: FRAME.y + 176 + k * 18 })),
]

const FRAGMENTS = SLOTS.map((slot, i) => ({
  kind: KINDS[i % KINDS.length],
  sx: 18 + rnd() * (W - 36),
  sy: 18 + rnd() * (H - 36),
  sr: -75 + rnd() * 150,
  tx: slot.x,
  ty: slot.y,
  order: rnd(),
}))

function Glyph({ kind }: { kind: Kind }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const }
  switch (kind) {
    case 'table':
      return (
        <g {...common}>
          <rect x={-7} y={-6} width={14} height={12} rx={1.5} />
          <path d="M-7 -2h14M-7 2h14M-2 -6v12" />
        </g>
      )
    case 'chat':
      return (
        <g {...common}>
          <path d="M-7 -6h14v9h-8l-4 3.5v-3.5h-2z" strokeLinejoin="round" />
        </g>
      )
    case 'file':
      return (
        <g {...common}>
          <path d="M-5 -7h7l3 3v11h-10z" strokeLinejoin="round" />
          <path d="M2 -7v3h3" />
        </g>
      )
    case 'sheet':
      return (
        <g {...common}>
          <rect x={-7} y={-6} width={14} height={12} rx={1.5} />
          <path d="M-4 -2h8M-4 1h8M-4 4h5" />
        </g>
      )
    case 'user':
      return (
        <g {...common}>
          <circle cx={0} cy={-3} r={3} />
          <path d="M-6 7c0-4 12-4 12 0" />
        </g>
      )
    case 'lock':
      return (
        <g {...common}>
          <rect x={-5.5} y={-1} width={11} height={8} rx={1.5} />
          <path d="M-3 -1v-2.5a3 3 0 0 1 6 0v2.5" />
        </g>
      )
  }
}

export function FragmentsToStructure() {
  const { ref, active, tr } = useReveal()
  const state = active ? 'on' : 'off'
  const drawTr = tr(1.1, 0.25)
  const lateTr = tr(0.8, 1.35)

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Разрозненные таблицы, сообщения и файлы выстраиваются в схему одного приложения"
    >
      {/* Каркас приложения: рисуется линией, пока обрывки занимают места */}
      <motion.rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.w}
        height={FRAME.h}
        rx={10}
        className="fill-card/70 stroke-border"
        strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={drawTr}
      />
      <motion.line
        x1={FRAME.x}
        y1={FRAME.y + HEADER_H}
        x2={FRAME.x + FRAME.w}
        y2={FRAME.y + HEADER_H}
        className="stroke-border"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={tr(0.9, 0.6)}
      />
      <motion.line
        x1={FRAME.x + SIDEBAR_W}
        y1={FRAME.y + HEADER_H}
        x2={FRAME.x + SIDEBAR_W}
        y2={FRAME.y + FRAME.h}
        className="stroke-border"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={tr(0.9, 0.7)}
      />

      {/* Подписи-плейсхолдеры появляются, когда всё встало на места */}
      <motion.g
        className="fill-muted-foreground/35"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={lateTr}
      >
        <rect x={FRAME.x + 34} y={FRAME.y + 11} width={70} height={7} rx={3.5} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={FRAME.x + 34} y={FRAME.y + 48 + i * 26} width={48 + (i % 3) * 10} height={7} rx={3.5} />
        ))}
        {Array.from({ length: 4 }, (_, j) => {
          const cx = FRAME.x + SIDEBAR_W + 22 + (j % 2) * 134
          const cy = FRAME.y + 56 + Math.floor(j / 2) * 58
          return (
            <g key={j}>
              <rect x={cx + 16} y={cy - 8} width={60} height={7} rx={3.5} />
              <rect x={cx + 16} y={cy + 4} width={84} height={5} rx={2.5} className="fill-muted-foreground/20" />
            </g>
          )
        })}
        {Array.from({ length: 4 }, (_, k) => (
          <g key={k}>
            <rect x={FRAME.x + SIDEBAR_W + 40} y={FRAME.y + 172 + k * 18} width={90 - (k % 2) * 14} height={6} rx={3} />
            <rect x={FRAME.x + SIDEBAR_W + 150} y={FRAME.y + 172 + k * 18} width={50} height={6} rx={3} />
            <rect x={FRAME.x + SIDEBAR_W + 220} y={FRAME.y + 172 + k * 18} width={32} height={6} rx={3} className="fill-primary/50" />
          </g>
        ))}
      </motion.g>

      {/* Карточки-контейнеры в основной области */}
      <motion.g
        className="fill-background/60 stroke-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={tr(0.8, 1.1)}
      >
        {Array.from({ length: 4 }, (_, j) => (
          <rect
            key={j}
            x={FRAME.x + SIDEBAR_W + 10 + (j % 2) * 134}
            y={FRAME.y + 38 + Math.floor(j / 2) * 58}
            width={124}
            height={46}
            rx={6}
          />
        ))}
        <rect x={FRAME.x + SIDEBAR_W + 10} y={FRAME.y + 160} width={258} height={76} rx={6} />
      </motion.g>

      {/* Обрывки: из хаоса — на свои места */}
      {FRAGMENTS.map((f, i) => (
        <motion.g
          key={i}
          className="text-foreground"
          initial={{ x: f.sx, y: f.sy, rotate: f.sr, opacity: 0.55 }}
          animate={
            active
              ? { x: f.tx, y: f.ty, rotate: 0, opacity: 1 }
              : { x: f.sx, y: f.sy, rotate: f.sr, opacity: 0.55 }
          }
          transition={tr(1.3, 0.15 + f.order * 0.7)}
          data-state={state}
        >
          <Glyph kind={f.kind} />
        </motion.g>
      ))}
    </svg>
  )
}
