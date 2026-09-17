import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Result = { ok: boolean; error?: string }

vi.mock('@/lib/landing/telegram', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/landing/telegram')>()
  return {
    ...actual,
    sendTelegramDocument: vi.fn(async (): Promise<Result> => ({ ok: true })),
    sendTelegramMessage: vi.fn(async (): Promise<Result> => ({ ok: true })),
  }
})

import { NextRequest } from 'next/server'
import { demoShop } from '@/lib/brief/fixtures'
import { sendTelegramDocument, sendTelegramMessage } from '@/lib/landing/telegram'
import { POST } from './route'

let ip = 0
const request = (raw: string, headers: Record<string, string> = { 'x-real-ip': `10.0.0.${++ip}` }) =>
  new NextRequest('http://localhost/api/brief', {
    method: 'POST',
    body: raw,
    headers: { 'content-type': 'application/json', ...headers },
  })
const valid = () => ({ answers: demoShop(), k: 'anna', startedAtMs: Date.now() - 10 * 60_000 })
const send = (body: unknown) => POST(request(JSON.stringify(body)))

describe('POST /api/brief', () => {
  beforeEach(() => {
    vi.mocked(sendTelegramDocument).mockReset().mockResolvedValue({ ok: true })
    vi.mocked(sendTelegramMessage).mockReset().mockResolvedValue({ ok: true })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('принимает бриф, сам строит карту и шлёт документ', async () => {
    const res = await send(valid())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const [filename, content, caption] = vi.mocked(sendTelegramDocument).mock.calls[0]
    expect(filename).toMatch(/^brief-anna-\d{4}-\d{2}-\d{2}-\d{4}\.md$/)
    expect(content).toContain('### Ответы на отзывы (начать с этого)')
    expect(caption).toContain('Начать с: Ответы на отзывы')
    expect(caption).toContain('Ступень: первый процесс до production')
    expect(content).toContain('- Проверить категорию по правилу 1.6: Одежда и обувь')
  })

  it('карта и файл строятся по нормализованным ответам: скрытые ответы не уходят', async () => {
    const a = demoShop()
    const answers = {
      ...a,
      categoryOther: 'Скрытая категория',
      aiTried: 'Скрытый пилот',
      deepAnswers: { ...a.deepAnswers, ads: a.deepAnswers.reviews },
    }
    expect((await send({ ...valid(), answers })).status).toBe(200)
    const [, content] = vi.mocked(sendTelegramDocument).mock.calls[0]
    expect(content).not.toContain('Скрытая категория')
    expect(content).not.toContain('Скрытый пилот')
    expect(content).not.toContain('"ads": {')
  })

  it('ловушка для ботов и слишком быстрое заполнение: тихий 200 без отправки, причина в логе', async () => {
    expect((await send({ ...valid(), website: 'http://spam' })).status).toBe(200)
    expect(console.warn).toHaveBeenLastCalledWith('[brief] dropped: honeypot')
    expect((await send({ ...valid(), startedAtMs: Date.now() - 5_000 })).status).toBe(200)
    expect(console.warn).toHaveBeenLastCalledWith('[brief] dropped: too_fast')
    expect(sendTelegramDocument).not.toHaveBeenCalled()
  })

  it('часы устройства спешат: бриф с будущим startedAtMs доставляется', async () => {
    expect((await send({ ...valid(), startedAtMs: Date.now() + 10 * 60_000 })).status).toBe(200)
    expect(sendTelegramDocument).toHaveBeenCalledTimes(1)
    expect(vi.mocked(sendTelegramDocument).mock.calls[0][1]).toContain('- Заполнение: неизвестно (часы устройства)')
  })

  it('без согласия и битый JSON: 400; в логе пути ошибок без значений', async () => {
    const noConsent = await send({ ...valid(), answers: { ...demoShop(), consent: false, contact: 'x' } })
    expect(noConsent.status).toBe(400)
    expect(console.warn).toHaveBeenCalledWith('[brief] validation: answers.contact, answers.consent')
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain('Анна')
    expect((await POST(request('{oops'))).status).toBe(400)
  })

  it('слишком большое тело: 413', async () => {
    expect((await POST(request('x'.repeat(70_000)))).status).toBe(413)
  })

  it('лимит по x-real-ip: шестой запрос 429, подделка x-forwarded-for не помогает', async () => {
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) {
      const headers = { 'x-real-ip': '203.0.113.77', 'x-forwarded-for': `6.6.6.${i}, 203.0.113.77` }
      statuses.push((await POST(request(JSON.stringify(valid()), headers))).status)
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429])
    expect(sendTelegramDocument).toHaveBeenCalledTimes(5)
    expect(sendTelegramMessage).not.toHaveBeenCalled()
  })

  it('документ не прошёл, сводка и текст частями прошли: 200', async () => {
    vi.mocked(sendTelegramDocument).mockResolvedValue({ ok: false, error: 'proxy' })
    const res = await send(valid())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(vi.mocked(sendTelegramMessage).mock.calls.length).toBeGreaterThan(1)
    expect(console.warn).toHaveBeenCalledWith('[brief] document rejected, delivered as text chunks')
  })

  it('документ не прошёл, сводка ушла, часть текста нет: 200 и частичная доставка в логе', async () => {
    vi.mocked(sendTelegramDocument).mockResolvedValue({ ok: false, error: 'proxy' })
    vi.mocked(sendTelegramMessage).mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, error: 'flood' })
    const res = await send(valid())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/^\[brief\] partial delivery: document: proxy; chunk 1\/\d+: flood$/))
  })

  it('Telegram не принял ни документ, ни сообщение: 502', async () => {
    vi.mocked(sendTelegramDocument).mockResolvedValue({ ok: false, error: 'proxy' })
    vi.mocked(sendTelegramMessage).mockResolvedValue({ ok: false, error: 'down' })
    const res = await send(valid())
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ ok: false, error: 'delivery' })
  })
})
