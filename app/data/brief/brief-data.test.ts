import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { PROCESS_IDS } from '@/lib/brief/ids'
import { briefAnswersSchema, deepAnswersSchema } from '@/lib/brief/schema'
import { READY_MADE_MAX_AGE_MONTHS } from './coefficients'
import { briefCopy } from './copy'
import { TERM_IDS } from './glossary'
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
  it('заголовок карты без площадок, площадки отдельной строкой', () => {
    expect(briefCopy.map.title).toBe('Что отдать программе, что ИИ, а что оставить себе')
    expect(briefCopy.map.shops('Wildberries + Ozon')).toBe('Площадки: Wildberries + Ozon')
    expect(briefCopy.map.zeroHoursNote).toBe('Пока ноль: сначала подготовка из пунктов ниже, потом автоматизация.')
  })

  it('часы и «Подробнее» из текстов совпадают с прежними строками экрана', () => {
    expect(briefCopy.more).toBe('Подробнее')
    expect(briefCopy.hours.zero).toBe('0 ч')
    expect(`≈ ${briefCopy.hours.perWeek('5')}`).toBe('≈ 5 ч/нед')
    expect(`≈ ${briefCopy.hours.total('<1')}`).toBe('≈ <1 ч')
    expect(briefCopy.map.startShort).toBe('начать с этого')
  })

  it('поле «что пробовали» многострочное, остальные «другое» в одну строку', () => {
    const others = [...shopQuestions, ...nowQuestions, ...goalsQuestions].flatMap((q) => (q.other ? [q.other] : []))
    expect(others.filter((o) => o.multiline).map((o) => o.field)).toEqual(['aiTried'])
  })

  it('лимит отправок: повтор через пару минут, как пополняется лимит', () => {
    expect(briefCopy.send.rateLimited).toBe('Слишком много попыток. Повторите через пару минут.')
  })

  it('без длинных тире в исходниках данных, логики и компонентов брифа', () => {
    const checked: string[] = []
    for (const dir of ['app/data/brief', 'lib/brief', 'components/brief']) {
      const abs = join(process.cwd(), dir)
      for (const file of readdirSync(abs).filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))) {
        expect(readFileSync(join(abs, file), 'utf8'), `${dir}/${file}`).not.toMatch(/—/)
        checked.push(`${dir}/${file}`)
      }
    }
    expect(checked.length).toBeGreaterThan(20)
    expect(checked.filter((f) => f.startsWith('components/brief/') && f.endsWith('.tsx')).length).toBeGreaterThan(5)
  })
})

describe('внутренние тексты не уходят в браузер', () => {
  const root = process.cwd()
  const resolve = (from: string, spec: string): string | undefined => {
    const base = spec.startsWith('@/') ? join(root, spec.slice(2)) : spec.startsWith('.') ? join(dirname(from), spec) : undefined
    if (!base) return undefined
    return [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].find((f) => existsSync(f))
  }
  /** Модули брифа, до которых доходит импорт из стартовых файлов: только данные и логика брифа и соседи по папке. */
  const reachable = (entries: readonly string[]): Set<string> => {
    const seen = new Set<string>()
    const queue = [...entries]
    while (queue.length > 0) {
      const file = queue.pop()!
      if (seen.has(file)) continue
      seen.add(file)
      for (const [, spec] of readFileSync(file, 'utf8').matchAll(/from '((?:@\/lib\/brief|@\/app\/data\/brief|\.{1,2})\/[^']+)'/g)) {
        const next = resolve(file, spec)
        if (next) queue.push(next)
      }
    }
    return new Set([...seen].map((f) => relative(root, f)))
  }

  it('компоненты брифа и всё, что они импортируют, не импортируют internal-copy', () => {
    const dir = join(root, 'components/brief')
    const components = readdirSync(dir)
      .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
      .map((f) => join(dir, f))
    const files = reachable(components)
    expect(files).toContain('lib/brief/build-map.ts')
    expect(files).toContain('lib/brief/state.ts')
    expect([...files].filter((f) => f.includes('internal'))).toEqual([])
    for (const f of files) expect(readFileSync(join(root, f), 'utf8'), f).not.toMatch(/from '[^']*internal-copy'/)
  })

  it('обход находит internal-copy там, где он есть', () => {
    expect(reachable([join(root, 'lib/brief/render-markdown.ts')])).toContain('lib/brief/internal-copy.ts')
    expect(reachable([join(root, 'app/api/brief/route.ts')])).toContain('lib/brief/internal-copy.ts')
  })
})
