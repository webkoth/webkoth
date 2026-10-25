import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { cn } from '@/lib/utils'
import { GlassPanel, Reveal } from './motion'

// Три цены стеклянными карточками. Главная (месяц внедрения) выделена содержимым:
// цена цианом и крупнее, а не рамкой — в брендбуке у стекла рамок нет.
export function Pricing({ copy }: { copy: AvtomatizaciyaCopy['pricing'] }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="text-sm font-medium text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{copy.title}</h2>
      </Reveal>
      <ul className="mt-10 grid items-stretch gap-4 md:grid-cols-3">
        {copy.items.map((p, i) => (
          <GlassPanel as="li" key={p.title} delay={0.08 * i} className={cn('p-6 md:p-8', p.highlight && 'md:-my-3 md:py-11')}>
            <h3 className="text-sm font-medium text-muted-foreground">{p.title}</h3>
            <p
              className={cn(
                'mt-3 font-semibold tracking-[-0.02em]',
                p.highlight ? 'text-4xl text-primary md:text-5xl' : 'text-2xl md:text-3xl',
              )}
            >
              {p.price}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.body}</p>
          </GlassPanel>
        ))}
      </ul>
    </section>
  )
}
