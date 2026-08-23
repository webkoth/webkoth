'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { EvolutionData, HubNodeKey } from '@/app/data/evolution/types'
import { useReducedMotionSafe } from './animations/use-reduced-motion'

// Именованный кейс — собственный продукт. Ненумерованная секция после шага 06:
// в нумерацию 01–06 («план работ») он не входит. Интерактивная схема архитектуры
// (ховер по узлу подсвечивает ветку и показывает описание), бейджи стека и лента
// из четырёх скриншотов продукта.

type Variant = 'default' | 'ai' | 'store' | 'out' | 'service'

type Node = { key: HubNodeKey; x: number; y: number; variant?: Variant }

type Edge = {
  from: HubNodeKey
  to: HubNodeKey
  shape: 'straight' | 'curve' | 'vertical'
  speed?: number
  branch: HubNodeKey[]
}

// SVG-space grid: 5 cols × 3 rows. Container scales via viewBox.
const NW = 184
const NH = 76
const COL_GAP = 56
const COL: Record<number, number> = {
  0: 40,
  1: 40 + (NW + COL_GAP),
  2: 40 + 2 * (NW + COL_GAP),
  3: 40 + 3 * (NW + COL_GAP),
  4: 40 + 4 * (NW + COL_GAP),
}
const ROW_TOP = 40
const ROW_MID = 200
const ROW_BOT = 360

const W = COL[4] + NW + 40
const H = ROW_BOT + NH + 30

const NODES: Node[] = [
  { key: 'chrome', x: COL[0], y: ROW_MID },
  { key: 'next', x: COL[1], y: ROW_MID },
  { key: 'queue', x: COL[2], y: ROW_MID },
  { key: 'parser', x: COL[3], y: ROW_TOP, variant: 'service' },
  { key: 'docparser', x: COL[3], y: ROW_MID, variant: 'service' },
  { key: 'ai', x: COL[3], y: ROW_BOT, variant: 'ai' },
  { key: 'bronze', x: COL[4], y: ROW_TOP, variant: 'store' },
  { key: 'silver', x: COL[4], y: ROW_MID, variant: 'store' },
  { key: 'telegram', x: COL[4], y: ROW_BOT, variant: 'out' },
]

const centerR = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 })
const centerL = (n: Node) => ({ x: n.x, y: n.y + NH / 2 })
const centerT = (n: Node) => ({ x: n.x + NW / 2, y: n.y })
const centerB = (n: Node) => ({ x: n.x + NW / 2, y: n.y + NH })

function nodeBy(k: HubNodeKey) {
  return NODES.find((n) => n.key === k)!
}

function pathFor(edge: Edge): string {
  const a = nodeBy(edge.from)
  const b = nodeBy(edge.to)
  if (edge.shape === 'vertical') {
    const p = centerB(a)
    const q = centerT(b)
    return `M${p.x},${p.y} L${q.x},${q.y}`
  }
  const p = centerR(a)
  const q = centerL(b)
  if (edge.shape === 'curve') {
    const midX = (p.x + q.x) / 2
    return `M${p.x},${p.y} C${midX},${p.y} ${midX},${q.y} ${q.x},${q.y}`
  }
  return `M${p.x},${p.y} L${q.x},${q.y}`
}

const EDGES: Edge[] = [
  { from: 'chrome', to: 'next', shape: 'straight', branch: [] },
  { from: 'next', to: 'queue', shape: 'straight', branch: [] },
  { from: 'queue', to: 'parser', shape: 'curve', branch: ['parser', 'bronze', 'silver', 'ai', 'telegram'], speed: 3.0 },
  { from: 'queue', to: 'docparser', shape: 'straight', branch: ['docparser', 'silver', 'ai', 'telegram'], speed: 3.4 },
  { from: 'queue', to: 'ai', shape: 'curve', branch: ['ai', 'telegram'], speed: 3.2 },
  { from: 'parser', to: 'bronze', shape: 'straight', branch: ['bronze', 'silver', 'ai', 'telegram'], speed: 2.4 },
  { from: 'bronze', to: 'silver', shape: 'vertical', branch: ['silver', 'ai', 'telegram'], speed: 2.2 },
  { from: 'docparser', to: 'silver', shape: 'straight', branch: ['silver', 'ai', 'telegram'], speed: 2.6 },
  { from: 'ai', to: 'telegram', shape: 'straight', branch: ['telegram'], speed: 2.0 },
]

const VARIANT_STYLES: Record<Variant, string> = {
  default: 'bg-card border-border data-[hover=true]:border-foreground/40',
  service: 'bg-card border-border data-[hover=true]:border-primary/60',
  ai: 'bg-primary/5 border-primary/40 data-[hover=true]:border-primary',
  store: 'bg-muted/40 border-border data-[hover=true]:border-foreground/50',
  out: 'bg-emerald-500/5 border-emerald-500/40 data-[hover=true]:border-emerald-500',
}

