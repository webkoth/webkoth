import { describe, expect, it, vi } from 'vitest'
import { deliverCopy } from '@/app/data/brief/copy'
import { chunkEscaped, deliverBrief, TELEGRAM_CHUNK } from './deliver'

const ok = async () => ({ ok: true })
const fail = async () => ({ ok: false, error: 'boom' })
const payload = { summary: '<b>Бриф</b>', filename: 'brief.md', markdown: '# Бриф\n<тест> & ok' }

describe('deliverBrief', () => {
  it('документ прошёл: больше ничего не шлём', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(ok), sendMessage })).toEqual({ ok: true, via: 'document' })
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('документ не прошёл: сводка с пометкой и текст частями', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage })).toEqual({ ok: true, via: 'chunks' })
    expect(sendMessage.mock.calls[0][0]).toBe(`<b>Бриф</b>\n\n<i>${deliverCopy.documentFailed}</i>`)
    expect(sendMessage.mock.calls[1][0]).toBe('<pre># Бриф\n&lt;тест&gt; &amp; ok\n</pre>')
  })

  it('не прошло ничего: ошибка с причинами', async () => {
    const r = await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage: vi.fn(fail) })
    expect(r.ok).toBe(false)
    expect(r.error).toContain('document: boom')
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
})
