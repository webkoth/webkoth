import { casePath, type CaseCopy, type CaseMeta, type CaseSlug } from '@/app/data/cases'
import { cvPath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'

// Разметка кейса для поиска: CreativeWork, а не Article - это описание системы,
// а не публикация. Автор ведёт на CV своей локали, репозиторий указывается
// только у открытого кода: у обезличенных клиентских систем ссылок нет.
export function JsonLdCase({
  lang,
  slug,
  meta,
  copy,
  owner,
}: {
  lang: Lang
  slug: CaseSlug
  meta: CaseMeta
  copy: CaseCopy
  owner: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: copy.title,
    headline: copy.detail.metaTitle,
    description: copy.detail.metaDescription,
    inLanguage: lang,
    url: `${baseUrl}${casePath(lang, slug)}`,
    creator: {
      '@type': 'Person',
      name: owner,
      url: `${baseUrl}${cvPath(lang)}`,
    },
    ...(meta.links.github ? { codeRepository: meta.links.github } : {}),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
