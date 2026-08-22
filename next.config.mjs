/** @type {import('next').NextConfig} */
const nextConfig = {
  // Главная живёт в корне (RU) и под /en (EN). Старые адреса лендинга и
  // /evolution отдаём 301-м, CV без локали — на русскую версию, как и раньше.
  async redirects() {
    return [
      { source: '/ru', destination: '/', permanent: true },
      { source: '/evolution', destination: '/', permanent: true },
      { source: '/minasarkisyan', destination: '/ru/minasarkisyan', permanent: true },
    ]
  },
}

export default nextConfig
