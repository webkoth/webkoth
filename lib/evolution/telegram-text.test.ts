import { describe, it, expect } from 'vitest'
import { buildLeadTelegramText } from './telegram-text'
import type { EvolutionLeadData } from './email'

const lead: EvolutionLeadData = {
  name: 'Иван',
  contact: '@ivan',
  answer: 'Собрали бота, им никто не пользуется.',
  ip: '203.0.113.7',
}

describe('buildLeadTelegramText', () => {
  it('собирает шапку и ответ на вопрос; без lang источник — RU-главная', () => {
    const text = buildLeadTelegramText(lead)
    expect(text).toContain('Главная webkoth.com (RU · /)')
    expect(text).toContain('<b>Имя:</b> Иван')
    expect(text).toContain('Собрали бота, им никто не пользуется.')
  })

  it('помечает заявки с английской версии', () => {
    const text = buildLeadTelegramText({ ...lead, lang: 'en' })
    expect(text).toContain('Главная webkoth.com (EN · /en)')
  })

  it('экранирует HTML в полях пользователя', () => {
    const text = buildLeadTelegramText({ ...lead, name: '<b>x</b> & y', answer: 'a < b' })
    expect(text).toContain('&lt;b&gt;x&lt;/b&gt; &amp; y')
    expect(text).toContain('a &lt; b')
    expect(text).not.toContain('<b>x</b>')
  })

  it('никогда не превышает лимит Telegram в 4096 символов', () => {
    const text = buildLeadTelegramText({ ...lead, answer: 'а'.repeat(4000) })
    expect(text.length).toBeLessThanOrEqual(4096)
    expect(text).toContain('Ответ обрезан')
  })

  it('не оставляет битую HTML-сущность на срезе', () => {
    // Много «&» → каждый раздувается до «&amp;», срез почти наверняка попадёт внутрь сущности.
    const text = buildLeadTelegramText({ ...lead, answer: '&'.repeat(3000) })
    const body = text.split('…')[0]
    const tail = body.slice(body.lastIndexOf('&'))
    expect(tail === '' || tail.includes(';')).toBe(true)
  })
})
