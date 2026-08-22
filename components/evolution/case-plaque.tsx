import type { ReactNode } from 'react'
import type { EvolutionBlock } from '@/app/data/evolution'

// Плашка кейса под анимацией блока: одна главная цифра крупно, остальные —
// мельче. Одна цифра на блок запоминается лучше трёх.
export function CasePlaque({
  block,
  children,
}: {
  block: Pick<EvolutionBlock, 'caseLabel' | 'caseBody' | 'mainFact' | 'facts'>
  children?: ReactNode
}) {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm md:mt-14 md:p-8">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Кейс</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-primary tabular-nums md:text-5xl">
            {block.mainFact.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{block.mainFact.label}</p>
        </div>
        <div className="min-w-0 md:col-span-8">
          <h3 className="text-base font-semibold md:text-lg">{block.caseLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{block.caseBody}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {block.facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="sr-only">{f.label}</dt>
                <dd className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-semibold tabular-nums">{f.value}</span>
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          {children ? <div className="mt-6 border-t border-border pt-6">{children}</div> : null}
        </div>
      </div>
    </div>
  )
}
