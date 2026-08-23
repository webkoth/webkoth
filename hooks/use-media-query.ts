'use client'

import { useSyncExternalStore } from 'react'

// Подписка на media query без setState-в-эффекте: серверный снимок — `fallback`,
// на клиенте — живое значение matchMedia. Используется, чтобы выбрать Dialog
// (десктоп) или нижний Sheet (мобильный) для формы заявки.
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  )
}
