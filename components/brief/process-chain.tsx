import { ArrowRight } from 'lucide-react'
import { colorShort } from '@/app/data/brief/copy'
import type { MapBranch, MapStep } from '@/lib/brief/map-types'
import { cn } from '@/lib/utils'
import { STEP_CLS } from './colors'

// Цепочка шагов процесса в цветах. У каждого шага есть текст: подпись вердикта
// или короткое «кто делает» - цвет не единственный сигнал.

function Step({ step, compact }: { step: MapStep; compact?: boolean }) {
  return (
    <span className={cn('inline-block rounded-lg border px-2 py-1 text-xs leading-snug', STEP_CLS[step.color])}>
      {step.label}
      {compact ? (
        <span className="sr-only">: {step.caption ?? colorShort[step.color]}</span>
      ) : (
        <span className="block text-[11px] opacity-80">{step.caption ?? colorShort[step.color]}</span>
      )}
    </span>
  )
}

export function ProcessChain({
  chain,
  branches,
  compact,
}: {
  chain: readonly MapStep[]
  branches: readonly MapBranch[]
  compact?: boolean
}) {
  return (
    <div>
      <ol className="mt-2 flex flex-wrap items-center gap-1.5">
        {chain.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 ? <ArrowRight aria-hidden className="size-3 text-muted-foreground" /> : null}
            <Step step={s} compact={compact} />
          </li>
        ))}
      </ol>
      {branches.map((b) => (
        <p key={b.when} className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {b.when}:
          <Step step={b.step} compact={compact} />
        </p>
      ))}
    </div>
  )
}
