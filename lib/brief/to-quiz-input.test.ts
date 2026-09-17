import { describe, expect, it } from 'vitest'
import { processCatalog } from '@/app/data/brief/processes'
import { emptyAnswers, type BriefAnswers, type DeepAnswers } from './schema'
import { toQuizInput } from './to-quiz-input'

const shop = (patch: Partial<BriefAnswers> = {}): BriefAnswers => ({
  ...emptyAnswers(),
  costKnown: 'exact',
  ledger: ['sheets'],
  ...patch,
})
const d: DeepAnswers = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'readInput', risk: 'buyersSee', data: 'cabinet' }

describe('toQuizInput', () => {
  it('отзывы: полный вход вердикта', () => {
    expect(toQuizInput(processCatalog.reviews, d, '1to3', shop())).toEqual({
      input: {
        hasEtalon: true,
        dataReady: true,
        useful: 'yes',
        rule: 'freeInput',
        check: 'expert',
        singleRun: true,
        sideEffect: 'write',
        irreversible: true,
        personalData: false,
      },
      dataReason: undefined,
    })
  })

  it('образец: «есть 1–2» считается, «нет» и «не знаю» нет', () => {
    const r = (etalon: DeepAnswers['etalon']) => toQuizInput(processCatalog.reviews, { ...d, etalon }, '1to3', shop()).input.hasEtalon
    expect([r('many'), r('few'), r('no'), r('unknown')]).toEqual([true, true, false, false])
  })

  it('данные «в голове» или «не знаю»: причина data', () => {
    for (const data of ['head', 'unknown'] as const) {
      const r = toQuizInput(processCatalog.reviews, { ...d, data }, '1to3', shop())
      expect([r.input.dataReady, r.dataReason]).toEqual([false, 'data'])
    }
  })

  it('денежный процесс без себестоимости: причина cost', () => {
    const r = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ costKnown: 'no' }))
    expect([r.input.dataReady, r.dataReason]).toEqual([false, 'cost'])
  })

  it('денежный процесс при учёте только «в голове»: причина ledger', () => {
    const r = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ ledger: ['head'] }))
    expect(r.dataReason).toBe('ledger')
    const ok = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ ledger: ['head', 'sheets'] }))
    expect(ok.dataReason).toBeUndefined()
  })

  it('не денежный процесс себестоимость не волнует', () => {
    expect(toQuizInput(processCatalog.reviews, d, '1to3', shop({ costKnown: 'no', ledger: ['head'] })).input.dataReady).toBe(true)
  })

  it('редко и меньше часа: rare; редко, но долго: yes', () => {
    expect(toQuizInput(processCatalog.reviews, { ...d, frequency: 'rare' }, 'lt1', shop()).input.useful).toBe('rare')
    expect(toQuizInput(processCatalog.reviews, { ...d, frequency: 'rare' }, '3to5', shop()).input.useful).toBe('yes')
  })

  it('правило и проверка', () => {
    const r = (patch: DeepAnswers) => toQuizInput(processCatalog.reviews, { ...d, ...patch }, '1to3', shop()).input
    expect(r({ rule: 'sheet' }).rule).toBe('full')
    expect(r({ rule: 'experience' }).rule).toBe('judgment')
    expect(r({ rule: 'unknown' }).rule).toBe('judgment')
    expect(r({ check: 'instant' }).check).toBe('auto')
    expect(r({ check: 'glance' }).check).toBe('quick')
  })

  it('необратимость только у процессов, которые пишут наружу', () => {
    expect(toQuizInput(processCatalog.reviews, { ...d, risk: 'nothing' }, '1to3', shop()).input.irreversible).toBe(false)
    expect(toQuizInput(processCatalog.reviews, { ...d, risk: 'unknown' }, '1to3', shop()).input.irreversible).toBe(true)
    expect(toQuizInput(processCatalog.ads, { ...d, risk: 'money' }, '1to3', shop()).input.irreversible).toBe(false)
  })

  it('персональные данные берутся из каталога', () => {
    expect(toQuizInput(processCatalog.returns, d, '1to3', shop()).input.personalData).toBe(true)
  })
})
