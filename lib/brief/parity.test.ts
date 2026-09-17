import { describe, expect, it } from 'vitest'
import { buildMap } from './build-map'
import { demoShop, headShop, soloRareShop } from './fixtures'
import * as ids from './ids'
import { buildInternal } from './internal'
import { normalizeAnswers } from './normalize'
import { renderTelegramSummary, SUMMARY_MAX } from './render-telegram'
import { briefSubmitSchema, type BriefAnswers, type DeepAnswers, type DeepQuestionId } from './schema'
import {
  briefReducer,
  deepList,
  initialState,
  invalidFields,
  type BriefAction,
  type BriefState,
  type GeneralField,
} from './state'

// Соответствие браузера и сервера: живая карта строится по черновику со скрытыми ответами,
// сервер строит карту по проверенным и нормализованным ответам. Для любого черновика,
// дошедшего до карты, обе карты должны совпадать, а сервер должен принять ответы.

const apply = (s: BriefState, actions: readonly BriefAction[]) => actions.reduce(briefReducer, s)
const field = (f: GeneralField, value: string | string[] | undefined): BriefAction => ({ type: 'setField', field: f, value })
const deep = (id: ids.ProcessId, d: DeepAnswers): BriefAction[] =>
  Object.entries(d).map(([f, value]) => ({ type: 'setDeep', id, field: f as DeepQuestionId, value }))
const toggle = (...xs: ids.ProcessId[]): BriefAction[] => xs.map((id) => ({ type: 'toggleProcess', id }))
const choose = (...xs: ids.ProcessId[]): BriefAction[] => xs.map((id) => ({ type: 'toggleDeepChoice', id }))

/** Сервер принимает ответы, и его карта совпадает с картой браузера. */
function expectParity(answers: BriefAnswers, k?: string) {
  const parsed = briefSubmitSchema.safeParse({ answers, k, startedAtMs: 1000, website: '' })
  expect(parsed.success, JSON.stringify(parsed.error?.issues)).toBe(true)
  const server = normalizeAnswers(parsed.data!.answers)
  const serverMap = buildMap(server)
  expect(buildMap(answers)).toEqual(serverMap)
  return { server, serverMap }
}

const general: BriefAction[] = [
  { type: 'start', now: 1000, k: 'anna' },
  // Площадка «другое» с текстом, потом без неё: строка скрыта, но хранится.
  field('marketplaces', ['wb', 'other']),
  field('marketplacesOther', 'Лавка у дома'),
  field('marketplaces', ['wb', 'ozon']),
  field('fulfillment', ['fbo', 'fbs']),
  // Категория «другое» с текстом, потом смена категории.
  field('category', 'other'),
  field('categoryOther', 'Товары для дачи'),
  field('category', 'apparel'),
  field('sku', '300to1000'),
  field('ordersPerDay', '10to100'),
  field('revenue', '5to20m'),
  field('teamSize', '2to5'),
  field('roles', ['manager', 'content']),
  field('ledger', ['sheets', 'other']),
  field('ledgerOther', 'Блокнот'),
  field('ledger', ['sheets', 'moysklad']),
  field('costKnown', 'approx'),
  field('tools', ['mpstats']),
  field('apiTokens', 'yes'),
  field('aiNow', 'triedFailed'),
  field('aiTried', 'Бот для отзывов\nне пошёл'),
  field('aiNow', 'chatSelf'),
  field('docs', 'partial'),
  field('goals', ['myTime', 'realProfit']),
  // Внедряю сам с часами, потом «некому»: часы скрыты.
  field('implementer', 'self'),
  field('implementerHours', '2to5'),
  field('implementer', 'nobody'),
  field('access', 'readOnly'),
  field('ruOnly', 'preferred'),
  field('budget', '150to400'),
  field('notes', 'К ноябрю хочу разгрузить отзывы'),
  field('name', 'Анна'),
  field('contact', '@anna_shop'),
  { type: 'setConsent', value: true },
]

const full = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'readInput', risk: 'buyersSee', data: 'cabinet' } as const

