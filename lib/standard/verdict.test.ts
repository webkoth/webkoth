import { describe, expect, it } from 'vitest'
import { decideVerdict, type QuizInput } from './verdict'

// База: путь, доходящий до агента. Каждый тест меняет минимум полей —
// так видно, какой именно вопрос повернул вердикт.
const base: QuizInput = {
  hasEtalon: true,
  dataReady: true,
  useful: 'yes',
  rule: 'judgment',
  check: 'quick',
  singleRun: true,
  sideEffect: 'notify',
  irreversible: false,
  personalData: false,
}

describe('ворота', () => {
  it('нет эталона — стоп, форма не выбирается', () => {
    expect(decideVerdict({ ...base, hasEtalon: false }).form).toBe('stopEtalon')
  })

  it('нет данных — стоп: сначала данные', () => {
    expect(decideVerdict({ ...base, dataReady: false }).form).toBe('stopData')
  })
})

describe('взвешивание', () => {
  it('шаг не нужен — F0', () => {
    expect(decideVerdict({ ...base, useful: 'no' }).form).toBe('f0')
  })

  it('редко и дёшево — помощник F1', () => {
    expect(decideVerdict({ ...base, useful: 'rare' }).form).toBe('f1')
  })

  it('правило записывается полностью — программа F3, без модели и автономии', () => {
    const v = decideVerdict({ ...base, rule: 'full' })
    expect(v.form).toBe('f3')
    expect(v.autonomy).toBeUndefined()
  })

  it('правило чёткое, вход свободный — конвейер F4', () => {
    expect(decideVerdict({ ...base, rule: 'freeInput' }).form).toBe('f4')
  })

  it('проверить может только эксперт — F1/F2', () => {
    expect(decideVerdict({ ...base, check: 'expert' }).form).toBe('f1f2')
  })

  it('не укладывается в прогон — split', () => {
    expect(decideVerdict({ ...base, singleRun: false }).form).toBe('split')
  })

  it('суждение, проверяемо, один прогон — агент F5', () => {
    expect(decideVerdict(base).form).toBe('f5')
  })
})

describe('последствия и автономия', () => {
  it('read — действие A5, notify — A4, write — A2 с верёвкой', () => {
    expect(decideVerdict({ ...base, sideEffect: 'read' }).autonomy?.act).toBe('A5')
    expect(decideVerdict({ ...base, sideEffect: 'notify' }).autonomy?.act).toBe('A4')
    const write = decideVerdict({ ...base, sideEffect: 'write' })
    expect(write.autonomy?.act).toBe('A2')
    expect(write.flags).toContain('rope')
  })

  it('необратимое прижимает действие к A2 даже при notify', () => {
    const v = decideVerdict({ ...base, irreversible: true })
    expect(v.autonomy?.act).toBe('A2')
    expect(v.flags).toContain('irreversible')
  })

  it('персональные данные — флаг контура на любом исходе', () => {
    expect(decideVerdict({ ...base, personalData: true }).flags).toContain('personalData')
    expect(decideVerdict({ ...base, personalData: true, rule: 'full' }).flags).toContain(
      'personalData',
    )
  })

  it('сбор и анализ всегда A5, решение A1 — «всё на агентов» не бывает', () => {
    const v = decideVerdict({ ...base, sideEffect: 'write' })
    expect(v.autonomy).toMatchObject({ collect: 'A5', analyze: 'A5', decide: 'A1' })
  })
})
