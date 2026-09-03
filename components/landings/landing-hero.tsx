'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { LandingCopy, LandingSkeleton } from '@/app/data/landings'
import { useLeadDialog } from '@/components/evolution/lead-dialog'

// Первый экран лендинга: слева текст и пара кнопок, справа сцена из анимаций главной
// (components/evolution/animations), подобранная под смысл страницы в landing-page.tsx.
// На мобильном сцена уходит под кнопки, чтобы призыв к действию оставался в первом экране.
// Пара кнопок зависит от скелета: symptoms-first ведёт в квиз и в заявку,
// case-first в заявку и к главному кейсу.
export function LandingHero({
  copy,
  skeleton,
  scene,
}: {
  copy: LandingCopy['hero']
  skeleton: LandingSkeleton
  scene?: ReactNode
}) {
  const { open } = useLeadDialog()
  const quizFirst = skeleton === 'symptoms-first'
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-8 md:pt-24 md:pb-16">
      <div className={scene ? 'grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12' : undefined}>
        <div className={scene ? 'lg:col-span-7' : undefined}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{copy.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {quizFirst ? (
              <>
                <Button size="lg" nativeButton={false} render={<a href="#quiz" />}>
                  {copy.primaryCta}
                </Button>
                <Button size="lg" variant="outline" onClick={() => open()}>
                  {copy.secondaryCta}
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => open()}>
                  {copy.primaryCta}
                </Button>
                <Button size="lg" variant="outline" nativeButton={false} render={<a href="#hero-case" />}>
                  {copy.secondaryCta}
                </Button>
              </>
            )}
          </div>
        </div>
        {scene ? (
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" aria-hidden={false}>
            {scene}
          </div>
        ) : null}
      </div>
    </section>
  )
}
