import { cvPath, homePath } from '@/app/data/evolution'
import type { EvolutionData } from '@/app/data/evolution/types'
import { contacts } from '@/lib/landing/contacts'

export function JsonLdEvolution({ data }: { data: EvolutionData }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const home = homePath(data.lang)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.meta.jsonLd.name,
    serviceType: data.meta.jsonLd.serviceType,
    description: data.meta.jsonLd.description,
    inLanguage: data.lang,
    areaServed: { '@type': 'Place', name: data.meta.jsonLd.area },
    provider: {
      '@type': 'Person',
      name: data.footer.owner,
      url: `${baseUrl}${cvPath(data.lang)}`,
      sameAs: ['https://github.com/webkoth', contacts.telegram],
    },
    url: `${baseUrl}${home === '/' ? '/' : home}`,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
