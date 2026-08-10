import { HelpCircle } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Faq({ data }: { data: MarketplacesData['faq'] }) {
  return (
    <section
      id="faq"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={HelpCircle}>08 · Вопросы</SectionLabel>
      <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>

      <Accordion className="w-full max-w-3xl">
        {data.items.map((item, i) => (
          <AccordionItem key={item.q} value={`q-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
