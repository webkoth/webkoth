import type { StepColor } from '@/lib/brief/map-types'

// Классы цветов шага карты. Токены brief-* заданы в app/globals.css; «ИИ готовит» = primary.
// Текст шага берёт токены *-fg: в светлой теме они темнее заливки, чтобы мелкий шрифт читался.

export const STEP_CLS: Record<StepColor, string> = {
  auto: 'border-brief-auto/40 bg-brief-auto/10 text-brief-auto-fg',
  ai: 'border-primary/40 bg-primary/10 text-brief-ai-fg',
  human: 'border-brief-human/40 bg-brief-human/10 text-brief-human-fg',
  skip: 'border-border bg-muted text-muted-foreground',
}

export const DOT_CLS: Record<StepColor, string> = {
  auto: 'bg-brief-auto',
  ai: 'bg-primary',
  human: 'bg-brief-human',
  skip: 'bg-brief-skip',
}

export const COLOR_ORDER: readonly StepColor[] = ['auto', 'ai', 'human', 'skip']
