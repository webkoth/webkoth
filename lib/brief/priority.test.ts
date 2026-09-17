import { describe, expect, it } from 'vitest'
import type { Verdict } from '@/lib/standard/verdict'
import type { DynamicOutcome, MapItem } from './map-types'
import { fitness, formatHours, pickStart, returnedHours, sortByPriority } from './priority'
import { stageOf } from './stage'

const outcome = (color: DynamicOutcome['color'], shareKey: DynamicOutcome['shareKey']): DynamicOutcome => ({
  color,
  caption: '',
  notes: [],
  shareKey,
  showApproval: false,
})
const verdict = (form: Verdict['form']): Verdict => ({ form, flags: [] })

const item = (processId: MapItem['processId'], priority: number, color: DynamicOutcome['color']): MapItem => ({
  processId,
  label: processId,
  hoursBand: '1to3',
  hours: 2,
  status: 'ready',
  outcome: outcome(color, 'f3'),
  returnedHours: priority,
  priority,
  chain: [],
  branches: [],
  why: [],
  prepare: [],
  cases: [],
  library: [],
})

describe('returnedHours', () => {
  it('часы × доля вердикта', () => {
    expect(returnedHours(7.5, outcome('ai', 'aiPrepares'))).toBeCloseTo(4.5)
    expect(returnedHours(2, outcome('auto', 'f3'))).toBeCloseTo(1.8)
    expect(returnedHours(4, outcome('skip', 'skip'))).toBe(0)
  })
})

describe('fitness', () => {
  it('агент на ранней стадии: половина, на стадии 1–2: полностью', () => {
    const auto = outcome('auto', 'aiAuto')
    expect(fitness(auto, verdict('f5'), stageOf('chatSelf'))).toBe(0.5)
    expect(fitness(auto, verdict('f5'), stageOf('automations'))).toBe(1)
    expect(fitness(auto, verdict('f4'), stageOf('none'))).toBe(1)
  })

  it('агент, оставленный человеку, не штрафуется; skip даёт ноль', () => {
    expect(fitness(outcome('human', 'human'), verdict('f5'), stageOf('none'))).toBe(1)
    expect(fitness(outcome('skip', 'skip'), verdict('stopData'), stageOf('none'))).toBe(0)
  })
})

describe('sortByPriority и pickStart', () => {
  it('по убыванию, равные сохраняют порядок', () => {
    const items = [item('stocks', 0, 'skip'), item('reviews', 3, 'ai'), item('ads', 0, 'skip'), item('unit', 3, 'auto')]
    expect(sortByPriority(items).map((i) => i.processId)).toEqual(['reviews', 'unit', 'stocks', 'ads'])
  })

  it('стартовый процесс только с цветом auto или ai', () => {
    expect(pickStart([item('competitors', 0.1, 'human'), item('digest', 0, 'skip')])).toBeUndefined()
    expect(pickStart([item('competitors', 2, 'human'), item('stocks', 1, 'auto')])).toBe('stocks')
  })

  it('незаполненный процесс не стартовый', () => {
    expect(pickStart([{ ...item('reviews', 3, 'ai'), status: 'pending' }])).toBeUndefined()
  })
})

describe('formatHours', () => {
  it('меньше часа и округление', () => {
    expect([formatHours(0), formatHours(0.4), formatHours(1.8), formatHours(6.3)]).toEqual(['<1', '<1', '2', '6'])
  })
})
