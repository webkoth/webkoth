'use client'

import { motion } from 'framer-motion'
import { FileText, Hand, Package, Tag } from 'lucide-react'
import { useReveal } from './use-reveal'

// Блок 4. Конвейер: слева стопка однотипных карточек-задач, «рука» двигает одну.
// При входе в viewport рука исчезает, лента ускоряется, карточки едут сами и на
// выходе складываются в стопки готового: этикетка, PDF, карточка товара.
// Сцена конечная — шесть карточек, без зацикливания.

const W = 480
const H = 300
const BELT = { x: 24, y: 158, w: 360, h: 16 }
const BELT_Y = BELT.y - 18 // центр карточки над лентой
const QUEUE = { x: 56, y: 110 }
const CARD_W = 36
const CARD_H = 26

const OUT = [
  { kind: 'label', x: 428, y: 72, label: 'этикетка', Icon: Tag },
  { kind: 'pdf', x: 428, y: 150, label: 'PDF', Icon: FileText },
  { kind: 'card', x: 428, y: 228, label: 'карточка', Icon: Package },
] as const

const CARD_COUNT = 9
const CARDS = Array.from({ length: CARD_COUNT }, (_, i) => ({
  i,
  out: (i % 3) as 0 | 1 | 2,
  stackN: Math.floor(i / 3),
  sx: QUEUE.x + i * 1.5,
  sy: QUEUE.y - i * 3,
}))

function Card({ kind, done }: { kind: 0 | 1 | 2; done?: boolean }) {
  const Icon = OUT[kind].Icon
  return (
    <g>
      <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H} rx={5} className="fill-card stroke-border" strokeWidth={1.2} />
      <Icon x={-CARD_W / 2 + 5} y={-CARD_H / 2 + 7} size={11} className="text-muted-foreground" strokeWidth={2} />
      <rect x={-CARD_W / 2 + 18} y={-CARD_H / 2 + 8} width={13} height={3.5} rx={1.75} className="fill-muted-foreground/45" />
      <rect x={-CARD_W / 2 + 18} y={-CARD_H / 2 + 14} width={9} height={3.5} rx={1.75} className="fill-muted-foreground/30" />
      {done ? <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H} rx={5} className="fill-primary/15 stroke-primary/50" strokeWidth={1.2} /> : null}
    </g>
  )
}

export function Conveyor() {
  const { ref, active, reduce, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Конвейер: карточки-задачи, которые двигали рукой по одной, едут сами и складываются в стопки готовых этикеток, PDF и карточек товара"
    >
      {/* Лента и ролики */}
      <rect x={BELT.x} y={BELT.y} width={BELT.w} height={BELT.h} rx={8} className="fill-muted stroke-border" />
      <motion.line
        x1={BELT.x + 10}
        y1={BELT.y + BELT.h / 2}
        x2={BELT.x + BELT.w - 10}
        y2={BELT.y + BELT.h / 2}
        className="stroke-muted-foreground/40"
        strokeWidth={2}
        strokeDasharray="8 10"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: active && !reduce ? -216 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 3.2, delay: 1.1, ease: 'easeInOut' }}
      />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={BELT.x + 20 + i * 40} cy={BELT.y + BELT.h + 9} r={4} className="fill-background stroke-border" />
      ))}

      {/* Подписи входа и выхода. Пунктирная карточка остаётся: поток задач никуда
          не делся — он просто больше не проходит через руки. */}
      <motion.rect
        x={QUEUE.x - CARD_W / 2}
        y={QUEUE.y - CARD_H / 2}
        width={CARD_W}
        height={CARD_H}
        rx={5}
        fill="none"
        className="stroke-muted-foreground/50"
        strokeDasharray="3 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={tr(0.6, 3.6)}
      />
      <text x={QUEUE.x - 30} y={QUEUE.y + 36} className="fill-muted-foreground font-mono text-[8px] uppercase tracking-[0.18em]">
        рутина
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={tr(0.8, 3.4)}>
        {OUT.map((o) => (
          <text key={o.kind} x={o.x} y={o.y + 30} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px] uppercase tracking-[0.18em]">
            {o.label}
          </text>
        ))}
      </motion.g>

      {/* Карточки: стопка → лента → стопка готового */}
      {CARDS.map((c) => {
        const out = OUT[c.out]
        const ex = out.x + c.stackN * 3
        const ey = out.y - c.stackN * 5
        const first = c.i === 0
        // Первая карточка едет медленно «под рукой», потом рука исчезает и всё ускоряется.
        const delay = first ? 0 : 1.5 + (c.i - 1) * 0.26
        const duration = first ? 2.3 : 1.1
        const times = first ? [0, 0.5, 0.55, 0.88, 1] : [0, 0.14, 0.7, 1]
        const xs = first ? [c.sx, 150, 150, BELT.x + BELT.w - 14, ex] : [c.sx, c.sx + 40, BELT.x + BELT.w - 14, ex]
        const ys = first ? [c.sy, BELT_Y, BELT_Y, BELT_Y, ey] : [c.sy, BELT_Y, BELT_Y, ey]
        return (
          <g key={c.i}>
            <motion.g
              initial={{ x: c.sx, y: c.sy }}
              animate={active ? { x: xs, y: ys } : { x: c.sx, y: c.sy }}
              transition={reduce ? { duration: 0 } : { duration, delay, times, ease: 'easeInOut' }}
            >
              <Card kind={c.out} />
            </motion.g>
            {/* Копия «готово» проявляется уже в стопке */}
            <motion.g
              initial={{ opacity: 0, x: ex, y: ey }}
              animate={{ opacity: active ? 1 : 0, x: ex, y: ey }}
              transition={tr(0.4, delay + duration)}
            >
              <Card kind={c.out} done />
            </motion.g>
          </g>
        )
      })}

      {/* Рука: двигает первую карточку и исчезает */}
      <motion.g
        initial={{ x: QUEUE.x + 6, y: QUEUE.y + 6, opacity: 1 }}
        animate={
          active
            ? { x: [QUEUE.x + 6, 156, 156, 172], y: [QUEUE.y + 6, BELT_Y + 6, BELT_Y + 6, BELT_Y + 28], opacity: [1, 1, 1, 0] }
            : { x: QUEUE.x + 6, y: QUEUE.y + 6, opacity: 1 }
        }
        transition={reduce ? { duration: 0 } : { duration: 1.7, delay: 0, times: [0, 0.68, 0.75, 1], ease: 'easeInOut' }}
      >
        <Hand size={22} className="text-foreground" strokeWidth={1.8} />
      </motion.g>
    </svg>
  )
}
