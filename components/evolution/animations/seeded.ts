// Детерминированный PRNG (mulberry32). Все «случайные» раскладки анимаций
// считаются на этапе модуля одинаково на сервере и клиенте — иначе SSR-разметка
// не совпадёт с клиентской и React выдаст hydration mismatch.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Кривая «быстрый старт, мягкая посадка» — общая для всех сцен страницы. */
export const EASE = [0.22, 1, 0.36, 1] as const
