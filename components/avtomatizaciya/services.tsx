import { Bot, Boxes, ChartColumn, FileSpreadsheet, Image, Megaphone, MessageSquareText, MessagesSquare, type LucideIcon } from 'lucide-react'
import type { AvtomatizaciyaCopy, ServiceIcon } from '@/app/data/avtomatizaciya'

const ICONS: Record<ServiceIcon, LucideIcon> = {
  profit: ChartColumn,
  reports: FileSpreadsheet,
  stock: Boxes,
  ads: Megaphone,
  reviews: MessageSquareText,
  chat: MessagesSquare,
  agents: Bot,
  photo: Image,
}

// Восемь услуг сеткой: одна колонка на телефоне, две на планшете, четыре на широком экране.
// Номер карточки крупно и бледно в углу: ход блока, по нему глаз идёт по сетке.
export function Services({ copy }: { copy: AvtomatizaciyaCopy['services'] }) {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {copy.items.map((s, i) => {
          const Icon = ICONS[s.icon]
          return (
            <li
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/40"
            >
              <span aria-hidden className="absolute top-3 right-4 font-mono text-5xl font-bold text-foreground/5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Icon className="size-6 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
