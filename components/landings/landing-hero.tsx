'use client'

import { Button } from '@/components/ui/button'
import type { LandingCopy, LandingSkeleton } from '@/app/data/landings'
import { useLeadDialog } from '@/components/evolution/lead-dialog'

// Первый экран без анимаций главной: у кампании одна задача, довести до
// квиза или заявки. Пара кнопок зависит от скелета: symptoms-first ведёт в
// квиз и в заявку, case-first в заявку и к главному кейсу.
export function LandingHero({ copy, skeleton }: { copy: LandingCopy['hero']; skeleton: LandingSkeleton }) {
  const { open } = useLeadDialog()
  const quizFirst = skeleton === 'symptoms-first'
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-8 md:pt-24 md:pb-16">
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
    </section>
  )
}
