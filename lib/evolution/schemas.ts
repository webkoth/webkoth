import { z } from 'zod'

// Слаги лендингов дублируются здесь строкой, а не импортом из app/data:
// схема живёт в lib и не должна тянуть за собой тексты страниц.
export const LEAD_LANDINGS = ['kontur', 'it-director', 'agent', 'finance'] as const

// Откуда пришла заявка с лендинга: страница, пресет квиза и тег вердикта.
// Всё необязательное: заявка с главной идёт без source.
export const leadSourceSchema = z.object({
  landing: z.enum(LEAD_LANDINGS),
  // sourceLabel склеивает preset и verdict в одну строку через ' · ' -
  // перенос строки здесь так же ломает подпись, как и в name/contact.
  preset: z.string().trim().max(60).regex(/^[^\r\n]+$/, 'no_newline').optional(),
  verdict: z.string().trim().max(20).regex(/^[^\r\n]+$/, 'no_newline').optional(),
})

export type LeadSource = z.infer<typeof leadSourceSchema>

// Метки рекламы первого и последнего входа и ClientID Метрики (lib/analytics/attribution.ts).
// Всё необязательное: заявка без рекламы приходит без них. Строки короткие и без
// переносов — они уходят в уведомление.
const attrValue = z.string().trim().max(200).regex(/^[^\r\n]*$/, 'no_newline').optional()
export const leadTouchSchema = z.object({
  landing: attrValue,
  at: attrValue,
  utm_source: attrValue,
  utm_medium: attrValue,
  utm_campaign: attrValue,
  utm_content: attrValue,
  utm_term: attrValue,
  yclid: attrValue,
  placement: attrValue,
  source_type: attrValue,
  device: attrValue,
  region: attrValue,
  cid: attrValue,
  gid: attrValue,
  aid: attrValue,
  pid: attrValue,
  match: attrValue,
})
export const leadAttributionSchema = z.object({
  first: leadTouchSchema.optional(),
  last: leadTouchSchema.optional(),
  clientId: attrValue,
})

export type LeadAttribution = z.infer<typeof leadAttributionSchema>

// Необязательные поля лендинга («Какая 1С», «Площадки», «Оборот в месяц»): ключ из данных
// страницы → строка. Ключи и число полей ограничены, чтобы тело запроса не стало мешком
// для чего угодно; пустые строки выбрасываются - незаполненное поле не попадает в уведомление.
export const LEAD_DETAILS_MAX = 6
export const LEAD_DETAIL_KEY = /^[A-Za-z0-9-]{1,32}$/
export const leadDetailsSchema = z
  .record(
    z.string().regex(LEAD_DETAIL_KEY, 'detail_key'),
    z.string().trim().max(200).regex(/^[^\r\n]*$/, 'no_newline'),
  )
  .refine((d) => Object.keys(d).length <= LEAD_DETAILS_MAX, 'details_max')
  .transform((d) => Object.fromEntries(Object.entries(d).filter(([, v]) => v.length > 0)))

export type LeadDetails = z.infer<typeof leadDetailsSchema>

// Форма главной (RU `/`, EN `/en`) — минимум полей: имя, контакт и один
// квалифицирующий вопрос оффера. Сообщения об ошибках — коды: текст на нужном
// языке подставляет форма из `data.finale.form.errors`.
export const evolutionLeadSchema = z.object({
  // Переносы строк запрещены: имя уходит в тему письма (email.ts), а «\r\n» в
  // заголовке — это header injection. .trim() снимает их только по краям.
  name: z
    .string()
    .trim()
    .min(2, 'name_min')
    .max(120)
    .regex(/^[^\r\n]+$/, 'no_newline'),
  contact: z
    .string()
    .trim()
    .min(3, 'contact_min')
    .max(200)
    .regex(/^[^\r\n]+$/, 'no_newline'),
  answer: z.string().trim().min(2, 'answer_min').max(4000),
  // Согласие на обработку персональных данных (152-ФЗ): без него заявку не принимаем.
  // boolean с проверкой, а не literal(true): форма стартует с false и должна типизироваться.
  consent: z.boolean().refine((v) => v === true, 'consent_required'),
  // honeypot: пропускаем через Zod, непустое значение ловит роут тихой двухсоткой.
  // .max(0) роняет запрос до хендлера и подсказывает боту, что это ловушка.
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
  // Язык страницы, с которой пришла заявка, — только для пометки в уведомлении.
  lang: z.enum(['ru', 'en']).optional(),
  source: leadSourceSchema.optional(),
  attribution: leadAttributionSchema.optional(),
  details: leadDetailsSchema.optional(),
})

export type EvolutionLeadInput = z.infer<typeof evolutionLeadSchema>
