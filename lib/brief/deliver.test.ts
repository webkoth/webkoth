import { describe, expect, it, vi } from 'vitest'
import { deliverCopy } from '@/app/data/brief/copy'
import { type BriefTransport, CHUNK_PAUSE_MS, chunkEscaped, DELIVERY_DEADLINE_MS, deliverBrief, TELEGRAM_CHUNK } from './deliver'

type Sent = { ok: boolean; error?: string }
const ok = async (..._args: unknown[]): Promise<Sent> => ({ ok: true })
const fail = async (..._args: unknown[]): Promise<Sent> => ({ ok: false, error: 'boom' })
const noSleep = async () => {}
const payload = { summary: '<b>Бриф</b>', filename: 'brief.md', markdown: '# Бриф\n<тест> & ok' }
const longPayload = { ...payload, markdown: 'строка\n'.repeat(1500) }

describe('deliverBrief', () => {
  it('документ прошёл: больше ничего не шлём', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(ok), sendMessage })).toEqual({ ok: true, via: 'document' })
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('документ не прошёл: сводка с пометкой и текст частями', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage, sleep: noSleep })).toEqual({ ok: true, via: 'chunks' })
    expect(sendMessage.mock.calls[0][0]).toBe(`<b>Бриф</b>\n\n<i>${deliverCopy.documentFailed}</i>`)
    expect(sendMessage.mock.calls[1][0]).toBe('<pre># Бриф\n&lt;тест&gt; &amp; ok\n</pre>')
  })

  it('перед каждой частью пауза, чтобы Telegram не отклонил поток сообщений', async () => {
    const events: string[] = []
    const sendMessage = vi.fn(async (text: string) => {
      events.push(text.startsWith('<pre>') ? 'chunk' : 'head')
      return { ok: true }
    })
    const sleep = vi.fn(async (ms: number) => void events.push(`sleep ${ms}`))
    expect(await deliverBrief(longPayload, { sendDocument: vi.fn(fail), sendMessage, sleep })).toEqual({ ok: true, via: 'chunks' })
    expect(CHUNK_PAUSE_MS).toBe(350)
    const pause = `sleep ${CHUNK_PAUSE_MS}`
    expect(events).toEqual(['head', pause, 'chunk', pause, 'chunk', pause, 'chunk'])
  })

  it('сводка ушла, часть текста нет: доставлено частично, не провал', async () => {
    const sendMessage = vi
      .fn(ok)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: false, error: 'flood' })
    const r = await deliverBrief(longPayload, { sendDocument: vi.fn(fail), sendMessage, sleep: noSleep })
    expect(r).toEqual({ ok: true, via: 'chunks', partial: true, error: 'document: boom; chunk 2/3: flood' })
    expect(sendMessage).toHaveBeenCalledTimes(3)
  })

  it('сводка не ушла: ошибка с причинами, частей не шлём', async () => {
    const sendMessage = vi.fn(fail)
    const r = await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage, sleep: noSleep })
    expect(r).toEqual({ ok: false, error: 'document: boom; message: boom' })
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  // Подставные часы: каждая отправка сдвигает время, как если бы ждала ответа Telegram.
  const clockTransport = (docMs: number, messageMs: number) => {
    let clock = 1_000_000
    const sendDocument = vi.fn<BriefTransport['sendDocument']>(async () => {
      clock += docMs
      return { ok: false, error: 'timeout' }
    })
    const sendMessage = vi.fn<BriefTransport['sendMessage']>(async () => {
      clock += messageMs
      return { ok: true }
    })
    return { sendDocument, sendMessage, sleep: noSleep, now: () => clock }
  }

  it('общий дедлайн 20 с от начала: после сводки оставшиеся части не шлём', async () => {
    expect(DELIVERY_DEADLINE_MS).toBe(20_000)
    // Документ 10 с, сводка 6 с (16 с), первая часть 6 с (22 с): вторую уже не шлём.
    const t = clockTransport(10_000, 6_000)
    const r = await deliverBrief(longPayload, t)
    expect(r).toEqual({ ok: true, via: 'chunks', partial: true, error: 'deadline' })
    expect(t.sendMessage).toHaveBeenCalledTimes(2)
  })

  it('дедлайн прошёл до сводки: сводка всё равно уходит, частей нет', async () => {
    const t = clockTransport(25_000, 1_000)
    const r = await deliverBrief(payload, t)
    expect(r).toEqual({ ok: true, via: 'chunks', partial: true, error: 'deadline' })
    expect(t.sendMessage).toHaveBeenCalledTimes(1)
    expect(t.sendMessage.mock.calls[0][0]).toContain(deliverCopy.documentFailed)
  })

  it('до дедлайна успели: все части доставлены', async () => {
    const t = clockTransport(10_000, 2_000)
    expect(await deliverBrief(longPayload, t)).toEqual({ ok: true, via: 'chunks' })
    expect(t.sendMessage).toHaveBeenCalledTimes(4)
  })
})

describe('chunkEscaped', () => {
  it('каждая часть не длиннее лимита, склейка равна экранированному тексту', () => {
    const raw = Array.from({ length: 400 }, (_, i) => `строка ${i} & <b>`).join('\n') + '\n' + '&'.repeat(5000)
    const parts = chunkEscaped(raw)
    expect(parts.length).toBeGreaterThan(1)
    for (const p of parts) expect(p.length).toBeLessThanOrEqual(TELEGRAM_CHUNK)
    const joined = parts.join('')
    expect(joined.replace(/\n$/, '')).toBe(raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    for (const p of parts) expect(p).not.toMatch(/&[a-z]{0,3}$/)
  })

  it('частей из одних пробельных символов нет', () => {
    const parts = chunkEscaped('b'.repeat(TELEGRAM_CHUNK - 1) + '\n')
    expect(parts.length).toBeGreaterThan(0)
    for (const p of parts) expect(p.trim()).not.toBe('')
  })

  it('суррогатная пара не рвётся между частями', () => {
    const raw = 'a' + '😀'.repeat(TELEGRAM_CHUNK * 2)
    const parts = chunkEscaped(raw)
    expect(parts.length).toBeGreaterThan(1)
    for (const p of parts) {
      expect(p.length).toBeLessThanOrEqual(TELEGRAM_CHUNK)
      expect(() => encodeURIComponent(p)).not.toThrow()
    }
    expect(parts.join('')).toBe(raw + '\n')
  })
})
