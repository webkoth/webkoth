import { describe, it, expect } from 'vitest'
import { buildLeadSubject, buildLeadText, buildLeadHtml, type LeadEmailData } from './email'

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

describe('buildLeadSubject', () => {
  it('естественная тема, без служебных префиксов', () => {
    expect(buildLeadSubject(lead)).toBe('Заявка на разбор от Иван')
  })
})

describe('buildLeadText', () => {
  it('содержит человекочитаемые площадки и роль', () => {
    const t = buildLeadText(lead)
    expect(t).toContain('Wildberries')
    expect(t).toContain('Ozon')
    expect(t).toContain('Владелец')
    expect(t).toContain('100–1000')
  })
})

describe('buildLeadHtml', () => {
  it('экранирует пользовательский ввод', () => {
    const html = buildLeadHtml({ ...lead, name: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('не падает без комментария', () => {
    expect(() => buildLeadHtml({ ...lead, comment: undefined })).not.toThrow()
  })
})
