import { describe, expect, it } from 'vitest'
import { processCatalog } from '@/app/data/brief/processes'
import { deepQuestions, goalsQuestions } from '@/app/data/brief/questions'
import { buildMap } from './build-map'
import { clarifyFor, flagsFor } from './flags'
import { clarifyCopy, flagCopy } from './internal-copy'
import { emptyAnswers, type BriefAnswers, type DeepAnswers } from './schema'

const category = flagCopy.category('не указана')
const flags = (patch: Partial<BriefAnswers>) => flagsFor({ ...emptyAnswers(), ...patch })

const complete: DeepAnswers = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'sheet', risk: 'nothing', data: 'cabinet' }
const clarify = (a: BriefAnswers) => clarifyFor(a, buildMap(a).items)
const oneProcess = (d: DeepAnswers, patch: Partial<BriefAnswers> = {}): BriefAnswers => ({
  ...emptyAnswers(),
  picked: [{ id: 'stocks', hours: '1to3' }],
  deepAnswers: { stocks: d },
  ...patch,
})
const title = (id: string) => [...deepQuestions, ...goalsQuestions].find((q) => q.id === id)!.title

describe('flagsFor', () => {
  it('персональные данные по отмеченному процессу, даже если его не разбирали', () => {
    const a: Partial<BriefAnswers> = {
      picked: [
        { id: 'reviews', hours: '1to3' },
        { id: 'stocks', hours: '1to3' },
        { id: 'ads', hours: '1to3' },
        { id: 'returns', hours: '1to3' },
      ],
      deepChoice: ['reviews'],
    }
    expect(flags(a)).toEqual([category, flagCopy.personalData(processCatalog.returns.label)])
  })

  it('российские сервисы, некому внедрять, нет доступа', () => {
    expect(flags({ ruOnly: 'required' })).toEqual([category, flagCopy.ruOnly])
    expect(flags({ ruOnly: 'preferred' })).toEqual([category])
    expect(flags({ implementer: 'nobody' })).toEqual([category, flagCopy.noImplementer])
    expect(flags({ access: 'no' })).toEqual([category, flagCopy.noAccess])
  })

  it('застрявший пилот с описанием и без', () => {
    expect(flags({ aiNow: 'triedFailed', aiTried: '  Бот не понял отзывы ' })).toEqual([
      category,
      flagCopy.stuckPilot('Бот не понял отзывы'),
    ])
    expect(flags({ aiNow: 'triedFailed' })).toEqual([category, flagCopy.stuckPilot('')])
    expect(flags({ aiNow: 'triedFailed', aiTried: 'Бот\r\nне понял\n\nотзывы' })).toEqual([
      category,
      flagCopy.stuckPilot('Бот не понял отзывы'),
    ])
  })

  it('бюджет подписью варианта', () => {
    expect(flags({ budget: 'lt50' })).toEqual([category, flagCopy.budget('До 50 тыс ₽')])
  })
})

describe('clarifyFor', () => {
  it('«не знаю» в подробном разборе', () => {
    expect(clarify(oneProcess({ ...complete, risk: 'unknown' }))).toEqual([
      clarifyCopy.deep(title('risk'), processCatalog.stocks.label),
    ])
  })

  it('никто не делает: нужен ли шаг; уже делает сервис: какой и чем не устраивает', () => {
    expect(clarify(oneProcess({ ...complete, who: 'nobody' }))).toEqual([clarifyCopy.needed(processCatalog.stocks.label)])
    expect(clarify(oneProcess({ ...complete, who: 'service' }))).toEqual([clarifyCopy.service(processCatalog.stocks.label)])
  })

  it('скрытый вопрос не даёт строки', () => {
    expect(clarify(oneProcess(complete, { implementer: 'nobody', implementerHours: 'unknown' }))).toEqual([])
    expect(clarify(oneProcess(complete, { implementer: 'self', implementerHours: 'unknown' }))).toEqual([
      clarifyCopy.general(title('implementerHours')),
    ])
  })
})
