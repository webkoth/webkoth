import { describe, expect, it } from 'vitest'
import { demoShop } from './fixtures'
import { briefAnswersSchema, briefSubmitSchema, emptyAnswers, type BriefAnswers } from './schema'

const filled = (): BriefAnswers => ({
  ...emptyAnswers(),
  marketplaces: ['wb'],
  picked: [{ id: 'reviews', hours: '1to3' }],
  deepAnswers: { reviews: demoShop().deepAnswers.reviews },
  name: 'Анна',
  contact: '@anna',
  consent: true,
})

const paths = (r: { error?: { issues: { path: PropertyKey[]; message: string }[] } }) =>
  (r.error?.issues ?? []).map((i) => `${i.path.join('.')}:${i.message}`)

describe('briefAnswersSchema', () => {
  it('пустые ответы проходят: это состояние черновика', () => {
    expect(briefAnswersSchema.safeParse(emptyAnswers()).success).toBe(true)
  })

  it('незнакомый процесс отклоняется', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'nope', hours: '1to3' }] }
    expect(briefAnswersSchema.safeParse(a).success).toBe(false)
  })

  it('повторы в отмеченных процессах и в подробном выборе отклоняются', () => {
    const picked = { ...emptyAnswers(), picked: [{ id: 'reviews', hours: '1to3' }, { id: 'reviews', hours: 'lt1' }] }
    expect(paths(briefAnswersSchema.safeParse(picked))).toEqual(['picked:duplicate'])
    const deepChoice = { ...emptyAnswers(), deepChoice: ['ads', 'ads'] }
    expect(paths(briefAnswersSchema.safeParse(deepChoice))).toEqual(['deepChoice:duplicate'])
  })

  it('что пробовали с ИИ: свободный текст с переносами строк', () => {
    expect(briefAnswersSchema.safeParse({ ...emptyAnswers(), aiTried: 'Бот в Telegram\nне понял отзывы' }).success).toBe(true)
    expect(briefAnswersSchema.safeParse({ ...emptyAnswers(), aiTried: 'я'.repeat(501) }).success).toBe(false)
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

  it('демо-магазин проходит', () => {
    expect(briefSubmitSchema.safeParse({ ...base, answers: demoShop() }).success).toBe(true)
  })

  it('нечего разбирать подробно: отклоняется с путём deepChoice', () => {
    const a = demoShop()
    const r = briefSubmitSchema.safeParse({ ...base, answers: { ...a, deepChoice: [] } })
    expect(paths(r)).toContain('answers.deepChoice:required')
  })

  it('незаполненный подробный разбор отклоняется с путём процесса', () => {
    const a = demoShop()
    const r = briefSubmitSchema.safeParse({
      ...base,
      answers: { ...a, deepAnswers: { ...a.deepAnswers, stocks: { ...a.deepAnswers.stocks, data: undefined } } },
    })
    expect(paths(r)).toEqual(['answers.deepAnswers.stocks:incomplete'])
  })

  it('свой процесс без названия отклоняется', () => {
    const a: BriefAnswers = {
      ...filled(),
      picked: [{ id: 'custom', hours: '1to3' }],
      deepAnswers: { custom: demoShop().deepAnswers.reviews },
    }
    expect(paths(briefSubmitSchema.safeParse({ ...base, answers: { ...a, customLabel: '  ' } }))).toEqual(['answers.customLabel:required'])
    expect(briefSubmitSchema.safeParse({ ...base, answers: { ...a, customLabel: 'Упаковка' } }).success).toBe(true)
  })

  it('больше трёх процессов в подробном выборе отклоняется', () => {
    const a = { ...filled(), deepChoice: ['reviews', 'ads', 'stocks', 'unit'] }
    expect(briefSubmitSchema.safeParse({ ...base, answers: a }).success).toBe(false)
  })
})
