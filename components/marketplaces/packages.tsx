import { Layers, ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Packages({ data }: { data: MarketplacesData['packages'] }) {
  return (
    <section
      id="packages"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Layers}>04 · Пакеты</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {data.items.map((p) => (
          <Card key={p.id} className="flex flex-col gap-0 p-5">
            <h3 className="text-base font-semibold">{p.title}</h3>
            <p className="mt-2 text-xl font-bold tabular-nums text-primary">{p.priceFrom}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.duration}</p>

            <p className="mt-4 text-sm text-muted-foreground">{p.body}</p>

            {p.bullets ? (
              <ul className="mt-3 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-auto pt-4 text-xs text-foreground/70">{p.who}</p>
          </Card>
        ))}
      </div>

      <a
        href="#form"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary transition hover:underline"
      >
        {data.footnote}
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    </section>
  )
}
