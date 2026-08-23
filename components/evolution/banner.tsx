'use client'

import type { CSSProperties } from 'react'
import type { EvolutionData } from '@/app/data/evolution/types'
import { ParticleField } from './particle-field'
import { ProductionStack } from './production-stack'
import { BANNER_SPECS, type BannerVariant } from './banner-specs'

// Баннеры для соцсетей из первого экрана лендинга: те же соты, схема, шрифт и
// тексты, но без шапки, кнопки и подсказок. Каждая сеть показывает обложку
// по-своему (обрезает края, кладёт сверху аватар), поэтому у каждого варианта
// своя «безопасная зона», куда ставится текст; схема — декоративная подложка
// справа, как в hero, и может уходить за край. Страница рендерится headless-
// Chrome в точном размере холста (см. scripts в описании коммита), поэтому
// размеры здесь — в пикселях, а не в rem/vw.

/** «**слово**» → <strong>, как в hero. */
function renderBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function Banner({ variant, data }: { variant: BannerVariant; data: EvolutionData }) {
  const s = BANNER_SPECS[variant]
  const canvas: CSSProperties = { width: s.width, height: s.height }
  const centerY = s.textCenterY ?? s.height / 2

  return (
    <div className="relative overflow-hidden bg-background text-foreground" style={canvas}>
      {/* Dev-оверлей Next не должен попадать в снимок баннера. */}
      <style>{`nextjs-portal { display: none !important }`}</style>
      <ParticleField />

      {/* Схема — подложка справа, по центру высоты, растворённый левый край */}
      <div
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          width: s.stackWidth,
          right: -s.stackRight,
          opacity: s.stackOpacity,
          maskImage: 'linear-gradient(to right, transparent, black 30%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)',
        }}
      >
        <ProductionStack delay={0} showStatus={false} copy={{ hint: data.hero.stackHint, nodes: data.hero.stackNodes }} />
      </div>

      {/* Текст: замок, заголовок в две строки, описание */}
      <div
        className="absolute z-10 -translate-y-1/2"
        style={{ left: s.textLeft, top: centerY, width: s.textWidth }}
      >
        <p
          className="font-mono uppercase text-primary"
          style={{ fontSize: s.seal, letterSpacing: '0.22em', lineHeight: 1.2 }}
        >
          {data.hero.seal}
        </p>
        <h1
          className="font-bold whitespace-pre-line"
          style={{ fontSize: s.headline, lineHeight: 1.08, letterSpacing: '-0.04em', marginTop: s.headline * 0.35 }}
        >
          {data.hero.line1}
        </h1>
        <p
          className="font-medium text-balance"
          style={{ fontSize: s.lead, lineHeight: 1.4, marginTop: s.lead * 0.9 }}
        >
          {renderBold(data.hero.lead)}
        </p>
        <p
          className="text-muted-foreground"
          style={{ fontSize: s.lead * 0.82, lineHeight: 1.4, marginTop: s.lead * 0.6 }}
        >
          {data.brand}
        </p>
      </div>
    </div>
  )
}
