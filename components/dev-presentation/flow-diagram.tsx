'use client'

import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

type NodeKey =
  | 'browser'
  | 'nextProxy'
  | 'aiService'
  | 'claude'
  | 'gemini'
  | 'groq'
  | 'response'

type Variant = 'default' | 'ai-primary' | 'ai-soft' | 'proc' | 'out'

type Node = {
  key: NodeKey
  x: number
  y: number
  label: string
  sub?: string
  variant: Variant
}

type Edge = {
  from: NodeKey
  to: NodeKey
  d: string
  speed: number
  branch: NodeKey[]
}

const NW = 132
const NH = 54
const COL_GAP = 36
const COL: Record<number, number> = {
  0: 24,
  1: 24 + (NW + COL_GAP),
  2: 24 + 2 * (NW + COL_GAP),
  3: 24 + 3 * (NW + COL_GAP),
  4: 24 + 4 * (NW + COL_GAP),
}
const ROW_TOP = 24
const ROW_MID = 116
const ROW_BOT = 208

const W = COL[4] + NW + 24
const H = ROW_BOT + NH + 36

const NODES: Node[] = [
  { key: 'browser',   x: COL[0], y: ROW_MID, label: 'Browser',      sub: 'клиент формы',          variant: 'default' },
  { key: 'nextProxy', x: COL[1], y: ROW_MID, label: 'Next.js',      sub: '/api/ai/polish',         variant: 'proc' },
  { key: 'aiService', x: COL[2], y: ROW_MID, label: 'hubmarket-ai', sub: 'Hono · Bearer',          variant: 'proc' },
  { key: 'claude',    x: COL[3], y: ROW_TOP, label: 'Claude',       sub: 'primary',                variant: 'ai-primary' },
  { key: 'gemini',    x: COL[3], y: ROW_MID, label: 'Gemini',       sub: 'fallback 1',             variant: 'ai-soft' },
  { key: 'groq',      x: COL[3], y: ROW_BOT, label: 'Groq',         sub: 'fallback 2',             variant: 'ai-soft' },
  { key: 'response',  x: COL[4], y: ROW_MID, label: 'Response',     sub: 'polished · provider',    variant: 'out' },
]

const NODE_DESCRIPTIONS: Record<NodeKey, string> = {
  browser:
    'Та же кнопка, что внутри формы ниже. Шлёт POST с черновиком текста на собственный proxy-роут.',
  nextProxy:
    'Proxy-эндпоинт в Next.js. Делает Zod-валидацию, per-IP rate-limit и подписывает запрос Bearer-токеном. Сам ключ AI-сервиса в браузер не уходит.',
  aiService:
    'Собственный микросервис на Hono — на отдельном сервере, потому что RU-хостинг блочит outbound SMTP. Авторизация по Bearer, выбирает порядок провайдеров.',
  claude:
    'Основной провайдер: Anthropic Claude. Качественнее всех на RU-текстах, держит основную нагрузку polish-задачи.',
  gemini:
    'Первый fallback: Google Gemini. Включается, если Claude недоступен или таймаутит (8s по умолчанию).',
  groq:
    'Второй fallback: Groq (Llama). Самый быстрый и дешёвый — последний рубеж, если оба основных провайдера молчат.',
  response:
    'Готовый текст возвращается в браузер. В ответе виден реальный provider, который сработал — claude / gemini / groq.',
}

const centerR = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 })
const centerL = (n: Node) => ({ x: n.x, y: n.y + NH / 2 })

function nodeBy(k: NodeKey) {
  return NODES.find((n) => n.key === k)!
}

function straight(from: NodeKey, to: NodeKey): string {
  const a = centerR(nodeBy(from))
  const b = centerL(nodeBy(to))
  return `M${a.x},${a.y} L${b.x},${b.y}`
}

function curve(from: NodeKey, to: NodeKey): string {
  const a = centerR(nodeBy(from))
  const b = centerL(nodeBy(to))
  const midX = (a.x + b.x) / 2
  return `M${a.x},${a.y} C${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`
}

