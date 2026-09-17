import { deepList, MAX_DEEP, needsCheck } from './deep'
import type { BriefAnswers } from './schema'

// Ответы перед картой и файлом. Черновик хранит и то, что селлер потом скрыл сменой
// ответа (строка «другое», часы внедрения, проверка при правиле на листке), чтобы
// вернуть при обратной смене. В карту и файл уходит только видимое.

export function normalizeAnswers(a: BriefAnswers): BriefAnswers {
  const out: BriefAnswers = { ...a }
  if (!a.marketplaces.includes('other')) delete out.marketplacesOther
  if (a.category !== 'other') delete out.categoryOther
  if (!a.ledger.includes('other')) delete out.ledgerOther
  if (a.aiNow !== 'triedFailed') delete out.aiTried
  if (a.implementer !== 'self' && a.implementer !== 'employee') delete out.implementerHours

  const picked = a.picked.map((p) => p.id)
  if (!picked.includes('custom')) delete out.customLabel
  out.deepChoice = picked.length <= MAX_DEEP ? [] : a.deepChoice.filter((id) => picked.includes(id))

  const deep = deepList(out)
  const deepAnswers: BriefAnswers['deepAnswers'] = {}
  for (const id of Object.keys(a.deepAnswers) as (keyof BriefAnswers['deepAnswers'])[]) {
    const d = a.deepAnswers[id]
    if (!d || !deep.includes(id)) continue
    const next = { ...d }
    if (!needsCheck(next)) delete next.check
    deepAnswers[id] = next
  }
  out.deepAnswers = deepAnswers
  return out
}
