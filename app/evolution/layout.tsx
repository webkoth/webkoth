import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Эволюция бизнеса: из хаоса — в систему, из рутины — в автоматизацию | Минас Саркисян',
  description:
    'Решаю задачи бизнеса один раз — системой, а не наймом. Деньги — прозрачнее, решения — точнее, процессы — быстрее, ресурсы — свободнее. Первый шаг — аудит: разбор прототипов и карта процессов.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://webkoth.com/evolution' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://webkoth.com/evolution',
    title: 'Эволюция бизнеса: из хаоса — в систему, из рутины — в автоматизацию',
    description:
      'Решаю задачи бизнеса один раз — системой, а не наймом. Системы создают предметные эксперты компании под инженерным контролем.',
    siteName: 'webkoth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Эволюция бизнеса: из хаоса — в систему, из рутины — в автоматизацию',
    description: 'Решаю задачи бизнеса один раз — системой, а не наймом.',
  },
}

export default function EvolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
