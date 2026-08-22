import { MessageSquare, CheckCircle2, Send } from 'lucide-react'
import { contacts } from '@/lib/landing/contacts'
import type { EvolutionData } from '@/app/data/evolution/types'
import { SproutsTree } from './animations/sprouts-tree'
import { LeadForm } from './lead-form'

// Финал: честная строка про кладбище, манифест, мини-таблица четырёх заходов
// и форма. Первый продукт — бесплатный диагностический разбор: карта процессов и план.
export function Finale({
  data,
  labels,
  animation,
  lang,
}: {
  data: EvolutionData['finale']
  labels: EvolutionData['labels']
  animation: EvolutionData['animations']['sprouts']
  lang: EvolutionData['lang']
}) {
  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {labels.step} {data.step}
          </p>
          <h2 id="finale-title" className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {data.slogan}
          </h2>
          <div className="mt-6 space-y-4 text-base text-muted-foreground md:text-lg">
            {data.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-sm md:p-5">
            <SproutsTree copy={animation} />
          </div>
        </div>
      </div>

      <blockquote className="mt-14 border-l-4 border-primary pl-6 md:mt-20 md:pl-8">
        <p className="max-w-4xl text-2xl font-semibold tracking-tight text-balance md:text-4xl md:leading-[1.2]">
          {data.manifesto}
        </p>
      </blockquote>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <h3 className="text-base font-semibold md:text-lg">{data.graveyard.title}</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card/70">
            <table className="w-full min-w-[20rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {data.graveyard.head.map((h) => (
                    <th key={h} scope="col" className="px-3 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.graveyard.rows.map((row, i) => {
                  const alive = i === data.graveyard.rows.length - 1
                  return (
                    <tr
                      key={row[0]}
                      className={
                        alive
                          ? 'bg-primary/10 font-medium text-foreground'
                          : 'border-b border-border text-muted-foreground'
                      }
                    >
                      <th scope="row" className="px-3 py-3 font-mono font-medium">
                        {row[0]}
                      </th>
                      <td className="px-3 py-3 font-mono tabular-nums whitespace-nowrap">{row[1]}</td>
                      <td className="px-3 py-3 font-mono tabular-nums">{row[2]}</td>
                      <td className={alive ? 'px-3 py-3 text-primary' : 'px-3 py-3'}>{row[3]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{data.graveyard.note}</p>
        </div>

        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            <MessageSquare className="size-3.5" aria-hidden />
            <span>{data.form.label}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">{data.form.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{data.form.sub}</p>

          <div className="my-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{data.form.takeawaysTitle}</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground md:text-sm">
              {data.form.takeaways.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-muted md:text-sm"
            >
              <Send className="size-3.5 text-primary" aria-hidden />
              <span>{data.form.telegramCta}</span>
            </a>
            <span className="text-xs text-muted-foreground">{data.form.orBelow}</span>
          </div>

          <LeadForm copy={data.form} lang={lang} />
        </div>
      </div>
    </section>
  )
}
