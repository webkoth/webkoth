import { describe, it, expect } from 'vitest'
import { buildLeadTelegramText } from './telegram-text'
import type { LeadEmailData } from './email'

const lead: LeadEmailData = {
  name: 'Иван',
  phone: '+79991234567',
  contact: '@ivan',
  marketplaces: ['wb', 'ozon'],
  catalogSize: '100_1000',
  role: 'owner',
  comment: 'Хотим внедрить',
  ip: '1.2.3.4',
}

const TELEGRAM_MAX_CHARS = 4096
const NOTE = 'Комментарий обрезан'

describe('buildLeadTelegramText', () => {
  it('держится под лимитом Telegram на максимальном комментарии', () => {
    const text = buildLeadTelegramText({ ...lead, comment: 'я'.repeat(4000) })
    expect(text.length).toBeLessThan(TELEGRAM_MAX_CHARS)
    expect(text).toContain(NOTE)
  })

  it('держится под лимитом, когда экранирование раздувает каждый символ', () => {
    // «&» → «&amp;»: 4000 символов превращаются в 20000 до обрезки.
    const text = buildLeadTelegramText({
      ...lead,
      name: '&'.repeat(120),
      contact: '&'.repeat(200),
      comment: '&'.repeat(4000),
    })
    expect(text.length).toBeLessThan(TELEGRAM_MAX_CHARS)
    // Обрезка не оставляет половину сущности вида «&am».
    expect(text).not.toMatch(/&(?![a-z]+;)/)
  })

  it('не трогает короткий комментарий и не добавляет пометку', () => {
    const text = buildLeadTelegramText(lead)
    expect(text).toContain('Хотим внедрить')
    expect(text).not.toContain(NOTE)
    expect(text).not.toContain('…')
  })

  it('не падает без комментария', () => {
    expect(() => buildLeadTelegramText({ ...lead, comment: undefined })).not.toThrow()
    const text = buildLeadTelegramText({ ...lead, comment: undefined })
    expect(text).not.toContain('Комментарий')
  })

  it('экранирует HTML в имени и комментарии', () => {
    const text = buildLeadTelegramText({
      ...lead,
      name: '<script>alert(1)</script>',
      comment: '<b>жирный</b> & <i>курсив</i>',
    })
    expect(text).not.toContain('<script>')
    expect(text).toContain('&lt;script&gt;')
    expect(text).toContain('&lt;b&gt;жирный&lt;/b&gt; &amp; &lt;i&gt;курсив&lt;/i&gt;')
  })
})
