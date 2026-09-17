import { describe, expect, it } from 'vitest'
import type { ProcessId } from './ids'
import {
  briefReducer,
  deepList,
  initialState,
  invalidFields,
  isDeepComplete,
  stepNumber,
  type BriefState,
} from './state'

const started = (): BriefState => briefReducer(initialState(0), { type: 'start', now: 1000 })

const pick = (s: BriefState, ids: ProcessId[]) =>
  ids.reduce((acc, id) => briefReducer(acc, { type: 'toggleProcess', id }), s)

const completeDeep = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'sheet', risk: 'nothing', data: 'cabinet' } as const

describe('старт и сброс', () => {
  it('start открывает шаг 1 и запоминает время начала', () => {
    const s = started()
    expect(s.step).toBe('shop')
    expect(s.startedAtMs).toBe(1000)
  })

  it('reset возвращает к вводному экрану с пустыми ответами', () => {
    const s = briefReducer(pick(started(), ['reviews']), { type: 'reset' })
    expect(s).toEqual(initialState(0))
  })
})

describe('выбор процессов', () => {
  it('отметка добавляет процесс с часами 1–3, повторная убирает вместе с подробностями', () => {
    let s = pick(started(), ['reviews'])
    expect(s.answers.picked).toEqual([{ id: 'reviews', hours: '1to3' }])
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'etalon', value: 'many' })
    s = briefReducer(s, { type: 'toggleDeepChoice', id: 'reviews' })
    s = pick(s, ['reviews'])
    expect(s.answers.picked).toEqual([])
    expect(s.answers.deepAnswers.reviews).toBeUndefined()
    expect(s.answers.deepChoice).toEqual([])
  })

  it('до трёх отмеченных разбираются все, по порядку отметки', () => {
    const s = pick(started(), ['stocks', 'reviews'])
    expect(deepList(s.answers)).toEqual(['stocks', 'reviews'])
  })

  it('больше трёх: разбираются выбранные, не больше трёх', () => {
    let s = pick(started(), ['stocks', 'reviews', 'ads', 'unit'])
    for (const id of ['unit', 'ads', 'reviews', 'stocks'] as const) {
      s = briefReducer(s, { type: 'toggleDeepChoice', id })
    }
    expect(s.answers.deepChoice).toEqual(['unit', 'ads', 'reviews'])
    expect(deepList(s.answers)).toEqual(['unit', 'ads', 'reviews'])
  })

  it('смена правила на «инструкции на листке» стирает ответ про проверку', () => {
    let s = pick(started(), ['reviews'])
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'rule', value: 'experience' })
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'check', value: 'glance' })
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'rule', value: 'sheet' })
    expect(s.answers.deepAnswers.reviews?.check).toBeUndefined()
  })
})

describe('значения проверяются схемой', () => {
  it('setField с неподходящим значением не меняет состояние, подходящее применяется', () => {
    const s = started()
    expect(briefReducer(s, { type: 'setField', field: 'tools', value: 'bidder' })).toBe(s)
    expect(briefReducer(s, { type: 'setField', field: 'category', value: 'cars' })).toBe(s)
    expect(briefReducer(s, { type: 'setField', field: 'tools', value: ['bidder'] }).answers.tools).toEqual(['bidder'])
    expect(briefReducer(s, { type: 'setField', field: 'category', value: 'home' }).answers.category).toBe('home')
    expect(briefReducer(s, { type: 'setField', field: 'category', value: undefined }).answers.category).toBeUndefined()
  })

  it('setDeep с неподходящим значением не меняет состояние, подходящее применяется', () => {
    const s = pick(started(), ['reviews'])
    expect(briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'etalon', value: 'maybe' })).toBe(s)
    expect(briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'etalon', value: 'few' }).answers.deepAnswers.reviews).toEqual({
      etalon: 'few',
    })
  })
})

describe('isDeepComplete', () => {
  it('нужны шесть ответов, проверка только при суждении', () => {
    expect(isDeepComplete(completeDeep)).toBe(true)
    expect(isDeepComplete({ ...completeDeep, rule: 'experience' })).toBe(false)
    expect(isDeepComplete({ ...completeDeep, rule: 'experience', check: 'glance' })).toBe(true)
    expect(isDeepComplete({ ...completeDeep, data: undefined })).toBe(false)
    expect(isDeepComplete(undefined)).toBe(false)
  })
})

describe('навигация', () => {
  it('подробные экраны идут по одному на процесс, назад возвращает на последний', () => {
    let s = pick(started(), ['reviews', 'stocks'])
    s = { ...s, step: 'time' }
    s = briefReducer(s, { type: 'next' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 0])
    s = briefReducer(s, { type: 'next' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 1])
    s = briefReducer(s, { type: 'next' })
    expect(s.step).toBe('goals')
    s = briefReducer(s, { type: 'back' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 1])
    s = briefReducer(briefReducer(s, { type: 'back' }), { type: 'back' })
    expect(s.step).toBe('time')
  })

  it('номера шагов для прогресса', () => {
    expect(['intro', 'shop', 'now', 'time', 'deep', 'goals', 'map'].map((k) => stepNumber(k as BriefState['step']))).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ])
  })
})

describe('invalidFields', () => {
  it('шаг 1 требует площадку', () => {
    expect(invalidFields(started())).toEqual(['marketplaces'])
  })

  it('шаг 3 требует процесс, подробный выбор при >3 и название своего', () => {
    let s: BriefState = { ...started(), step: 'time' }
    expect(invalidFields(s)).toEqual(['picked'])
    s = pick(s, ['custom', 'reviews', 'ads', 'unit'])
    expect(invalidFields(s)).toEqual(['deepChoice', 'customLabel'])
  })

  it('подробный шаг перечисляет пропущенные вопросы', () => {
    let s = pick(started(), ['reviews'])
    s = { ...s, step: 'deep', deepIndex: 0 }
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'frequency', value: 'daily' })
    expect(invalidFields(s)).toEqual(['who', 'etalon', 'rule', 'risk', 'data'])
  })

  it('шаг 5 требует имя, контакт и согласие', () => {
    const s: BriefState = { ...started(), step: 'goals' }
    expect(invalidFields(s)).toEqual(['name', 'contact', 'consent'])
  })
})