/** Больше трёх процессов; у снятого с подробного выбора остались ответы, свой процесс снят с названием. */
const dirtyMany = (): BriefState =>
  apply(initialState(0), [
    ...general,
    ...toggle('reviews', 'stocks', 'ads', 'payouts', 'supply', 'custom'),
    field('customLabel', 'Заказ упаковки'),
    ...toggle('custom'),
    { type: 'setHours', id: 'reviews', hours: '5to10' },
    ...choose('reviews', 'stocks', 'ads'),
    ...deep('reviews', { ...full, handover: 'give' }),
    ...deep('stocks', { ...full, who: 'employee', etalon: 'few', rule: 'experience', check: 'glance', risk: 'money' }),
    ...deep('ads', { ...full, rule: 'unknown', check: 'expert', data: 'file' }),
    ...choose('ads', 'payouts'),
    ...deep('payouts', { ...full, frequency: 'weekly', rule: 'sheet', risk: 'money', data: 'head' }),
  ])

/** Три процесса и устаревший подробный выбор; снятый с выбора процесс снова в разборе. */
const dirtyFew = (): BriefState => apply(dirtyMany(), [...toggle('supply', 'payouts')])

describe('браузер и сервер: одна карта', () => {
  it('грязные черновики действительно грязные', () => {
    const many = dirtyMany().answers
    expect(many.marketplacesOther).toBe('Лавка у дома')
    expect(many.categoryOther).toBe('Товары для дачи')
    expect(many.implementerHours).toBe('2to5')
    expect(many.customLabel).toBe('Заказ упаковки')
    expect(many.picked.length).toBeGreaterThan(3)
    expect(Object.keys(many.deepAnswers)).toContain('ads')
    expect(deepList(many)).not.toContain('ads')
    const few = dirtyFew().answers
    expect(few.picked.map((p) => p.id)).toEqual(['reviews', 'stocks', 'ads'])
    expect(few.deepChoice).toEqual(['reviews', 'stocks'])
    expect(deepList(few)).toEqual(['reviews', 'stocks', 'ads'])
  })

  it('грязные черновики и три эталонных магазина: сервер принимает, карты совпадают', () => {
    for (const answers of [dirtyMany().answers, dirtyFew().answers, demoShop(), headShop(), soloRareShop()]) {
      expectParity(answers, 'anna')
    }
    const { server } = expectParity(dirtyMany().answers)
    for (const hidden of ['marketplacesOther', 'categoryOther', 'ledgerOther', 'aiTried', 'implementerHours', 'customLabel'] as const) {
      expect(server[hidden], hidden).toBeUndefined()
    }
    expect(Object.keys(server.deepAnswers)).not.toContain('ads')
  })
})

// Детерминированный генератор: одно и то же зерно даёт одни и те же прогоны.
function lcg(seed: number) {
  let x = seed >>> 0
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    return x / 2 ** 32
  }
}

