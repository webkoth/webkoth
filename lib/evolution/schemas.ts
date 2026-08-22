import { z } from 'zod'

// Форма /evolution — минимум полей: имя, контакт и один квалифицирующий вопрос
// оффера: «Что уже пробовали с ИИ и что из этого работает?».
export const evolutionLeadSchema = z.object({
  // Переносы строк запрещены: имя уходит в тему письма (email.ts), а «\r\n» в
  // заголовке — это header injection. .trim() снимает их только по краям.
  name: z
    .string()
    .trim()
    .min(2, 'Минимум 2 символа')
    .max(120)
    .regex(/^[^\r\n]+$/, 'Без переносов строк'),
  contact: z
    .string()
    .trim()
    .min(3, 'Telegram, email или телефон')
    .max(200)
    .regex(/^[^\r\n]+$/, 'Без переносов строк'),
  answer: z.string().trim().min(2, 'Пары слов достаточно — даже «ничего»').max(4000),
  // honeypot: пропускаем через Zod, непустое значение ловит роут тихой двухсоткой.
  // .max(0) роняет запрос до хендлера и подсказывает боту, что это ловушка.
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
})

export type EvolutionLeadInput = z.infer<typeof evolutionLeadSchema>
