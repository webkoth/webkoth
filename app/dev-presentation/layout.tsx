import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Минас Саркисян — fullstack & AI engineer · webkoth',
  description:
    '10+ лет fullstack, 2+ года плотно с LLM. Свяжитесь — отвечу в течение 24ч.',
  robots: { index: false, follow: false }, // test task page — don't index
}

export default function DevPresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
