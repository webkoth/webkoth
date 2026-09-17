import { describe, expect, it } from 'vitest'
import { demoShop } from './fixtures'
import { stepForIssue } from './issue-step'
import { briefSubmitSchema } from './schema'

describe('stepForIssue', () => {
  const a = demoShop()

  it('площадки: шаг 1', () => {
    expect(stepForIssue(['answers', 'marketplaces'], a)).toEqual({ step: 'shop', deepIndex: 0 })
    expect(stepForIssue(['marketplaces'], a)).toEqual({ step: 'shop', deepIndex: 0 })
  })

  it('процессы, подробный выбор и название своего процесса: шаг 3', () => {
    for (const field of ['picked', 'deepChoice', 'customLabel']) {
      expect(stepForIssue(['answers', field], a), field).toEqual({ step: 'time', deepIndex: 0 })
    }
    expect(stepForIssue(['answers', 'picked', 0, 'hours'], a)).toEqual({ step: 'time', deepIndex: 0 })
  })

  it('подробные ответы: шаг «Подробно» с номером процесса в списке разбора', () => {
    // demoShop разбирает reviews, stocks, payouts
    expect(stepForIssue(['answers', 'deepAnswers', 'reviews'], a)).toEqual({ step: 'deep', deepIndex: 0 })
    expect(stepForIssue(['answers', 'deepAnswers', 'payouts'], a)).toEqual({ step: 'deep', deepIndex: 2 })
    expect(stepForIssue(['answers', 'deepAnswers', 'stocks', 'rule'], a)).toEqual({ step: 'deep', deepIndex: 1 })
  })

  it('подробные ответы процесса вне списка разбора: шаг 3', () => {
    expect(stepForIssue(['answers', 'deepAnswers', 'ads'], a)).toEqual({ step: 'time', deepIndex: 0 })
    expect(stepForIssue(['answers', 'deepAnswers'], a)).toEqual({ step: 'time', deepIndex: 0 })
  })

  it('имя, контакт, согласие и прочее: шаг 5', () => {
    for (const path of [['answers', 'name'], ['answers', 'contact'], ['answers', 'consent'], ['answers', 'notes'], ['k'], []]) {
      expect(stepForIssue(path, a), path.join('.')).toEqual({ step: 'goals', deepIndex: 0 })
    }
  })

  it('пути настоящих ошибок схемы отправки ведут на нужные шаги', () => {
    const issueOf = (answers: typeof a) => {
      const r = briefSubmitSchema.safeParse({ answers, startedAtMs: 1 })
      if (r.success) throw new Error('ожидалась ошибка')
      return stepForIssue(r.error.issues[0].path, answers)
    }
    expect(issueOf({ ...a, marketplaces: [] })).toEqual({ step: 'shop', deepIndex: 0 })
    const stocks = { ...a.deepAnswers.stocks, rule: undefined }
    expect(issueOf({ ...a, deepAnswers: { ...a.deepAnswers, stocks } })).toEqual({ step: 'deep', deepIndex: 1 })
    expect(issueOf({ ...a, deepChoice: [] })).toEqual({ step: 'time', deepIndex: 0 })
    expect(issueOf({ ...a, consent: false })).toEqual({ step: 'goals', deepIndex: 0 })
  })
})
