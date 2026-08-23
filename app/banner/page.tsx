import type { Metadata } from 'next'
import { evolutionData, isLang } from '@/app/data/evolution'
import { Banner } from '@/components/evolution/banner'
import { BANNER_SPECS, type BannerVariant } from '@/components/evolution/banner-specs'

// Служебная страница для обложек соцсетей: /banner?v=youtube|facebook|linkedin|x&lang=ru|en.
// Рендерится headless-Chrome в размере холста варианта (см. BANNER_SPECS) — результат
// лежит в public/brand/. В индекс не попадает и нигде не линкуется.
// Размер холста зависит от ?v= — страница всегда рендерится на запрос.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Banner',
  robots: { index: false, follow: false },
}

const isVariant = (v: unknown): v is BannerVariant => typeof v === 'string' && v in BANNER_SPECS

export default async function BannerPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; lang?: string }>
}) {
  const { v, lang } = await searchParams
  const variant: BannerVariant = isVariant(v) ? v : 'youtube'
  const data = evolutionData[isLang(lang) ? lang : 'ru']
  return <Banner variant={variant} data={data} />
}
