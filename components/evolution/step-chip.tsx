import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Чип номера шага — единственное, что взято из прототипа: моно-цифра в тонкой
// рамке акцентного цвета. Один и тот же в eyebrow секций, roadmap и финале.
export function StepChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('h-auto rounded-[4px] border-primary/60 px-1.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-primary', className)}
    >
      {children}
    </Badge>
  )
}
