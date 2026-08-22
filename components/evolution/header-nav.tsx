'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { PaletteToggle } from '@/components/palette-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type NavItem = { id: string; label: string }

// Шапка с якорями по шести блокам — пункты навигации и есть постулаты.
// Активный блок подсвечивается по скроллу; на узких экранах строка якорей
// прокручивается горизонтально, чтобы не давать странице расти вширь.
export function HeaderNav({
  brand,
  back,
  cta,
  items,
}: {
  brand: string
  back: string
  cta: string
  items: NavItem[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        }
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        setActiveId(best)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [items])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {back || brand}
        </Link>
        <div className="flex items-center gap-1">
          <PaletteToggle />
          <ModeToggle />
          {/* На мобильном работу этой кнопки делает StickyCta. */}
          <Button
            size="sm"
            className="ml-2 hidden sm:inline-flex"
            nativeButton={false}
            render={<a href="#form" />}
          >
            {cta}
          </Button>
        </div>
      </div>
      <nav aria-label="Шаги" className="border-t border-border/60">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] md:px-6 lg:justify-center [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => {
            const active = activeId === item.id
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs whitespace-nowrap transition md:text-[13px]',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
