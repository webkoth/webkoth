import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from './section-label'
import { AnimatedMetric } from './animated-metric'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Hero({ data }: { data: DevPresentationData['hero'] }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-10 pb-12 md:px-8 md:pt-14 md:pb-16">
      <SectionLabel icon={User}>01 · Профиль</SectionLabel>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        {data.name}
      </h1>
      <p className="mb-2 text-lg font-medium text-primary md:text-xl">
        {data.role}
      </p>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {data.pitch}
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {data.metrics.map((m) => (
          <AnimatedMetric
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
          />
        ))}
      </div>

      <Button size="lg" render={<a href="#contacts" />}>
        Связаться
      </Button>
    </section>
  )
}
