'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE } from './animations/seeded'

// Hero, правая колонка: «живая» схема работающей системы — Client → Frontend →
// Backend → ИИ-каскад → Queue → Worker → DB с бегущими метриками. Подписи узлов
// нарочно английские на обеих локалях: это терминальное окно и технические
// термины, а не текст страницы. Единственная, кроме поля частиц, зацикленная
// анимация — и она тоже про «система работает, а не застыла».

type NodeKey =
  | 'client'
  | 'frontend'
  | 'backend'
  | 'api'
  | 'ai'
  | 'ai1'
  | 'ai2'
  | 'ai3'
  | 'queue'
  | 'worker'
  | 'db'

type Variant =
  | 'entry'
  | 'frontend'
  | 'hub'
  | 'external'
  | 'ai-hub'
  | 'ai-primary'
  | 'ai-fallback'
  | 'queue'
  | 'worker'
  | 'store'

type Node = {
  key: NodeKey
  label: string
  tech: string
  unit: string
  baseValue: number
  spread: number
  x: number
  y: number
  variant: Variant
}

const NW = 124
const NH = 56
const COL_GAP = 24
const ROW_GAP = 40
const PAD_X = 16
const PAD_Y = 14

const COL: number[] = [PAD_X, PAD_X + NW + COL_GAP, PAD_X + 2 * (NW + COL_GAP)]
const ROW: number[] = [
  PAD_Y,
  PAD_Y + NH + ROW_GAP,
  PAD_Y + 2 * (NH + ROW_GAP),
  PAD_Y + 3 * (NH + ROW_GAP),
]

const W = PAD_X * 2 + 3 * NW + 2 * COL_GAP
const H = PAD_Y * 2 + 4 * NH + 3 * ROW_GAP

const NODES: Node[] = [
  // Row 1: entry chain
  { key: 'client', label: 'Client', tech: '', unit: 'users', baseValue: 248, spread: 40, x: COL[0], y: ROW[0], variant: 'entry' },
  { key: 'frontend', label: 'Frontend', tech: 'Next.js', unit: 'rps', baseValue: 62, spread: 30, x: COL[1], y: ROW[0], variant: 'frontend' },
  { key: 'backend', label: 'Backend', tech: '', unit: 'rps', baseValue: 96, spread: 40, x: COL[2], y: ROW[0], variant: 'hub' },
  // Row 2: AI router (center) + external API (right sidecar to Backend)
  { key: 'ai', label: 'AI', tech: '', unit: 'tok/s', baseValue: 340, spread: 160, x: COL[1], y: ROW[1], variant: 'ai-hub' },
  { key: 'api', label: 'API', tech: '', unit: 'calls/m', baseValue: 38, spread: 22, x: COL[2], y: ROW[1], variant: 'external' },
  // Row 3: AI cascade
  { key: 'ai1', label: 'Agent #1', tech: 'Claude', unit: '/min', baseValue: 54, spread: 24, x: COL[0], y: ROW[2], variant: 'ai-primary' },
  { key: 'ai2', label: 'Agent #2', tech: 'Gemini', unit: '/min', baseValue: 18, spread: 12, x: COL[1], y: ROW[2], variant: 'ai-fallback' },
  { key: 'ai3', label: 'Agent #3', tech: 'Groq', unit: '/min', baseValue: 6, spread: 5, x: COL[2], y: ROW[2], variant: 'ai-fallback' },
  // Row 4: async data pipeline
  { key: 'queue', label: 'Queue', tech: '', unit: 'queued', baseValue: 12, spread: 18, x: COL[0], y: ROW[3], variant: 'queue' },
  { key: 'worker', label: 'Worker', tech: '', unit: '/min', baseValue: 28, spread: 16, x: COL[1], y: ROW[3], variant: 'worker' },
  { key: 'db', label: 'DB', tech: '', unit: 'qps', baseValue: 215, spread: 90, x: COL[2], y: ROW[3], variant: 'store' },
]

const VARIANT_STYLES: Record<Variant, string> = {
  entry: 'bg-sky-500/5 border-sky-500/40',
  frontend: 'bg-sky-500/5 border-sky-500/30',
  hub: 'bg-card border-border',
  external: 'bg-transparent border-dashed border-foreground/40 text-foreground/80',
  'ai-hub': 'bg-primary/20 border-primary',
  'ai-primary': 'bg-primary/10 border-primary/40',
  'ai-fallback': 'bg-primary/5 border-primary/30',
  queue: 'bg-amber-500/5 border-amber-500/40',
  worker: 'bg-muted/40 border-border',
  store: 'bg-card border-border',
}

