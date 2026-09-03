import type { Metadata } from 'next'
import Link from 'next/link'
import { evolutionData } from '@/app/data/evolution'
import { privacyData } from '@/app/data/privacy'
import { Footer } from '@/components/evolution/footer'
import { HtmlLang } from '@/components/evolution/html-lang'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'

export const metadata: Metadata = {
  title: privacyData.meta.title,
  description: privacyData.meta.description,
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/privacy` },
}

// Политика конфиденциальности: только RU, без шапки с навигацией, чтобы страница
// читалась как документ. Ссылка на неё стоит в форме заявки и в футере.
export default function PrivacyPage() {
  const d = privacyData
  const data = evolutionData.ru
  return (
    <>
      <HtmlLang lang="ru" />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <article className="mx-auto max-w-3xl px-4 pt-14 pb-16 md:px-8 md:pt-20">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-primary hover:underline">
            ← {d.back}
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">{d.title}</h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{d.updated}</p>

          <dl className="mt-8 grid gap-2 rounded-2xl border border-border bg-card/70 p-5 text-sm md:grid-cols-[max-content_1fr] md:gap-x-6">
            <dt className="text-muted-foreground">Оператор</dt>
            <dd>{d.operator.name}</dd>
            <dt className="text-muted-foreground">ИНН</dt>
            <dd>{d.operator.inn}</dd>
            <dt className="text-muted-foreground">ОГРНИП</dt>
            <dd>{d.operator.ogrnip}</dd>
            <dt className="text-muted-foreground">Сайт</dt>
            <dd>{d.operator.site}</dd>
          </dl>

          {d.sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 text-base leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-10 rounded-2xl border border-border bg-card/70 p-5">
            <h2 className="text-xl font-semibold tracking-tight">{d.contactTitle}</h2>
            <p className="mt-3 text-base text-foreground/90">{d.contactBody}</p>
            <a
              href={d.operator.contactHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-primary underline underline-offset-2"
            >
              {d.operator.contactLabel}: {d.operator.contactHref.replace('https://', '')}
            </a>
          </section>
        </article>
        <Footer data={data} />
      </main>
    </>
  )
}
