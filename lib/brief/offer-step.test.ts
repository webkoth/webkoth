import { describe, expect, it } from 'vitest'
import type { MapItem } from './map-types'
import { offerStepOf } from './offer-step'
import { emptyAnswers } from './schema'

const stopData = { verdict: { form: 'stopData', flags: [] } } as unknown as MapItem
const ready = { verdict: { form: 'f3', flags: [] } } as unknown as MapItem

describe('offerStepOf', () => {
  it('застрявший пилот важнее всего', () => {
    expect(offerStepOf({ ...emptyAnswers(), aiNow: 'triedFailed' }, [stopData, stopData], 'reviews')).toBe('pilot')
  })

  it('два процесса без данных или учёт в голове: аудит', () => {
    expect(offerStepOf(emptyAnswers(), [stopData, stopData], undefined)).toBe('audit')
    expect(offerStepOf({ ...emptyAnswers(), ledger: ['head'] }, [ready], 'stocks')).toBe('audit')
  })

  it('есть с чего начать и есть кому внедрять: первый процесс', () => {
    expect(offerStepOf({ ...emptyAnswers(), implementer: 'employee' }, [ready, stopData], 'stocks')).toBe('firstProcess')
    expect(offerStepOf({ ...emptyAnswers(), implementer: 'nobody' }, [ready], 'stocks')).toBe('review')
  })

  it('иначе разбор', () => {
    expect(offerStepOf(emptyAnswers(), [ready], undefined)).toBe('review')
  })
})
