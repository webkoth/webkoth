import { describe, expect, it } from 'vitest'
import { explainCopy, outcomeCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { buildMap, usesReadyTool } from './build-map'
import { demoShop, headShop, soloRareShop } from './fixtures'
import { formatHours } from './priority'
import { emptyAnswers, type BriefAnswers } from './schema'

describe('демо-магазин', () => {
  const map = buildMap(demoShop())

  it('порядок по приоритету и «начните с»', () => {
    expect(map.items.map((i) => i.processId)).toEqual(['reviews', 'stocks', 'payouts'])
    expect(map.startId).toBe('reviews')
    expect(map.startFallback).toBeUndefined()
  })

  it('отзывы: ИИ готовит, утверждаете вы', () => {
    const r = map.items[0]
    expect(r.verdict?.form).toBe('f4')
    expect(r.chain.map((s) => s.color)).toEqual(['auto', 'auto', 'ai', 'human', 'auto'])
    expect(r.returnedHours).toBeCloseTo(4.5)
    expect(r.why).toEqual([explainCopy.why.mostHours, explainCopy.why.hasEtalon, explainCopy.why.approval])
    expect(r.prepare).toEqual([explainCopy.prepare.approver])
    expect(r.branches).toHaveLength(1)
    expect(r.readyMade).toEqual({ kind: 'cabinet', text: processCatalog.reviews.readyMade!.text, alreadyUsing: false })
  })

  it('остатки: программа исполняет, вы утверждаете', () => {
    const s = map.items[1]
    expect(s.verdict?.form).toBe('f3')
    expect(s.chain.map((x) => x.color)).toEqual(['auto', 'auto', 'human', 'auto'])
    expect(s.returnedHours).toBeCloseTo(1.8)
    expect(s.prepare).toEqual([explainCopy.prepare.moreEtalons, explainCopy.prepare.approver])
    expect(s.readyMade?.alreadyUsing).toBe(true)
    expect(s.why).toEqual([])
  })

  it('сверка: сначала данные', () => {
    const p = map.items[2]
    expect([p.verdict?.form, p.dataReason, p.returnedHours]).toEqual(['stopData', 'data', 0])
    expect(p.prepare).toEqual([explainCopy.prepare.data])
  })

  it('итог, не разобранные, стадия', () => {
    expect(map.totalReturnedHours).toBeCloseTo(6.3)
    expect(map.notDeep.map((n) => [n.processId, n.hours])).toEqual([
      ['ads', 2],
      ['supply', 2],
    ])
    expect(map.stage.key).toBe('stage1')
  })
})

describe('«всё в голове»', () => {
  const map = buildMap(headShop())

  it('денежные процессы ждут данных, отзывы ждут образца', () => {
    expect(map.items.map((i) => [i.processId, i.verdict?.form])).toEqual([
      ['unit', 'stopData'],
      ['payouts', 'stopData'],
      ['reviews', 'stopEtalon'],
    ])
    expect(map.items[0].dataReason).toBe('cost')
  })

  it('старта нет, начинать с порядка', () => {
    expect(map.startId).toBeUndefined()
    expect(map.startFallback).toEqual({ processId: 'unit', text: explainCopy.prepare.cost })
    expect(map.stage.key).toBe('stage0')
    expect(map.totalReturnedHours).toBe(0)
  })
})

describe('один владелец, редкие задачи', () => {
  const map = buildMap(soloRareShop())

  it('конкуренты остаются вам, сводка ждёт образца', () => {
    expect(map.items.map((i) => [i.processId, i.outcome?.color])).toEqual([
      ['competitors', 'human'],
      ['digest', 'skip'],
    ])
    expect(map.startId).toBeUndefined()
    expect(map.startFallback).toEqual({
      processId: 'digest',
      text: explainCopy.prepare.etalon(processCatalog.digest.hints.etalon),
    })
  })

  it('итог меньше часа', () => {
    expect(map.totalReturnedHours).toBeCloseTo(0.1)
    expect(formatHours(map.totalReturnedHours)).toBe('<1')
  })
})

describe('частичные ответы и особые случаи', () => {
  it('пустой бриф: пустая карта без падения', () => {
    const map = buildMap(emptyAnswers())
    expect([map.items, map.notDeep, map.startId, map.totalReturnedHours]).toEqual([[], [], undefined, 0])
  })

  it('процесс отмечен, подробностей нет: пункт ждёт', () => {
    const map = buildMap({ ...emptyAnswers(), picked: [{ id: 'reviews', hours: '1to3' }] })
    const r = map.items[0]
    expect(r.status).toBe('pending')
    expect(r.chain.find((s) => s.label === 'Черновик ответа')).toEqual({
      label: 'Черновик ответа',
      color: 'skip',
      caption: outcomeCopy.captions.pending,
    })
    expect(r.chain.some((s) => s.label === 'Утвердить')).toBe(false)
    expect([map.startId, map.startFallback, map.totalReturnedHours]).toEqual([undefined, undefined, 0])
  })

  it('агент на ранней стадии теряет половину приоритета', () => {
    const answers = (aiNow: BriefAnswers['aiNow']): BriefAnswers => ({
      ...emptyAnswers(),
      aiNow,
      picked: [{ id: 'digest', hours: '5to10' }],
      deepAnswers: {
        digest: { frequency: 'daily', who: 'me', etalon: 'many', rule: 'experience', check: 'glance', risk: 'nothing', data: 'cabinet' },
      },
    })
    const early = buildMap(answers('chatSelf')).items[0]
    const later = buildMap(answers('automations')).items[0]
    expect(early.verdict?.form).toBe('f5')
    expect(early.returnedHours).toBeCloseTo(6)
    expect(early.priority).toBeCloseTo(3)
    expect(later.priority).toBeCloseTo(6)
  })

  it('причина «нет данных» хранится только у остановки по данным', () => {
    const map = buildMap({
      ...emptyAnswers(),
      picked: [{ id: 'reviews', hours: '1to3' }],
      deepAnswers: {
        reviews: { frequency: 'daily', who: 'me', etalon: 'no', rule: 'readInput', risk: 'buyersSee', data: 'head' },
      },
    })
    expect([map.items[0].verdict?.form, map.items[0].dataReason]).toEqual(['stopEtalon', undefined])
    expect(map.items[0].prepare).toEqual([explainCopy.prepare.etalon(processCatalog.reviews.hints.etalon)])
  })

  it('своё: название селлера и пометка', () => {
    const map = buildMap({ ...emptyAnswers(), customLabel: 'Упаковка', picked: [{ id: 'custom', hours: '1to3' }] })
    expect([map.items[0].label, map.items[0].entryNote]).toEqual(['Упаковка', processCatalog.custom.mapNote])
  })

  it('usesReadyTool по ответам про сервисы и учёт', () => {
    const a = { ...emptyAnswers(), tools: ['mayak' as const], ledger: ['1c' as const] }
    expect([usesReadyTool(a, 'analytics'), usesReadyTool(a, 'ledgerSystem'), usesReadyTool(a, 'bidder'), usesReadyTool(a, undefined)]).toEqual([
      true,
      true,
      false,
      false,
    ])
  })
})
