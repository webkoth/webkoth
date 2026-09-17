import { HOURS_VALUE } from '@/app/data/brief/coefficients'
import { outcomeCopy } from '@/app/data/brief/copy'
import { processCatalog, type ProcessEntry } from '@/app/data/brief/processes'
import { decideVerdict } from '@/lib/standard/verdict'
import { prepareFor, whyFirst } from './explain'
import type { HoursBand, ReadyToolKey } from './ids'
import { processLabel } from './labels'
import type { BriefMap, DynamicOutcome, MapBranch, MapItem, MapStep, ReadyMadeView, StageInfo } from './map-types'
import { fitness, pickStart, returnedHours, sortByPriority } from './priority'
import type { BriefAnswers } from './schema'
import { stageOf } from './stage'
import { deepList, isDeepComplete } from './state'
import { dynamicOutcome } from './step-color'
import { toQuizInput } from './to-quiz-input'

// Сборка карты из ответов. Одна функция для живого черновика (частичные ответы),
// итоговой карты в браузере и пересчёта на сервере: карте из браузера сервер не доверяет.

const PENDING: DynamicOutcome = {
  color: 'skip',
  caption: outcomeCopy.captions.pending,
  notes: [],
  shareKey: 'skip',
  showApproval: false,
}

export function usesReadyTool(a: BriefAnswers, key: ReadyToolKey | undefined): boolean {
  switch (key) {
    case 'reviewsCabinet':
      return a.tools.includes('reviewsCabinet') || a.tools.includes('reviewsService')
    case 'bidder':
      return a.tools.includes('bidder')
    case 'repricer':
      return a.tools.includes('repricer')
    case 'analytics':
      return a.tools.some((t) => t === 'mpstats' || t === 'mayak' || t === 'analyticsOther')
    case 'ledgerSystem':
      return a.ledger.some((l) => l === 'moysklad' || l === '1c' || l === 'other')
    default:
      return false
  }
}

function chainOf(entry: ProcessEntry, outcome: DynamicOutcome): MapStep[] {
  return entry.chain.flatMap((s): MapStep[] => {
    if (s.kind === 'fixed') return [{ label: s.label, color: s.color }]
    if (s.kind === 'dynamic') return [{ label: s.label, color: outcome.color, caption: outcome.caption }]
    return outcome.showApproval ? [{ label: s.label, color: 'human', caption: outcomeCopy.approvalCaption }] : []
  })
}

function branchesOf(entry: ProcessEntry): MapBranch[] {
  return (entry.branches ?? []).map((b) => ({ when: b.when, step: { label: b.step.label, color: b.step.color } }))
}

function readyMadeOf(entry: ProcessEntry, a: BriefAnswers): ReadyMadeView | undefined {
  if (!entry.readyMade) return undefined
  const { kind, text, toolsKey } = entry.readyMade
  return { kind, text, alreadyUsing: usesReadyTool(a, toolsKey) }
}

function buildItem(entry: ProcessEntry, band: HoursBand, a: BriefAnswers, stage: StageInfo): MapItem {
  const hours = HOURS_VALUE[band]
  const common = {
    processId: entry.id,
    label: processLabel(entry.id, a),
    hoursBand: band,
    hours,
    branches: branchesOf(entry),
    why: [],
    entryNote: entry.mapNote,
    readyMade: readyMadeOf(entry, a),
    cases: entry.cases,
    library: entry.library ?? [],
  }
  const d = a.deepAnswers[entry.id]
  if (!d || !isDeepComplete(d)) {
    return { ...common, status: 'pending', returnedHours: 0, priority: 0, chain: chainOf(entry, PENDING), prepare: [] }
  }
  const { input, dataReason: reason } = toQuizInput(entry, d, band, a)
  const verdict = decideVerdict(input)
  // Причина нужна только остановке по данным: при остановке по образцу она ничего не объясняет.
  const dataReason = verdict.form === 'stopData' ? reason : undefined
  const outcome = dynamicOutcome(verdict, d.handover)
  const returned = returnedHours(hours, outcome)
  return {
    ...common,
    status: 'ready',
    input,
    verdict,
    dataReason,
    outcome,
    returnedHours: returned,
    priority: returned * fitness(outcome, verdict, stage),
    chain: chainOf(entry, outcome),
    prepare: prepareFor(entry, { verdict, outcome, dataReason }, d, a),
  }
}

export function buildMap(a: BriefAnswers): BriefMap {
  const stage = stageOf(a.aiNow)
  const deep = deepList(a)
  const bandOf = new Map(a.picked.map((p) => [p.id, p.hours]))
  const sorted = sortByPriority(deep.map((id) => buildItem(processCatalog[id], bandOf.get(id) ?? '1to3', a, stage)))
  const startId = pickStart(sorted)
  const items = sorted.map((i) =>
    i.processId === startId ? { ...i, why: whyFirst(i, sorted, a.deepAnswers[i.processId] ?? {}) } : i,
  )
  const blocked = startId
    ? undefined
    : items.find((i) => i.verdict?.form === 'stopEtalon' || i.verdict?.form === 'stopData')

  return {
    stage,
    items,
    startId,
    startFallback: blocked?.prepare[0] ? { processId: blocked.processId, text: blocked.prepare[0] } : undefined,
    totalReturnedHours: items.reduce((sum, i) => sum + i.returnedHours, 0),
    notDeep: a.picked
      .filter((p) => !deep.includes(p.id))
      .map((p) => ({ processId: p.id, label: processLabel(p.id, a), hours: HOURS_VALUE[p.hours] })),
  }
}
