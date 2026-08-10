import { AnimatedMetric } from '@/components/dev-presentation/animated-metric'
import { Button } from '@/components/ui/button'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Hero({ data }: { data: MarketplacesData['hero'] }) {
  return (
    <section id="hero" className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{data.h1}</h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{data.sub}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" nativeButton={false} render={<a href="#form" />}>
          {data.ctaPrimary}
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<a href="#video" />}>
          {data.ctaSecondary}
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {data.metrics.map((m) => (
          <AnimatedMetric key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
        ))}
      </div>
    </section>
  )
}
