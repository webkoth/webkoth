import { ArrowRight } from 'lucide-react'
import type { EvolutionData } from '@/app/data/evolution/types'

// Экспонаты плашек кейсов — то, что в документе концепции помечено «Показать: …».

export function DataFlowExhibit({ data }: { data: EvolutionData['exhibits']['dataFlow'] }) {
  const { nodes, note } = data
  return (
    <div>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-2">
            <span
              className={
                i === nodes.length - 1
                  ? 'rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 font-medium text-primary'
                  : 'rounded-lg border border-border bg-background/60 px-3 py-1.5'
              }
            >
              {n}
            </span>
            {i < nodes.length - 1 ? <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

export function BeforeAfterExhibit({ data }: { data: EvolutionData['exhibits']['beforeAfter'] }) {
  const { beforeTitle, before, afterTitle, after } = data
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-background/60 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{beforeTitle}</p>
        <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {before.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="font-mono text-xs tabular-nums opacity-60">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col rounded-xl border border-primary/50 bg-primary/10 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{afterTitle}</p>
        <div className="flex flex-1 items-center justify-center py-6">
          <span className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">
            {after}
          </span>
        </div>
      </div>
    </div>
  )
}

export function LaunchTableExhibit({ data }: { data: EvolutionData['exhibits']['launchTable'] }) {
  const { head, rows } = data
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[22rem] text-sm">
        <thead>
          <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {head.map((h) => (
              <th key={h} scope="col" className="py-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-border/60 last:border-0">
              <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                {r[0]}
              </th>
              <td className="py-2.5 pr-4 font-mono tabular-nums text-muted-foreground">{r[1]}</td>
              <td className="py-2.5 pr-4 font-mono tabular-nums text-muted-foreground">{r[2]}</td>
              <td className="py-2.5 font-mono font-semibold text-primary">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SharesExhibit({ data }: { data: EvolutionData['exhibits']['shares'] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {data.map((s) => (
        <div key={s.role} className="rounded-xl border border-border bg-background/60 p-4">
          <p className="text-3xl font-bold tracking-tight text-primary tabular-nums md:text-4xl">{s.value}</p>
          <p className="mt-1 text-sm font-medium">{s.role}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{s.detail}</p>
        </div>
      ))}
    </div>
  )
}
