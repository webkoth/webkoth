import { describe, expect, it } from 'vitest'
import { briefAnswersSchema, briefSubmitSchema, emptyAnswers } from './schema'

const filled = () => ({
  ...emptyAnswers(),
  marketplaces: ['wb' as const],
  picked: [{ id: 'reviews' as const, hours: '1to3' as const }],
  name: 'Анна',
  contact: '@anna',
  consent: true,
})

describe('briefAnswersSchema', () => {
  it('пустые ответы проходят: это состояние черновика', () => {
    expect(briefAnswersSchema.safeParse(emptyAnswers()).success).toBe(true)
  })

  it('незнакомый процесс отклоняется', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'nope', hours: '1to3' }] }
    expect(briefAnswersSchema.safeParse(a).success).toBe(false)
  })
})

describe('briefSubmitSchema', () => {
  const base = { startedAtMs: 1_700_000_000_000 }

  it('заполненный бриф проходит', () => {
    expect(briefSubmitSchema.safeParse({ ...base, answers: filled() }).success).toBe(true)
  })

  it('без согласия отклоняется с путём consent', () => {
    const r = briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), consent: false } })
    expect(r.success).toBe(false)
    expect(r.error?.issues.some((i) => i.path.join('.') === 'answers.consent')).toBe(true)
  })

  it('без площадок, процессов, имени или контакта отклоняется', () => {
    for (const patch of [{ marketplaces: [] }, { picked: [] }, { name: 'А' }, { contact: '' }]) {
      expect(briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), ...patch } }).success).toBe(false)
    }
  })

  it('перенос строки в имени отклоняется', () => {
    expect(briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), name: 'Анна\nBcc' } }).success).toBe(false)
  })

  it('метка k только латиница, цифры и дефис', () => {
    expect(briefSubmitSchema.safeParse({ ...base, k: 'anna-1', answers: filled() }).success).toBe(true)
    expect(briefSubmitSchema.safeParse({ ...base, k: 'Анна', answers: filled() }).success).toBe(false)
  })

  it('больше трёх процессов в подробном выборе отклоняется', () => {
    const a = { ...filled(), deepChoice: ['reviews', 'ads', 'stocks', 'unit'] }
    expect(briefSubmitSchema.safeParse({ ...base, answers: a }).success).toBe(false)
  })
})
