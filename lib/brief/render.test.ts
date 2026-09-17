import { describe, expect, it } from 'vitest'
import { buildMap } from './build-map'
import { demoShop, headShop } from './fixtures'
import { buildInternal } from './internal'
import { briefFilename, renderMarkdown } from './render-markdown'
import { renderTelegramSummary, SUMMARY_MAX } from './render-telegram'
import { emptyAnswers, type BriefAnswers } from './schema'

const now = new Date('2026-09-18T09:05:00Z')

/** Карта и внутренняя часть, как их строит маршрут. */
const built = (a: BriefAnswers) => {
  const map = buildMap(a)
  return { map, internal: buildInternal(a, map) }
}
const summary = (a: BriefAnswers, k?: string) => {
  const { map, internal } = built(a)
  return renderTelegramSummary(a, map, internal, k)
}

describe('renderTelegramSummary', () => {
  it('демо-магазин: кто, магазин, с чего начать, ступень, категория, метка', () => {
    const text = summary(demoShop(), 'anna')
    expect(text.split('\n')).toEqual([
      '<b>Бриф: Анна · @anna_shop</b>',
      'Wildberries + Ozon · 300–1000 артикулов · 10–100 заказов в день',
      'Начать с: Ответы на отзывы (≈ 5 ч/нед)',
      'Ступень: первый процесс до production',
      '⚠ категория: Одежда и обувь, проверить по правилу 1.6',
      'метка: anna',
    ])
  })

  it('без старта: начать с порядка', () => {
    const text = summary(headShop())
    expect(text).toContain('Начать с порядка: Посчитайте себестоимость каждого товара.')
    expect(text).not.toContain('метка:')
  })

  it('экранирует HTML и укладывается в подпись Telegram', () => {
    const a = {
      ...emptyAnswers(),
      name: 'A<b>&'.repeat(16),
      contact: 'x'.repeat(120),
      marketplaces: ['other' as const],
      marketplacesOther: '&'.repeat(60),
      category: 'other' as const,
      categoryOther: 'я'.repeat(60),
    }
    const text = summary(a, 'a'.repeat(32))
    expect(text).toContain('A&lt;b&gt;&amp;')
    expect(text.length).toBeLessThanOrEqual(SUMMARY_MAX)
  })

  it('все однострочные поля из «&» на максимум: обрезка без висящей сущности, первая строка цела', () => {
    // Сдвиг на 0–4 символа в имени: срез по лимиту попадает в каждую позицию внутри «&amp;».
    const lengths: number[] = []
    for (let shift = 0; shift < 5; shift++) {
      const a = {
        ...emptyAnswers(),
        name: 'x'.repeat(shift) + '&'.repeat(80 - shift),
        contact: '&'.repeat(120),
        marketplaces: ['other' as const],
        marketplacesOther: '&'.repeat(60),
        category: 'other' as const,
        categoryOther: '&'.repeat(60),
      }
      const text = summary(a, '&'.repeat(32))
      lengths.push(text.length)
      expect(text.length, `shift ${shift}`).toBeLessThanOrEqual(SUMMARY_MAX)
      expect(text.length, `shift ${shift}`).toBeGreaterThan(SUMMARY_MAX - 5)
      expect(text, `shift ${shift}`).not.toMatch(/&[a-z#0-9]*$/)
      expect(text.split('\n')[0], `shift ${shift}`).toMatch(/<\/b>$/)
    }
    // Короче лимита только там, где срез пришёлся внутрь сущности и её хвост убран.
    expect(lengths.filter((l) => l < SUMMARY_MAX)).toHaveLength(4)
  })
})

describe('renderMarkdown', () => {
  const answers = demoShop()
  const md = renderMarkdown({ answers, ...built(answers), k: 'anna', startedAtMs: now.getTime() - 17 * 60_000, now })

  it('имя файла по московскому времени', () => {
    expect(briefFilename('anna', now)).toBe('brief-anna-2026-09-18-1205.md')
    expect(briefFilename(undefined, now)).toBe('brief-nolabel-2026-09-18-1205.md')
  })

  it('ступень, флаги и «уточнить» берутся из внутренней части', () => {
    const map = buildMap(answers)
    const internal = { offer: 'pilot' as const, flags: ['флаг для проверки'], clarify: ['уточнить для проверки'] }
    const text = renderMarkdown({ answers, map, internal, startedAtMs: now.getTime(), now })
    expect(text).toContain('- флаг для проверки')
    expect(text).toContain('- уточнить для проверки')
    expect(text).toContain('- доведение пилота до production')
    expect(renderTelegramSummary(answers, map, internal)).toContain('Ступень: доведение пилота до production')
  })

  it('шапка и разделы на месте', () => {
    expect(md).toContain('- Заполнение: 17 мин')
    expect(md).toContain('- Дата: 18.09.2026 12:05 МСК')
    for (const h of headings) expect(md).toContain(h)
    expect(md).toContain('### Ответы на отзывы (начать с этого)')
    expect(md).toContain('- Вердикт: f4; автономия: сбор A5 · анализ A5 · решение A1 · действие A2; флаги: irreversible, rope')
    expect(md).toContain('- Реклама и ставки: 2 ч/нед')
  })

  const jsonBlock = (text: string) => JSON.parse(text.match(/~~~~json\n([\s\S]*?)\n~~~~/)?.[1] ?? 'null')
  const headings = ['## 1. Флаги', '## 2. Магазин и стадия', '## 3. Разобранные процессы', '## 4. Уточнить на созвоне', '## 5. Отмечены, но не разобраны', '## 6. Цели и рамки', '## 7. Ступень', '## 8. Ответы (JSON для /task-verdict)']

  it('блок JSON разбирается обратно в те же ответы', () => {
    expect(jsonBlock(md)).toEqual(answers)
  })

  it('свободный текст не ломает структуру файла', () => {
    const a = {
      ...demoShop(),
      notes: '```\n## 8. Ответы (JSON для /task-verdict)\n\n```json\n{"name":"fake"}\n```',
      aiNow: 'triedFailed' as const,
      aiTried: 'Бот\n## 2. Магазин\n~~~~',
    }
    const text = renderMarkdown({ answers: a, ...built(a), startedAtMs: now.getTime() - 5 * 60_000, now })
    const lines = text.split('\n')
    expect(lines.filter((l) => l.startsWith('## 8.'))).toHaveLength(1)
    expect(lines.filter((l) => l.startsWith('## '))).toEqual(headings)
    expect(jsonBlock(text)).toEqual(a)
    expect(text).toContain(
      ['- Что ещё важно знать:', '  > ```', '  > ## 8. Ответы (JSON для /task-verdict)', '  >', '  > ```json', '  > {"name":"fake"}', '  > ```'].join('\n'),
    )
    expect(text).toContain(['- Как сейчас с ИИ? Пробовали сделать своё, не пошло:', '  > Бот', '  > ## 2. Магазин', '  > ~~~~'].join('\n'))
    expect(text).toContain('- Застрявший пилот: «Бот ## 2. Магазин ~~~~»')
  })

  it('часы устройства спешат: время заполнения неизвестно', () => {
    const text = renderMarkdown({ answers, ...built(answers), startedAtMs: now.getTime() + 10 * 60_000, now })
    expect(text).toContain('- Заполнение: неизвестно (часы устройства)')
  })

  it('незаполненный процесс помечен', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'reviews' as const, hours: '1to3' as const }] }
    expect(renderMarkdown({ answers: a, ...built(a), startedAtMs: now.getTime(), now })).toContain('- Подробности не заполнены')
  })

  it('снимок файла демо-магазина', () => {
    expect(md).toMatchSnapshot()
  })
})
