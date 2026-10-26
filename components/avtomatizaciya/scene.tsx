'use client'

import type { ReactNode } from 'react'

// «Пространственный» слой страницы по референсам собственника (Pinterest, 25.10.2026):
// настоящая фотография или атмосферный фон, а поверх — парящие стеклянные окна
// с экранами продукта, как в Apple Vision Pro. Фото генерировались KIE (Nano Banana 2.1),
// исходники — .local/kie-2026-10-25, промпты — в комментариях коммита.

/** Подпись раздела мелкой моноширинной строкой и заголовок обычным весом. */
export function SectionHead({ eyebrow, title, className }: { eyebrow: ReactNode; title: string; className?: string }) {
  return (
    <div className={className}>
      <p className="micro text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-4 text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-balance md:text-[2.6rem]">{title}</h2>
    </div>
  )
}
