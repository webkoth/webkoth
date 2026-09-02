import { describe, expect, it } from 'vitest'
import { LANDING_SLUGS, landingCopy, landingPath } from '@/app/data/landings'
import { buildLandingMarkdown } from './llms-markdown'

describe('buildLandingMarkdown', () => {
  it('для каждого лендинга содержит заголовок, адрес, шаги, цены и вопросы', () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
    for (const slug of LANDING_SLUGS) {
      const c = landingCopy[slug]
      const md = buildLandingMarkdown(slug, c)
      expect(md, slug).toContain(`## ${c.hero.title}`)
      expect(md, slug).toContain(`URL: ${baseUrl}${landingPath(slug)}`)
      for (const s of c.how.steps) expect(md, `${slug}/how`).toContain(s.title)
      for (const s of c.pricing.steps) expect(md, `${slug}/pricing`).toContain(s.price)
      for (const f of c.faq.items) expect(md, `${slug}/faq`).toContain(f.q)
    }
  })

  it('не содержит длинных тире', () => {
    for (const slug of LANDING_SLUGS) {
      expect(buildLandingMarkdown(slug, landingCopy[slug]), slug).not.toMatch(/—/)
    }
  })
})
