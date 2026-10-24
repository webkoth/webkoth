import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Четыре плитки для компаний: суть и вилка цены. Цена крупно внизу плитки: ход блока.
// id плитки - якорь: со старых страниц и из рекламы можно вести прямо на направление.
export function Companies({ copy }: { copy: AvtomatizaciyaCopy['companies'] }) {
  return (
    <section id="companies" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{copy.lead}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {copy.items.map((t) => (
          <li
            key={t.id}
            id={`companies-${t.id}`}
            className="flex scroll-mt-28 flex-col rounded-2xl border border-border bg-card/60 p-6 md:p-8"
          >
            <h3 className="text-xl font-semibold tracking-tight">{t.title}</h3>
            <p className="mt-3 flex-1 text-sm text-muted-foreground md:text-base">{t.body}</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-2xl font-bold tracking-tight text-primary">{t.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.support}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
