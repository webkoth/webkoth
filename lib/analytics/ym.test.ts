import { afterEach, describe, expect, it, vi } from 'vitest'
import { ymGoal } from './ym'

describe('ymGoal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('не падает без window (серверный рендер)', () => {
    expect(() => ymGoal('quiz_start')).not.toThrow()
  })

  it('не падает, когда счётчик не подключён', () => {
    vi.stubGlobal('window', {})
    expect(() => ymGoal('lead_sent')).not.toThrow()
  })

  it('вызывает ym(id, "reachGoal", цель), когда счётчик есть', () => {
    const ym = vi.fn()
    vi.stubGlobal('window', { ym })
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '12345')
    ymGoal('quiz_result')
    expect(ym).toHaveBeenCalledWith(12345, 'reachGoal', 'quiz_result')
  })

  it('не вызывает ym, когда NEXT_PUBLIC_YM_ID не задан', () => {
    const ym = vi.fn()
    vi.stubGlobal('window', { ym })
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '')
    ymGoal('lead_sent')
    expect(ym).not.toHaveBeenCalled()
  })
})
