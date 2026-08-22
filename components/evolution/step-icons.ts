import { Gauge, LayoutGrid, Target, Users, Wallet, Workflow, type LucideIcon } from 'lucide-react'
import type { EvolutionData } from '@/app/data/evolution/types'

// «Словарь шагов»: одна иконка на шаг, одна и та же везде, где шаг упоминается —
// нав-якоря, eyebrow секции, ветви дерева в финале. Набор совпадает с иконками
// ветвей в animations/sprouts-tree.tsx, чтобы память навигации не ломалась.
export const STEP_ICONS: Record<keyof EvolutionData['blocks'], LucideIcon> = {
  system: LayoutGrid,
  money: Wallet,
  decisions: Target,
  automation: Workflow,
  speed: Gauge,
  resources: Users,
}

export type StepKey = keyof typeof STEP_ICONS

export const isStepKey = (v: string): v is StepKey => v in STEP_ICONS
