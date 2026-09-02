// app/data/landings/landings.test.ts
import { describe, expect, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { LEAD_LANDINGS } from '@/lib/evolution/schemas'
import { LANDING_SLUGS, landingMeta } from './index'
import { presetsForLanding, quizPresets, resolvePresetParam } from './index'

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

describe('пресеты квиза', () => {
  it('каждый пресет лендинга существует и привязан к нему', () => {
    for (const slug of LANDING_SLUGS) {
      for (const id of landingMeta[slug].presets) {
        expect(quizPresets[id], `${slug}/${id}`).toBeDefined()
        expect(quizPresets[id].landing, `${slug}/${id}`).toBe(slug)
      }
    }
  })

  it('presetsForLanding отдаёт пресеты в порядке реестра', () => {
    expect(presetsForLanding('finance').map((p) => p.id)).toEqual([...landingMeta.finance.presets])
  })

  it('?p= принимает короткое имя и полный id, чужое отбрасывает', () => {
    expect(resolvePresetParam('finance', 'pervichka')).toBe('finance-pervichka')
    expect(resolvePresetParam('finance', 'finance-otchet')).toBe('finance-otchet')
    expect(resolvePresetParam('finance', 'kontur-stocks')).toBeUndefined()
    expect(resolvePresetParam('finance', null)).toBeUndefined()
  })

  it('у каждого пресета есть подсказка хотя бы к эталону', () => {
    for (const p of Object.values(quizPresets)) {
      expect(p.hints.hasEtalon, p.id).toBeTruthy()
    }
  })
})
