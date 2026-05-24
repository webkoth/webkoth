'use client'

import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type NodeKey = 'browser' | 'next' | 'hubmarketAi' | 'claude' | 'gemini' | 'groq'
type Variant = 'default' | 'proc' | 'ai-primary' | 'ai-soft'

interface Node {
  key: NodeKey
  x: number
  y: number
  label: string
  sub: string
  variant: Variant
}

interface Edge {
  from: NodeKey
  to: NodeKey
  d: string
  speed: number
  branch: NodeKey[]
}

const NW = 104
const NH = 38

const COL_X = [6, 134, 262, 400, 400, 400] as const
const ROWS = { TOP: 8, MID: 64, MID2: 112, MID3: 160 } as const

const W = 510
const H = 206

const NODES: Node[] = [
  { key: 'browser',     x: COL_X[0], y: ROWS.MID,  label: 'Browser',    sub: 'клиент формы',         variant: 'default' },
  { key: 'next',        x: COL_X[1], y: ROWS.MID,  label: 'Next.js',    sub: '/api/ai/polish',       variant: 'proc' },
  { key: 'hubmarketAi', x: COL_X[2], y: ROWS.MID,  label: 'hubmarket-ai', sub: 'Hono · Bearer auth', variant: 'proc' },
  { key: 'claude',      x: COL_X[3], y: ROWS.TOP,  label: 'Claude',      sub: 'primary',             variant: 'ai-primary' },
  { key: 'gemini',      x: COL_X[4], y: ROWS.MID2, label: 'Gemini',      sub: 'fallback 1',          variant: 'ai-soft' },
  { key: 'groq',        x: COL_X[5], y: ROWS.MID3, label: 'Groq',        sub: 'fallback 2',          variant: 'ai-soft' },
]

const nodeBy = (k: NodeKey) => NODES.find((n) => n.key === k)!
const cr = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 })
const cl = (n: Node) => ({ x: n.x, y: n.y + NH / 2 })

function line(from: NodeKey, to: NodeKey): string {
  const a = cr(nodeBy(from))
  const b = cl(nodeBy(to))
  if (a.y === b.y) return `M${a.x},${a.y} L${b.x},${b.y}`
  const midX = (a.x + b.x) / 2
  return `M${a.x},${a.y} C${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`
}

const EDGES: Edge[] = [
  { from: 'browser',     to: 'next',        d: line('browser', 'next'),        speed: 2.6, branch: ['next', 'hubmarketAi', 'claude', 'gemini', 'groq'] },
  { from: 'next',        to: 'hubmarketAi', d: line('next', 'hubmarketAi'),    speed: 2.6, branch: ['hubmarketAi', 'claude', 'gemini', 'groq'] },
  { from: 'hubmarketAi', to: 'claude',      d: line('hubmarketAi', 'claude'),  speed: 2.6, branch: ['claude'] },
  { from: 'hubmarketAi', to: 'gemini',      d: line('hubmarketAi', 'gemini'),  speed: 3.2, branch: ['gemini'] },
  { from: 'hubmarketAi', to: 'groq',        d: line('hubmarketAi', 'groq'),    speed: 3.4, branch: ['groq'] },
]

const VARIANT_STYLES: Record<Variant, string> = {
  default: 'bg-card border-border',
  proc: 'bg-sky-500/5 border-sky-500/50',
  'ai-primary': 'bg-primary/10 border-primary',
  'ai-soft': 'bg-primary/5 border-primary/40',
}

export function FlowDiagram() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<NodeKey | null>(null)

  const isEdgeActive = (e: Edge) =>
    hovered == null || e.from === hovered || e.to === hovered || e.branch.includes(hovered)
  const isNodeActive = (k: NodeKey) => {
    if (hovered == null) return true
    if (hovered === k) return true
    return EDGES.some((e) => e.from === hovered && (e.to === k || e.branch.includes(k)))
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-background/60">
      <div className="px-2 py-3 md:px-3 md:py-4">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Поток запроса polish: Browser → Next.js → hubmarket-ai → cascade Claude/Gemini/Groq"
          >
            <defs>
              <marker
                id="flow-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" className="fill-foreground/45" />
              </marker>
            </defs>

            {EDGES.map((e, i) => {
              const active = isEdgeActive(e)
              return (
                <g key={`edge-${i}`}>
                  <path
                    d={e.d}
                    fill="none"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    className={
                      'transition-[stroke,opacity] duration-300 ' +
                      (active ? 'stroke-foreground/40' : 'stroke-foreground/10')
                    }
                    strokeDasharray="5 5"
                    markerEnd="url(#flow-arrow)"
                  >
                    {!reduce && (
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-20"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    )}
                  </path>
                  {!reduce && active && (
                    <circle r={3.5} className="fill-primary">
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

            {NODES.map((n) => {
              const active = isNodeActive(n.key)
              const isHovered = hovered === n.key
              return (
                <foreignObject key={n.key} x={n.x} y={n.y} width={NW} height={NH}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(n.key)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(n.key)}
                    onBlur={() => setHovered(null)}
                    className={
                      'flex h-full w-full flex-col items-center justify-center rounded-xl border px-2 py-1 text-center shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 ' +
                      VARIANT_STYLES[n.variant] +
                      (active ? ' opacity-100' : ' opacity-35') +
                      (isHovered ? ' shadow-md' : '')
                    }
                  >
                    <span className="text-[11px] font-semibold leading-tight md:text-xs">
                      {n.label}
                    </span>
                    <span className="font-mono text-[8px] text-muted-foreground md:text-[9px]">
                      {n.sub}
                    </span>
                  </button>
                </foreignObject>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
