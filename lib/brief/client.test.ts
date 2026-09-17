import { afterEach, describe, expect, it, vi } from 'vitest'
import { postBrief } from './client'
import { demoShop } from './fixtures'

const body = { answers: demoShop(), startedAtMs: 1, website: '' }
const reply = (status: number, json: unknown) => vi.fn(async () => new Response(JSON.stringify(json), { status }))

describe('postBrief', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('200 и ok: отправлено; тело уходит JSON-ом на /api/brief', async () => {
    const f = reply(200, { ok: true })
    expect(await postBrief(body, f)).toBe('sent')
    expect(f).toHaveBeenCalledWith('/api/brief', expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }))
  })

  it('запрос ограничен по времени; таймаут: не отправилось', async () => {
    const f = reply(200, { ok: true })
    await postBrief(body, f)
    expect(f).toHaveBeenCalledWith('/api/brief', expect.objectContaining({ signal: expect.any(AbortSignal) }))
    const timeout = vi.fn(async () => Promise.reject(new DOMException('The operation timed out', 'TimeoutError')))
    expect(await postBrief(body, timeout)).toBe('failed')
  })

  it('429: лимит; 502, 400 и сеть: не отправилось', async () => {
    expect(await postBrief(body, reply(429, { ok: false }))).toBe('rateLimited')
    expect(await postBrief(body, reply(502, { ok: false }))).toBe('failed')
    expect(await postBrief(body, reply(400, { ok: false }))).toBe('failed')
    expect(await postBrief(body, vi.fn(async () => Promise.reject(new Error('offline'))))).toBe('failed')
  })

  it('браузер без AbortSignal.timeout (Safari до 16): запрос уходит без таймаута и отправляется', async () => {
    vi.stubGlobal('AbortSignal', { ...AbortSignal, timeout: undefined })
    const f = reply(200, { ok: true })
    expect(await postBrief(body, f)).toBe('sent')
    expect(f).toHaveBeenCalledTimes(1)
    expect(f.mock.calls[0]).toEqual(['/api/brief', expect.not.objectContaining({ signal: expect.anything() })])
  })

  it('браузер без AbortSignal вовсе: запрос уходит и отправляется', async () => {
    vi.stubGlobal('AbortSignal', undefined)
    const f = reply(200, { ok: true })
    expect(await postBrief(body, f)).toBe('sent')
  })
})
