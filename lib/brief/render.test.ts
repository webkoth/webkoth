import { describe, expect, it } from 'vitest'
import { buildMap } from './build-map'
import { demoShop, headShop } from './fixtures'
import { briefFilename, renderMarkdown } from './render-markdown'
import { renderTelegramSummary, SUMMARY_MAX } from './render-telegram'
import { emptyAnswers } from './schema'

const now = new Date('2026-09-18T09:05:00Z')

describe('renderTelegramSummary', () => {
  it('демо-магазин: кто, магазин, с чего начать, ступень, категория, метка', () => {
    const text = renderTelegramSummary(demoShop(), buildMap(demoShop()), 'anna')
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
    const text = renderTelegramSummary(headShop(), buildMap(headShop()))
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
    const text = renderTelegramSummary(a, buildMap(a), 'a'.repeat(32))
    expect(text).toContain('A&lt;b&gt;&amp;')
    expect(text.length).toBeLessThanOrEqual(SUMMARY_MAX)
  })
})

describe('renderMarkdown', () => {
  const answers = demoShop()
  const md = renderMarkdown({ answers, map: buildMap(answers), k: 'anna', startedAtMs: now.getTime() - 17 * 60_000, now })

  it('имя файла по московскому времени', () => {
    expect(briefFilename('anna', now)).toBe('brief-anna-2026-09-18-1205.md')
    expect(briefFilename(undefined, now)).toBe('brief-nolabel-2026-09-18-1205.md')
  })

  it('шапка и разделы на месте', () => {
    expect(md).toContain('- Заполнение: 17 мин')
    expect(md).toContain('- Дата: 18.09.2026 12:05 МСК')
    for (const h of ['## 1. Флаги', '## 2. Магазин и стадия', '## 3. Разобранные процессы', '## 4. Уточнить на созвоне', '## 5. Отмечены, но не разобраны', '## 6. Цели и рамки', '## 7. Ступень', '## 8. Ответы (JSON для /task-verdict)']) {
      expect(md).toContain(h)
    }
    expect(md).toContain('### Ответы на отзывы (начать с этого)')
    expect(md).toContain('- Вердикт: f4; автономия: сбор A5 · анализ A5 · решение A1 · действие A2; флаги: irreversible, rope')
    expect(md).toContain('- Реклама и ставки: 2 ч/нед')
  })

  it('блок JSON разбирается обратно в те же ответы', () => {
    const json = md.match(/```json\n([\s\S]*?)\n```/)?.[1]
    expect(JSON.parse(json ?? 'null')).toEqual(answers)
  })

  it('незаполненный процесс помечен', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'reviews' as const, hours: '1to3' as const }] }
    expect(renderMarkdown({ answers: a, map: buildMap(a), startedAtMs: now.getTime(), now })).toContain('- Подробности не заполнены')
  })

  it('снимок файла демо-магазина', () => {
    expect(md).toMatchSnapshot()
  })
})
