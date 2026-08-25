import { describe, expect, it } from 'vitest'
import { TOUCH_INTENT_PX, WHEEL_INTENT_PX, isHorizontalIntent } from './carousel-gesture'

describe('isHorizontalIntent', () => {
  it('прокрутка страницы пальцем по карточке не считается листанием', () => {
    expect(isHorizontalIntent(0, -120, TOUCH_INTENT_PX)).toBe(false)
    // Палец редко идёт строго вертикально, но ось держит браузер: dy ведущий
    expect(isHorizontalIntent(8, -120, TOUCH_INTENT_PX)).toBe(false)
    expect(isHorizontalIntent(-40, 90, TOUCH_INTENT_PX)).toBe(false)
  })

  it('свайп по горизонтали считается листанием в обе стороны', () => {
    expect(isHorizontalIntent(60, 4, TOUCH_INTENT_PX)).toBe(true)
    expect(isHorizontalIntent(-60, -4, TOUCH_INTENT_PX)).toBe(true)
  })

  it('дрожание пальца ниже порога листанием не считается', () => {
    expect(isHorizontalIntent(9, 0, TOUCH_INTENT_PX)).toBe(false)
    expect(isHorizontalIntent(10, 0, TOUCH_INTENT_PX)).toBe(true)
  })

  it('диагональ ровно по 45 градусов - не листание', () => {
    expect(isHorizontalIntent(50, 50, TOUCH_INTENT_PX)).toBe(false)
    expect(isHorizontalIntent(50, -50, TOUCH_INTENT_PX)).toBe(false)
  })

  it('колесо мыши крутит страницу, shift+колесо и трекпад - карусель', () => {
    expect(isHorizontalIntent(0, 100, WHEEL_INTENT_PX)).toBe(false)
    expect(isHorizontalIntent(-100, 0, WHEEL_INTENT_PX)).toBe(true)
    // Трекпад шлёт мелкие дельты; ведущая ось видна и на них
    expect(isHorizontalIntent(3, 2, WHEEL_INTENT_PX)).toBe(true)
    expect(isHorizontalIntent(0.5, 0, WHEEL_INTENT_PX)).toBe(false)
  })
})
