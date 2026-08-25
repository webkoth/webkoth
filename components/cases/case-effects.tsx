import type { CaseDetail } from '@/app/data/cases'
import type { EvolutionData } from '@/app/data/evolution/types'
import { CaseSection } from './case-section'

// Таблица эффектов - единственное место, где видно, что одна система
// окупилась сразу по нескольким постулатам. У систем с одним углом
// строка была бы ровно одна, и она повторяла бы «стало» выше.
// Разметка - dl/dt/dd, а не список абзацев: связь «шаг → эффект» здесь
// и есть содержание раздела, и она должна доезжать до скринридера, а не
// держаться на одной колоночной сетке.
export function CaseEffects({
  effects,
  blocks,
  title,
}: {
  effects: CaseDetail['effects']
  blocks: EvolutionData['blocks']
  title: string
}) {
  if (effects.length <= 1) return null

  return (
    <CaseSection title={title}>
      <dl className="mt-4 grid gap-2">
        {effects.map((e) => (
          <div
            key={e.block}
            className="grid gap-1 rounded-lg bg-muted/50 px-4 py-3 text-sm sm:grid-cols-[14rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-xs text-muted-foreground">
              {blocks[e.block].step} · {blocks[e.block].slogan}
            </dt>
            <dd>{e.text}</dd>
          </div>
        ))}
      </dl>
    </CaseSection>
  )
}
