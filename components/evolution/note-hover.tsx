import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

// Подсказка «как считалось» у цифры или значения. Одна и та же в плашке блока,
// в карточке кейса и в фактах страницы кейса, поэтому живёт отдельно.
// Без `note` возвращает содержимое как есть: проверять на стороне вызова
// пришлось бы в каждом из трёх мест. Триггер - кнопка, чтобы подсказка
// открывалась и с клавиатуры, а не только по наведению.
export function NoteHover({
  note,
  hint,
  className,
  children,
}: {
  note?: string
  hint: string
  className?: string
  children: ReactNode
}) {
  if (!note) return <>{children}</>
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<button type="button" />}
        className={cn(
          'cursor-help rounded-sm text-left underline decoration-primary/40 decoration-dotted underline-offset-4 outline-none transition hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring/50',
          className,
        )}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <Info className="size-3" aria-hidden />
          {hint}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{note}</p>
      </HoverCardContent>
    </HoverCard>
  )
}