const BADGE_TONES: Record<Variant, string> = {
  default: 'bg-muted text-foreground/80',
  service: 'bg-primary/10 text-primary',
  ai: 'bg-primary/15 text-primary',
  store: 'bg-foreground/10 text-foreground/80',
  out: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
}

export function HubmarketCase({ data }: { data: EvolutionData['hubmarket'] }) {
  const reduce = useReducedMotionSafe()
  const [hovered, setHovered] = useState<HubNodeKey | null>(null)
  const titleParts = data.title.split(data.linkText)

  const isEdgeActive = (e: Edge) =>
    hovered == null || e.from === hovered || e.to === hovered || e.branch.includes(hovered)

  const isNodeActive = (k: HubNodeKey) => {
    if (hovered == null) return true
    if (hovered === k) return true
    return EDGES.some((e) => e.from === hovered && (e.to === k || e.branch.includes(k)))
  }

  return (
    <TooltipProvider delay={120}>
      <section
        id="hubmarket"
        aria-labelledby="hubmarket-title"
        className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{data.eyebrow}</p>
            <h2 id="hubmarket-title" className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              {titleParts[0]}
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
              >
                {data.linkText}
              </a>
              {titleParts[1] ?? ''}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground md:text-xl">{data.sub}</p>
          </div>
          <div className="min-w-0 space-y-4 text-base text-muted-foreground md:text-lg lg:col-span-7 lg:pt-9">
            {data.frame.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{data.hint}</p>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
          <div className="p-4 md:p-8">
            <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label={data.diagramAria}
              >
                <defs>
                  <marker
                    id="arrow-hub"
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
                  const d = pathFor(e)
                  const active = isEdgeActive(e)
                  return (
                    <g key={`edge-${i}`}>
                      <path
                        d={d}
                        fill="none"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        className={cn(
                          'transition-[stroke,opacity] duration-300',
                          active ? 'stroke-foreground/45' : 'stroke-foreground/10',
                        )}
                        strokeDasharray="5 5"
                        markerEnd="url(#arrow-hub)"
                      >
                        {!reduce && (
                          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.4s" repeatCount="indefinite" />
                        )}
                      </path>
                      {!reduce && active && (
                        <circle r={4} className="fill-primary">
                          <animateMotion dur={`${e.speed ?? 3}s`} repeatCount="indefinite" path={d} rotate="auto" />
                        </circle>
                      )}
                    </g>
                  )
                })}

                {NODES.map((n) => {
                  const variant = n.variant ?? 'default'
                  const copy = data.nodes[n.key]
                  const active = isNodeActive(n.key)
                  const isHovered = hovered === n.key
                  return (
                    <foreignObject key={n.key} x={n.x} y={n.y} width={NW} height={NH}>
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          onMouseEnter={() => setHovered(n.key)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(n.key)}
                          onBlur={() => setHovered(null)}
                          data-hover={isHovered}
                          className={cn(
                            'group flex h-full w-full flex-col items-start justify-center rounded-xl border px-3.5 py-2 text-left shadow-sm outline-none transition-all duration-200',
                            'focus-visible:ring-2 focus-visible:ring-primary/50',
                            VARIANT_STYLES[variant],
                            active ? 'opacity-100' : 'opacity-30',
                            isHovered && 'shadow-md',
                          )}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">
                              {copy.label}
                            </span>
                            {copy.badge && (
                              <span
                                className={cn(
                                  'shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider',
                                  BADGE_TONES[variant],
                                )}
                              >
                                {copy.badge}
                              </span>
                            )}
                          </div>
                          <span className="mt-1 font-mono text-[11px] leading-tight text-muted-foreground">{copy.sub}</span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs whitespace-normal border border-primary/40 bg-primary p-3 text-left text-[13px] leading-snug text-primary-foreground shadow-lg"
                        >
                          {copy.description}
                        </TooltipContent>
                      </Tooltip>
                    </foreignObject>
                  )
                })}
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {data.flowLabel}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {data.stack.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="h-7 border-primary/40 bg-primary/5 px-3 py-1 font-mono text-[13px] font-medium text-primary hover:bg-primary/10"
            >
              {s}
            </Badge>
          ))}
        </div>

        {/* Скриншоты: горизонтальная лента, на узких экранах прокручивается.
            Сайдбар с данными аккаунта с изображений срезан. */}
        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{data.screenshotsTitle}</p>
        <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {data.screenshots.map((s) => (
            <li key={s.src} className="w-[82vw] max-w-[34rem] shrink-0 snap-start sm:w-[28rem]">
              <figure className="overflow-hidden rounded-2xl border border-border bg-card/70">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={2300}
                  height={1440}
                  sizes="(max-width: 640px) 82vw, 34rem"
                  className="h-auto w-full"
                />
                <figcaption className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">{s.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </TooltipProvider>
  )
}
