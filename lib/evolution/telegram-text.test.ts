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

  it('заявка с лендинга подписана страницей, пресетом и вердиктом', () => {
    const text = buildLeadTelegramText({
      ...lead,
      source: { landing: 'finance', preset: 'finance-pervichka', verdict: 'F4' },
    })
    expect(text).toContain('Лендинг /finance')
    expect(text).toContain('finance-pervichka')
    expect(text).toContain('F4')
  })

  it('выводит поля лендинга строками под контактом и экранирует их', () => {
    const text = buildLeadTelegramText({
      ...lead,
      source: { landing: 'kontur' },
      details: [
        { label: 'Какая 1С', value: 'УТ 11 <доработанная>' },
        { label: 'Оборот в месяц', value: '3 млн ₽ & больше' },
      ],
    })
    expect(text).toContain(
      '<b>Контакт:</b> @ivan\n<b>Какая 1С:</b> УТ 11 &lt;доработанная&gt;\n<b>Оборот в месяц:</b> 3 млн ₽ &amp; больше\n<b>IP:</b>',
    )
  })

  it('без полей лендинга шапка как раньше: за контактом сразу IP', () => {
    expect(buildLeadTelegramText(lead)).toContain('<b>Контакт:</b> @ivan\n<b>IP:</b> 203.0.113.7')
    expect(buildLeadTelegramText({ ...lead, details: [] })).toContain('<b>Контакт:</b> @ivan\n<b>IP:</b> 203.0.113.7')
  })

  it('шесть полей из «&» и длинный ответ не перебивают лимит Telegram', () => {
    const details = Array.from({ length: 6 }, (_, i) => ({ label: `k${i}`, value: '&'.repeat(200) }))
    const text = buildLeadTelegramText({ ...lead, details, answer: '&'.repeat(4000) })
    expect(text.length).toBeLessThanOrEqual(4096)
    for (const line of text.split('\n').filter((l) => l.startsWith('<b>k'))) {
      const tail = line.slice(line.lastIndexOf('&'))
      expect(tail.includes(';')).toBe(true)
    }
  })

  it('пишет, что меток рекламы нет, если заявка без атрибуции', () => {
    expect(buildLeadTelegramText(lead)).toContain('<b>Реклама:</b> меток нет')
  })

  it('выводит последний и первый вход, yclid и ClientID', () => {
    const text = buildLeadTelegramText({
      ...lead,
      attribution: {
        first: { landing: '/', at: '2026-09-10T08:00:00.000Z', utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: 'home-rsya' },
        last: {
          landing: '/kontur',
          at: '2026-09-17T10:00:00.000Z',
          utm_source: 'yandex',
          utm_medium: 'cpc',
          utm_campaign: 'kontur-rsya',
          utm_content: 'integraciya-1s-marketpleysy',
          utm_term: '1c <wb>',
          placement: 'ya.ru',
          device: 'mobile',
          cid: '714528958',
          yclid: '777',
        },
        clientId: '1789632086123456789',
      },
    })
    expect(text).toContain('<b>Последний вход:</b> yandex/cpc · кампания kontur-rsya · группа integraciya-1s-marketpleysy · фраза 1c &lt;wb&gt; · площадка ya.ru · mobile · /kontur · cid 714528958')
    expect(text).toContain('<b>Первый вход:</b> yandex/cpc · кампания home-rsya')
    expect(text).toContain('<b>yclid:</b> 777')
    expect(text).toContain('<b>ClientID Метрики:</b> 1789632086123456789')
    expect(text).not.toContain('меток нет')
  })
})
