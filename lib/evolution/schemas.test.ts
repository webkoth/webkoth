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
})
