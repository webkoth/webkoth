import type { ReactNode } from 'react'
import {
  AppWindow,
  CalendarClock,
  Coins,
  Database,
  FileCode2,
  FlaskConical,
  GitCommitHorizontal,
  Info,
  Percent,
  Route,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { EvolutionBlock, Fact } from '@/app/data/evolution/types'
import { cn } from '@/lib/utils'

// Плашка кейса под анимацией блока: одна главная цифра крупно, остальные —
// мельче. Одна цифра на блок запоминается лучше трёх. У цифры с `note` —
// HoverCard «как считалось» (и фокус с клавиатуры: триггер — кнопка).
// Иконка факта подбирается по смыслу подписи — декоративная, 14px, muted.
const FACT_ICON_RULES: [RegExp, LucideIcon][] = [
  [/коммит|commit/i, GitCommitHorizontal],
  [/строк|lines|rows/i, FileCode2],
  [/модел|model/i, Database],
  [/страниц|pages|screens/i, AppWindow],
  [/api|маршрут|route/i, Route],
  [/тест|test/i, FlaskConical],
  [/₽|руб|альтернатив|alternative/i, Coins],
  [/%/, Percent],
  [/рол|role|эксперт|expert|специалист|specialist/i, Users],
  [/день|дни|месяц|day|days|month|week|недел/i, CalendarClock],
]

function factIcon(f: Fact): LucideIcon | null {
  const hay = `${f.value} ${f.label}`
  for (const [re, Icon] of FACT_ICON_RULES) if (re.test(hay)) return Icon
  return null
}

function FactNote({ fact, hint, children }: { fact: Fact; hint: string; children: ReactNode }) {
  if (!fact.note) return <>{children}</>
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<button type="button" />}
        className="group/fact inline-flex cursor-help items-baseline gap-1 rounded-sm text-left underline decoration-primary/40 decoration-dotted underline-offset-4 outline-none transition hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <Info className="size-3" aria-hidden />
          {hint}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{fact.note}</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export function CasePlaque({
  block,
  tag,
  factHint,
  children,
}: {
  block: Pick<EvolutionBlock, 'caseLabel' | 'caseBody' | 'mainFact' | 'facts'>
  tag: string
  factHint: string
  children?: ReactNode
}) {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm md:mt-14 md:p-8">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{tag}</p>
          <div className="mt-3">
            <FactNote fact={block.mainFact} hint={factHint}>
              <span className="text-4xl font-bold tracking-tight text-primary tabular-nums md:text-5xl">
                {block.mainFact.value}
              </span>
            </FactNote>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{block.mainFact.label}</p>
        </div>
        <div className="min-w-0 md:col-span-8">
          <h3 className="text-base font-semibold md:text-lg">{block.caseLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{block.caseBody}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {block.facts.map((f) => {
              const Icon = factIcon(f)
              return (
                <div key={f.label} className="min-w-0">
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="flex items-baseline gap-2">
                    {Icon ? <Icon className="size-3.5 shrink-0 translate-y-0.5 text-muted-foreground" aria-hidden /> : null}
                    <FactNote fact={f} hint={factHint}>
                      <span className={cn('font-mono text-base font-semibold tabular-nums')}>{f.value}</span>
                    </FactNote>
                    <span className="text-xs text-muted-foreground">{f.label}</span>
                  </dd>
                </div>
              )
            })}
          </dl>
          {children ? <div className="mt-6 border-t border-border pt-6">{children}</div> : null}
        </div>
      </div>
    </div>
  )
}
