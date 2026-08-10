export function JsonLdService() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Обучение и внедрение AI для селлеров маркетплейсов',
    serviceType: 'AI-внедрение для Wildberries, Ozon и Яндекс.Маркета',
    description:
      'Обучение команды и внедрение AI в процессы компаний, торгующих на Wildberries, Ozon и Яндекс.Маркете.',
    areaServed: { '@type': 'Country', name: 'Россия' },
    provider: {
      '@type': 'Person',
      name: 'Минас Саркисян',
      url: 'https://webkoth.com',
    },
    url: 'https://webkoth.com/marketplaces',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
