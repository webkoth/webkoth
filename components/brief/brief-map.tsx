'use client'

import type { ReactNode } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { Button } from '@/components/ui/button'
import { marketplacesText } from '@/lib/brief/labels'
import type { BriefMap } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { SendStatus } from '@/lib/brief/state'
import { contacts } from '@/lib/landing/contacts'
import { Legend } from './legend'
import { MapItemView, type CaseLinks } from './map-item'
import { TermNotes } from './term-notes'

// Итоговая карта: итог, «начните с этого», процессы по приоритету, статус отправки.
// «Скачать PDF» - системная печать браузера: всё лишнее спрятано классами print:hidden.

function Kpi({ value, label, children }: { value: string; label: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function SendLine({ send, onRetry }: { send: SendStatus; onRetry: () => void }) {
  const s = briefCopy.send
  if (send === 'idle') return null
  if (send === 'sending') return <p className="text-sm text-muted-foreground">{s.sending}</p>
  if (send === 'sent') return <p className="rounded-xl border border-brief-auto/40 bg-brief-auto/10 p-3 text-sm">{s.sent}</p>
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/50 p-3 text-sm">
      <span>{send === 'rateLimited' ? s.rateLimited : s.failed}</span>
      <Button size="sm" onClick={onRetry}>
        {s.retry}
      </Button>
      <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
        {s.writeTelegram}
      </a>
    </div>
  )
}

export function BriefMapView({
  map,
  answers,
  send,
  onRetry,
  onReset,
  onPdf,
  caseLinks,
}: {
  map: BriefMap
  answers: BriefAnswers
  send: SendStatus
  onRetry: () => void
  onReset: () => void
  /** «Скачать PDF»: цель Метрики и системная печать. */
  onPdf: () => void
  caseLinks: CaseLinks
}) {
  const m = briefCopy.map
  const shops = marketplacesText(answers)
  const start = map.items.find((i) => i.processId === map.startId)
  const rest = map.items.filter((i) => i.processId !== map.startId)
  const fallbackItem = map.startFallback ? map.items.find((i) => i.processId === map.startFallback?.processId) : undefined
  const hours = map.totalReturnedHours
  const total = hours === 0 ? briefCopy.hours.zero : hours < 1 ? m.lessThanHour : `≈ ${briefCopy.hours.total(formatHours(hours))}`
  const hoursNote = map.items.length === 0 ? null : hours === 0 ? (map.startFallback ? m.zeroHoursNote : null) : hours < 1 ? m.lessThanHourNote : null

  return (
    <section className="space-y-5 py-4">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{m.eyebrow}</p>
        <h1 tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight outline-none md:text-3xl">
          {m.title}
        </h1>
        {shops ? <p className="mt-2 text-sm text-muted-foreground">{m.shops(shops)}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Kpi value={total} label={m.kpiHours} />
          <Kpi value={String(map.items.length)} label={m.kpiProcesses} />
          <Kpi value={map.stage.label} label={m.kpiStage}>
            <TermNotes terms={['stage']} />
          </Kpi>
        </div>
        {hoursNote ? <p className="mt-3 text-sm text-muted-foreground">{hoursNote}</p> : null}
        <div className="mt-5">
          <Legend />
        </div>
      </header>

      {/* Статус отправки объявляется диктором; контейнер есть всегда, в PDF не печатается. */}
      <div role="status" aria-live="polite" className="empty:mb-0 print:hidden">
        <SendLine send={send} onRetry={onRetry} />
      </div>

      {start ? <MapItemView item={start} index={1} highlight caseLinks={caseLinks} /> : null}
      {!start && map.startFallback ? (
        <div className="rounded-2xl border border-primary bg-primary/5 p-4 md:p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{m.startFallback}</p>
          <p className="mt-2 text-sm">
            {fallbackItem ? `${fallbackItem.label}: ` : ''}
            {map.startFallback.text}
          </p>
        </div>
      ) : null}

      {rest.map((item, i) => (
        <MapItemView key={item.processId} item={item} index={i + (start ? 2 : 1)} caseLinks={caseLinks} />
      ))}

      {map.notDeep.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {m.notDeep}: {map.notDeep.map((n) => `${n.label} (${briefCopy.hours.perWeek(formatHours(n.hours))})`).join(', ')} · {m.notDeepTail}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2 print:hidden">
        <Button size="lg" onClick={onPdf}>
          {m.pdf}
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
          {m.reset}
        </Button>
      </div>
    </section>
  )
}
