import { describe, expect, it } from 'vitest'
import { verdictQuizData } from '@/app/data/standard-quiz'
import { buildLeadContext, summarizeAnswers } from './quiz-summary'

const copy = verdictQuizData.ru

describe('summarizeAnswers', () => {
  it('перечисляет только данные ответы, подписями из копии квиза', () => {
    const s = summarizeAnswers({ hasEtalon: true, dataReady: true, useful: 'yes', rule: 'freeInput' }, copy)
    expect(s).toBe('эталон есть · данные есть · часто или дорого · правило чёткое, вход свободный')
  })

  it('пустые ответы дают пустую строку', () => {
    expect(summarizeAnswers({}, copy)).toBe('')
  })

  it('последствия подписываются кратко', () => {
    const s = summarizeAnswers({ sideEffect: 'write', irreversible: true, personalData: false }, copy)
    expect(s).toBe('пишет наружу · необратимое есть · персданных нет')
  })

  it('check=expert и singleRun=false подписываются', () => {
    const s = summarizeAnswers({ check: 'expert', singleRun: false }, copy)
    expect(s).toBe('проверяет только эксперт · длинная цепочка')
  })

  it('check=quick и singleRun=true подписываются', () => {
    const s = summarizeAnswers({ check: 'quick', singleRun: true }, copy)
    expect(s).toBe('проверка человеком за 10 секунд · один прогон')
  })
})

describe('buildLeadContext', () => {
  it('собирает паспорт для поля заявки', () => {
    const text = buildLeadContext({
      landingTitle: 'Видно деньги',
      presetLabel: 'Первичка в 1С',
      formTag: 'F4',
      formTitle: 'Конвейер с ИИ-шагом',
      summary: 'эталон есть · данные есть',
    })
    expect(text).toBe('Страница: Видно деньги\nПроцесс: Первичка в 1С\nВердикт: F4, Конвейер с ИИ-шагом\nОтветы: эталон есть · данные есть\n\nЧто хочу обсудить: ')
  })
})
