import { describe, expect, it } from 'vitest'
import { demoShop, headShop } from './fixtures'
import { normalizeAnswers } from './normalize'
import { emptyAnswers, type BriefAnswers, type DeepAnswers } from './schema'

const complete: DeepAnswers = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'sheet', risk: 'nothing', data: 'cabinet' }

describe('normalizeAnswers', () => {
  it('эталонные магазины не меняются, вплоть до JSON', () => {
    for (const a of [demoShop(), headShop()]) expect(JSON.stringify(normalizeAnswers(a))).toBe(JSON.stringify(a))
  })

  it('исходные ответы не мутирует', () => {
    const a: BriefAnswers = {
      ...demoShop(),
      categoryOther: 'Шины',
      deepAnswers: { ...demoShop().deepAnswers, stocks: { ...complete, check: 'glance' } },
    }
    const before = JSON.stringify(a)
    normalizeAnswers(a)
    expect(JSON.stringify(a)).toBe(before)
  })

  it('строка «другое» остаётся, только если выбран её вариант', () => {
    const typed = { marketplacesOther: 'Авито', categoryOther: 'Шины', ledgerOther: 'Битрикс', aiTried: 'Бот' }
    const hidden = normalizeAnswers({
      ...emptyAnswers(),
      ...typed,
      marketplaces: ['wb'],
      category: 'auto',
      ledger: ['sheets'],
      aiNow: 'chatSelf',
    })
    for (const k of Object.keys(typed)) expect(hidden, k).not.toHaveProperty(k)
    const shown = normalizeAnswers({
      ...emptyAnswers(),
      ...typed,
      marketplaces: ['wb', 'other'],
      category: 'other',
      ledger: ['other'],
      aiNow: 'triedFailed',
    })
    expect(shown).toMatchObject(typed)
  })

  it('часы внедрения только у себя или сотрудника, название своего только при отмеченном своём', () => {
    const a = { ...emptyAnswers(), implementerHours: 'gt5' as const, customLabel: 'Упаковка' }
    expect(normalizeAnswers({ ...a, implementer: 'nobody' })).not.toHaveProperty('implementerHours')
    expect(normalizeAnswers({ ...a, implementer: 'employee' }).implementerHours).toBe('gt5')
    expect(normalizeAnswers(a)).not.toHaveProperty('customLabel')
    expect(normalizeAnswers({ ...a, picked: [{ id: 'custom', hours: '1to3' }] }).customLabel).toBe('Упаковка')
  })

  it('подробный выбор только из отмеченных и пустой, если отмечено не больше трёх', () => {
    const picked: BriefAnswers['picked'] = [
      { id: 'reviews', hours: '1to3' },
      { id: 'stocks', hours: '1to3' },
      { id: 'ads', hours: '1to3' },
      { id: 'unit', hours: '1to3' },
    ]
    const a = { ...emptyAnswers(), picked, deepChoice: ['cards', 'ads', 'unit'] as BriefAnswers['deepChoice'] }
    expect(normalizeAnswers(a).deepChoice).toEqual(['ads', 'unit'])
    expect(normalizeAnswers({ ...a, picked: picked.slice(0, 3) }).deepChoice).toEqual([])
  })

  it('подробные ответы только по разбираемым процессам, проверка только при суждении', () => {
    const a: BriefAnswers = {
      ...emptyAnswers(),
      picked: [
        { id: 'reviews', hours: '1to3' },
        { id: 'stocks', hours: '1to3' },
      ],
      deepAnswers: {
        reviews: { ...complete, rule: 'experience', check: 'glance' },
        stocks: { ...complete, check: 'expert' },
        ads: complete,
      },
    }
    expect(normalizeAnswers(a).deepAnswers).toEqual({
      reviews: { ...complete, rule: 'experience', check: 'glance' },
      stocks: complete,
    })
  })
})
