import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendTelegramDocument, sendTelegramMessage } from './telegram'

function setup() {
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'TOKEN')
  vi.stubEnv('TELEGRAM_CHAT_ID', 'CHAT')
  vi.stubEnv('TELEGRAM_API_BASE_URL', 'https://proxy.example/')
  const fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('telegram', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('без настроек не отправляет', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    expect(await sendTelegramDocument('a.md', 'x', 'c')).toEqual({ ok: false, error: 'Telegram env not configured' })
  })

  it('sendMessage по-прежнему шлёт JSON', async () => {
    const fetchMock = setup()
    expect(await sendTelegramMessage('<b>hi</b>')).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://proxy.example/botTOKEN/sendMessage')
    expect(JSON.parse(init.body as string)).toEqual({
      chat_id: 'CHAT',
      text: '<b>hi</b>',
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
  })

  it('sendDocument шлёт multipart с файлом и подписью', async () => {
    const fetchMock = setup()
    expect(await sendTelegramDocument('brief.md', '# Бриф', '<b>Бриф</b>')).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://proxy.example/botTOKEN/sendDocument')
    const form = init.body as FormData
    expect(form.get('chat_id')).toBe('CHAT')
    expect(form.get('caption')).toBe('<b>Бриф</b>')
    expect(form.get('parse_mode')).toBe('HTML')
    const file = form.get('document') as File
    expect(file.name).toBe('brief.md')
    expect(await file.text()).toBe('# Бриф')
  })

  it('ошибка Telegram после повтора возвращается строкой', async () => {
    const fetchMock = setup()
    fetchMock.mockImplementation(async () => new Response('Bad Request', { status: 400 }))
    const r = await sendTelegramDocument('brief.md', 'x', 'c')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('Telegram 400')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
