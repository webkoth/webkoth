import { CaseCard } from '@/components/evolution/case-card'
import type { BlockAngle } from '@/app/data/cases'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import { cn } from '@/lib/utils'
import { CaseSection } from './case-section'

// Другие кейсы того же шага. Соседей всегда двое или трое: в блоке по правилу
// реестра три-четыре карточки (это проверяет тест), одна из них - текущая.
// Проверка на пустоту оставлена как страховка на случай правки правила -
// раздел из одного заголовка выглядел бы поломкой.
// Нечётной последней карточке отдаём обе колонки: три карточки в сетке из двух
// оставляют пустую половину ряда - её видно на /en/cases/product-portal.
export function CaseSiblings({
  items,
  lang,
  labels,
  title,
}: {
  items: BlockAngle[]
  lang: Lang
  labels: EvolutionData['labels']
  title: string
}) {
  if (items.length === 0) return null

  return (
    <CaseSection title={title} className="mt-14">
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item.slug}
            className={cn(items.length % 2 === 1 && i === items.length - 1 && 'md:col-span-2')}
          >
            <CaseCard entry={item} lang={lang} labels={labels} />
          </div>
        ))}
      </div>
    </CaseSection>
  )
}
