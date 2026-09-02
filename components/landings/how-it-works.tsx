import type { LandingCopy } from '@/app/data/landings'
import { StepChip } from '@/components/evolution/step-chip'
import { StandardNote } from './standard-note'

export function HowItWorks({ copy, note }: { copy: LandingCopy['how']; note: LandingCopy['standardNote'] }) {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              <StepChip>{String(i + 1).padStart(2, '0')}</StepChip>
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{step.body}</p>
          </li>
        ))}
      </ol>
      <StandardNote copy={note} />
    </section>
  )
}
