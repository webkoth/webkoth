import { z } from 'zod'

// Слаги лендингов дублируются здесь строкой, а не импортом из app/data:
// схема живёт в lib и не должна тянуть за собой тексты страниц.
export const LEAD_LANDINGS = ['kontur', 'it-director', 'agent', 'finance'] as const

// Откуда пришла заявка с лендинга: страница, пресет квиза и тег вердикта.
// Всё необязательное: заявка с главной идёт без source.
export const leadSourceSchema = z.object({
  landing: z.enum(LEAD_LANDINGS),
  preset: z.string().trim().max(60).optional(),
  verdict: z.string().trim().max(20).optional(),
})

export type LeadSource = z.infer<typeof leadSourceSchema>

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
  // honeypot: пропускаем через Zod, непустое значение ловит роут тихой двухсоткой.
  // .max(0) роняет запрос до хендлера и подсказывает боту, что это ловушка.
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
  // Язык страницы, с которой пришла заявка, — только для пометки в уведомлении.
  lang: z.enum(['ru', 'en']).optional(),
  source: leadSourceSchema.optional(),
})

export type EvolutionLeadInput = z.infer<typeof evolutionLeadSchema>
