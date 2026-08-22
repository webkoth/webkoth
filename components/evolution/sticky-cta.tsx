'use client'

import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeadDialog } from './lead-dialog'

// Плавающая кнопка открывает модалку с формой. Прячется, пока на экране hero
// (там есть своя кнопка) и пока видна inline-форма — иначе на мобильном она
// ложится поверх кнопки отправки.
export function StickyCta({ label }: { label: string }) {
  const [heroVisible, setHeroVisible] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const { open } = useLeadDialog()

  useEffect(() => {
    const hero = document.getElementById('hero')
    const form = document.getElementById('form')
    const observers: IntersectionObserver[] = []

    if (hero) {
      const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
        rootMargin: '-80px',
      })
      io.observe(hero)
      observers.push(io)
    }
    if (form) {
      const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
        rootMargin: '0px 0px -40px 0px',
      })
      io.observe(form)
      observers.push(io)
    }
    return () => observers.forEach((io) => io.disconnect())
  }, [])

  if (heroVisible || formVisible) return null

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      <Button size="lg" className="shadow-lg" onClick={open}>
        <MessageSquare aria-hidden />
        {label}
      </Button>
    </div>
  )
}
