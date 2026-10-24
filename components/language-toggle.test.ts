import { describe, expect, it } from 'vitest'
import { buildPath } from './language-toggle'

describe('buildPath', () => {
  it('главная: RU в корне, EN под /en', () => {
    expect(buildPath('/', 'ru', 'en')).toBe('/en')
    expect(buildPath('/', 'ru', 'ru')).toBe('/')
    expect(buildPath('/en', 'en', 'ru')).toBe('/')
    expect(buildPath('/en', 'en', 'en')).toBe('/en')
  })

  it('лендинг Директа только по-русски: RU остаётся, EN — на английскую главную', () => {
    expect(buildPath('/kontur', 'ru', 'ru')).toBe('/kontur')
    expect(buildPath('/kontur', 'ru', 'en')).toBe('/en')
  })

  it('/avtomatizaciya только по-русски', () => {
    expect(buildPath('/avtomatizaciya', 'ru', 'ru')).toBe('/avtomatizaciya')
    expect(buildPath('/avtomatizaciya', 'ru', 'en')).toBe('/en')
  })

  it('страницы под /[lang] меняют префикс языка', () => {
    expect(buildPath('/ru/standard', 'ru', 'en')).toBe('/en/standard')
    expect(buildPath('/en/standard', 'en', 'ru')).toBe('/ru/standard')
    expect(buildPath('/ru/standard', 'ru', 'ru')).toBe('/ru/standard')
  })
})
