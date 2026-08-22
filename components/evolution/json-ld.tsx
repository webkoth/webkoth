export function JsonLdEvolution() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Эволюция бизнеса: из хаоса — в систему, из рутины — в автоматизацию',
    serviceType: 'Аудит и построение бизнес-систем с ИИ силами предметных экспертов компании',
    description:
      'Решаю задачи бизнеса один раз — системой, а не наймом. Первый шаг — аудит: разбор существующих прототипов и карта процессов.',
    areaServed: { '@type': 'Country', name: 'Россия' },
    provider: {
      '@type': 'Person',
      name: 'Минас Саркисян',
      url: 'https://webkoth.com',
    },
    url: 'https://webkoth.com/evolution',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
