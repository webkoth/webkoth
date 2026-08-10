import { Sunrise, Package, Tag, Megaphone, Star, Wallet, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData, ProcessIcon } from '@/app/data/marketplaces'

const ICONS: Record<ProcessIcon, LucideIcon> = {
  sunrise: Sunrise,
  package: Package,
  tag: Tag,
  megaphone: Megaphone,
  star: Star,
  wallet: Wallet,
}

export function DailyProcesses({ data }: { data: MarketplacesData['processes'] }) {
  return (
    <section
      id="processes"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Layers}>02 · Ваш рабочий день</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <Card key={item.title} className="block p-5">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" aria-hidden />
                <h3 className="text-base font-semibold">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm font-medium text-primary">«{item.quote}»</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
