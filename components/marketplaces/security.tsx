import { ShieldCheck } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Security({ data }: { data: MarketplacesData['security'] }) {
  return (
    <section
      id="security"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={ShieldCheck}>06 · Безопасность</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <ul className="grid gap-3 md:grid-cols-2">
        {data.items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
