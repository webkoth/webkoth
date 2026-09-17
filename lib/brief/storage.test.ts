import { describe, expect, it } from 'vitest'
import { demoShop } from './fixtures'
import { initialState, type BriefState } from './state'
import { clearState, loadState, saveState, STORAGE_KEY } from './storage'

const memory = () => {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}
const broken = {
  getItem: () => {
    throw new Error('denied')
  },
  setItem: () => {
    throw new Error('quota')
  },
  removeItem: () => {
    throw new Error('denied')
  },
}
const state = (): BriefState => ({ ...initialState(1000), step: 'time', answers: demoShop() })

describe('storage', () => {
  it('сохраняет и читает состояние', () => {
    const store = memory()
    expect(saveState(store, state())).toBe(true)
    expect(loadState(store)).toEqual({ status: 'ok', state: state() })
  })

  it('пусто, недоступно, повреждено', () => {
    expect(loadState(memory())).toEqual({ status: 'empty' })
    expect(loadState(undefined)).toEqual({ status: 'unavailable' })
    expect(loadState(broken)).toEqual({ status: 'unavailable' })
    const store = memory()
    store.data.set(STORAGE_KEY, '{"version":0}')
    expect(loadState(store)).toEqual({ status: 'outdated' })
    store.data.set(STORAGE_KEY, 'not json')
    expect(loadState(store)).toEqual({ status: 'outdated' })
  })

  it('перезагрузка посреди отправки превращается в «не отправилось»', () => {
    const store = memory()
    saveState(store, { ...state(), step: 'map', send: 'sending' })
    const r = loadState(store)
    expect(r.status === 'ok' && r.state.send).toBe('failed')
  })

  it('ошибки хранилища не бросаются наружу', () => {
    expect(saveState(broken, state())).toBe(false)
    expect(saveState(undefined, state())).toBe(false)
    expect(() => clearState(broken)).not.toThrow()
    const store = memory()
    saveState(store, state())
    clearState(store)
    expect(loadState(store)).toEqual({ status: 'empty' })
  })
})
