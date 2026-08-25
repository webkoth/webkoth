'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLeadDialog } from './lead-dialog'

// Видимость секции по id - через подписку, а не через setState в эффекте
// (тот же приём, что в useMediaQuery): снимок лежит в мутабельной ячейке,
// React перечитывает его по уведомлению наблюдателя.
// `fallback` - снимок до подписки: на сервере и в первом клиентском рендере,
// иначе кнопка успела бы мигнуть поверх hero.
// Секции на странице может не быть вовсе - тогда она «не видна»: на странице
// кейса нет ни hero, ни inline-формы, и прятаться плавающей кнопке не за что.
function useSectionVisible(id: string, rootMargin: string, fallback: boolean): boolean {
  const visible = useRef(fallback)

  const subscribe = useCallback(
    (onChange: () => void) => {
      const el = document.getElementById(id)
      if (!el) {
        visible.current = false
        onChange()
        return () => {}
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          visible.current = entry.isIntersecting
          onChange()
        },
        { rootMargin },
      )
      io.observe(el)
      return () => io.disconnect()
    },
    [id, rootMargin],
  )

  return useSyncExternalStore(
    subscribe,
    () => visible.current,
    () => fallback,
  )
}

// Плавающая кнопка открывает модалку с формой. Прячется, пока на экране hero
// (там есть своя кнопка) и пока видна inline-форма — иначе на мобильном она
// ложится поверх кнопки отправки. На странице кейса ни того, ни другого нет,
// и кнопка видна сразу: там она единственная CTA ниже первого экрана.
// `mobileOnly` - для страницы кейса: от lg панель фактов липкая и её кнопка
// всё время на экране, так что две одинаковые CTA в двух сотнях пикселей друг
// от друга ничего не добавляют. Порог тот же, что у `lg:sticky` панели.
export function StickyCta({ label, mobileOnly = false }: { label: string; mobileOnly?: boolean }) {
  const heroVisible = useSectionVisible('hero', '-80px', true)
  const formVisible = useSectionVisible('form', '0px 0px -40px 0px', false)
  const { open } = useLeadDialog()

  if (heroVisible || formVisible) return null

  return (
    <div className={cn('fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6', mobileOnly && 'lg:hidden')}>
      <Button size="lg" className="shadow-lg" onClick={open}>
        <MessageSquare aria-hidden />
        {label}
      </Button>
    </div>
  )
}
