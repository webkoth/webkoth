"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { StackNodeKey } from "@/app/data/evolution/types"
import { EASE } from "./animations/seeded"
import { useReducedMotionSafe } from "./animations/use-reduced-motion"

// Hero, правая колонка: «живая» схема работающей системы — Client → Frontend →
// Backend → ИИ-каскад → Queue → Worker → DB с бегущими метриками. Подписи узлов
// нарочно английские на обеих локалях: это терминальное окно и технические
// термины, а не текст страницы; описания узлов (tooltip) — в языке страницы.
// Поверх фонового потока пакетов по рёбрам идут «трассы» — отдельные запросы,
// которые проходят весь путь и по очереди подсвечивают узлы; раз в десяток секунд
// Agent #1 «падает», трафик уходит в фолбэк — и возвращается. Единственная, кроме
// поля частиц, зацикленная анимация — и она тоже про «система работает, а не застыла».

type NodeKey = StackNodeKey

type Variant =
  | "entry"
  | "frontend"
  | "hub"
  | "external"
  | "ai-hub"
  | "ai-primary"
  | "ai-fallback"
  | "queue"
  | "worker"
  | "store"

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
const ROW_GAP = 30
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
  {
    key: "client",
    label: "Client",
    tech: "",
    unit: "users",
    baseValue: 248,
    spread: 40,
    x: COL[0],
    y: ROW[0],
    variant: "entry",
  },
  {
    key: "frontend",
    label: "Frontend",
    tech: "Next.js",
    unit: "rps",
    baseValue: 62,
    spread: 30,
    x: COL[1],
    y: ROW[0],
    variant: "frontend",
  },
  {
    key: "backend",
    label: "Backend",
    tech: "",
    unit: "rps",
    baseValue: 96,
    spread: 40,
    x: COL[2],
    y: ROW[0],
    variant: "hub",
  },
  // Row 2: AI router (center) + external API (right sidecar to Backend)
  {
    key: "ai",
    label: "AI",
    tech: "",
    unit: "tok/s",
    baseValue: 340,
    spread: 160,
    x: COL[1],
    y: ROW[1],
    variant: "ai-hub",
  },
  {
    key: "api",
    label: "API",
    tech: "",
    unit: "calls/m",
    baseValue: 38,
    spread: 22,
    x: COL[2],
    y: ROW[1],
    variant: "external",
  },
  // Row 3: AI cascade
  {
    key: "ai1",
    label: "Agent #1",
    tech: "Claude",
    unit: "/min",
    baseValue: 54,
    spread: 24,
    x: COL[0],
    y: ROW[2],
    variant: "ai-primary",
  },
  {
    key: "ai2",
    label: "Agent #2",
    tech: "Gemini",
    unit: "/min",
    baseValue: 18,
    spread: 12,
    x: COL[1],
    y: ROW[2],
    variant: "ai-fallback",
  },
  {
    key: "ai3",
    label: "Agent #3",
    tech: "Groq",
    unit: "/min",
    baseValue: 6,
    spread: 5,
    x: COL[2],
    y: ROW[2],
    variant: "ai-fallback",
  },
  // Row 4: async data pipeline
  {
    key: "queue",
    label: "Queue",
    tech: "",
    unit: "queued",
    baseValue: 12,
    spread: 18,
    x: COL[0],
    y: ROW[3],
    variant: "queue",
  },
  {
    key: "worker",
    label: "Worker",
    tech: "",
    unit: "/min",
    baseValue: 28,
    spread: 16,
    x: COL[1],
    y: ROW[3],
    variant: "worker",
  },
  {
    key: "db",
    label: "DB",
    tech: "",
    unit: "qps",
    baseValue: 215,
    spread: 90,
    x: COL[2],
    y: ROW[3],
    variant: "store",
  },
]

