import { z } from 'zod'

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
})

export type EvolutionLeadInput = z.infer<typeof evolutionLeadSchema>
