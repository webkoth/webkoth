import { describe, expect, it } from 'vitest'
import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttribution,
  mergeTouch,
  readAttribution,
  touchFromUrl,
} from './attribution'

const memory = () => {
  const data = new Map<string, string>()
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), data }
}
const AD =
  'https://webkoth.com/kontur?utm_source=yandex&utm_medium=cpc&utm_campaign=kontur-rsya&utm_content=integraciya-1s-marketpleysy&utm_term=1c%20wb&placement=ya.ru&device=mobile&cid=714528958&yclid=123'

describe('touchFromUrl', () => {
  it('берёт utm, yclid и параметры Директа, страницу без параметров', () => {
    const t = touchFromUrl(AD, new Date('2026-09-17T10:00:00Z'))
    expect(t).toMatchObject({
      landing: '/kontur',
      utm_campaign: 'kontur-rsya',
      utm_term: '1c wb',
      placement: 'ya.ru',
      device: 'mobile',
      cid: '714528958',
      yclid: '123',
      at: '2026-09-17T10:00:00.000Z',
    })
  })

  it('без меток — не рекламный вход', () => {
    expect(touchFromUrl('https://webkoth.com/kontur#quiz')).toBeNull()
    expect(touchFromUrl('не адрес')).toBeNull()
  })

  it('обрезает значения и убирает переносы строк', () => {
    const t = touchFromUrl(`https://webkoth.com/?utm_term=${encodeURIComponent('a\nb' + 'x'.repeat(300))}`)
    expect(t?.utm_term?.includes('\n')).toBe(false)
    expect(t?.utm_term?.length).toBe(200)
  })
})

describe('mergeTouch', () => {
  const now = new Date('2026-09-17T10:00:00Z')
  const touch = (at: string, campaign: string) => ({ landing: '/', at, utm_campaign: campaign })

  it('первое касание сохраняется, последнее обновляется', () => {
    const a = mergeTouch({}, touch('2026-09-10T00:00:00Z', 'a'), now)
    const b = mergeTouch(a, touch('2026-09-17T09:00:00Z', 'b'), now)
    expect(b.first?.utm_campaign).toBe('a')
    expect(b.last?.utm_campaign).toBe('b')
  })

  it('касания старше 30 дней забываются', () => {
    const old = { first: touch('2026-08-01T00:00:00Z', 'old'), last: touch('2026-08-01T00:00:00Z', 'old') }
    expect(mergeTouch(old, null, now)).toEqual({ first: undefined, last: undefined })
    const next = mergeTouch(old, touch('2026-09-17T09:00:00Z', 'new'), now)
    expect(next.first?.utm_campaign).toBe('new')
  })
})

describe('captureAttribution / readAttribution', () => {
  it('сохраняет рекламный вход и не затирает его прямым заходом', () => {
    const store = memory()
    const now = new Date('2026-09-17T10:00:00Z')
    captureAttribution(AD, now, store)
    captureAttribution('https://webkoth.com/kontur#pricing', now, store)
    const a = readAttribution(now, store)
    expect(a.last?.utm_campaign).toBe('kontur-rsya')
    expect(a.first?.yclid).toBe('123')
  })

  it('битое хранилище не роняет чтение', () => {
    const store = memory()
    store.setItem(ATTRIBUTION_STORAGE_KEY, '{не json')
    expect(readAttribution(new Date(), store)).toEqual({})
    expect(readAttribution(new Date(), null)).toEqual({})
  })
})
