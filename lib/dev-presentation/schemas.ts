import { z } from 'zod'

// Server-side schema for /api/dev-presentation/lead
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Похоже на неполный номер')
    .max(32)
    .regex(/^[+\d\s\-()]+$/, 'Только цифры, пробелы, +-()'),
  email: z.email('Невалидный email').max(200),
  message: z.string().trim().min(10, 'Минимум 10 символов').max(4000),
  // anti-spam: honeypot allowed through Zod (non-empty triggers silent-200 in route)
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
})

export type LeadInput = z.infer<typeof leadSchema>

// Server-side schema for /api/ai/polish
export const polishSchema = z.object({
  text: z.string().trim().min(30, 'Минимум 30 символов').max(4000),
})

export type PolishInput = z.infer<typeof polishSchema>

// AI summary structure (what hubmarket-ai returns)
export type AiSummary = {
  tldr: string
  intent: 'hire' | 'project' | 'question' | 'spam'
  urgency: 'high' | 'normal' | 'low'
  suggested_reply: string
}
