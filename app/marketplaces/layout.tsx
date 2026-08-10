import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI для селлеров маркетплейсов — обучение и внедрение | Минас Саркисян',
  description:
    'Подключаю Wildberries, Ozon и Яндекс.Маркет к AI и внедряю в процессы вашей команды. Менеджер спрашивает словами — получает ответ по вашим данным.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://webkoth.com/marketplaces' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://webkoth.com/marketplaces',
    title: 'AI для селлеров маркетплейсов — обучение и внедрение',
    description:
      'Подключаю WB, Ozon и Яндекс.Маркет к AI и внедряю в процессы команды. Бесплатный разбор на ваших данных.',
    siteName: 'webkoth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI для селлеров маркетплейсов — обучение и внедрение',
    description: 'Подключаю WB, Ozon и Яндекс.Маркет к AI и внедряю в процессы команды.',
  },
}

export default function MarketplacesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
