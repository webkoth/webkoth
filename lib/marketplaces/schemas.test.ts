import { describe, it, expect } from 'vitest'
import { marketplacesLeadSchema } from './schemas'

const valid = {
  name: 'Иван',
  phone: '+7 999 123-45-67',
  contact: '@ivan',
  marketplaces: ['wb'],
  catalogSize: 'lt100',
  role: 'owner',
  filledAtMs: 1_700_000_000_000,
}

describe('marketplacesLeadSchema', () => {
  it('принимает минимально заполненную заявку', () => {
    expect(marketplacesLeadSchema.safeParse(valid).success).toBe(true)
  })

  it('требует хотя бы одну площадку', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, marketplaces: [] })
    expect(r.success).toBe(false)
  })

  it('отклоняет телефон с буквами', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, phone: 'позвоните мне' })
    expect(r.success).toBe(false)
  })

  it('пропускает honeypot любой длины — фильтрует роут, а не схема', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, website: 'http://spam.example' })
    expect(r.success).toBe(true)
  })

  it('отклоняет имя с переносом строки — тема письма склеивается из name', () => {
    const r = marketplacesLeadSchema.safeParse({
      ...valid,
      name: 'Иван\nBcc: attacker@example.com',
    })
    expect(r.success).toBe(false)
  })

  it('отклоняет неизвестную площадку', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, marketplaces: ['avito'] })
    expect(r.success).toBe(false)
  })
})
