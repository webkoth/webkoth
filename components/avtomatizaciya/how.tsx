import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Четыре шага линией: крупный номер шага - ход блока. Под шагами ссылка на стандарт
// вместо прежнего квиза (решение 24.10).
export function How({ copy }: { copy: AvtomatizaciyaCopy['how'] }) {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
        {copy.steps.map((s, i) => (
          <li key={s.title} className="border-t-2 border-primary/60 pt-4">
            <span className="font-mono text-4xl font-bold text-primary">{i + 1}</span>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
      <Link
        href={copy.standardLink.href}
        className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        {copy.standardLink.label}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  )
}
