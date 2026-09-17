import type { StepColor } from '@/lib/brief/map-types'

// Классы цветов шага карты. Токены brief-* заданы в app/globals.css; «ИИ готовит» = primary.

export const STEP_CLS: Record<StepColor, string> = {
  auto: 'border-brief-auto/40 bg-brief-auto/10 text-brief-auto',
  ai: 'border-primary/40 bg-primary/10 text-primary',
  human: 'border-brief-human/40 bg-brief-human/10 text-brief-human',
  skip: 'border-border bg-muted text-muted-foreground',
}

export const DOT_CLS: Record<StepColor, string> = {
  auto: 'bg-brief-auto',
  ai: 'bg-primary',
  human: 'bg-brief-human',
  skip: 'bg-brief-skip',
}

export const COLOR_ORDER: readonly StepColor[] = ['auto', 'ai', 'human', 'skip']
