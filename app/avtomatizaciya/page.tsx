import type { Metadata } from 'next'
import { evolutionData } from '@/app/data/evolution'
import { avtomatizaciya, avtomatizaciyaPath } from '@/app/data/avtomatizaciya'
import { AvtomatizaciyaPage } from '@/components/avtomatizaciya/page'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
const url = `${baseUrl}${avtomatizaciyaPath}`
const { title, description } = avtomatizaciya.meta

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'ru_RU', url, title, description, siteName: evolutionData.ru.brand },
  twitter: { card: 'summary_large_image', title, description },
}

export default function Page() {
  return <AvtomatizaciyaPage />
}
