import { emptyAnswers, type BriefAnswers } from './schema'

// Три эталонных магазина (спека, раздел 13). Ожидания к ним - в build-map.test.ts.

/** Магазин из макета: отзывы первыми, остатки программой, сверка ждёт данных. */
export function demoShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['wb', 'ozon'],
    fulfillment: ['fbo', 'fbs'],
    category: 'apparel',
    sku: '300to1000',
    ordersPerDay: '10to100',
    revenue: '5to20m',
    teamSize: '2to5',
    roles: ['manager', 'content'],
    ledger: ['sheets', 'moysklad'],
    costKnown: 'approx',
    tools: ['mpstats'],
    apiTokens: 'yes',
    aiNow: 'chatSelf',
    docs: 'partial',
    picked: [
      { id: 'reviews', hours: '5to10' },
      { id: 'stocks', hours: '1to3' },
      { id: 'ads', hours: '1to3' },
      { id: 'payouts', hours: '3to5' },
      { id: 'supply', hours: '1to3' },
    ],
    deepChoice: ['reviews', 'stocks', 'payouts'],
    deepAnswers: {
      reviews: { frequency: 'daily', who: 'me', etalon: 'many', rule: 'readInput', risk: 'buyersSee', data: 'cabinet', handover: 'give' },
      stocks: { frequency: 'daily', who: 'employee', etalon: 'few', rule: 'sheet', risk: 'money', data: 'sheet' },
      payouts: { frequency: 'weekly', who: 'me', etalon: 'many', rule: 'sheet', risk: 'money', data: 'head' },
    },
    goals: ['myTime', 'realProfit'],
    implementer: 'employee',
    implementerHours: '2to5',
    access: 'readOnly',
    ruOnly: 'preferred',
    budget: '150to400',
    notes: 'К ноябрю хочу разгрузить отзывы',
    name: 'Анна',
    contact: '@anna_shop',
    consent: true,
  }
}

/** «Всё в голове»: денежные процессы упираются в данные, ступень - аудит. */
export function headShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['wb'],
    fulfillment: ['fbo'],
    category: 'home',
    teamSize: 'solo',
    roles: ['onlyMe'],
    ledger: ['head'],
    costKnown: 'no',
    tools: ['none'],
    apiTokens: 'unknown',
    aiNow: 'none',
    docs: 'head',
    picked: [
      { id: 'unit', hours: '3to5' },
      { id: 'payouts', hours: '1to3' },
      { id: 'reviews', hours: '1to3' },
    ],
    deepAnswers: {
      unit: { frequency: 'weekly', who: 'me', etalon: 'few', rule: 'sheet', risk: 'money', data: 'sheet' },
      payouts: { frequency: 'weekly', who: 'me', etalon: 'many', rule: 'sheet', risk: 'money', data: 'cabinet' },
      reviews: { frequency: 'daily', who: 'me', etalon: 'no', rule: 'readInput', risk: 'buyersSee', data: 'cabinet' },
    },
    implementer: 'self',
    name: 'Олег',
    contact: '+7 900 000-00-00',
    consent: true,
  }
}

/** Один владелец, редкие задачи: почти всё «не трогать», итог меньше часа. */
export function soloRareShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['ozon'],
    teamSize: 'solo',
    roles: ['onlyMe'],
    ledger: ['sheets'],
    costKnown: 'exact',
    tools: ['none'],
    apiTokens: 'no',
    aiNow: 'chatSelf',
    picked: [
      { id: 'competitors', hours: 'lt1' },
      { id: 'digest', hours: 'lt1' },
    ],
    deepAnswers: {
      competitors: { frequency: 'rare', who: 'me', etalon: 'many', rule: 'readInput', risk: 'nothing', data: 'cabinet' },
      digest: { frequency: 'weekly', who: 'me', etalon: 'no', rule: 'readInput', risk: 'nothing', data: 'cabinet' },
    },
    name: 'Ира',
    contact: '@ira',
    consent: true,
  }
}
