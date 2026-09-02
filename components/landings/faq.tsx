import type { LandingCopy } from '@/app/data/landings'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function Faq({ copy }: { copy: LandingCopy['faq'] }) {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <Accordion className="mt-8 max-w-3xl">
        {copy.items.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