const VARIANT_STYLES: Record<Variant, string> = {
  entry: "bg-sky-500/5 border-sky-500/40",
  frontend: "bg-sky-500/5 border-sky-500/30",
  hub: "bg-card border-border",
  external:
    "bg-transparent border-dashed border-foreground/40 text-foreground/80",
  "ai-hub": "bg-primary/20 border-primary",
  "ai-primary": "bg-primary/10 border-primary/40",
  "ai-fallback": "bg-primary/5 border-primary/30",
  queue: "bg-amber-500/5 border-amber-500/40",
  worker: "bg-muted/40 border-border",
  store: "bg-card border-border",
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

type Edge = {
  id: string
  from: NodeKey
  to: NodeKey
  d: string
  speed: number
  tone: string
}

const edge = (
  from: NodeKey,
  to: NodeKey,
  d: string,
  speed: number,
  tone: string
): Edge => ({
  id: `${from}→${to}`,
  from,
  to,
  d,
  speed,
  tone,
})

const EDGES: Edge[] = [
  // Top entry chain
  edge(
    "client",
    "frontend",
    lateral("client", "frontend"),
    1.7,
    "fill-sky-500"
  ),
  edge(
    "frontend",
    "backend",
    lateral("frontend", "backend"),
    1.9,
    "fill-sky-400"
  ),
  // Backend ↔ External API (bidirectional via two offset lines)
  edge(
    "backend",
    "api",
    downOffset("backend", "api", -6),
    2.0,
    "fill-foreground/55"
  ),
  edge(
    "api",
    "backend",
    upOffset("api", "backend", 6),
    2.2,
    "fill-foreground/55"
  ),
  // Backend → central AI
  edge("backend", "ai", down("backend", "ai"), 2.2, "fill-primary"),
  // AI router fans out
  edge("ai", "ai1", down("ai", "ai1"), 2.4, "fill-primary"),
  edge("ai", "ai2", down("ai", "ai2"), 2.4, "fill-primary/80"),
  edge("ai", "ai3", down("ai", "ai3"), 2.4, "fill-primary/70"),
  // RAG / context: DB feeds back into the third agent
  edge("db", "ai3", up("db", "ai3"), 2.8, "fill-sky-500"),
  // All agents enqueue results
  edge("ai1", "queue", down("ai1", "queue"), 2.6, "fill-amber-500"),
  edge("ai2", "queue", down("ai2", "queue"), 2.8, "fill-amber-500/80"),
  edge("ai3", "queue", down("ai3", "queue"), 3.0, "fill-amber-500/70"),
  // Async pipeline
  edge("queue", "worker", lateral("queue", "worker"), 2.0, "fill-amber-500"),
  edge("worker", "db", lateral("worker", "db"), 2.0, "fill-foreground/70"),
]

const edgeBetween = (from: NodeKey, to: NodeKey) =>
  EDGES.find((e) => e.from === from && e.to === to)

const isAdjacent = (a: NodeKey, b: NodeKey) =>
  EDGES.some(
    (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)
  )

// ─── Трассы запросов ──────────────────────────────────────────

// Маршруты одного запроса через систему. Вес — частота; `fallback` — куда уходит
// трафик Agent #1, пока он лежит.
type Route = { path: NodeKey[]; weight: number; tone: string }

const ROUTES: Route[] = [
  {
    path: [
      "client",
      "frontend",
      "backend",
      "ai",
      "ai1",
      "queue",
      "worker",
      "db",
    ],
    weight: 5,
    tone: "fill-primary",
  },
  {
    path: [
      "client",
      "frontend",
      "backend",
      "ai",
      "ai2",
      "queue",
      "worker",
      "db",
    ],
    weight: 1.5,
    tone: "fill-primary",
  },
  {
    path: [
      "client",
      "frontend",
      "backend",
      "ai",
      "ai3",
      "queue",
      "worker",
      "db",
    ],
    weight: 1.5,
    tone: "fill-primary",
  },
  {
    path: ["client", "frontend", "backend", "api", "backend"],
    weight: 2,
    tone: "fill-sky-500",
  },
]
const FALLBACK_ROUTE: Route = {
  path: ["client", "frontend", "backend", "ai", "ai2", "queue", "worker", "db"],
  weight: 0,
  tone: "fill-amber-500",
}

/** Скорость трассы относительно фонового пакета на том же ребре: запрос «пролетает». */
const TRACE_SPEED = 0.42
/** Пауза между трассами, мс. */
const TRACE_GAP_MIN = 2500
const TRACE_GAP_MAX = 4000
/** Сколько горит узел, когда трасса до него дошла, мс. */
const LIT_MS = 380
/** Инцидент: период, длительность падения и вспышки восстановления, мс. */
const INCIDENT_GAP_MIN = 12_000
const INCIDENT_GAP_MAX = 18_000
const INCIDENT_DOWN_MS = 2200
const INCIDENT_RECOVER_MS = 700

type Hop = { d: string; start: number; dur: number; to: NodeKey }
type Trace = { id: number; hops: Hop[]; tone: string }

function pickRoute(incident: boolean): Route {
  const total = ROUTES.reduce((s, r) => s + r.weight, 0)
  let r = Math.random() * total
  for (const route of ROUTES) {
    r -= route.weight
    if (r <= 0)
      return incident && route.path.includes("ai1") ? FALLBACK_ROUTE : route
  }
  return ROUTES[0]
}

type Timers = { later: (fn: () => void, ms: number) => void; clear: () => void }

function makeTimers(): Timers {
  const ids = new Set<number>()
  return {
    later(fn, ms) {
      const id = window.setTimeout(() => {
        ids.delete(id)
        fn()
      }, ms)
      ids.add(id)
    },
    clear() {
      ids.forEach((id) => window.clearTimeout(id))
      ids.clear()
    },
  }
}

// Трассы: раз в 2.5–4 с собирается маршрут, его рёбра превращаются в цепочку
// <animateMotion> с абсолютными begin по таймлайну SVG (getCurrentTime), а
// подсветка узлов идёт по тем же длительностям через setTimeout. Состояние
// меняется только по событиям — ни одного setState на кадр.
function useTraces(
  active: boolean,
  reduce: boolean | null,
  svgRef: React.RefObject<SVGSVGElement | null>,
  incidentRef: React.RefObject<boolean>
) {
  const [traces, setTraces] = useState<Trace[]>([])
  const [lit, setLit] = useState<Partial<Record<NodeKey, number>>>({})

  useEffect(() => {
    if (!active || reduce) return
    const t = makeTimers()
    let seq = 0
    const bump = (k: NodeKey, delta: 1 | -1) =>
      setLit((prev) => ({ ...prev, [k]: Math.max(0, (prev[k] ?? 0) + delta) }))

    const spawn = () => {
      const svg = svgRef.current
      if (svg && typeof svg.getCurrentTime === "function") {
        const route = pickRoute(incidentRef.current)
        const t0 = svg.getCurrentTime()
        const hops: Hop[] = []
        let acc = 0
        for (let i = 0; i < route.path.length - 1; i++) {
          const e = edgeBetween(route.path[i], route.path[i + 1])
          if (!e) continue
          const dur = e.speed * TRACE_SPEED
          hops.push({ d: e.d, start: t0 + acc, dur, to: route.path[i + 1] })
          acc += dur
        }
        const id = ++seq
        setTraces((prev) => [...prev, { id, hops, tone: route.tone }])

        bump(route.path[0], 1)
        t.later(() => bump(route.path[0], -1), LIT_MS)
        let ms = 0
        for (const hop of hops) {
          ms += hop.dur * 1000
          const k = hop.to
          t.later(() => {
            bump(k, 1)
            t.later(() => bump(k, -1), LIT_MS)
          }, ms)
        }
        t.later(
          () => setTraces((prev) => prev.filter((x) => x.id !== id)),
          ms + 400
        )
      }
      t.later(
        spawn,
        TRACE_GAP_MIN + Math.random() * (TRACE_GAP_MAX - TRACE_GAP_MIN)
      )
    }

    t.later(spawn, 900)
    return () => t.clear()
  }, [active, reduce, svgRef, incidentRef])

  return { traces, lit }
}

type IncidentPhase = "ok" | "down" | "recovered"

// Инцидент: Agent #1 падает на пару секунд, трафик уходит в Agent #2, потом
// короткая зелёная вспышка — «система пережила». Не тревога, а демонстрация.
function useIncident(active: boolean, reduce: boolean | null) {
  const [phase, setPhase] = useState<IncidentPhase>("ok")
  const downRef = useRef(false)

  useEffect(() => {
    if (!active || reduce) return
    const t = makeTimers()
    const schedule = () =>
      t.later(
        () => {
          downRef.current = true
          setPhase("down")
          t.later(() => {
            downRef.current = false
            setPhase("recovered")
            t.later(() => {
              setPhase("ok")
              schedule()
            }, INCIDENT_RECOVER_MS)
          }, INCIDENT_DOWN_MS)
        },
        INCIDENT_GAP_MIN + Math.random() * (INCIDENT_GAP_MAX - INCIDENT_GAP_MIN)
      )
    schedule()
    return () => {
      t.clear()
      downRef.current = false
    }
  }, [active, reduce])

  return { phase, downRef }
}

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

// ─── Equalizer ────────────────────────────────────────────────

const EQ_DOTS: { color: string; threshold: Load }[] = [
  { color: "bg-emerald-500", threshold: 1 },
  { color: "bg-yellow-500", threshold: 2 },
  { color: "bg-red-500", threshold: 3 },
]

function Equalizer({ load, down }: { load: Load; down?: boolean }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {EQ_DOTS.map((d, i) => {
        const active = down || load >= d.threshold
        return (
          <span
            key={i}
            className={cn(
              "size-[5px] rounded-full transition-colors duration-300",
              down ? "bg-red-500" : d.color,
              active ? "animate-pulse opacity-100" : "opacity-15"
            )}
            style={active ? { animationDelay: `${i * 120}ms` } : undefined}
          />
        )
      })}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────

// Карточка узла — триггер tooltip (кнопка: доступна с клавиатуры). Состояния:
// lit — трасса дошла до узла, dimmed — наведён другой, несвязанный узел,
// down / recovered — инцидент на Agent #1.
function NodeCard({
  node,
  state,
  description,
  lit,
  dimmed,
  down,
  recovered,
  onHover,
}: {
  node: Node
  state: NodeState
  description: string
  lit: boolean
  dimmed: boolean
  down: boolean
  recovered: boolean
  onHover: (k: NodeKey | null) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-label={`${node.label}${node.tech ? ` · ${node.tech}` : ""}`}
        onMouseEnter={() => onHover(node.key)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(node.key)}
        onBlur={() => onHover(null)}
        className={cn(
          "flex h-full w-full flex-col justify-center gap-0.5 rounded-xl border px-2.5 text-left shadow-sm outline-none",
          "transition-[opacity,transform,box-shadow,border-color,background-color] duration-300",
          "focus-visible:ring-2 focus-visible:ring-primary/50",
          VARIANT_STYLES[node.variant],
          dimmed && "opacity-50",
          lit && "scale-[1.03] shadow-md ring-2 ring-primary/60",
          down && "border-destructive/60 bg-destructive/5",
          recovered && "ring-2 ring-emerald-500/70"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] leading-tight font-semibold tracking-tight text-foreground">
            {node.label}
          </span>
          <Equalizer load={state.load} down={down} />
        </div>
        <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] leading-tight">
          {node.tech ? (
            <span className="truncate text-muted-foreground">{node.tech}</span>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-foreground/80 tabular-nums">
            {down ? "—" : state.value}
            <span className="ml-0.5 text-muted-foreground">{node.unit}</span>
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[16rem] border border-primary/40 bg-primary p-3 text-left text-[13px] leading-snug whitespace-normal text-primary-foreground shadow-lg"
      >
        {description}
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Main ─────────────────────────────────────────────────────

export function ProductionStack({
  delay = 0,
  copy,
  showStatus = true,
}: {
  delay?: number
  copy: { hint: string; nodes: Record<StackNodeKey, string> }
  /** Строка статуса под схемой (live · инцидент · подсказка). В hero-подложке она не нужна. */
  showStatus?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  // Появление — один раз; активность циклов — пока схема на экране.
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const visible = useInView(ref, { amount: 0.2 })
  const active = inView && visible
  const reduce = useReducedMotionSafe()
  const liveState = useLiveState(active, reduce)
  const initial = useMemo(() => initialState(), [])
  const { phase, downRef } = useIncident(active, reduce)
  const { traces, lit } = useTraces(active, reduce, svgRef, downRef)
  const [hovered, setHovered] = useState<NodeKey | null>(null)

  const incident = phase === "down"

  return (
    <TooltipProvider delay={120}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }
        }
        className="relative w-full"
      >
        {/* Без «окна»: схема лежит прямо на фоне, под ней — одна строка статуса. */}
        <div>
          <div>
            <div
              className="relative mx-auto w-full"
              style={{ aspectRatio: `${W} / ${H}` }}
            >
              <svg
                ref={svgRef}
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
                    <path
                      d="M0,0 L10,5 L0,10 z"
                      className="fill-foreground/55"
                    />
                  </marker>
                  <filter
                    id="svc-glow"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                  >
                    <feGaussianBlur stdDeviation="2.4" />
                  </filter>
                </defs>

                {EDGES.map((e) => {
                  const touching =
                    hovered != null && (e.from === hovered || e.to === hovered)
                  const dimmedEdge = hovered != null && !touching
                  // Инцидент: по ai→ai1 трафика нет, ai→ai2 пульсирует янтарным.
                  const failover = incident && e.id === "ai→ai2"
                  const noTraffic = incident && e.id === "ai→ai1"
                  return (
                    <g key={e.id}>
                      <path
                        d={e.d}
                        fill="none"
                        strokeWidth={touching || failover ? 2 : 1.5}
                        strokeLinecap="round"
                        className={cn(
                          "transition-[stroke,opacity,stroke-width] duration-300",
                          touching
                            ? "stroke-primary"
                            : dimmedEdge
                              ? "stroke-foreground/10"
                              : "stroke-foreground/30",
                          failover && "animate-pulse stroke-amber-500"
                        )}
                        strokeDasharray="4 4"
                        markerEnd="url(#svc-arrow-eq)"
                      >
                        {!reduce && (
                          <animate
                            attributeName="stroke-dashoffset"
                            from="0"
                            to="-16"
                            dur="1.0s"
                            repeatCount="indefinite"
                          />
                        )}
                      </path>
                      {!reduce && (
                        <circle
                          r={3.5}
                          className={cn(
                            "transition-opacity duration-300",
                            failover ? "fill-amber-500" : e.tone,
                            (dimmedEdge || noTraffic) &&
                              (noTraffic ? "opacity-0" : "opacity-25")
                          )}
                        >
                          <animateMotion
                            dur={`${e.speed}s`}
                            repeatCount="indefinite"
                            path={e.d}
                            rotate="auto"
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}

                {/* Трассы: каждый хоп — <g>, видимый только в своём интервале; begin — абсолютное время таймлайна SVG. */}
                {traces.map((tr) => (
                  <g key={tr.id}>
                    {tr.hops.map((hop, i) => (
                      <g key={i} visibility="hidden">
                        <set
                          attributeName="visibility"
                          to="visible"
                          begin={`${hop.start}s`}
                          dur={`${hop.dur}s`}
                          fill="remove"
                        />
                        <animateMotion
                          begin={`${hop.start}s`}
                          dur={`${hop.dur}s`}
                          path={hop.d}
                          rotate="auto"
                          fill="remove"
                        />
                        <circle
                          r={8}
                          className={tr.tone}
                          opacity={0.35}
                          filter="url(#svc-glow)"
                        />
                        <circle r={4.5} className={tr.tone} />
                        <circle
                          r={1.8}
                          className="fill-primary-foreground"
                          opacity={0.9}
                        />
                      </g>
                    ))}
                  </g>
                ))}

                {NODES.map((node) => {
                  const dimmed =
                    hovered != null &&
                    hovered !== node.key &&
                    !isAdjacent(hovered, node.key)
                  const isAgent1 = node.key === "ai1"
                  return (
                    <foreignObject
                      key={node.key}
                      x={node.x}
                      y={node.y}
                      width={NW}
                      height={NH}
                      className="overflow-visible"
                    >
                      <NodeCard
                        node={node}
                        state={liveState[node.key] ?? initial[node.key]}
                        description={copy.nodes[node.key]}
                        lit={(lit[node.key] ?? 0) > 0}
                        dimmed={dimmed}
                        down={isAgent1 && incident}
                        recovered={isAgent1 && phase === "recovered"}
                        onHover={setHovered}
                      />
                    </foreignObject>
                  )
                })}
              </svg>
            </div>
            {showStatus ? (
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="size-1.5 animate-pulse rounded-full bg-emerald-500"
                    aria-hidden
                  />
                  live
                </span>
                <span className="text-foreground/40">·</span>
                {phase === "down" ? (
                  <span className="text-amber-500">failover → Agent #2</span>
                ) : phase === "recovered" ? (
                  <span className="text-emerald-500">Agent #1 recovered</span>
                ) : (
                  <span>0 downtime</span>
                )}
                <span className="text-foreground/40">·</span>
                <span>{copy.hint}</span>
              </p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
