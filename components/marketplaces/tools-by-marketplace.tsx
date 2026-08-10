import { Boxes, Check } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function ToolsByMarketplace({ data }: { data: MarketplacesData['tools'] }) {
  return (
    <section
      id="tools"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Boxes}>03 · Состав</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {data.columns.map((col) => (
          <Card key={col.id} className="block p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold">{col.label}</h3>
              <Badge variant="secondary">{col.count}</Badge>
            </div>
            <ul className="mt-4 space-y-2">
              {col.groups.map((g) => (
                <li key={g} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        {data.note}
      </p>
    </section>
  )
}