const centerR = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 })
const centerL = (n: Node) => ({ x: n.x, y: n.y + NH / 2 })
const centerB = (n: Node) => ({ x: n.x + NW / 2, y: n.y + NH })
const centerT = (n: Node) => ({ x: n.x + NW / 2, y: n.y })

function n(k: NodeKey) {
  return NODES.find((x) => x.key === k)!
}

function lateral(from: NodeKey, to: NodeKey): string {
  const a = centerR(n(from))
  const b = centerL(n(to))
  return `M${a.x},${a.y} L${b.x},${b.y}`
}

function down(from: NodeKey, to: NodeKey): string {
  const a = centerB(n(from))
  const b = centerT(n(to))
  const midY = (a.y + b.y) / 2
  return `M${a.x},${a.y} C${a.x},${midY} ${b.x},${midY} ${b.x},${b.y}`
}

// Upward: from top of a lower node to bottom of a higher node.
function up(from: NodeKey, to: NodeKey): string {
  const a = centerT(n(from))
  const b = centerB(n(to))
  const midY = (a.y + b.y) / 2
  return `M${a.x},${a.y} C${a.x},${midY} ${b.x},${midY} ${b.x},${b.y}`
}

// Backend ↔ API: two short vertical lines offset side-by-side so we can render
// arrows going in opposite directions.
function downOffset(from: NodeKey, to: NodeKey, dx: number): string {
  const a = centerB(n(from))
  const b = centerT(n(to))
  return `M${a.x + dx},${a.y} L${b.x + dx},${b.y}`
}
function upOffset(from: NodeKey, to: NodeKey, dx: number): string {
  const a = centerT(n(from))
  const b = centerB(n(to))
  return `M${a.x + dx},${a.y} L${b.x + dx},${b.y}`
}

type Edge = { id: string; d: string; speed: number; tone: string }

const EDGES: Edge[] = [
  // Top entry chain
  { id: 'client→frontend', d: lateral('client', 'frontend'), speed: 1.7, tone: 'fill-sky-500' },
  { id: 'frontend→backend', d: lateral('frontend', 'backend'), speed: 1.9, tone: 'fill-sky-400' },
  // Backend ↔ External API (bidirectional via two offset lines)
  { id: 'backend→api', d: downOffset('backend', 'api', -6), speed: 2.0, tone: 'fill-foreground/55' },
  { id: 'api→backend', d: upOffset('api', 'backend', 6), speed: 2.2, tone: 'fill-foreground/55' },
  // Backend → central AI
  { id: 'backend→ai', d: down('backend', 'ai'), speed: 2.2, tone: 'fill-primary' },
  // AI router fans out
  { id: 'ai→ai1', d: down('ai', 'ai1'), speed: 2.4, tone: 'fill-primary' },
  { id: 'ai→ai2', d: down('ai', 'ai2'), speed: 2.4, tone: 'fill-primary/80' },
  { id: 'ai→ai3', d: down('ai', 'ai3'), speed: 2.4, tone: 'fill-primary/70' },
  // RAG / context: DB feeds back into the third agent
  { id: 'db→ai3', d: up('db', 'ai3'), speed: 2.8, tone: 'fill-sky-500' },
  // All agents enqueue results
  { id: 'ai1→queue', d: down('ai1', 'queue'), speed: 2.6, tone: 'fill-amber-500' },
  { id: 'ai2→queue', d: down('ai2', 'queue'), speed: 2.8, tone: 'fill-amber-500/80' },
  { id: 'ai3→queue', d: down('ai3', 'queue'), speed: 3.0, tone: 'fill-amber-500/70' },
  // Async pipeline
  { id: 'queue→worker', d: lateral('queue', 'worker'), speed: 2.0, tone: 'fill-amber-500' },
  { id: 'worker→db', d: lateral('worker', 'db'), speed: 2.0, tone: 'fill-foreground/70' },
]

// ─── Live state ───────────────────────────────────────────────

type Load = 1 | 2 | 3
type NodeState = { load: Load; value: number }

