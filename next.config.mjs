// Кейсы, снятые с сайта 25.10.2026: внутренняя разработка, непонятная продавцу.
// Витрины (data-marts) влиты в кейс хранилища данных и ведут на него.
const REMOVED_CASES = [
  'project-generator',
  'it-inventory',
  'legacy-db-map',
  'marketplace-knowledge',
  'deploy-from-chat',
  'frontend-factory',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // С 25.10.2026 сайт — одна страница-оффер для продавцов маркетплейсов на главной
  // (business-os/decisions/2026-10-25-webkoth-odin-offer-dlya-prodavcov.md). Прежний адрес
  // оффера, четыре лендинга, стандарт AIAS, английская версия и снятые кейсы ведут на главную.
  // Исключение с 27.10.2026 — английское резюме /en/minasarkisyan для откликов.
  // Код этих страниц частично остаётся в репозитории. `permanent: true` в Next - это 308:
  // метод запроса не меняется, метки рекламы в строке запроса переносятся.
  async redirects() {
    return [
      { source: '/ru', destination: '/', permanent: true },
      { source: '/evolution', destination: '/', permanent: true },
      { source: '/avtomatizaciya', destination: '/', permanent: true },
      { source: '/kontur', destination: '/', permanent: true },
      { source: '/finance', destination: '/', permanent: true },
      { source: '/it-director', destination: '/', permanent: true },
      { source: '/agent', destination: '/', permanent: true },
      { source: '/standard', destination: '/', permanent: true },
      { source: '/ru/standard', destination: '/', permanent: true },
      { source: '/ru/standard/:path*', destination: '/', permanent: true },
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path((?!minasarkisyan/?$).*)', destination: '/', permanent: true },
      { source: '/ru/cases/data-marts', destination: '/ru/cases/data-platform', permanent: true },
      ...REMOVED_CASES.map((slug) => ({ source: `/ru/cases/${slug}`, destination: '/', permanent: true })),
      { source: '/minasarkisyan', destination: '/ru/minasarkisyan', permanent: true },
      { source: '/cases/:slug', destination: '/ru/cases/:slug', permanent: true },
    ]
  },
}

export default nextConfig
