import { evolutionData } from '@/app/data/evolution'
import type { AvtomatizaciyaCopy } from './types'

/**
 * Форма главной с заголовком и вопросом этой страницы вместо текстов главной.
 * title и sub выводит только модалка (lead-dialog.tsx); сама LeadForm их не рисует,
 * поэтому в блоке заявки заголовок не задваивается.
 */
export function leadFormCopy(copy: AvtomatizaciyaCopy['lead']) {
  const base = evolutionData.ru.finale.form
  return {
    ...base,
    title: copy.title,
    sub: copy.sub,
    fields: { ...base.fields, answer: copy.answerLabel },
    placeholders: { ...base.placeholders, answer: copy.answerPlaceholder },
  }
}
