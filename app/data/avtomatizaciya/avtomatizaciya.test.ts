import { describe, expect, it } from 'vitest'
import { angleForCase, CASE_SLUGS } from '@/app/data/cases'
import { LEAD_DETAIL_KEY, LEAD_DETAILS_MAX } from '@/lib/evolution/schemas'
import { avtomatizaciya, avtomatizaciyaPath, buildAvtomatizaciyaMarkdown } from './index'

const c = avtomatizaciya

describe('тексты одностраничника', () => {
  it('восемь услуг для продавцов, заголовки не повторяются', () => {
    expect(c.services.items).toHaveLength(8)
    expect(new Set(c.services.items.map((s) => s.title)).size).toBe(8)
  })

  it('четыре плитки для компаний в утверждённом составе', () => {
    expect(c.companies.items.map((t) => t.id)).toEqual(['kontur', 'finance', 'it-director', 'training'])
  })

  it('кейсы существуют в реестре, не повторяются и у каждого есть угол', () => {
    for (const slug of c.cases.slugs) expect(CASE_SLUGS, slug).toContain(slug)
    expect(new Set(c.cases.slugs).size).toBe(c.cases.slugs.length)
    for (const slug of c.cases.slugs) expect(() => angleForCase('ru', slug)).not.toThrow()
  })

  it('разбор бесплатный', () => {
    expect(c.pricing.items[0]).toMatchObject({ title: 'Разбор', price: 'бесплатно' })
  })

  it('поля заявки проходят ограничения схемы', () => {
    expect(c.lead.fields.length).toBeLessThanOrEqual(LEAD_DETAILS_MAX)
    for (const f of c.lead.fields) expect(f.key).toMatch(LEAD_DETAIL_KEY)
  })

  it('в текстах нет длинного тире', () => {
    expect(JSON.stringify(c)).not.toMatch(/—/)
  })

  it('markdown для LLM содержит заголовок и адрес страницы', () => {
    const md = buildAvtomatizaciyaMarkdown()
    expect(md).toContain(c.hero.title)
    expect(md).toContain(avtomatizaciyaPath)
  })
})
