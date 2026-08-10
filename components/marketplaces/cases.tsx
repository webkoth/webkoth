import { TrendingUp } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Cases({ data }: { data: MarketplacesData['cases'] }) {
  return (
    <section
      id="cases"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={TrendingUp}>05 · Кейсы</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((c) => (
          <Card key={c.title} className="block p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{c.title}</h3>
              {c.duration ? <Badge variant="secondary">{c.duration}</Badge> : null}
            </div>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Было
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{c.before}</p>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-primary">
              Стало
            </p>
            <p className="mt-1 text-sm">{c.after}</p>

            {c.note ? (
              <p className="mt-4 text-xs text-muted-foreground italic">{c.note}</p>
            ) : null}
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        {data.honesty}
      </p>
    </section>
  )
}
