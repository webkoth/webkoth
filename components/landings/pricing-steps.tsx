import type { LandingCopy } from '@/app/data/landings'
import { cn } from '@/lib/utils'

export function PricingSteps({ copy }: { copy: LandingCopy['pricing'] }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{copy.note}</p>
      <ol
        className={cn(
          'mt-8 grid gap-4',
          // При четырёх шагах (лендинг «Агент») md:grid-cols-3 оставляет один
          // шаг сиротой во втором ряду; при остальных трёх шагах хватает трёх колонок.
          copy.steps.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3',
        )}
      >
        {copy.steps.map((step) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 font-mono text-sm text-primary">{step.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
