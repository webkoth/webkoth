import { describe, expect, it } from 'vitest'
import { explainCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { prepareFor, whyFirst } from './explain'
import type { DynamicOutcome, MapItem } from './map-types'
import { emptyAnswers, type DeepAnswers } from './schema'

const outcome = (patch: Partial<DynamicOutcome>): DynamicOutcome => ({
  color: 'auto',
  caption: '',
  notes: [],
  shareKey: 'f3',
  showApproval: false,
  ...patch,
})
const base = (processId: MapItem['processId'], hours: number, patch: Partial<MapItem> = {}): MapItem => ({
  processId,
  label: processId,
  hoursBand: '1to3',
  hours,
  status: 'ready',
  returnedHours: 0,
  priority: 0,
  chain: [],
  branches: [],
  why: [],
  prepare: [],
  cases: [],
  library: [],
  ...patch,
})
const d: DeepAnswers = { etalon: 'many' }
const w = explainCopy.why
const p = explainCopy.prepare

describe('whyFirst', () => {
  it('часы, образцы и утверждение, не больше трёх', () => {
    const start = base('reviews', 7.5, { verdict: { form: 'f4', flags: [] }, outcome: outcome({ color: 'ai', showApproval: true }) })
    expect(whyFirst(start, [start, base('stocks', 2)], d)).toEqual([w.mostHours, w.hasEtalon, w.approval])
  })

  it('программа без ИИ и не самый долгий процесс', () => {
    const start = base('stocks', 2, { verdict: { form: 'f3', flags: [] }, outcome: outcome({}) })
    expect(whyFirst(start, [start, base('reviews', 7.5)], { etalon: 'few' })).toEqual([w.program])
  })
})

describe('prepareFor', () => {
  const a = { ...emptyAnswers(), apiTokens: 'yes' as const }

  it('сначала блокирующее: образец', () => {
    const item = { verdict: { form: 'stopEtalon' as const, flags: [] }, outcome: outcome({ color: 'skip' }) }
    expect(prepareFor(processCatalog.digest, item, { etalon: 'no' }, a)).toEqual([p.etalon(processCatalog.digest.hints.etalon)])
  })

  it('данные: по причине, затем «ещё образцы»', () => {
    const item = { verdict: { form: 'stopData' as const, flags: [] }, outcome: outcome({ color: 'skip' }), dataReason: 'cost' as const }
    expect(prepareFor(processCatalog.unit, item, { etalon: 'few' }, a)).toEqual([p.cost, p.moreEtalons])
  })

  it('утверждение и ключ доступа, если ключей нет и процесс идёт через кабинет', () => {
    const item = { verdict: { form: 'f4' as const, flags: [] }, outcome: outcome({ color: 'ai', showApproval: true }) }
    expect(prepareFor(processCatalog.reviews, item, d, { ...a, apiTokens: 'no' })).toEqual([p.approver, p.apiToken])
    expect(prepareFor(processCatalog.competitors, item, d, { ...a, apiTokens: 'no' })).toEqual([p.approver])
  })

  it('для остановленного процесса про ключ не говорим', () => {
    const item = { verdict: { form: 'stopData' as const, flags: [] }, outcome: outcome({ color: 'skip' }), dataReason: 'data' as const }
    expect(prepareFor(processCatalog.payouts, item, d, { ...a, apiTokens: 'unknown' })).toEqual([p.data])
  })
})
