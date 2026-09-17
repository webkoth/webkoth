import { describe, expect, expectTypeOf, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { PROCESS_IDS } from '@/lib/brief/ids'
import { briefAnswersSchema, deepAnswersSchema } from '@/lib/brief/schema'
import { READY_MADE_MAX_AGE_MONTHS } from './coefficients'
import { briefCopy, clarifyCopy, colorCopy, explainCopy, flagCopy, offerCopy, outcomeCopy, readyMadeCopy, stageCopy } from './copy'
import { glossary, TERM_IDS } from './glossary'
import { processCatalog } from './processes'
import { deepQuestions, goalsQuestions, nowQuestions, shopQuestions, type OtherField, type QuestionDef } from './questions'

const entries = Object.values(processCatalog)

describe('каталог процессов', () => {
  it('запись на каждый id, ключ совпадает с id', () => {
    expect(Object.keys(processCatalog).sort()).toEqual([...PROCESS_IDS].sort())
    for (const [key, e] of Object.entries(processCatalog)) expect(e.id).toBe(key)
  })

  it('ровно один dynamic-шаг, approval только сразу после него', () => {
    for (const e of entries) {
      const kinds = e.chain.map((s) => s.kind)
      expect(kinds.filter((k) => k === 'dynamic'), e.id).toHaveLength(1)
      kinds.forEach((k, i) => {
        if (k === 'approval') expect(kinds[i - 1], e.id).toBe('dynamic')
      })
    }
  })

  it('у write-процессов approval есть, у read и notify нет', () => {
    for (const e of entries) {
      const has = e.chain.some((s) => s.kind === 'approval')
      expect(has, e.id).toBe(e.facts.sideEffect === 'write')
    }
  })

  it('подсказки к образцу, правилу и данным не пустые', () => {
    for (const e of entries) {
      for (const k of ['etalon', 'rule', 'data'] as const) expect(e.hints[k].length, `${e.id}.${k}`).toBeGreaterThan(10)
    }
  })

  it('кейсы есть в реестре', () => {
    for (const e of entries) for (const c of e.cases) expect(CASE_SLUGS, e.id).toContain(c)
  })

  it('«уже есть готовое» проверено не раньше чем полгода назад', () => {
    const now = new Date()
    for (const e of entries) {
      if (!e.readyMade) continue
      const [y, m] = e.readyMade.checked.split('-').map(Number)
      const age = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
      expect(age, `${e.id}: перепроверить readyMade`).toBeLessThanOrEqual(READY_MADE_MAX_AGE_MONTHS)
    }
  })

  it('упомянутые термины есть в глоссарии', () => {
    const used = [
      ...entries.flatMap((e) => e.terms ?? []),
      ...[...shopQuestions, ...nowQuestions, ...goalsQuestions, ...deepQuestions].flatMap((q) => q.terms ?? []),
    ]
    for (const t of used) expect(TERM_IDS).toContain(t)
  })
})

describe('вопросы', () => {
  it('значения вариантов общих вопросов проходят схему ответов', () => {
    const shape = briefAnswersSchema.shape
    for (const q of [...shopQuestions, ...nowQuestions, ...goalsQuestions]) {
      for (const o of q.options) {
        const value = q.multi ? [o.value] : o.value
        expect(shape[q.id].safeParse(value).success, `${q.id}=${o.value}`).toBe(true)
      }
    }
  })

  it('строка «другое» пишет только в текстовые поля', () => {
    expectTypeOf<NonNullable<QuestionDef['other']>['field']>().toEqualTypeOf<OtherField>()
    const shape = briefAnswersSchema.shape
    for (const q of [...shopQuestions, ...nowQuestions, ...goalsQuestions]) {
      if (q.other) expect(shape[q.other.field].safeParse('свой ответ').success, q.id).toBe(true)
    }
  })

  it('значения вариантов подробных вопросов проходят схему', () => {
    const shape = deepAnswersSchema.shape
    for (const q of deepQuestions) {
      for (const o of q.options) expect(shape[q.id].safeParse(o.value).success, `${q.id}=${o.value}`).toBe(true)
    }
  })
})

describe('тексты брифа', () => {
  it('без длинных тире', () => {
    const texts = JSON.stringify({
      glossary,
      processCatalog,
      shopQuestions,
      nowQuestions,
      goalsQuestions,
      deepQuestions,
      briefCopy,
      colorCopy,
      outcomeCopy,
      explainCopy,
      stageCopy,
      offerCopy,
      samples: [
        briefCopy.map.title('Wildberries'),
        briefCopy.time.deepBanner(4),
        briefCopy.live.bar(2),
        explainCopy.prepare.etalon('x'),
        readyMadeCopy.cabinet('x'),
        readyMadeCopy.service('x'),
        flagCopy.category('x'),
        flagCopy.stuckPilot('x'),
        clarifyCopy.deep('x', 'y'),
      ],
    })
    expect(texts).not.toMatch(/—/)
  })
})
