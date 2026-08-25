import type { Metadata } from 'next'
import { evolutionData, homePath } from '@/app/data/evolution'
import { casePath, getCase, type CaseSlug } from '@/app/data/cases'
import type { Lang } from '@/app/data/evolution/types'

// Metadata главной для обеих локалей: canonical на свой URL, hreflang на оба,
// x-default — русская версия (основная аудитория).
export function buildHomeMetadata(lang: Lang): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData[lang]
  const url = `${baseUrl}${homePath(lang)}`

  return {
    title: d.meta.title,
    description: d.meta.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ru: `${baseUrl}/`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      url,
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
      siteName: d.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title: d.meta.ogTitle,
      description: d.meta.twitterDescription,
    },
  }
}

// Metadata страницы кейса: canonical на свой URL, hreflang на обе локали,
// x-default - русская версия, как на главной.
export function buildCaseMetadata(lang: Lang, slug: CaseSlug): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData[lang]
  const { copy } = getCase(lang, slug)
  const url = `${baseUrl}${casePath(lang, slug)}`

  return {
    title: copy.detail.metaTitle,
    description: copy.detail.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ru: `${baseUrl}${casePath('ru', slug)}`,
        en: `${baseUrl}${casePath('en', slug)}`,
        'x-default': `${baseUrl}${casePath('ru', slug)}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      url,
      title: copy.detail.metaTitle,
      description: copy.detail.metaDescription,
      siteName: d.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.detail.metaTitle,
      description: copy.detail.metaDescription,
    },
  }
}
