import { evolutionData } from '@/app/data/evolution'
import type { AvtomatizaciyaCopy } from './types'

/** Форма главной с вопросом этой страницы вместо вопроса главной. */
export function leadFormCopy(copy: AvtomatizaciyaCopy['lead']) {
  const base = evolutionData.ru.finale.form
  return {
    ...base,
    fields: { ...base.fields, answer: copy.answerLabel },
    placeholders: { ...base.placeholders, answer: copy.answerPlaceholder },
  }
}
