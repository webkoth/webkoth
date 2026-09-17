import { outcomeCopy } from '@/app/data/brief/copy'
import type { Verdict } from '@/lib/standard/verdict'
import type { DynamicOutcome } from './map-types'
import type { DeepAnswers } from './schema'

// Вердикт → цвет и подпись dynamic-шага (спека, 7.2). Цвет всегда идёт с подписью:
// цвет не единственный сигнал.

const c = outcomeCopy.captions
const n = outcomeCopy.notes

function base(v: Verdict): DynamicOutcome {
  switch (v.form) {
    case 'f3':
      // Необратимое действие (деньги, публикация) утверждает человек и у программы:
      // по AIAS «исполняет код, утверждает человек».
      return v.flags.includes('irreversible')
        ? { color: 'auto', caption: c.program, notes: [n.program, n.irreversible], shareKey: 'f3', showApproval: true }
        : { color: 'auto', caption: c.program, notes: [n.program], shareKey: 'f3', showApproval: false }
    case 'f4':
    case 'f5':
      return v.autonomy?.act === 'A2'
        ? { color: 'ai', caption: c.aiPrepares, notes: [], shareKey: 'aiPrepares', showApproval: true }
        : { color: 'auto', caption: c.aiAuto, notes: [], shareKey: 'aiAuto', showApproval: false }
    case 'split':
      return { color: 'ai', caption: c.split, notes: [n.split], shareKey: 'split', showApproval: false }
    case 'f1':
    case 'f1f2':
      return { color: 'human', caption: c.human, notes: [], shareKey: 'human', showApproval: false }
    case 'f0':
      return { color: 'skip', caption: c.f0, notes: [n.f0], shareKey: 'skip', showApproval: false }
    case 'stopEtalon':
      return { color: 'skip', caption: c.stopEtalon, notes: [], shareKey: 'skip', showApproval: false }
    case 'stopData':
      return { color: 'skip', caption: c.stopData, notes: [n.stopData], shareKey: 'skip', showApproval: false }
  }
}

function flagNotes(v: Verdict, withApproval: boolean): string[] {
  const out: string[] = []
  if (v.flags.includes('personalData')) out.push(n.personalData)
  if (withApproval && v.flags.includes('rope')) out.push(n.rope)
  return out
}

export function dynamicOutcome(v: Verdict, handover: DeepAnswers['handover']): DynamicOutcome {
  const b = base(v)
  if (handover === 'keep' && b.color !== 'skip') {
    const couldAutomate = v.form === 'f3' || v.form === 'f4' || v.form === 'f5'
    return {
      color: 'human',
      caption: c.human,
      notes: [...(couldAutomate ? [n.kept] : []), ...flagNotes(v, false)],
      shareKey: 'human',
      showApproval: false,
    }
  }
  return { ...b, notes: [...b.notes, ...flagNotes(v, b.showApproval)] }
}