const EDGES: Edge[] = [
  {
    from: 'browser',
    to: 'nextProxy',
    d: straight('browser', 'nextProxy'),
    speed: 2.6,
    branch: ['nextProxy', 'aiService', 'claude', 'gemini', 'groq', 'response'],
  },
  {
    from: 'nextProxy',
    to: 'aiService',
    d: straight('nextProxy', 'aiService'),
    speed: 2.4,
    branch: ['aiService', 'claude', 'gemini', 'groq', 'response'],
  },
  {
    from: 'aiService',
    to: 'claude',
    d: curve('aiService', 'claude'),
    speed: 2.6,
    branch: ['claude', 'response'],
  },
  {
    from: 'aiService',
    to: 'gemini',
    d: straight('aiService', 'gemini'),
    speed: 3.2,
    branch: ['gemini', 'response'],
  },
  {
    from: 'aiService',
    to: 'groq',
    d: curve('aiService', 'groq'),
    speed: 3.4,
    branch: ['groq', 'response'],
  },
  {
    from: 'claude',
    to: 'response',
    d: curve('claude', 'response'),
    speed: 2.4,
    branch: ['response'],
  },
  {
    from: 'gemini',
    to: 'response',
    d: straight('gemini', 'response'),
    speed: 3.0,
    branch: ['response'],
  },
  {
    from: 'groq',
    to: 'response',
    d: curve('groq', 'response'),
    speed: 3.4,
    branch: ['response'],
  },
]

const VARIANT_STYLES: Record<Variant, string> = {
  default: 'bg-card border-border data-[hover=true]:border-foreground/40',
  'ai-primary': 'bg-primary/10 border-primary data-[hover=true]:border-primary',
  'ai-soft': 'bg-primary/5 border-primary/40 data-[hover=true]:border-primary/70',
  proc: 'bg-sky-500/5 border-sky-500/50 data-[hover=true]:border-sky-500',
  out: 'bg-emerald-500/5 border-emerald-500/50 data-[hover=true]:border-emerald-500',
}

export function FlowDiagram() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<NodeKey | null>(null)

  const isEdgeActive = (e: Edge) =>
    hovered == null ||
    e.from === hovered ||
    e.to === hovered ||
    e.branch.includes(hovered)

  const isNodeActive = (k: NodeKey) => {
    if (hovered == null) return true
    if (hovered === k) return true
    return EDGES.some(
      (e) => e.from === hovered && (e.to === k || e.branch.includes(k)),
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="p-4 md:p-7">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Поток запроса /api/ai/polish: Browser → Next.js proxy → hubmarket-ai → Claude/Gemini/Groq cascade → Response"
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
                    className={cn(
                      'transition-[stroke,opacity] duration-300',
                      active ? 'stroke-foreground/40' : 'stroke-foreground/10',
                    )}
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
                    <circle r={4} className="fill-primary">
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
                  <HoverCard>
                    <HoverCardTrigger
                      render={
                        <button
                          type="button"
                          onMouseEnter={() => setHovered(n.key)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(n.key)}
                          onBlur={() => setHovered(null)}
                          data-hover={isHovered}
                          className={cn(
                            'flex h-full w-full flex-col items-center justify-center rounded-xl border px-2 py-1 text-center shadow-sm outline-none transition-all duration-200',
                            'focus-visible:ring-2 focus-visible:ring-primary/50',
                            VARIANT_STYLES[n.variant],
                            active ? 'opacity-100' : 'opacity-35',
                            isHovered && 'shadow-md',
                          )}
                        >
                          <span className="text-[13px] font-semibold leading-tight tracking-tight text-foreground">
                            {n.label}
                          </span>
                          {n.sub && (
                            <span className="mt-0.5 font-mono text-[10px] leading-tight text-muted-foreground">
                              {n.sub}
                            </span>
                          )}
                        </button>
                      }
                    />
                    <HoverCardContent className="flex w-72 flex-col gap-1">
                      <div className="font-mono text-[13px] font-semibold text-primary">
                        {n.label}
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {NODE_DESCRIPTIONS[n.key]}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </foreignObject>
              )
            })}
          </svg>
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          поток запроса · наведите на узел
        </div>
      </div>
    </div>
  )
}
