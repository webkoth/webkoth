import { ListChecks } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function HowReviewWorks({ data }: { data: MarketplacesData['review'] }) {
  return (
    <section
      id="review"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={ListChecks}>07 · Разбор</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <ol className="grid gap-4 md:grid-cols-3">
        {data.steps.map((s) => (
          <li key={s.step} className="rounded-xl border border-border bg-card/50 p-5">
            <span className="font-mono text-2xl font-bold text-primary/40 tabular-nums">
              0{s.step}
            </span>
            <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-l-2 border-primary/40 pl-3 text-sm">{data.note}</p>
    </section>
  )
}
