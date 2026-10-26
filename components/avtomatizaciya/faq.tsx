import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GlassPanel } from './motion'
import { SectionHead } from './scene'

// Вопросы — одна стеклянная карточка в центре на тумане.
export function Faq({ copy }: { copy: AvtomatizaciyaCopy['faq'] }) {
  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-28 px-3 py-16 md:px-8 md:py-24">
      <GlassPanel className="mx-auto max-w-3xl rounded-[32px] p-8 md:p-12">
        <SectionHead eyebrow={copy.eyebrow} title={copy.title} />
        <Accordion className="mt-8 border-t border-foreground/10">
          {copy.items.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-foreground/10">
              <AccordionTrigger className="py-5 text-base font-normal md:text-lg">{item.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </GlassPanel>
    </section>
  )
}
