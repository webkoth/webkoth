import { Check } from 'lucide-react'
import { CaseSection } from './case-section'

// «Что это даёт бизнесу»: результаты списком с галочками - без цифр и оговорок,
// они остались в панели фактов и в подсказках карточки.
export function CaseValue({ items, title }: { items: readonly string[]; title: string }) {
  return (
    <CaseSection title={title}>
      <ul className="mt-4 grid gap-2.5">
        {items.map((v) => (
          <li key={v} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </CaseSection>
  )
}
