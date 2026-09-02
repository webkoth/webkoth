// app/data/landings/landings.test.ts
import { describe, expect, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { LEAD_LANDINGS } from '@/lib/evolution/schemas'
import { LANDING_SLUGS, landingMeta } from './index'

describe('реестр лендингов', () => {
  it('у каждого лендинга есть запись, слаг совпадает с ключом', () => {
    for (const slug of LANDING_SLUGS) {
      expect(landingMeta[slug].slug).toBe(slug)
    }
  })

  it('кейсы карусели и главный кейс существуют в реестре кейсов', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      for (const c of meta.cases) expect(CASE_SLUGS, `${slug}/${c}`).toContain(c)
      if (meta.heroCase) expect(CASE_SLUGS, `${slug}/hero`).toContain(meta.heroCase)
    }
  })

  it('case-first обязан иметь главный кейс, symptoms-first не имеет', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      if (meta.skeleton === 'case-first') expect(meta.heroCase, slug).toBeDefined()
      else expect(meta.heroCase, slug).toBeUndefined()
    }
  })

  it('кейсы внутри карусели не повторяются', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      expect(new Set(meta.cases).size, slug).toBe(meta.cases.length)
    }
  })

  // Слаги дублируются в схеме заявки (lib не импортирует app/data); тест не даёт им разойтись.
  it('слаги лендингов совпадают со слагами в схеме заявки', () => {
    expect([...LANDING_SLUGS].sort()).toEqual([...LEAD_LANDINGS].sort())
  })
})
