import { stageCopy } from '@/app/data/brief/copy'
import type { StageInfo } from './map-types'
import type { BriefAnswers } from './schema'

// Стадия магазина по самооценке (спека, 7.3). Стадии 3 и 4 лестницы AIAS из брифа
// не определяются: их показывает только аудит.

export function stageOf(aiNow: BriefAnswers['aiNow']): StageInfo {
  switch (aiNow) {
    case 'none':
      return { key: 'stage0', ...stageCopy.stage0, early: true, stuckPilot: false }
    case 'chatSelf':
    case 'teamRegular':
      return { key: 'stage1', ...stageCopy.stage1, early: true, stuckPilot: false }
    case 'automations':
      return { key: 'stage1to2', ...stageCopy.stage1to2, early: false, stuckPilot: false }
    case 'triedFailed':
      return { key: 'stage1stuck', ...stageCopy.stage1stuck, early: true, stuckPilot: true }
    default:
      return { key: 'unknown', ...stageCopy.unknown, early: true, stuckPilot: false }
  }
}
