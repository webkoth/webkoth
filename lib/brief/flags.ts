import { clarifyCopy, flagCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { deepQuestions, goalsQuestions, nowQuestions, optionLabel, shopQuestions } from '@/app/data/brief/questions'
import { answerValues, categoryText, processLabel } from './labels'
import type { MapItem } from './map-types'
import type { BriefAnswers } from './schema'

// Флаги и «что уточнить на созвоне» (спека, 7.7 и 7.8). Только для файла нам.
// Название и категории нанимателя в код сайта не попадают: флаг категории ставится всегда.

export function flagsFor(a: BriefAnswers): string[] {
  const out = [flagCopy.category(categoryText(a))]
  // По всем отмеченным процессам: данные покупателей есть и там, где подробно не разбирали.
  const personal = a.picked
    .filter((p) => processCatalog[p.id].facts.personalData)
    .map((p) => processLabel(p.id, a))
  if (personal.length > 0) out.push(flagCopy.personalData(personal.join(', ')))
  if (a.ruOnly === 'required') out.push(flagCopy.ruOnly)
  if (a.implementer === 'nobody') out.push(flagCopy.noImplementer)
  if (a.access === 'no') out.push(flagCopy.noAccess)
  if (a.aiNow === 'triedFailed') out.push(flagCopy.stuckPilot(a.aiTried?.trim() ?? ''))
  const budget = goalsQuestions.find((q) => q.id === 'budget')!
  if (a.budget) out.push(flagCopy.budget(optionLabel(budget, a.budget) ?? a.budget))
  return out
}

export function clarifyFor(a: BriefAnswers, items: readonly MapItem[]): string[] {
  const out: string[] = []
  for (const q of [...shopQuestions, ...nowQuestions, ...goalsQuestions]) {
    if (q.showIf && !q.showIf(a)) continue
    if (answerValues(q, a).includes('unknown')) out.push(clarifyCopy.general(q.title))
  }
  for (const item of items) {
    if (item.status !== 'ready') continue
    const d = a.deepAnswers[item.processId] ?? {}
    for (const q of deepQuestions) {
      if (q.showIf && !q.showIf(d)) continue
      if (d[q.id] === 'unknown') out.push(clarifyCopy.deep(q.title, item.label))
    }
    if (d.who === 'nobody') out.push(clarifyCopy.needed(item.label))
    if (d.who === 'service') out.push(clarifyCopy.service(item.label))
  }
  return out
}
