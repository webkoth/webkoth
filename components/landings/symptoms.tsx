import { AlertTriangle } from 'lucide-react'
import type { LandingCopy } from '@/app/data/landings'

export function Symptoms({ copy }: { copy: NonNullable<LandingCopy['symptoms']> }) {
  return (
    <section id="symptoms" className="mx-auto max-w-6xl border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.items.map((item) => (
          <li key={item} className="flex gap-3 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed md:text-[15px]">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
