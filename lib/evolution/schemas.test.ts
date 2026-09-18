import { describe, it, expect } from 'vitest'
import { evolutionLeadSchema } from './schemas'

const valid = {
  name: 'Иван',
  contact: '@ivan',
  answer: 'Собрали бота для заявок, им никто не пользуется.',
  consent: true,
  filledAtMs: 1_700_000_000_000,
}

describe('evolutionLeadSchema', () => {
  it('принимает минимально заполненную заявку', () => {
    expect(evolutionLeadSchema.safeParse(valid).success).toBe(true)
  })

  it('отклоняет заявку без согласия на обработку персональных данных (152-ФЗ)', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, consent: false })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues.map((i) => i.message)).toContain('consent_required')
    const { consent: _omit, ...rest } = valid
    void _omit
    expect(evolutionLeadSchema.safeParse(rest).success).toBe(false)
  })

  it('принимает телефон как контакт — поле общее для Telegram, email и телефона', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, contact: '+7 999 123-45-67' }).success).toBe(true)
  })

  it('требует ответ на квалифицирующий вопрос, но короткий «ничего» — тоже ответ', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, answer: '' }).success).toBe(false)
    expect(evolutionLeadSchema.safeParse({ ...valid, answer: 'ничего' }).success).toBe(true)
  })

  it('пропускает honeypot любой длины — фильтрует роут, а не схема', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, website: 'http://spam.example' })
    expect(r.success).toBe(true)
  })

  it('отклоняет имя с переносом строки — тема письма склеивается из name', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, name: 'Иван\nBcc: attacker@example.com' })
    expect(r.success).toBe(false)
  })

  it('отклоняет контакт с переносом строки — он уходит в Reply-To', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, contact: 'a@b.co\r\nBcc: x@y.z' })
    expect(r.success).toBe(false)
  })

  it('отклоняет отсутствие метки времени заполнения', () => {
    const { filledAtMs: _omit, ...rest } = valid
    void _omit
    expect(evolutionLeadSchema.safeParse(rest).success).toBe(false)
  })

  it('принимает source с лендинга, пресетом и вердиктом', () => {
    const r = evolutionLeadSchema.safeParse({
      ...valid,
      source: { landing: 'finance', preset: 'finance-pervichka', verdict: 'F4' },
    })
    expect(r.success).toBe(true)
  })

  it('принимает source только с лендингом', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, source: { landing: 'agent' } }).success).toBe(true)
  })

  it('отклоняет source с неизвестным лендингом', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, source: { landing: 'shop' } }).success).toBe(false)
  })

  it('отклоняет preset с переносом строки — sourceLabel склеивает его в одну строку', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, source: { landing: 'kontur', preset: 'a\nb' } })
    expect(r.success).toBe(false)
  })

  it('отклоняет preset длиннее 60 символов', () => {
    const r = evolutionLeadSchema.safeParse({
      ...valid,
      source: { landing: 'kontur', preset: 'x'.repeat(61) },
    })
    expect(r.success).toBe(false)
  })

  it('принимает атрибуцию рекламы и отклоняет перенос строки в метке', () => {
    const attribution = {
      first: { landing: '/kontur', at: '2026-09-17T10:00:00.000Z', utm_campaign: 'kontur-rsya', yclid: '123' },
      last: { landing: '/kontur', at: '2026-09-17T10:00:00.000Z', utm_term: '1c wb', placement: 'ya.ru' },
      clientId: '1789632086123456789',
    }
    expect(evolutionLeadSchema.safeParse({ ...valid, attribution }).success).toBe(true)
    const bad = { ...attribution, last: { ...attribution.last, utm_term: 'a\nb' } }
    expect(evolutionLeadSchema.safeParse({ ...valid, attribution: bad }).success).toBe(false)
  })

  it('без необязательных полей лендинга details в результате нет', () => {
    const r = evolutionLeadSchema.safeParse(valid)
    expect(r.success && r.data.details).toBeUndefined()
  })

  it('принимает поля лендинга, обрезает пробелы и выбрасывает пустые', () => {
    const r = evolutionLeadSchema.safeParse({
      ...valid,
      source: { landing: 'kontur' },
      details: { onec: '  УТ 11 ', marketplaces: 'Wildberries, Ozon', turnover: '   ' },
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.details).toEqual({ onec: 'УТ 11', marketplaces: 'Wildberries, Ozon' })
  })

  it('отклоняет ключ поля не латиницей, с пробелом или длиннее 32 символов', () => {
    for (const key of ['какая1с', 'one c', 'a'.repeat(33), '']) {
      expect(evolutionLeadSchema.safeParse({ ...valid, details: { [key]: 'x' } }).success, key).toBe(false)
    }
    expect(evolutionLeadSchema.safeParse({ ...valid, details: { 'one-c2': 'x' } }).success).toBe(true)
  })

  it('отклоняет больше шести полей, значение длиннее 200 символов, перенос строки и не строку', () => {
    const seven = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`k${i}`, 'x']))
    expect(evolutionLeadSchema.safeParse({ ...valid, details: seven }).success).toBe(false)
    expect(evolutionLeadSchema.safeParse({ ...valid, details: { onec: 'x'.repeat(201) } }).success).toBe(false)
    expect(evolutionLeadSchema.safeParse({ ...valid, details: { onec: 'УТ\nBcc: x@y.z' } }).success).toBe(false)
    expect(evolutionLeadSchema.safeParse({ ...valid, details: { onec: 11 } }).success).toBe(false)
    expect(evolutionLeadSchema.safeParse({ ...valid, details: ['УТ 11'] }).success).toBe(false)
  })

  it('поля лендинга не мешают ловушке: honeypot по-прежнему проходит схему для роута', () => {
    const r = evolutionLeadSchema.safeParse({ ...valid, website: 'http://spam.example', details: { onec: 'УТ 11' } })
    expect(r.success && r.data.website).toBe('http://spam.example')
  })
})
