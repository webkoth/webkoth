import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Три цены. Первая (бесплатный разбор) выделена рамкой акцента: ход блока.
export function Pricing({ copy }: { copy: AvtomatizaciyaCopy['pricing'] }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {copy.items.map((p, i) => (
          <li
            key={p.title}
            className={
              i === 0
                ? 'rounded-2xl border-2 border-primary bg-primary/5 p-6 md:p-8'
                : 'rounded-2xl border border-border bg-card/60 p-6 md:p-8'
            }
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.title}</h3>
            <p className="mt-3 text-3xl font-bold tracking-tight">{p.price}</p>
            <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">{copy.note}</p>
    </section>
  )
}
