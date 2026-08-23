'use client'

import { useSyncExternalStore } from 'react'
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * prefers-reduced-motion без расхождений гидратации: на сервере и в первом
 * клиентском рендере всегда false (как в SSR-разметке), настоящее значение —
 * со следующего рендера после монтирования. Framer'овский useReducedMotion уже
 * в первом клиентском рендере отдаёт true, и всё, что от него зависит в разметке
 * (SMIL-элементы, условные ветки), расходится с HTML сервера.
 * Применять только там, где от reduce зависит разметка (production-stack,
 * hubmarket-case). Где reduce влияет лишь на длительности и animate —
 * оставлять framer'овский useReducedMotion: он даёт мгновенный финальный кадр.
 */
export function useReducedMotionSafe(): boolean {
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)
  const reduce = useFramerReducedMotion()
  return mounted && !!reduce
}
