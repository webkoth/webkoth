import { describe, expect, it } from 'vitest'
import { stageCopy } from '@/app/data/brief/copy'
import { stageOf } from './stage'

describe('stageOf', () => {
  it('пять веток самооценки', () => {
    const view = (aiNow: Parameters<typeof stageOf>[0]) => {
      const s = stageOf(aiNow)
      return [s.key, s.early, s.stuckPilot]
    }
    expect(view('none')).toEqual(['stage0', true, false])
    expect(view('chatSelf')).toEqual(['stage1', true, false])
    expect(view('teamRegular')).toEqual(['stage1', true, false])
    expect(view('automations')).toEqual(['stage1to2', false, false])
    expect(view('triedFailed')).toEqual(['stage1stuck', true, true])
    expect(view(undefined)).toEqual(['unknown', true, false])
  })

  it('в карту для браузера идёт только подпись: внутренней пометки стадии нет', () => {
    for (const aiNow of ['none', 'chatSelf', 'teamRegular', 'automations', 'triedFailed', undefined] as const) {
      const s = stageOf(aiNow)
      expect(Object.keys(s).sort(), String(aiNow)).toEqual(['early', 'key', 'label', 'stuckPilot'])
      expect(s.label).toBe(stageCopy[s.key].label)
    }
  })
})
