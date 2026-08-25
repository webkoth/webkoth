import { ArrowRight } from 'lucide-react'

// Цепочка «источники → система → результат». Последний узел выделен: это
// то, ради чего система существует. Разметка перенесена из DataFlowExhibit.
// `readonly` в пропах - потому что данные кейсов объявлены константами
// (`CaseDetail.diagramNodes`), а обычный `string[]` их не принимает.
export function CaseDiagram({ nodes, note }: { nodes: readonly string[]; note: string }) {
  return (
    <div>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-2">
            <span
              className={
                i === nodes.length - 1
                  ? 'rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 font-medium text-primary'
                  : 'rounded-lg border border-border bg-background/60 px-3 py-1.5'
              }
            >
              {n}
            </span>
            {i < nodes.length - 1 ? <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}
