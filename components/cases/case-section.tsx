import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Оболочка раздела страницы кейса: моно-заголовок одного набора и один отступ
// сверху. Заголовок повторялся шесть раз одной и той же строкой классов -
// достаточно, чтобы разъехаться при первой же правке.
export function CaseSection({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('mt-10', className)}>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}
