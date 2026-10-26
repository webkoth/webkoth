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
      <div className="rounded-[22px] bg-foreground/[0.04] p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <X className="size-3.5" aria-hidden />
          {painLabel}
        </p>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">{pain}</p>
      </div>
      <div className="glass rounded-[22px] p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
          <Check className="size-3.5" aria-hidden />
          {outcomeLabel}
        </p>
        <p className="mt-2 text-base leading-relaxed">{outcome}</p>
      </div>
    </div>
  )
}
