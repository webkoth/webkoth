import { Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
        {data.paragraph}
      </p>

      <div className="space-y-5">
        {data.chipGroups.map((group) => (
          <div key={group.groupLabel}>
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {group.groupLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.chips.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
