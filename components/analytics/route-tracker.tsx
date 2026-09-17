'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/analytics/attribution'

type YmHitFn = (id: number, action: 'hit', url: string, options: { referer?: string; title?: string }) => void

// Две вещи на каждую страницу (аудит 2026-09-17):
// 1) метки рекламы из адреса сохраняются для заявки (lib/analytics/attribution.ts);
// 2) переходы внутри сайта через next/link отправляются в Метрику хитом — сам
//    счётчик видит только первую загрузку, и визит с рекламы обрывался на входе.
// Первый хит делает init счётчика, поэтому при монтировании хит не шлётся.
export function RouteTracker() {
  const pathname = usePathname()
  const prevUrl = useRef<string | null>(null)

  useEffect(() => {
    const url = window.location.href
    captureAttribution(url)

    const prev = prevUrl.current
    prevUrl.current = url
    if (prev === null || prev === url) return

    const id = Number(process.env.NEXT_PUBLIC_YM_ID)
    const ym = (window as unknown as { ym?: YmHitFn }).ym
    if (!id || typeof ym !== 'function') return
    try {
      ym(id, 'hit', url, { referer: prev, title: document.title })
    } catch {
      // аналитика не роняет навигацию
    }
  }, [pathname])

  return null
}
