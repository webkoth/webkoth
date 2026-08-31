import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { evolutionBlockOrder, evolutionData, homePath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import { standardData, standardPath } from '@/app/data/standard'
import { verdictQuizData } from '@/app/data/standard-quiz'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { HtmlLang } from '@/components/evolution/html-lang'
import { VerdictQuiz } from './verdict-quiz'

// Страница квиза вердикта: тонкая оболочка вокруг клиентского компонента.
// Хлебная крошка ведёт на страницу стандарта, CTA внутри квиза - через общую
// модалку лида, поэтому провайдер обязателен и здесь.
export function VerdictPage({ lang }: { lang: Lang }) {
  const data = evolutionData[lang]
  const s = verdictQuizData[lang]
  const anchorBase = homePath(lang)
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = evolutionBlockOrder.map((key) => ({
    id: data.blocks[key].id,
    label: data.blocks[key].slogan,
  }))

  return (
    <>
      <HtmlLang lang={lang} />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang={lang}>
          <main className="relative z-[1] min-h-screen" lang={lang}>
            <HeaderNav
              lang={lang}
              brand={data.brand}
              owner={data.footer.owner}
              nav={data.nav}
              labels={data.labels}
              items={navItems}
              llmMarkdown={llmMarkdown}
              anchorBase={anchorBase}
            />

            <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
              <nav aria-label={standardData[lang].title}>
                <Link
                  href={standardPath(lang)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  {standardData[lang].title}
                </Link>
              </nav>

              <header className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {s.eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{s.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{s.lead}</p>
                <p className="mt-3 text-xs text-muted-foreground">{s.disclaimer}</p>
              </header>

              <div className="mt-8">
                <VerdictQuiz lang={lang} ctaLabel={data.nav.cta} />
              </div>
            </div>

            <Footer data={data} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
