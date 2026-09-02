import { ArrowUpRight } from 'lucide-react'
import type { LandingCopy } from '@/app/data/landings'

const STANDARD_URL = '/ru/standard'

export function StandardNote({ copy }: { copy: LandingCopy['standardNote'] }) {
  return (
    <div className="mt-8 grid gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 md:grid-cols-2 md:p-6">
      <h3 className="text-lg font-semibold tracking-tight md:col-span-2">{copy.title}</h3>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Стандарт</p>
        <p className="mt-2 text-sm leading-relaxed">{copy.standard}</p>
        <a href={STANDARD_URL} className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-primary">
          Открытый стандарт AIAS <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Под вас</p>
        <p className="mt-2 text-sm leading-relaxed">{copy.individual}</p>
      </div>
    </div>
  )
}
