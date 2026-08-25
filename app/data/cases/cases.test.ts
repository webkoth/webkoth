import { describe, expect, it } from 'vitest'
import { evolutionBlockOrder, evolutionData } from '@/app/data/evolution'
import { CASE_SLUGS, anglesForBlock, caseMeta, casesCopy, isCaseSlug } from './index'
import type { CaseMeta } from './types'

const LANGS = ['ru', 'en'] as const

describe('реестр кейсов', () => {
  it('набор углов в обеих локалях совпадает с registry.blocks', () => {
    for (const slug of CASE_SLUGS) {
      const expected = [...caseMeta[slug].blocks].sort()
      for (const lang of LANGS) {
        const actual = Object.keys(casesCopy[lang][slug].angles).sort()
        expect(actual, `${lang}/${slug}`).toEqual(expected)
      }
    }
  })

  it('в каждом угле 2–3 чипа, шкала не переполнена и процент в подписи сходится', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        for (const [block, angle] of Object.entries(casesCopy[lang][slug].angles)) {
          const at = `${lang}/${slug}/${block}`
          expect(angle!.chips.length, at).toBeGreaterThanOrEqual(2)
          expect(angle!.chips.length, at).toBeLessThanOrEqual(3)
          // Значение чипа - подпись в пилюле, а не фраза: длинное значение ломает
          // вёрстку карточки. Условия и оговорки живут в `note`, он не ограничен.
          for (const chip of angle!.chips) {
            expect(chip.value.length, `${at}/${chip.label}`).toBeLessThanOrEqual(60)
          }
          // Карточка в карусели показывается по одной, а высоту трека задаёт самая
          // высокая: лишний абзац здесь - это пустота под всеми остальными. Порог
          // общий для локалей, потому что EN длиннее RU примерно на десятую часть.
          // Сокращать оговорку, на которой держится точность утверждения, нельзя -
          // подробности переносятся в `detail` и в `note`, карточка ведёт на кейс.
          expect(angle!.pain.length, `${at}/pain`).toBeLessThanOrEqual(175)
          expect(angle!.outcome.length, `${at}/outcome`).toBeLessThanOrEqual(205)
          const bar = angle!.bar
          if (!bar) continue
          expect(bar.filled, at).toBeGreaterThan(0)
          expect(bar.filled, at).toBeLessThanOrEqual(bar.total)
          // Процент в подписи написан руками и может разойтись с долей.
          const written = bar.caption.match(/(\d+)\s*%/)
          if (written) expect(Number(written[1]), at).toBe(Math.round((bar.filled / bar.total) * 100))
        }
      }
    }
  })

  it('у открытого кода есть ссылка, у клиентской системы её нет', () => {
    for (const slug of CASE_SLUGS) {
      const meta: CaseMeta = caseMeta[slug]
      if (meta.kind === 'oss') {
        expect(Object.values(meta.links).filter(Boolean).length, slug).toBeGreaterThan(0)
      }
      // Обезличивание: ссылка на репозиторий или сайт раскроет клиента.
      if (meta.kind === 'internal') expect(Object.keys(meta.links), slug).toEqual([])
    }
  })

  it('подписей скриншотов столько же, сколько файлов', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        expect(casesCopy[lang][slug].detail.screenshots.length, `${lang}/${slug}`).toBe(
          caseMeta[slug].screenshots.length,
        )
      }
    }
  })

  it('таблица эффектов перечисляет блоки системы в том же порядке', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        const actual = casesCopy[lang][slug].detail.effects.map((e) => e.block)
        expect(actual, `${lang}/${slug}`).toEqual([...caseMeta[slug].blocks])
      }
    }
  })

  // Правило не косметическое: меньше трёх - карусель бессмысленна, больше
  // пяти - при автопрокрутке в семь секунд полный круг блока уходит далеко
  // за полминуты, и до последней карточки читатель просто не досиживает.
  it('в каждом блоке 3–5 карточек', () => {
    for (const block of evolutionBlockOrder) {
      const n = anglesForBlock('ru', block).length
      expect(n, block).toBeGreaterThanOrEqual(3)
      expect(n, block).toBeLessThanOrEqual(5)
    }
  })

  // Порядок `blocks` - это порядок углов и порядок строк в таблице эффектов
  // (её сверяет тест выше). Углы, перечисленные вразнобой, дали бы таблицу,
  // читающуюся против хода страницы, и ни один другой тест этого не заметит.
  it('blocks перечислены в порядке блоков страницы', () => {
    for (const slug of CASE_SLUGS) {
      const b = [...caseMeta[slug].blocks]
      expect(b, slug).toEqual(
        [...b].sort((x, y) => evolutionBlockOrder.indexOf(x) - evolutionBlockOrder.indexOf(y)),
      )
    }
  })

  // Описание уезжает в <meta> и в карту сайта как есть, а выдача обрезает его
  // примерно на 160 знаках: всё, что длиннее, до читателя просто не доедет.
  it('metaDescription укладывается в выдачу', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        const d = casesCopy[lang][slug].detail.metaDescription
        expect(d.length, `${lang}/${slug}`).toBeLessThanOrEqual(160)
      }
    }
  })

  // Карточка подставляет число в `caseAlsoIn` через `.replace('{n}', …)`.
  // Потерянный плейсхолдер не сломает сборку - просто уедет в прод фразой
  // «даёт эффект ещё по шагам». `caseAlsoInOne` - форма единственного числа,
  // числа в ней нет по замыслу.
  it('в подписи связи углов есть плейсхолдер {n}', () => {
    for (const lang of LANGS) {
      const labels = evolutionData[lang].labels
      expect(labels.caseAlsoIn, `${lang}/caseAlsoIn`).toContain('{n}')
      expect(labels.caseAlsoInOne, `${lang}/caseAlsoInOne`).not.toContain('{n}')
    }
  })

  // Тем же способом карусель собирает счётчик и подписи точек. Потерянный
  // плейсхолдер здесь тише: счётчик уедет в прод как «3 из {n}», а точка -
  // как «Кейс» без номера, и обе четвёрки точек станут неразличимы на слух.
  it('в подписях карусели есть плейсхолдеры', () => {
    for (const lang of LANGS) {
      const labels = evolutionData[lang].labels
      expect(labels.carouselCounter, `${lang}/carouselCounter`).toContain('{i}')
      expect(labels.carouselCounter, `${lang}/carouselCounter`).toContain('{n}')
      expect(labels.carouselGoTo, `${lang}/carouselGoTo`).toContain('{i}')
    }
  })

  it('isCaseSlug отсекает чужое', () => {
    expect(isCaseSlug('finance-loop')).toBe(true)
    expect(isCaseSlug('nope')).toBe(false)
    expect(isCaseSlug(42)).toBe(false)
  })

  it('anglesForBlock отдаёт ровно системы блока в порядке CASE_SLUGS', () => {
    for (const lang of LANGS) {
      for (const block of evolutionBlockOrder) {
        // Ожидание считается из реестра, а не из ответа функции: иначе пустой
        // результат тоже был бы «подпоследовательностью CASE_SLUGS».
        const expected = CASE_SLUGS.filter((s) => (caseMeta[s].blocks as readonly string[]).includes(block))
        expect(anglesForBlock(lang, block).map((a) => a.slug), `${lang}/${block}`).toEqual(expected)
      }
    }
  })

  it('otherBlocks перечисляет остальные блоки системы', () => {
    for (const block of evolutionBlockOrder) {
      for (const a of anglesForBlock('ru', block)) {
        expect(a.otherBlocks, `${a.slug}/${block}`).toEqual(
          [...caseMeta[a.slug].blocks].filter((b) => b !== block),
        )
      }
    }
  })

  // Девять систем Task 2 пишутся руками в двух файлах - именно здесь одна локаль
  // получит третий чип или потеряет шкалу. Сверяем форму, а не только ключи углов.
  it('RU и EN совпадают по форме', () => {
    for (const slug of CASE_SLUGS) {
      const ru = casesCopy.ru[slug]
      const en = casesCopy.en[slug]

      for (const block of caseMeta[slug].blocks) {
        const at = `${slug}/${block}`
        const a = ru.angles[block]!
        const b = en.angles[block]!
        expect(b.chips.length, `${at}/chips`).toBe(a.chips.length)
        expect(b.chips.map((c) => c.icon), `${at}/icons`).toEqual(a.chips.map((c) => c.icon))
        expect(Boolean(b.bar), `${at}/bar`).toBe(Boolean(a.bar))
        if (a.bar && b.bar) {
          expect(b.bar.filled, `${at}/bar.filled`).toBe(a.bar.filled)
          expect(b.bar.total, `${at}/bar.total`).toBe(a.bar.total)
        }
      }

      const shape = (c: typeof ru) => ({
        effects: c.detail.effects.map((e) => e.block),
        value: c.detail.value.length,
        how: c.detail.how.length,
        facts: c.detail.facts.length,
        diagramNodes: c.detail.diagramNodes.length,
        screenshots: c.detail.screenshots.length,
        beforeAfter: c.detail.beforeAfter?.before.length ?? null,
      })
      expect(shape(en), slug).toEqual(shape(ru))
    }
  })
})
