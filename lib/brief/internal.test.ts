import { describe, expect, it } from 'vitest'
import { buildMap } from './build-map'
import { demoShop, headShop, soloRareShop } from './fixtures'
import { buildInternal } from './internal'
import { clarifyCopy, flagCopy } from './internal-copy'
import { emptyAnswers, type BriefAnswers } from './schema'

const internal = (a: BriefAnswers) => buildInternal(a, buildMap(a))

describe('buildInternal', () => {
  it('карта для селлера без ступени, флагов и «уточнить»', () => {
    const keys = Object.keys(buildMap(demoShop()))
    for (const k of ['offer', 'flags', 'clarify']) expect(keys).not.toContain(k)
  })

  it('демо-магазин: первый процесс, категория и бюджет, уточнять нечего', () => {
    expect(internal(demoShop())).toEqual({
      offer: 'firstProcess',
      flags: [flagCopy.category('Одежда и обувь'), flagCopy.budget('150–400 тыс ₽')],
      clarify: [],
    })
  })

  it('«всё в голове»: аудит, уточнить ключи доступа', () => {
    const r = internal(headShop())
    expect(r.offer).toBe('audit')
    expect(r.clarify).toEqual([clarifyCopy.general('Выпускали ключи доступа к кабинету?')])
  })

  it('один владелец, редкие задачи: разбор', () => {
    expect(internal(soloRareShop()).offer).toBe('review')
  })

  it('пустой бриф: только флаг категории', () => {
    expect(internal(emptyAnswers()).flags).toEqual([flagCopy.category('не указана')])
  })

  it('заполнено быстрее минуты: секунды в поле и первым флагом', () => {
    const a = demoShop()
    const r = buildInternal(a, buildMap(a), { fillSeconds: 5 })
    expect(r.fastFillSeconds).toBe(5)
    expect(flagCopy.fastFill(5)).toBe('Заполнено за 5 с: проверить, не бот ли')
    expect(r.flags).toEqual([flagCopy.fastFill(5), flagCopy.category('Одежда и обувь'), flagCopy.budget('150–400 тыс ₽')])
    expect(buildInternal(a, buildMap(a), { fillSeconds: 0 }).flags[0]).toBe(flagCopy.fastFill(0))
  })

  it('минута и дольше, время неизвестно: пометки нет', () => {
    const a = demoShop()
    for (const opts of [{ fillSeconds: 60 }, { fillSeconds: 600 }, { fillSeconds: -1 }, {}, undefined]) {
      const r = buildInternal(a, buildMap(a), opts)
      expect(Object.keys(r)).not.toContain('fastFillSeconds')
      expect(r.flags[0]).toBe(flagCopy.category('Одежда и обувь'))
    }
  })
})
