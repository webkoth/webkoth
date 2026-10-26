'use client'

import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { cn } from '@/lib/utils'
import { GlassPanel } from './motion'
import { SectionHead } from './scene'

// Цена: заголовок на небе и три отдельные стеклянные плашки без общего контейнера (26.10).
// Главная цена выделена размером и кнопкой, не рамкой.
export function Pricing({ copy, cta }: { copy: AvtomatizaciyaCopy['pricing']; cta: string }) {
  const { open } = useLeadDialog()
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 px-3 py-16 md:px-8 md:py-24">
      <SectionHead eyebrow={copy.eyebrow} title={copy.title} className="px-1 md:px-2" />
      <ul className="mt-8 grid items-stretch gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
        {copy.items.map((p, i) => (
          <GlassPanel as="li" key={p.title} delay={0.06 * i} className={cn('flex flex-col rounded-[28px] p-6 md:p-8', p.highlight && 'md:-my-3 md:py-11')}>
            <h3 className="micro text-muted-foreground">{p.title}</h3>
            <p className={cn('mt-4 font-medium tracking-[-0.03em]', p.highlight ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl')}>
              {p.price}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.body}</p>
            {p.highlight ? (
              <button
                type="button"
                onClick={() => open()}
                className="mt-auto inline-flex h-11 items-center justify-center self-start rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_rgb(0_184_219/.55)] transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:mt-8"
              >
                {cta}
              </button>
            ) : null}
          </GlassPanel>
        ))}
      </ul>
    </section>
  )
}
