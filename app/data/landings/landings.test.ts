// app/data/landings/landings.test.ts
import { describe, expect, it } from 'vitest'
import { CASE_SLUGS, caseMeta, casesCopy } from '@/app/data/cases'
import { LEAD_DETAIL_KEY, LEAD_DETAILS_MAX, LEAD_LANDINGS } from '@/lib/evolution/schemas'
import { LANDING_SLUGS, landingMeta } from './index'
import { presetsForLanding, quizPresets, resolvePresetParam } from './index'
import { landingCopy } from './index'

const NO_DASH = /—/

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

  it('case-first и quiz-first обязаны иметь главный кейс, symptoms-first не имеет', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      if (meta.skeleton === 'symptoms-first') expect(meta.heroCase, slug).toBeUndefined()
      else expect(meta.heroCase, slug).toBeDefined()
    }
  })

  // angleForCase бросает на блоке без угла: опечатка в реестре уронила бы страницу при сборке.
  it('угол главного кейса есть у системы в обеих локалях', () => {
    for (const slug of LANDING_SLUGS) {
      const { heroCase, heroCaseAngle } = landingMeta[slug]
      if (!heroCaseAngle) continue
      expect(heroCase, slug).toBeDefined()
      if (!heroCase) continue
      expect(caseMeta[heroCase].blocks, slug).toContain(heroCaseAngle)
      expect(casesCopy.ru[heroCase].angles[heroCaseAngle], `${slug}/ru`).toBeDefined()
      expect(casesCopy.en[heroCase].angles[heroCaseAngle], `${slug}/en`).toBeDefined()
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

describe('тексты лендингов', () => {
  it('у каждого лендинга есть тексты, скелет совпадает с наличием блоков', () => {
    for (const slug of LANDING_SLUGS) {
      const copy = landingCopy[slug]
      const meta = landingMeta[slug]
      expect(copy.meta.title.length, `${slug}/title`).toBeLessThanOrEqual(70)
      expect(copy.meta.description.length, `${slug}/description`).toBeLessThanOrEqual(160)
      if (meta.skeleton === 'symptoms-first') {
        expect(copy.symptoms, slug).toBeDefined()
        expect(copy.heroCase, slug).toBeUndefined()
      } else {
        expect(copy.heroCase, slug).toBeDefined()
        expect(copy.symptoms, slug).toBeUndefined()
      }
    }
  })

  it('в текстах нет длинных тире', () => {
    for (const slug of LANDING_SLUGS) {
      expect(JSON.stringify(landingCopy[slug]), slug).not.toMatch(NO_DASH)
    }
  })

  it('«что это значит для вас» задано для всех форм вердикта', () => {
    const forms = ['stopEtalon', 'stopData', 'f0', 'f1', 'f3', 'f4', 'f1f2', 'split', 'f5'] as const
    for (const slug of LANDING_SLUGS) {
      for (const form of forms) {
        expect(landingCopy[slug].quiz.meaning[form].length, `${slug}/${form}`).toBeGreaterThan(20)
      }
    }
  })

  it('первый экран трёх страниц не начинается со слова ИИ', () => {
    for (const slug of ['kontur', 'it-director', 'finance'] as const) {
      expect(landingCopy[slug].hero.title.startsWith('ИИ'), slug).toBe(false)
    }
  })

  // ★ Главный кейс входит в `cases`, карусель его исключает (задача 19): после исключения
  // должно остаться не меньше трёх, иначе карусель бессмысленна.
  it('после исключения главного кейса в карусели остаётся не меньше трёх', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      const rest = meta.cases.filter((c) => c !== meta.heroCase)
      expect(rest.length, slug).toBeGreaterThanOrEqual(3)
    }
  })

  // Главный кейс case-first и quiz-first страницы должен входить в cases: сборщик страницы
  // (задача 19) исключает его из карусели фильтром, а не отдельным списком.
  it('главный кейс case-first и quiz-first страницы входит в cases', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      if (meta.skeleton !== 'symptoms-first') expect(meta.cases, slug).toContain(meta.heroCase)
    }
  })

  // Поля формы дублируют ограничения схемы заявки: поле, которое схема отвергнет,
  // роняло бы всю заявку с этой страницы.
  it('необязательные поля заявки проходят схему: ключ, число, уникальность', () => {
    for (const slug of LANDING_SLUGS) {
      const fields = landingCopy[slug].lead.fields ?? []
      expect(fields.length, slug).toBeLessThanOrEqual(LEAD_DETAILS_MAX)
      expect(new Set(fields.map((f) => f.key)).size, slug).toBe(fields.length)
      for (const f of fields) expect(f.key, `${slug}/${f.key}`).toMatch(LEAD_DETAIL_KEY)
    }
  })

  // Разницы и итог таблицы считает компонент, а вывод под ней написан текстом:
  // тест не даёт им разойтись после правки чисел.
  it('вывод примера сверки называет каждое расхождение из таблицы', () => {
    const group = (n: number) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    for (const slug of LANDING_SLUGS) {
      const r = landingCopy[slug].reconciliation
      if (!r) continue
      const diffs = r.rows.map((row) => Math.abs(row.oneC - row.report)).filter((d) => d > 0)
      expect(diffs.length, slug).toBeGreaterThan(0)
      for (const d of diffs) expect(r.verdict, `${slug}/${d}`).toContain(`${group(d)} ₽`)
    }
  })

  // Заголовки шагов «как это работает» и цен, вопросы FAQ - ключи React-списков
  // (задача 17): совпадение делает key неуникальным и молча ломает рендер.
  it('заголовки и вопросы, используемые как ключи списков, не повторяются', () => {
    for (const slug of LANDING_SLUGS) {
      const copy = landingCopy[slug]
      expect(new Set(copy.how.steps.map((s) => s.title)).size, `${slug}/how`).toBe(copy.how.steps.length)
      expect(new Set(copy.pricing.steps.map((s) => s.title)).size, `${slug}/pricing`).toBe(copy.pricing.steps.length)
      expect(new Set(copy.faq.items.map((i) => i.q)).size, `${slug}/faq`).toBe(copy.faq.items.length)
    }
  })
})
