import type { Metadata } from 'next'
import { evolutionData, homePath } from '@/app/data/evolution'
import { casePath, getCase, type CaseSlug } from '@/app/data/cases'
import { standardData, standardPath } from '@/app/data/standard'
import { verdictPath, verdictQuizData } from '@/app/data/standard-quiz'
import { landingCopy, landingPath, type LandingSlug } from '@/app/data/landings'
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

// Metadata страницы стандарта: та же схема canonical/hreflang, что у кейсов -
// русская версия основная, x-default на неё.
export function buildStandardMetadata(lang: Lang): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData[lang]
  const s = standardData[lang]
  const url = `${baseUrl}${standardPath(lang)}`

  return {
    title: s.meta.title,
    description: s.meta.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ru: `${baseUrl}${standardPath('ru')}`,
        en: `${baseUrl}${standardPath('en')}`,
        'x-default': `${baseUrl}${standardPath('ru')}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      url,
      title: s.meta.title,
      description: s.meta.description,
      siteName: d.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title: s.meta.title,
      description: s.meta.description,
    },
  }
}

// Metadata квиза вердикта: та же схема, что у страницы стандарта.
export function buildVerdictMetadata(lang: Lang): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData[lang]
  const q = verdictQuizData[lang]
  const url = `${baseUrl}${verdictPath(lang)}`

  return {
    title: q.meta.title,
    description: q.meta.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ru: `${baseUrl}${verdictPath('ru')}`,
        en: `${baseUrl}${verdictPath('en')}`,
        'x-default': `${baseUrl}${verdictPath('ru')}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      url,
      title: q.meta.title,
      description: q.meta.description,
      siteName: d.brand,
    },
    twitter: { card: 'summary_large_image', title: q.meta.title, description: q.meta.description },
  }
}

// Лендинги только RU: без alternates по языкам, канонический адрес без ?p=,
// чтобы две кампании /finance не плодили дубли в индексе.
export function buildLandingMetadata(slug: LandingSlug): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData.ru
  const c = landingCopy[slug]
  const url = `${baseUrl}${landingPath(slug)}`

  return {
    title: c.meta.title,
    description: c.meta.description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      title: c.meta.title,
      description: c.meta.description,
      siteName: d.brand,
    },
    twitter: { card: 'summary_large_image', title: c.meta.title, description: c.meta.description },
  }
}
