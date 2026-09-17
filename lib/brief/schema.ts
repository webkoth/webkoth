import { z } from 'zod'
import { deepList, isDeepComplete, MAX_DEEP } from './deep'
import * as ids from './ids'

// Схема ответов брифа. Одна на браузер (черновик, localStorage) и сервер (отправка).
// Черновик допускает пустые поля; строгие требования к отправке - в briefSubmitSchema.

// Переносы строк запрещены в однострочных полях: имя и контакт уходят в заголовок
// сообщения и в имя файла, «\r\n» там ломает разметку.
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(/^[^\r\n]*$/, 'no_newline')

export const deepAnswersSchema = z.object({
  frequency: z.enum(ids.FREQUENCY).optional(),
  who: z.enum(ids.WHO).optional(),
  etalon: z.enum(ids.ETALON).optional(),
  rule: z.enum(ids.RULE).optional(),
  check: z.enum(ids.CHECK).optional(),
  risk: z.enum(ids.RISK).optional(),
  data: z.enum(ids.DATA_SOURCE).optional(),
  handover: z.enum(ids.HANDOVER).optional(),
})
export type DeepAnswers = z.infer<typeof deepAnswersSchema>
export type DeepQuestionId = keyof DeepAnswers

export const briefAnswersSchema = z.object({
  // Шаг 1
  marketplaces: z.array(z.enum(ids.MARKETPLACES)).max(ids.MARKETPLACES.length),
  marketplacesOther: line(60).optional(),
  fulfillment: z.array(z.enum(ids.FULFILLMENT)).max(ids.FULFILLMENT.length),
  category: z.enum(ids.CATEGORIES).optional(),
  categoryOther: line(60).optional(),
  sku: z.enum(ids.SKU_BANDS).optional(),
  ordersPerDay: z.enum(ids.ORDER_BANDS).optional(),
  revenue: z.enum(ids.REVENUE_BANDS).optional(),
  teamSize: z.enum(ids.TEAM_SIZES).optional(),
  roles: z.array(z.enum(ids.ROLES)).max(ids.ROLES.length),
  // Шаг 2
  ledger: z.array(z.enum(ids.LEDGERS)).max(ids.LEDGERS.length),
  ledgerOther: line(60).optional(),
  costKnown: z.enum(ids.COST_KNOWN).optional(),
  tools: z.array(z.enum(ids.TOOLS)).max(ids.TOOLS.length),
  apiTokens: z.enum(ids.API_TOKENS).optional(),
  aiNow: z.enum(ids.AI_NOW).optional(),
  // Свободный рассказ о неудачном пилоте: переносы строк допустимы, в заголовки он не идёт.
  aiTried: z.string().trim().max(500).optional(),
  docs: z.enum(ids.DOCS).optional(),
  // Шаг 3: порядок массива - порядок, в котором селлер отмечал процессы
  picked: z
    .array(z.object({ id: z.enum(ids.PROCESS_IDS), hours: z.enum(ids.HOURS_BANDS) }))
    .max(ids.PROCESS_IDS.length),
  customLabel: line(80).optional(),
  deepChoice: z.array(z.enum(ids.PROCESS_IDS)).max(MAX_DEEP),
  // Шаг 4
  deepAnswers: z.partialRecord(z.enum(ids.PROCESS_IDS), deepAnswersSchema),
  // Шаг 5
  goals: z.array(z.enum(ids.GOALS)).max(2),
  implementer: z.enum(ids.IMPLEMENTERS).optional(),
  implementerHours: z.enum(ids.IMPLEMENTER_HOURS).optional(),
  access: z.enum(ids.ACCESS).optional(),
  ruOnly: z.enum(ids.RU_ONLY).optional(),
  budget: z.enum(ids.BUDGETS).optional(),
  notes: z.string().trim().max(1000).optional(),
  name: line(80).optional(),
  contact: line(120).optional(),
  consent: z.boolean(),
}).superRefine((a, ctx) => {
  // Повторы ломают порядок разбора и счёт часов: процесс считается один раз.
  const unique = (xs: readonly string[], path: string) => {
    if (new Set(xs).size !== xs.length) ctx.addIssue({ code: 'custom', path: [path], message: 'duplicate' })
  }
  unique(a.picked.map((p) => p.id), 'picked')
  unique(a.deepChoice, 'deepChoice')
})
export type BriefAnswers = z.infer<typeof briefAnswersSchema>

export function emptyAnswers(): BriefAnswers {
  return {
    marketplaces: [],
    fulfillment: [],
    roles: [],
    ledger: [],
    tools: [],
    picked: [],
    deepChoice: [],
    deepAnswers: {},
    goals: [],
    consent: false,
  }
}

export const briefSubmitSchema = z.object({
  answers: briefAnswersSchema.superRefine((a, ctx) => {
    const need = (ok: boolean, path: string, message: string) => {
      if (!ok) ctx.addIssue({ code: 'custom', path: [path], message })
    }
    need(a.marketplaces.length > 0, 'marketplaces', 'required')
    need(a.picked.length > 0, 'picked', 'required')
    // Карта строится по подробным ответам: без них сервер собрал бы пустую карту.
    const deep = deepList(a)
    need(deep.length > 0, 'deepChoice', 'required')
    for (const id of deep) {
      if (isDeepComplete(a.deepAnswers[id])) continue
      ctx.addIssue({ code: 'custom', path: ['deepAnswers', id], message: 'incomplete' })
    }
    const custom = a.picked.some((p) => p.id === 'custom')
    need(!custom || Boolean(a.customLabel?.trim()), 'customLabel', 'required')
    need((a.name ?? '').length >= 2, 'name', 'name_min')
    need((a.contact ?? '').length >= 3, 'contact', 'contact_min')
    need(a.consent, 'consent', 'consent_required')
  }),
  k: z.string().regex(ids.LABEL_RE).optional(),
  startedAtMs: z.number().int().positive(),
  // honeypot: непустое значение роут ловит тихой двухсоткой
  website: z.string().max(200).optional(),
})
export type BriefSubmit = z.infer<typeof briefSubmitSchema>
