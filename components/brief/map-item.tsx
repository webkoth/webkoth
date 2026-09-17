import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { briefCopy, readyMadeCopy } from '@/app/data/brief/copy'
import type { CaseSlug } from '@/app/data/cases'
import type { MapItem, ReadyMadeView } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import { cn } from '@/lib/utils'
import { ProcessChain } from './process-chain'

// Пункт карты: процесс, цепочка шагов, пометки, «почему первым», «готовое»,
// «что подготовить» и ссылки. compact - для живого черновика: без пояснений и ссылок.

export type CaseLinks = Partial<Record<CaseSlug, { title: string; href: string }>>

function hoursTag(item: MapItem): string {
  if (item.status === 'pending') return briefCopy.map.pending
  if (item.returnedHours > 0) return `≈ ${formatHours(item.returnedHours)} ч/нед`
  return item.outcome?.caption ?? ''
}

function readyMadeText(r: ReadyMadeView): string {
  const base = r.kind === 'cabinet' ? readyMadeCopy.cabinet(r.text) : readyMadeCopy.service(r.text)
  return r.alreadyUsing ? `${base} ${readyMadeCopy.using}` : base
}

function Lines({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-1 text-sm leading-relaxed">
        {items.map((x) => (
          <li key={x} className="border-l-2 border-primary/50 pl-2.5">
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MapItemView({
  item,
  index,
  highlight,
  compact,
  caseLinks,
}: {
  item: MapItem
  index?: number
  highlight?: boolean
  compact?: boolean
  caseLinks?: CaseLinks
}) {
  const notes = [...(item.outcome?.notes ?? []), ...(item.entryNote ? [item.entryNote] : [])]
  const cases = item.cases.flatMap((slug) => (caseLinks?.[slug] ? [{ slug, ...caseLinks[slug] }] : []))

  return (
    <article
      className={cn(
        'break-inside-avoid rounded-2xl border',
        compact ? 'p-3' : 'p-4 md:p-5',
        highlight ? 'border-primary bg-primary/5' : 'border-border bg-card/70',
      )}
    >
      {highlight && !compact ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{briefCopy.map.startHere}</p>
      ) : null}
      <h3 className={cn('flex flex-wrap items-baseline gap-2 font-semibold', compact ? 'text-sm' : 'mt-1 text-base')}>
        {index !== undefined ? `${index}. ` : null}
        {item.label}
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] font-normal text-muted-foreground">
          {hoursTag(item)}
        </span>
      </h3>
      <ProcessChain chain={item.chain} branches={item.branches} compact={compact} />

      {!compact ? (
        <>
          {notes.map((n) => (
            <p key={n} className="mt-2 text-xs text-muted-foreground">
              {n}
            </p>
          ))}
          {item.why.length > 0 ? <Lines title={briefCopy.map.why} items={item.why} /> : null}
          {item.readyMade ? <p className="mt-3 text-sm">{readyMadeText(item.readyMade)}</p> : null}
          {item.prepare.length > 0 ? <Lines title={briefCopy.map.prepare} items={item.prepare} /> : null}
          {cases.length > 0 || item.library.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs print:hidden">
              {cases.map((c) => (
                <Link key={c.slug} href={c.href} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary">
                  {briefCopy.map.similar}: {c.title}
                  <ArrowUpRight aria-hidden className="size-3" />
                </Link>
              ))}
              {item.library.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary"
                >
                  {briefCopy.map.library}: {l.label}
                  <ArrowUpRight aria-hidden className="size-3" />
                </a>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  )
}
