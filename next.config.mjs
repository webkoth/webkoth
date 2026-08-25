/** @type {import('next').NextConfig} */
const nextConfig = {
  // Главная живёт в корне (RU) и под /en (EN). Старые адреса лендинга и
  // /evolution отдаём постоянным редиректом, а адреса без локали (CV и кейсы)
  // ведём на русскую версию, как и раньше. `permanent: true` в Next - это 308,
  // а не 301: при нём метод запроса не меняется. Так же он записан в README.
  async redirects() {
    return [
      { source: '/ru', destination: '/', permanent: true },
      { source: '/evolution', destination: '/', permanent: true },
      { source: '/minasarkisyan', destination: '/ru/minasarkisyan', permanent: true },
      { source: '/cases/:slug', destination: '/ru/cases/:slug', permanent: true },
    ]
  },
}

export default nextConfig
