'use client'

import { ArrowRight, GitCommitHorizontal, Hand, MousePointerClick, Rocket, Table2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

// «Было / стало» — две вкладки: сначала список ручных шагов, переключение —
// и та же операция одной кнопкой. Переключение само по себе и есть экспонат.
export function BeforeAfterExhibit({ data }: { data: EvolutionData['exhibits']['beforeAfter'] }) {
  const { beforeTitle, before, afterTitle, after } = data
  return (
    <Tabs defaultValue="before">
      {/* На узких экранах подписи вкладок длинные — список во всю ширину и с переносом. */}
      <TabsList className="h-auto w-full flex-wrap sm:w-fit">
        <TabsTrigger value="before" className="h-auto min-h-8 flex-1 whitespace-normal sm:flex-none">
          <Hand aria-hidden />
          {beforeTitle}
        </TabsTrigger>
        <TabsTrigger value="after" className="h-auto min-h-8 flex-1 whitespace-normal sm:flex-none">
          <MousePointerClick aria-hidden />
          {afterTitle}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="before">
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            {before.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="font-mono text-xs tabular-nums opacity-60">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </TabsContent>
      <TabsContent value="after">
        <div className="flex min-h-[9.5rem] flex-col items-center justify-center rounded-xl border border-primary/50 bg-primary/10 p-4">
          <span className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">
            <MousePointerClick className="size-4" aria-hidden />
            {after}
          </span>
        </div>
      </TabsContent>
    </Tabs>
  )
}

// Таблица запусков: вкладка «Все» — таблица целиком, вкладки по системам —
// одна система крупно: первый коммит → прод-конвейер и разрыв между ними.
export function LaunchTableExhibit({
  data,
  labels,
}: {
  data: EvolutionData['exhibits']['launchTable']
  labels: Pick<EvolutionData['labels'], 'all'>
}) {
  const { head, rows } = data
  return (
    <Tabs defaultValue="all">
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="all">
          <Table2 aria-hidden />
          {labels.all}
        </TabsTrigger>
        {rows.map((r) => (
          <TabsTrigger key={r[0]} value={r[0]}>
            {r[0]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
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
      </TabsContent>
      {rows.map((r) => (
        <TabsContent key={r[0]} value={r[0]}>
          <div className="grid gap-3 rounded-xl border border-border bg-background/60 p-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{head[1]}</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-lg tabular-nums">
                <GitCommitHorizontal className="size-4 text-muted-foreground" aria-hidden />
                {r[1]}
              </p>
            </div>
            <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{head[2]}</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-lg tabular-nums">
                <Rocket className="size-4 text-primary" aria-hidden />
                {r[2]}
              </p>
            </div>
            <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{head[3]}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-primary">{r[3]}</p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
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
