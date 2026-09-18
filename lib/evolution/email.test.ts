import { describe, it, expect } from 'vitest'
import { buildLeadHtml, buildLeadText, leadDetailRows, type EvolutionLeadData } from './email'

const fields = [
  { key: 'onec', label: 'Какая 1С' },
  { key: 'marketplaces', label: 'Площадки' },
  { key: 'turnover', label: 'Оборот в месяц' },
]

const lead: EvolutionLeadData = {
  name: 'Иван',
  contact: '@ivan',
  answer: 'Выплаты WB не сходятся с 1С.',
  ip: '203.0.113.7',
}

describe('leadDetailRows', () => {
  it('без details пусто', () => {
    expect(leadDetailRows(undefined, fields)).toEqual([])
  })

  it('подписи из полей лендинга в порядке формы, пустые пропускаются', () => {
    expect(leadDetailRows({ turnover: '3 млн ₽', onec: 'УТ 11', marketplaces: '' }, fields)).toEqual([
      { label: 'Какая 1С', value: 'УТ 11' },
      { label: 'Оборот в месяц', value: '3 млн ₽' },
    ])
  })

  it('незнакомый ключ подписан самим ключом и стоит в конце', () => {
    expect(leadDetailRows({ extra: 'x', onec: 'УНФ' }, fields)).toEqual([
      { label: 'Какая 1С', value: 'УНФ' },
      { label: 'extra', value: 'x' },
    ])
    expect(leadDetailRows({ onec: 'КА' })).toEqual([{ label: 'onec', value: 'КА' }])
  })

  it('поле лендинга с ключом из прототипа не достаёт функцию', () => {
    expect(leadDetailRows({}, [{ key: 'constructor', label: 'x' }])).toEqual([])
  })
})

describe('письмо о заявке', () => {
  const details = [{ label: 'Какая 1С', value: 'УТ 11 <доработанная>' }]

  it('текст содержит поля лендинга, без них как раньше', () => {
    expect(buildLeadText({ ...lead, details })).toContain('Какая 1С: УТ 11 <доработанная>')
    expect(buildLeadText(lead)).not.toContain('Какая 1С')
  })

  it('HTML экранирует значение и подпись поля', () => {
    const html = buildLeadHtml({ ...lead, details: [...details, { label: '<i>', value: 'x' }] })
    expect(html).toContain('УТ 11 &lt;доработанная&gt;')
    expect(html).toContain('&lt;i&gt;')
    expect(html).not.toContain('<доработанная>')
  })
})
