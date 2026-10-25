import type { Metadata } from 'next'
import { evolutionData } from '@/app/data/evolution'
import { avtomatizaciya, glavnayaPath } from '@/app/data/avtomatizaciya'
import { AvtomatizaciyaPage } from '@/components/avtomatizaciya/page'

// Главная — оффер для продавцов маркетплейсов (решение 25.10.2026). Прежняя «Эволюция бизнеса»
// и английская версия сняты с сайта, их адреса перенаправляются сюда (next.config.mjs).
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
const url = `${baseUrl}${glavnayaPath}`
const { title, description } = avtomatizaciya.meta

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'ru_RU', url, title, description, siteName: evolutionData.ru.brand },
  twitter: { card: 'summary_large_image', title, description },
}

export default function Home() {
  return <AvtomatizaciyaPage />
}
