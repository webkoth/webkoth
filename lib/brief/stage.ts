import { stageCopy } from '@/app/data/brief/copy'
import type { StageInfo } from './map-types'
import type { BriefAnswers } from './schema'

// Стадия магазина по самооценке (спека, 7.3). Стадии 3 и 4 лестницы AIAS из брифа
// не определяются: их показывает только аудит. Внутренняя пометка стадии (stageForUsCopy в internal-copy.ts)
// в карту не входит: карта уходит в браузер, пометку берёт только файл брифа.

export function stageOf(aiNow: BriefAnswers['aiNow']): StageInfo {
  switch (aiNow) {
    case 'none':
      return { key: 'stage0', label: stageCopy.stage0.label, early: true, stuckPilot: false }
    case 'chatSelf':
    case 'teamRegular':
      return { key: 'stage1', label: stageCopy.stage1.label, early: true, stuckPilot: false }
    case 'automations':
      return { key: 'stage1to2', label: stageCopy.stage1to2.label, early: false, stuckPilot: false }
    case 'triedFailed':
      return { key: 'stage1stuck', label: stageCopy.stage1stuck.label, early: true, stuckPilot: true }
    default:
      return { key: 'unknown', label: stageCopy.unknown.label, early: true, stuckPilot: false }
  }
}
