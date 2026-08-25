import { Boxes, CalendarClock, Coins, Layers, Replace, ShieldCheck, Users, Zap, type LucideIcon } from 'lucide-react'
import type { ChipIcon } from '@/app/data/cases/types'

// Иконка чипа задаётся ключом, а не подбирается регуляркой по подписи: подпись
// переводится, а ключ - нет.
export const CHIP_ICONS: Record<ChipIcon, LucideIcon> = {
  scale: Boxes,
  time: CalendarClock,
  people: Users,
  replaced: Replace,
  money: Coins,
  trust: ShieldCheck,
  auto: Zap,
  coverage: Layers,
}
