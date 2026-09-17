'use client'

import type { AnchorHTMLAttributes } from 'react'
import { ymGoal } from '@/lib/analytics/ym'

// Ссылка на Telegram с целью tg_click: серверным компонентам нельзя вешать onClick,
// а без цели обращения в Telegram в Метрике не видны (аудит 2026-09-17).
export function TelegramLink({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      onClick={(e) => {
        ymGoal('tg_click')
        onClick?.(e)
      }}
    />
  )
}
