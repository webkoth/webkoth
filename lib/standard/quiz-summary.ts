// Ответы квиза одной строкой для заявки: паспорт задачи до первого звонка.
// Подписи короткие и свои, а не из кнопок квиза: кнопка «Да, есть образец»
// в заявке читалась бы без вопроса.
import type { QuizCopy } from '@/app/data/standard-quiz'
import type { QuizInput } from './verdict'

type Answers = Partial<QuizInput>

const LABELS = {
  hasEtalon: { true: 'эталон есть', false: 'эталона нет' },
  dataReady: { true: 'данные есть', false: 'данных нет' },
  useful: { no: 'результат не используют', rare: 'редко и дёшево', yes: 'часто или дорого' },
  rule: { full: 'правило полное', freeInput: 'правило чёткое, вход свободный', judgment: 'нужно суждение' },
  check: { auto: 'проверка автоматическая', quick: 'проверка человеком за 10 секунд', expert: 'проверяет только эксперт' },
  singleRun: { true: 'один прогон', false: 'длинная цепочка' },
  sideEffect: { read: 'только читает', notify: 'уведомляет', write: 'пишет наружу' },
  irreversible: { true: 'необратимое есть', false: 'необратимого нет' },
  personalData: { true: 'персданные есть', false: 'персданных нет' },
} as const

const ORDER: (keyof QuizInput)[] = [
  'hasEtalon',
  'dataReady',
  'useful',
  'rule',
  'check',
  'singleRun',
  'sideEffect',
  'irreversible',
  'personalData',
]

// `copy` принимается ради будущих локалей: подписи RU, квиз лендингов RU-only.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function summarizeAnswers(answers: Answers, _copy: QuizCopy): string {
  const parts: string[] = []
  for (const key of ORDER) {
    const value = answers[key]
    if (value === undefined) continue
    const table = LABELS[key] as Record<string, string>
    parts.push(table[String(value)])
  }
  return parts.join(' · ')
}

export function buildLeadContext(p: {
  landingTitle: string
  presetLabel: string
  formTag: string
  formTitle: string
  summary: string
}): string {
  return [
    `Страница: ${p.landingTitle}`,
    `Процесс: ${p.presetLabel}`,
    `Вердикт: ${p.formTag}, ${p.formTitle}`,
    `Ответы: ${p.summary}`,
    '',
    'Что хочу обсудить: ',
  ].join('\n')
}
