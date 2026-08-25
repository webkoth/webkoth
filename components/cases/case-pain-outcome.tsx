import { Check, X } from 'lucide-react'

// Пара «болело / стало» по главному углу системы - тот же разворот, что
// на карточке в карусели, только крупнее: читатель пришёл сюда по карточке
// и должен увидеть на месте ровно то, за чем шёл.
export function CasePainOutcome({
  pain,
  outcome,
  painLabel,
  outcomeLabel,
}: {
  pain: string
  outcome: string
  painLabel: string
  outcomeLabel: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-destructive">
          <X className="size-3.5" aria-hidden />
          {painLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pain}</p>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
          <Check className="size-3.5" aria-hidden />
          {outcomeLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{outcome}</p>
      </div>
    </div>
  )
}
