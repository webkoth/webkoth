import { describe, expect, it } from 'vitest'
import { clarifyCopy, flagCopy } from '@/app/data/brief/copy'
import { buildMap } from './build-map'
import { demoShop, headShop, soloRareShop } from './fixtures'
import { buildInternal } from './internal'
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
})
