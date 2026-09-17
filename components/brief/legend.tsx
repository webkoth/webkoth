import { briefCopy, colorCopy } from '@/app/data/brief/copy'
import { cn } from '@/lib/utils'
import { COLOR_ORDER, DOT_CLS } from './colors'
import { TermNotes } from './term-notes'

export function Legend() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{briefCopy.map.legend}</p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {COLOR_ORDER.map((c) => (
          <li key={c} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={cn('size-2.5 rounded-sm', DOT_CLS[c])} />
            {colorCopy[c]}
          </li>
        ))}
      </ul>
      <TermNotes terms={['program', 'aiPrepares', 'agent']} />
    </div>
  )
}
