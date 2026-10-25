import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GlassPanel, Reveal } from './motion'

export function Faq({ copy }: { copy: AvtomatizaciyaCopy['faq'] }) {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="text-sm font-medium text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{copy.title}</h2>
      </Reveal>
      <GlassPanel className="mt-10 max-w-3xl px-6 py-2 md:px-8" delay={0.1}>
        <Accordion>
          {copy.items.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-foreground/[0.08] last:border-b-0">
              <AccordionTrigger className="py-5 text-base font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </GlassPanel>
    </section>
  )
}
