import { explainCopy } from '@/app/data/brief/copy'
import type { ProcessEntry } from '@/app/data/brief/processes'
import type { MapItem } from './map-types'
import type { BriefAnswers, DeepAnswers } from './schema'

// «Почему первым» и «что подготовить» (спека, 7.9): фиксированные фразы по условиям,
// не больше трёх на пункт. Сначала то, что блокирует, потом остальное.

const MAX_PHRASES = 3

export function whyFirst(item: MapItem, items: readonly MapItem[], d: DeepAnswers): string[] {
  const out: string[] = []
  const hours = items.filter((i) => i.status === 'ready').map((i) => i.hours)
  const maxHours = Math.max(...hours)
  // При равенстве «больше всего» неправда: фразу пишем только единственному максимуму.
  if (item.hours === maxHours && hours.filter((h) => h === maxHours).length === 1) {
    out.push(explainCopy.why.mostHours)
  }
  if (d.etalon === 'many') out.push(explainCopy.why.hasEtalon)
  if (item.outcome?.showApproval) out.push(explainCopy.why.approval)
  if (item.verdict?.form === 'f3' && item.outcome?.color === 'auto') out.push(explainCopy.why.program)
  return out.slice(0, MAX_PHRASES)
}

export function prepareFor(
  entry: ProcessEntry,
  item: Pick<MapItem, 'verdict' | 'outcome' | 'dataReason'>,
  d: DeepAnswers,
  a: BriefAnswers,
): string[] {
  const p = explainCopy.prepare
  const out: string[] = []
  if (item.verdict?.form === 'stopEtalon') out.push(p.etalon(entry.hints.etalon))
  if (item.verdict?.form === 'stopData') out.push(p[item.dataReason ?? 'data'])
  if (d.etalon === 'few') out.push(p.moreEtalons)
  if (item.outcome?.showApproval) out.push(p.approver)
  if (a.apiTokens !== 'yes' && entry.facts.cabinetApi && item.outcome?.color !== 'skip') out.push(p.apiToken)
  return out.slice(0, MAX_PHRASES)
}
