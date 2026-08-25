import Image from 'next/image'
import type { CaseDetail, CaseMeta } from '@/app/data/cases'
import { CaseSection } from './case-section'

// Скриншотов сегодня нет ни у одной системы: обезличенные снимки готовятся
// отдельно. Раздел не рисуется вовсе - пустая полоса с заголовком читалась бы
// как недоделка. Подписи лежат в текстах и совпадают с файлами по индексу,
// это проверяет тест реестра.
export function CaseScreenshots({
  shots,
  captions,
  title,
}: {
  shots: CaseMeta['screenshots']
  captions: CaseDetail['screenshots']
  title: string
}) {
  if (shots.length === 0) return null

  return (
    <CaseSection title={title}>
      <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {shots.map((s, i) => (
          <li key={s.src} className="w-[82vw] max-w-[34rem] shrink-0 snap-start sm:w-[28rem]">
            <figure className="overflow-hidden rounded-2xl border border-border bg-card/70">
              <Image
                src={s.src}
                alt={captions[i].alt}
                width={2300}
                height={1440}
                sizes="(max-width: 640px) 82vw, 34rem"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                {captions[i].caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </CaseSection>
  )
}
