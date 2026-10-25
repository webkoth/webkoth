import { describe, expect, it } from 'vitest'
import { CASE_SLUGS, getCase } from '@/app/data/cases'
import { LEAD_DETAIL_KEY, LEAD_DETAILS_MAX } from '@/lib/evolution/schemas'
import { SHOWN_CASE_SLUGS, avtomatizaciya, buildAvtomatizaciyaMarkdown, glavnayaPath } from './index'
import { leadFormCopy } from './lead-form-copy'

const c = avtomatizaciya

describe('тексты главной', () => {
  it('заголовок утверждён, акцент — его часть', () => {
    expect(c.hero.title).toBe('Автоматизация и внедрение ИИ для продавцов на маркетплейсах')
    expect(c.hero.title).toContain(c.hero.titleAccent)
  })

  it('шесть направлений в утверждённом порядке', () => {
    expect(c.directions.items.map((d) => d.id)).toEqual(['finance', 'data', 'stock', 'ads', 'content', 'chat'])
  })

  it('одиннадцать кейсов: есть в реестре, не повторяются', () => {
    expect(SHOWN_CASE_SLUGS).toHaveLength(11)
    expect(new Set(SHOWN_CASE_SLUGS).size).toBe(11)
    for (const slug of SHOWN_CASE_SLUGS) {
      expect(CASE_SLUGS, slug).toContain(slug)
      expect(() => getCase('ru', slug)).not.toThrow()
    }
  })

  it('цена: созвон бесплатно, месяц 100 000 ₽, сопровождение', () => {
    expect(c.pricing.items.map((p) => p.price)).toEqual(['бесплатно', '100 000 ₽', 'от 15 000 ₽ в месяц'])
    expect(c.pricing.items.filter((p) => p.highlight)).toHaveLength(1)
  })

  it('поля заявки проходят ограничения схемы', () => {
    expect(c.lead.fields.length).toBeLessThanOrEqual(LEAD_DETAILS_MAX)
    for (const f of c.lead.fields) expect(f.key).toMatch(LEAD_DETAIL_KEY)
  })

  it('в текстах нет длинного тире и стрелок', () => {
    const text = JSON.stringify(c)
    expect(text).not.toMatch(/—/)
    expect(text).not.toMatch(/→/)
  })

  it('в текстах нет упоминания супруги', () => {
    expect(JSON.stringify(c)).not.toMatch(/супруг/i)
  })

  it('markdown для LLM содержит заголовок, адрес и все кейсы', () => {
    const md = buildAvtomatizaciyaMarkdown()
    expect(md).toContain(c.hero.title)
    expect(md).toContain(`webkoth.com${glavnayaPath}`)
    for (const slug of SHOWN_CASE_SLUGS) expect(md).toContain(`/ru/cases/${slug}`)
  })

  it('модалка заявки говорит заголовком и вопросом страницы', () => {
    const form = leadFormCopy(c.lead)
    expect(form.title).toBe(c.lead.title)
    expect(form.sub).toBe(c.lead.sub)
    expect(form.fields.answer).toBe(c.lead.answerLabel)
  })
})
