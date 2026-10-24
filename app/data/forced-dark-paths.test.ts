import { describe, expect, it } from 'vitest'
import { FORCED_DARK_PATHS, isForcedDarkPath } from './forced-dark-paths'

describe('isForcedDarkPath', () => {
  it('форсит тёмную тему на /avtomatizaciya', () => {
    expect(FORCED_DARK_PATHS).toContain('/avtomatizaciya')
    expect(isForcedDarkPath('/avtomatizaciya')).toBe(true)
    expect(isForcedDarkPath('/avtomatizaciya/')).toBe(true)
  })

  it('не трогает остальные страницы', () => {
    expect(isForcedDarkPath('/')).toBe(false)
    expect(isForcedDarkPath('/kontur')).toBe(false)
    expect(isForcedDarkPath('/ru/standard')).toBe(false)
    expect(isForcedDarkPath(null)).toBe(false)
  })
})
