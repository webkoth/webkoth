import type { OfferStep, StageKey } from './map-types'

// Внутренние тексты брифа: только для файла и сообщения нам в Telegram. Модуль импортируют
// лишь серверные части (внутренняя часть брифа, флаги, рендеры, доставка); компоненты
// брифа и всё, что они импортируют, его не импортируют (проверяет brief-data.test.ts).

/** Внутренняя пометка стадии для файла брифа; селлер видит только stageCopy.label. */
export const stageForUsCopy: Record<StageKey, string> = {
  stage0: 'стадия 0 по лестнице AIAS',
  stage1: 'стадия 1, стихийное использование',
  stage1to2: 'стадия 1–2 по самоотчёту, уточняет аудит',
  stage1stuck: 'стадия 1, застрявший пилот',
  unknown: 'стадия не указана',
}

export const offerCopy: Record<OfferStep, string> = {
  pilot: 'доведение пилота до production',
  audit: 'аудит и карта',
  firstProcess: 'первый процесс до production',
  review: 'разбор процесса, 30 минут',
}

export const flagCopy = {
  fastFill: (n: number) => `Заполнено за ${n} с: проверить, не бот ли`,
  category: (c: string) => `Проверить категорию по правилу 1.6: ${c}`,
  personalData: (list: string) => `Персональные данные покупателей: ${list}`,
  ruOnly: 'Данные только в российских сервисах: обязательно',
  noImplementer: 'С их стороны внедрением заняться некому: нужно под ключ',
  noAccess: 'Доступ к кабинетам не дают',
  stuckPilot: (text: string) => (text ? `Застрявший пилот: «${text}»` : 'Застрявший пилот, без описания'),
  budget: (b: string) => `Бюджет: ${b}`,
}

export const clarifyCopy = {
  general: (title: string) => `Уточнить: ${title}`,
  deep: (title: string, process: string) => `Уточнить: ${title} (${process})`,
  needed: (process: string) => `Уточнить: нужен ли шаг вообще (${process})`,
  service: (process: string) => `Уточнить: какой сервис уже это делает и чем не устраивает (${process})`,
}

export const deliverCopy = {
  documentFailed: 'Файл не прошёл, отправляю текстом частями.',
  noDeep: 'Подробности не заполнены',
  start: 'начать с этого',
}
