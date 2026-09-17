import { describe, expect, it } from 'vitest'
import { outcomeCopy } from '@/app/data/brief/copy'
import type { Verdict, VerdictFlag, VerdictForm } from '@/lib/standard/verdict'
import { dynamicOutcome } from './step-color'

const v = (form: VerdictForm, act?: 'A2' | 'A4' | 'A5', flags: VerdictFlag[] = []): Verdict => ({
  form,
  autonomy: act ? { collect: 'A5', analyze: 'A5', decide: 'A1', act } : undefined,
  flags,
})
const c = outcomeCopy.captions
const n = outcomeCopy.notes

describe('dynamicOutcome', () => {
  it('F3: программа', () => {
    expect(dynamicOutcome(v('f3'), 'give')).toEqual({ color: 'auto', caption: c.program, notes: [n.program], shareKey: 'f3', showApproval: false })
  })

  it('F4 с действием A2: ИИ готовит, шаг утверждения показан', () => {
    expect(dynamicOutcome(v('f4', 'A2', ['irreversible', 'rope']), undefined)).toEqual({
      color: 'ai',
      caption: c.aiPrepares,
      notes: [n.rope],
      shareKey: 'aiPrepares',
      showApproval: true,
    })
  })

  it('F5 с действием A4: ИИ делает сам', () => {
    const o = dynamicOutcome(v('f5', 'A4'), 'give')
    expect([o.color, o.caption, o.shareKey, o.showApproval]).toEqual(['auto', c.aiAuto, 'aiAuto', false])
  })

  it('split: по этапам', () => {
    expect(dynamicOutcome(v('split'), 'give')).toEqual({ color: 'ai', caption: c.split, notes: [n.split], shareKey: 'split', showApproval: false })
  })

  it('F1 и F1/F2: человек с помощником', () => {
    for (const form of ['f1', 'f1f2'] as const) {
      expect(dynamicOutcome(v(form), 'give')).toMatchObject({ color: 'human', caption: c.human, shareKey: 'human' })
    }
  })

  it('F0 и остановки: не трогать', () => {
    expect(dynamicOutcome(v('f0'), 'give')).toMatchObject({ color: 'skip', caption: c.f0, notes: [n.f0], shareKey: 'skip' })
    expect(dynamicOutcome(v('stopEtalon'), 'give')).toMatchObject({ color: 'skip', caption: c.stopEtalon, notes: [] })
    expect(dynamicOutcome(v('stopData'), 'give')).toMatchObject({ color: 'skip', caption: c.stopData, notes: [n.stopData] })
  })

  it('«оставить себе»: человек; при F3 пометка, что могла бы программа', () => {
    expect(dynamicOutcome(v('f3'), 'keep')).toEqual({ color: 'human', caption: c.human, notes: [n.kept], shareKey: 'human', showApproval: false })
    expect(dynamicOutcome(v('f1'), 'keep').notes).toEqual([])
    expect(dynamicOutcome(v('stopData'), 'keep').color).toBe('skip')
  })

  it('флаг персональных данных даёт пометку; rope без шага утверждения не пишется', () => {
    expect(dynamicOutcome(v('f3', undefined, ['personalData']), 'give').notes).toEqual([n.program, n.personalData])
    expect(dynamicOutcome(v('f4', 'A2', ['rope']), 'keep').notes).toEqual([n.kept])
  })
})
