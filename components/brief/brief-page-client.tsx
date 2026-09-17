'use client'

import dynamic from 'next/dynamic'
import type { CaseLinks } from './map-item'

// Бриф рисуется только в браузере: черновик лежит в localStorage, и первый же рендер
// должен знать, есть ли он. Без серверного рендера нет эффекта загрузки и мигания
// вводного экрана; пока код страницы грузится, держим место под экран.

const BriefPage = dynamic(() => import('./brief-page').then((m) => m.BriefPage), {
  ssr: false,
  loading: () => <div className="min-h-[60vh]" aria-busy />,
})

export function BriefPageClient({ k, caseLinks }: { k?: string; caseLinks: CaseLinks }) {
  return <BriefPage k={k} caseLinks={caseLinks} />
}
