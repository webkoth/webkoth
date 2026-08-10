'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function StickyCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-80px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <Button size="lg" nativeButton={false} render={<a href="#form" />}>
        {label}
      </Button>
    </div>
  )
}
