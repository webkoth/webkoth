import { describe, expect, it } from 'vitest'
import { clientIp } from './client-ip'

const h = (init: Record<string, string>) => new Headers(init)

describe('clientIp', () => {
  it('x-real-ip в приоритете', () => {
    expect(clientIp(h({ 'x-real-ip': ' 203.0.113.7 ', 'x-forwarded-for': '1.1.1.1, 203.0.113.9' }))).toBe('203.0.113.7')
  })

  it('без x-real-ip: последнее значение x-forwarded-for, подделанное первое не используется', () => {
    expect(clientIp(h({ 'x-forwarded-for': '6.6.6.6, 203.0.113.9' }))).toBe('203.0.113.9')
    expect(clientIp(h({ 'x-forwarded-for': '6.6.6.6, 203.0.113.9, ' }))).toBe('203.0.113.9')
    expect(clientIp(h({ 'x-real-ip': '  ', 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9')
  })

  it('пустые заголовки: unknown', () => {
    expect(clientIp(h({}))).toBe('unknown')
    expect(clientIp(h({ 'x-real-ip': '', 'x-forwarded-for': ' , ' }))).toBe('unknown')
  })
})
