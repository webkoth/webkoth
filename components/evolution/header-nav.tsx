'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ModeToggle } from '@/components/mode-toggle'
import { PaletteToggle } from '@/components/palette-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { FontToggle } from '@/components/font-toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import { STEP_ICONS, isStepKey } from './step-icons'
import { ReadingProgress } from './reading-progress'
import { LlmDocsButton } from './llm-docs-button'
import { SOCIAL_ICONS } from './social-icons'
import { SOCIAL_LINKS_HEADER } from '@/lib/landing/social'

export type NavItem = { id: string; label: string }

// Шапка: бренд · служебные тумблеры в ряд (язык, палитра, тема, моно-шрифт) ·
// строка якорей по шести шагам с иконками-словарём. CTA в шапке нет — её
// работу делают кнопка в hero и плавающая StickyCta. Активный шаг подсвечивается
// по скроллу; на узких экранах подписи якорей прячутся, остаются иконка и номер
// (подпись — в tooltip). Высоту шапки кладём в --header-h: от неё считает
// «один экран» hero. Под шапкой — полоса прогресса чтения.
export function HeaderNav({
  lang,
  brand,
  owner,
  nav,
  labels,
  items,
  llmMarkdown,
}: {
  lang: Lang
  brand: string
  /** Имя владельца — alt фото в шапке. */
  owner: string
  /** Markdown страницы для модалки «документация для LLM» (то же, что /llms.txt). */
  llmMarkdown: string
  nav: EvolutionData['nav']
  labels: EvolutionData['labels']
  items: NavItem[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const root = document.documentElement
    const set = () => root.style.setProperty('--header-h', `${el.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--header-h')
    }
  }, [])

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
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        {/* Вместо текстового бренда — фото владельца: то же, что в профилях соцсетей
            (public/images/avatar). Подпись бренда остаётся для скринридеров и title. */}
        <a
          href="#hero"
          title={brand}
          className="inline-flex items-center gap-2 rounded-full transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Image
            src="/images/avatar/avatar-256.webp"
            alt={owner}
            width={36}
            height={36}
            priority
            className="size-9 rounded-full object-cover ring-1 ring-border"
          />
          <span className="sr-only">{brand}</span>
        </a>
        {/* Соцсети рядом с фото — те же, что в футере; на узких экранах их показывает футер. */}
        <nav aria-label={nav.socialAria} className="ml-2 hidden items-center gap-0.5 md:flex">
          {SOCIAL_LINKS_HEADER.map((s) => {
            const Icon = SOCIAL_ICONS[s.key]
            const label = s.label[lang]
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageToggle currentLang={lang} />
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <PaletteToggle />
            </TooltipTrigger>
            <TooltipContent side="bottom">{nav.palette}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side="bottom">{nav.theme}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <FontToggle />
            </TooltipTrigger>
            <TooltipContent side="bottom">{nav.font}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <LlmDocsButton markdown={llmMarkdown} copy={nav.llm} labels={labels} />
            </TooltipTrigger>
            <TooltipContent side="bottom">{nav.llm.title}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <nav aria-label={nav.stepsAria} className="border-t border-border/60">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] md:px-6 lg:justify-center-safe [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => {
            const active = activeId === item.id
            const Icon = isStepKey(item.id) ? STEP_ICONS[item.id] : null
            return (
              <li key={item.id} className="shrink-0">
                <Tooltip>
                  <TooltipTrigger
                    render={<a href={`#${item.id}`} aria-current={active ? 'location' : undefined} />}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition xl:text-[13px]',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {/* Номер: на мобильном — вместе с иконкой (подписи нет); на десктопе прячем — иконка + подпись и так говорят всё, а место нужно шести якорям. */}
                    <span className="font-mono text-[10px] opacity-60 lg:hidden">0{i + 1}</span>
                    {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                    <span className="hidden sm:inline">{item.label}</span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="sm:hidden">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>
      <ReadingProgress label={labels.readingProgress} />
    </header>
  )
}
