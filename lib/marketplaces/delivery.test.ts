import { describe, it, expect } from 'vitest'
import { settleReturning, settleThrowing, summarize } from './delivery'

describe('settleReturning — канал, который сообщает об отказе возвратом', () => {
  it('ok:true → успех', async () => {
    const r = await settleReturning('telegram', Promise.resolve({ ok: true }))
    expect(r).toEqual({ channel: 'telegram', ok: true })
  })

  it('ok:false → провал, а НЕ успех', async () => {
    const r = await settleReturning('telegram', Promise.resolve({ ok: false, error: '401' }))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('401')
  })

  it('брошенное исключение тоже провал', async () => {
    const r = await settleReturning('telegram', Promise.reject(new Error('boom')))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('boom')
  })
})

describe('settleThrowing — канал, который бросает', () => {
  it('резолв → успех', async () => {
    const r = await settleThrowing('email', Promise.resolve({ id: 'x' }))
    expect(r).toEqual({ channel: 'email', ok: true })
  })

  it('реджект → провал', async () => {
    const r = await settleThrowing('email', Promise.reject(new Error('relay 500')))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('relay 500')
  })
})

describe('summarize', () => {
  it('оба канала прошли — успех без partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: true },
        { channel: 'email', ok: true },
      ]),
    ).toEqual({ ok: true, partial: false, missing: [] })
  })

  it('прошёл только Telegram — успех с partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: true },
        { channel: 'email', ok: false, error: 'relay down' },
      ]),
    ).toEqual({ ok: true, partial: true, missing: ['email'] })
  })

  it('прошёл только email — успех с partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: false, error: '401' },
        { channel: 'email', ok: true },
      ]),
    ).toEqual({ ok: true, partial: true, missing: ['telegram'] })
  })

  it('оба упали — провал, заявка потеряна', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: false, error: '401' },
        { channel: 'email', ok: false, error: 'relay down' },
      ]),
    ).toEqual({ ok: false, partial: false, missing: ['telegram', 'email'] })
  })
})
