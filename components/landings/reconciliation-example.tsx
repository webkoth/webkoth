import { CircleAlert } from 'lucide-react'
import type { LandingCopy } from '@/app/data/landings'
import { cn } from '@/lib/utils'

// Сцена первого экрана /kontur: не анимация, а то, что бухгалтер селлера узнаёт с первого
// взгляда, - отчёт площадки и 1С рядом, строки с расхождением подсвечены. Разницы и строка
// «К перечислению» считаются из строк, поэтому числа в таблице не могут не сойтись.
// На 360 px таблица помещается без прокрутки; overflow-x-auto страхует крупный шрифт.

const MINUS = '−'
const group = (n: number) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const signed = (n: number) => (n < 0 ? MINUS : '') + group(n)

export function ReconciliationExample({ copy }: { copy: NonNullable<LandingCopy['reconciliation']> }) {
  const rows = copy.rows.map((r) => ({ ...r, diff: Math.abs(r.oneC - r.report) }))
  const report = rows.reduce((sum, r) => sum + r.report, 0)
  const oneC = rows.reduce((sum, r) => sum + r.oneC, 0)
  const mismatch = Math.abs(oneC - report)
  const num = 'px-2 py-2.5 text-right font-mono whitespace-nowrap tabular-nums'

  return (
    <figure className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-sm font-semibold tracking-tight">{copy.title}</span>
        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          {copy.badge}
        </span>
      </figcaption>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] sm:text-xs">
          <thead>
            <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              <th scope="col" className="py-2 pr-2 pl-4 text-left align-bottom font-medium">
                {copy.head[0]}
              </th>
              {copy.head.slice(1).map((h, i) => (
                <th key={h} scope="col" className={cn('px-2 py-2 text-right align-bottom font-medium', i === 2 && 'pr-4')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={cn('border-b border-border', r.diff > 0 && 'bg-destructive/10')}>
                <th scope="row" className="py-2.5 pr-2 pl-4 text-left font-normal">
                  {r.label}
                </th>
                <td className={num}>{signed(r.report)}</td>
                <td className={num}>{signed(r.oneC)}</td>
                <td className={cn(num, 'pr-4', r.diff > 0 ? 'font-semibold text-destructive' : 'text-muted-foreground')}>
                  {group(r.diff)}
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <th scope="row" className="py-2.5 pr-2 pl-4 text-left">
                {copy.total}
              </th>
              <td className={num}>{signed(report)}</td>
              <td className={num}>{signed(oneC)}</td>
              <td className={cn(num, 'pr-4', mismatch > 0 ? 'text-destructive' : 'text-muted-foreground')}>{group(mismatch)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 border-t border-border px-4 py-3 text-xs leading-relaxed sm:text-sm">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
        <span>
          <span className="font-semibold text-destructive">
            {copy.mismatch} {group(mismatch)} ₽:
          </span>{' '}
          {copy.verdict}
        </span>
      </p>
    </figure>
  )
}
