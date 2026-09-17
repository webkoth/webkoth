import { deepList } from './deep'
import type { BriefAnswers } from './schema'
import type { StepKey } from './state'

// Ошибка проверки перед отправкой: на какой шаг вернуть селлера, чтобы он её исправил.
// Путь берётся из ошибки briefSubmitSchema (['answers', поле, ...]) или сразу от поля ответов.

export function stepForIssue(path: readonly PropertyKey[], a: BriefAnswers): { step: StepKey; deepIndex: number } {
  const [field, id] = path[0] === 'answers' ? path.slice(1) : path
  switch (field) {
    case 'marketplaces':
      return { step: 'shop', deepIndex: 0 }
    case 'picked':
    case 'deepChoice':
    case 'customLabel':
      return { step: 'time', deepIndex: 0 }
    case 'deepAnswers': {
      const index = deepList(a).findIndex((p) => p === id)
      return index === -1 ? { step: 'time', deepIndex: 0 } : { step: 'deep', deepIndex: index }
    }
    default:
      return { step: 'goals', deepIndex: 0 }
  }
}
