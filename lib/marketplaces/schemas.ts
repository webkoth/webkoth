import { z } from 'zod'

export const MARKETPLACE_IDS = ['wb', 'ozon', 'ym'] as const
export const CATALOG_SIZES = ['lt100', '100_1000', 'gt1000'] as const
export const ROLES = ['owner', 'manager', 'other'] as const

export const marketplacesLeadSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Похоже на неполный номер')
    .max(32)
    .regex(/^[+\d\s\-()]+$/, 'Только цифры, пробелы, +-()'),
  contact: z.string().trim().min(3, 'Telegram или email').max(200),
  marketplaces: z.array(z.enum(MARKETPLACE_IDS)).min(1, 'Выберите хотя бы одну площадку'),
  catalogSize: z.enum(CATALOG_SIZES),
  role: z.enum(ROLES),
  comment: z.string().trim().max(4000).optional(),
  // honeypot: пропускаем через Zod, непустое значение ловит роут тихой двухсоткой.
  // .max(0) роняет запрос до хендлера и подсказывает боту, что это ловушка.
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
})

export type MarketplacesLeadInput = z.infer<typeof marketplacesLeadSchema>
export type MarketplaceId = (typeof MARKETPLACE_IDS)[number]
export type CatalogSize = (typeof CATALOG_SIZES)[number]
export type Role = (typeof ROLES)[number]
