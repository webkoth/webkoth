import { describe, expect, it } from 'vitest'
import { shopQuestions } from '@/app/data/brief/questions'
import { answerText, categoryText, marketplacesText, processLabel } from './labels'
import { emptyAnswers } from './schema'

describe('подписи', () => {
  it('своё: название селлера или «Своё»', () => {
    expect(processLabel('custom', { ...emptyAnswers(), customLabel: ' Упаковка ' })).toBe('Упаковка')
    expect(processLabel('custom', emptyAnswers())).toBe('Своё')
    expect(processLabel('reviews', emptyAnswers())).toBe('Ответы на отзывы')
  })

  it('площадки через плюс, «другое» с уточнением', () => {
    expect(marketplacesText({ ...emptyAnswers(), marketplaces: ['wb', 'other'], marketplacesOther: 'Мегамаркет' })).toBe(
      'Wildberries + Другое: Мегамаркет',
    )
    expect(marketplacesText(emptyAnswers())).toBe('')
  })

  it('категория или «не указана»', () => {
    expect(categoryText({ ...emptyAnswers(), category: 'home' })).toBe('Дом и сад')
    expect(categoryText(emptyAnswers())).toBe('не указана')
  })

  it('ответ на вопрос: подписи через запятую, пусто → undefined', () => {
    const roles = shopQuestions.find((q) => q.id === 'roles')!
    expect(answerText(roles, { ...emptyAnswers(), roles: ['manager', 'ads'] })).toBe('Менеджер, Реклама')
    expect(answerText(roles, emptyAnswers())).toBeUndefined()
  })
})
