import { Wrench, Compass } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Magnetic } from '@/components/landing/magnetic'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function AboutStack({
  data,
}: {
  data: DevPresentationData['about']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={Wrench}>02 · О себе и стек</SectionLabel>
      {data.paragraph ? (
        <p className="mb-10 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
          {data.paragraph}
        </p>
      ) : null}

      <div className="mb-12">
        <h2 className="mb-5 inline-flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
          <Compass className="size-5 text-primary" aria-hidden />
          Направления разработки
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.directions.map((d) => (
            <div
              key={d.title}
              className="rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="mb-1 text-sm font-semibold text-foreground">{d.title}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">{d.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-xl font-bold tracking-tight md:text-2xl">Стек</h2>
        <div className="space-y-5">
          {data.chipGroups.map((group) => (
            <div key={group.groupLabel}>
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.groupLabel}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.chips.map((chip) => (
                  <Magnetic key={chip}>
                    <Badge
                      variant="secondary"
                      className="cursor-default border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
                    >
                      {chip}
                    </Badge>
                  </Magnetic>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