function pickLoad(): Load {
  const r = Math.random()
  if (r < 0.6) return 1
  if (r < 0.88) return 2
  return 3
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function initialState(): Record<NodeKey, NodeState> {
  const acc = {} as Record<NodeKey, NodeState>
  for (const node of NODES) {
    acc[node.key] = { load: 1, value: node.baseValue }
  }
  return acc
}

function useLiveState(active: boolean, reduce: boolean | null) {
  const [state, setState] = useState<Record<NodeKey, NodeState>>(initialState)

  useEffect(() => {
    if (!active || reduce) return
    const id = window.setInterval(() => {
      setState((prev) => {
        const next = { ...prev }
        for (const node of NODES) {
          const cur = prev[node.key]
          const lo = Math.max(0, node.baseValue - node.spread)
          const hi = node.baseValue + node.spread
          const jitter = Math.round((Math.random() - 0.5) * node.spread * 0.6)
          const value = clamp(cur.value + jitter, lo, hi)
          next[node.key] = { load: pickLoad(), value }
        }
        return next
      })
    }, 1800)
    return () => window.clearInterval(id)
  }, [active, reduce])

  return state
}

function useFooterTicker(active: boolean, reduce: boolean | null) {
  const [calls, setCalls] = useState(12_847)
  useEffect(() => {
    if (!active || reduce) return
    const id = window.setInterval(() => {
      setCalls((c) => c + Math.floor(1 + Math.random() * 5))
    }, 1800)
    return () => window.clearInterval(id)
  }, [active, reduce])
  return calls
}

// ─── Equalizer ────────────────────────────────────────────────

const EQ_DOTS: { color: string; threshold: Load }[] = [
  { color: 'bg-emerald-500', threshold: 1 },
  { color: 'bg-yellow-500', threshold: 2 },
  { color: 'bg-red-500', threshold: 3 },
]

function Equalizer({ load }: { load: Load }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {EQ_DOTS.map((d, i) => {
        const active = load >= d.threshold
        return (
          <span
            key={i}
            className={cn(
              'size-[5px] rounded-full transition-opacity duration-300',
              d.color,
              active ? 'animate-pulse opacity-100' : 'opacity-15',
            )}
            style={active ? { animationDelay: `${i * 120}ms` } : undefined}
          />
        )
      })}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────

function NodeCard({ node, state }: { node: Node; state: NodeState }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-center gap-0.5 rounded-xl border px-2.5 shadow-sm',
        VARIANT_STYLES[node.variant],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-semibold leading-tight tracking-tight text-foreground">
          {node.label}
        </span>
        <Equalizer load={state.load} />
      </div>
      <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] leading-tight">
        {node.tech ? <span className="truncate text-muted-foreground">{node.tech}</span> : <span />}
        <span className="shrink-0 tabular-nums text-foreground/80">
          {state.value}
          <span className="ml-0.5 text-muted-foreground">{node.unit}</span>
        </span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────

export function ProductionStack({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const liveState = useLiveState(inView, reduce)
  const calls = useFooterTicker(inView, reduce)
  const initial = useMemo(() => initialState(), [])

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }}
      className="relative w-full"
    >
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-3xl opacity-50 blur-3xl"
        style={{ background: 'color-mix(in oklab, var(--primary) 28%, transparent)' }}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">production-stack</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            live
          </span>
        </div>

        {/* Diagram */}
        <div className="p-3 md:p-4">
          <div className="relative mx-auto w-full" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="svc-arrow-eq"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="9"
                  markerHeight="9"
                  markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-foreground/55" />
                </marker>
              </defs>

              {EDGES.map((e) => (
                <g key={e.id}>
                  <path
                    d={e.d}
                    fill="none"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    className="stroke-foreground/30"
                    strokeDasharray="4 4"
                    markerEnd="url(#svc-arrow-eq)"
                  >
                    {!reduce && (
                      <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.0s" repeatCount="indefinite" />
                    )}
                  </path>
                  {!reduce && (
                    <circle r={3.5} className={e.tone}>
                      <animateMotion dur={`${e.speed}s`} repeatCount="indefinite" path={e.d} rotate="auto" />
                    </circle>
                  )}
                </g>
              ))}

              {NODES.map((node) => (
                <foreignObject key={node.key} x={node.x} y={node.y} width={NW} height={NH}>
                  <NodeCard node={node} state={liveState[node.key] ?? initial[node.key]} />
                </foreignObject>
              ))}
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-5 py-3 font-mono text-xs text-muted-foreground">
          <span className="text-emerald-500">✓</span>
          <span className="tabular-nums">{calls.toLocaleString('en-US')}</span>
          <span>req</span>
          <span className="text-foreground/40">·</span>
          <span>p99 180ms</span>
          <span className="text-foreground/40">·</span>
          <span>0 downtime</span>
        </div>
      </div>
    </motion.div>
  )
}