describe('случайные прохождения брифа', () => {
  const RUNS = 500
  const MAX_ACTIONS = 600
  const rnd = lcg(20260917)
  const pickOne = <T>(xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)]
  const maybe = <T>(xs: readonly T[]): T | undefined => (rnd() < 0.15 ? undefined : pickOne(xs))
  const subset = <T>(xs: readonly T[], max = xs.length): T[] => xs.filter(() => rnd() < 0.35).slice(0, max)
  const texts = ['Лавка', '  С пробелами  ', 'Бот\nне пошёл', 'x', 'Упаковка & <b>', '', '   ']

  const shopActions = (): BriefAction[] => [
    field('marketplaces', subset(ids.MARKETPLACES)),
    field('marketplacesOther', pickOne(texts)),
    field('fulfillment', subset(ids.FULFILLMENT)),
    field('category', maybe(ids.CATEGORIES)),
    field('categoryOther', pickOne(texts)),
    field('sku', maybe(ids.SKU_BANDS)),
    field('ordersPerDay', maybe(ids.ORDER_BANDS)),
    field('revenue', maybe(ids.REVENUE_BANDS)),
    field('teamSize', maybe(ids.TEAM_SIZES)),
    field('roles', subset(ids.ROLES)),
  ]
  const nowActions = (): BriefAction[] => [
    field('ledger', subset(ids.LEDGERS)),
    field('ledgerOther', pickOne(texts)),
    field('costKnown', maybe(ids.COST_KNOWN)),
    field('tools', subset(ids.TOOLS)),
    field('apiTokens', maybe(ids.API_TOKENS)),
    field('aiNow', maybe(ids.AI_NOW)),
    field('aiTried', pickOne(texts)),
    field('docs', maybe(ids.DOCS)),
  ]
  const deepValues: { [K in DeepQuestionId]: readonly NonNullable<DeepAnswers[K]>[] } = {
    frequency: ids.FREQUENCY,
    who: ids.WHO,
    etalon: ids.ETALON,
    rule: ids.RULE,
    check: ids.CHECK,
    risk: ids.RISK,
    data: ids.DATA_SOURCE,
    handover: ids.HANDOVER,
  }
  const setDeep = (id: ids.ProcessId, f: DeepQuestionId): BriefAction => ({ type: 'setDeep', id, field: f, value: pickOne(deepValues[f]) })
  const timeActions = (s: BriefState): BriefAction[] => {
    const picked = s.answers.picked.map((p) => p.id)
    return [
      ...toggle(pickOne(ids.PROCESS_IDS)),
      ...(picked.length > 0 ? [{ type: 'setHours', id: pickOne(picked), hours: pickOne(ids.HOURS_BANDS) } as const] : []),
      ...(picked.length > 0 ? choose(pickOne(picked)) : []),
      field('customLabel', pickOne(texts)),
    ]
  }
  const goalsActions = (): BriefAction[] => [
    field('goals', subset(ids.GOALS, 2)),
    field('implementer', maybe(ids.IMPLEMENTERS)),
    field('implementerHours', maybe(ids.IMPLEMENTER_HOURS)),
    field('access', maybe(ids.ACCESS)),
    field('ruOnly', maybe(ids.RU_ONLY)),
    field('budget', maybe(ids.BUDGETS)),
    field('notes', pickOne(texts)),
    field('name', pickOne(['Анна', ' Олег ', 'И', ''])),
    field('contact', pickOne(['@anna_shop', '+7 900 000-00-00', 'ab', ''])),
    { type: 'setConsent', value: rnd() < 0.7 },
  ]

  /** Действие, которое чинит первую ошибку шага: без него прогон редко доходит до карты. */
  const fix = (s: BriefState, invalid: string): BriefAction => {
    const id = deepList(s.answers)[s.deepIndex]
    switch (invalid) {
      case 'marketplaces':
        return field('marketplaces', [pickOne(ids.MARKETPLACES)])
      case 'picked':
        return toggle(pickOne(ids.PROCESS_IDS))[0]
      case 'deepChoice':
        return choose(pickOne(s.answers.picked.map((p) => p.id)))[0]
      case 'customLabel':
        return field('customLabel', pickOne(['Упаковка', ' Свой процесс ']))
      case 'name':
        return field('name', 'Анна')
      case 'contact':
        return field('contact', '@anna_shop')
      case 'consent':
        return { type: 'setConsent', value: true }
      default:
        return setDeep(id, invalid as DeepQuestionId)
    }
  }

  const stepActions = (s: BriefState): BriefAction[] => {
    switch (s.step) {
      case 'shop':
        return shopActions()
      case 'now':
        return nowActions()
      case 'time':
        return timeActions(s)
      case 'deep': {
        const id = deepList(s.answers)[s.deepIndex]
        return (Object.keys(deepValues) as DeepQuestionId[]).map((f) => setDeep(id, f))
      }
      case 'goals':
        return goalsActions()
      default:
        return []
    }
  }

  it(`${RUNS} прогонов: дошедшие до карты черновики сервер принимает, карты совпадают, сводка в лимите`, () => {
    let reached = 0
    for (let run = 0; run < RUNS; run++) {
      let s = briefReducer(initialState(0), { type: 'start', now: 1000 })
      for (let i = 0; i < MAX_ACTIONS && s.step !== 'map'; i++) {
        const invalid = invalidFields(s)
        const r = rnd()
        let action: BriefAction
        if (invalid.length === 0 && r < 0.3) action = { type: 'next' }
        else if (r < 0.36) action = { type: 'back' }
        else if (invalid.length > 0 && r < 0.6) action = fix(s, invalid[0])
        else action = pickOne(stepActions(s))
        if (s.step === 'intro') action = { type: 'next' }
        s = briefReducer(s, action)
      }
      if (s.step !== 'map') continue
      reached++
      const k = pickOne([undefined, 'anna', 'a'.repeat(32)])
      const { server, serverMap } = expectParity(s.answers, k)
      const fillSeconds = pickOne([undefined, 0, 5, 59, 600])
      const summary = renderTelegramSummary(server, serverMap, buildInternal(server, serverMap, { fillSeconds }), k)
      expect(summary.length).toBeLessThanOrEqual(SUMMARY_MAX)
    }
    // Проверка не пустая: большая часть прогонов доходит до карты.
    expect(reached).toBeGreaterThan(RUNS * 0.8)
  })
})
