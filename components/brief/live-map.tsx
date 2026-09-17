'use client'

import { useState } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { BriefMap } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import { MapItemView } from './map-item'

// Черновик карты рядом с вопросами: справа на широком экране, плашкой внизу на телефоне.

function LiveMapBody({ map }: { map: BriefMap }) {
  const count = map.items.length + map.notDeep.length
  if (count === 0) return <p className="text-sm text-muted-foreground">{briefCopy.live.empty}</p>
  return (
    <div className="space-y-2">
      {map.totalReturnedHours > 0 ? (
        <p className="text-sm">
          ≈ {formatHours(map.totalReturnedHours)} ч · {briefCopy.map.kpiHours}
        </p>
      ) : null}
      {map.items.map((i) => (
        <MapItemView key={i.processId} item={i} compact highlight={i.processId === map.startId} />
      ))}
      {map.notDeep.length > 0 ? (
        <p className="pt-1 text-xs text-muted-foreground">
          {briefCopy.map.notDeep}: {map.notDeep.map((n) => n.label).join(', ')}
        </p>
      ) : null}
    </div>
  )
}

export function LiveMap({ map }: { map: BriefMap }) {
  const [open, setOpen] = useState(false)
  const count = map.items.length + map.notDeep.length

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start print:hidden" aria-label={briefCopy.live.title}>
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{briefCopy.live.title}</p>
          <LiveMapBody map={map} />
        </div>
      </aside>

      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden print:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="w-full rounded-xl border border-border bg-card/95 px-4 py-3 text-left text-sm shadow-lg backdrop-blur">
            {briefCopy.live.bar(count)} ↑
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto p-4">
            <SheetTitle>{briefCopy.live.title}</SheetTitle>
            <LiveMapBody map={map} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
