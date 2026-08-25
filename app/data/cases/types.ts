// Типы кейсов. Кейс принадлежит не блоку, а набору «углов»: одна система
// приносит пользу по нескольким постулатам страницы, и в каждом блоке у неё
// своё «болело → стало». Язык-независимая часть - в registry.ts, тексты -
// в ru.ts/en.ts, совпадение локалей проверяется тестом.
// Массивы здесь readonly: всё это константы сборки, менять их некому.

import type { EvolutionData } from '@/app/data/evolution/types'

/** Ключ блока лендинга: 'system' | 'money' | 'decisions' | 'automation' | 'speed' | 'resources'. */
export type BlockKey = keyof EvolutionData['blocks']

/** `internal` - обезличенная клиентская система, `product` - свой продукт, `oss` - открытый код. */
export type CaseKind = 'internal' | 'product' | 'oss'

export type CaseStatus = 'production' | 'pilot'

/** Закрытый словарь иконок чипов: ключ, а не подбор регуляркой по подписи. */
export type ChipIcon = 'scale' | 'time' | 'people' | 'replaced' | 'money' | 'trust' | 'auto' | 'coverage'

export type CaseLinks = { github?: string; npm?: string; site?: string }

export type CaseMeta = {
  kind: CaseKind
  status: CaseStatus
  /**
   * В каких блоках система показывается; порядок здесь - порядок углов.
   * Непустой кортеж: система, не показанная ни в одном блоке, не кейс,
   * а страница кейса читает `blocks[0]` без проверки.
   */
  blocks: readonly [BlockKey, ...BlockKey[]]
  links: CaseLinks
  /** Стек - имена собственные, они не переводятся, поэтому живут вне локалей. */
  stack: readonly string[]
  /** Файлы скриншотов; подписи к ним - в текстах, по тому же индексу. */
  screenshots: readonly { src: string }[]
}

/** Пара «характеристика → значение». `note` - HoverCard «как считалось». */
export type Chip = { icon: ChipIcon; label: string; value: string; note?: string }

/** Тонкая шкала под характеристиками. Заполняется только там, где доля настоящая. */
export type CaseBar = { filled: number; total: number; caption: string }

export type CaseAngle = {
  /** Заголовок карточки именно в этом блоке - результат с точки зрения постулата. */
  headline: string
  pain: string
  outcome: string
  chips: readonly Chip[]
  bar?: CaseBar
}

export type CaseDetail = {
  lead: string
  /** Таблица эффектов по постулатам: ровно те блоки и в том же порядке, что в `meta.blocks`. */
  effects: readonly { block: BlockKey; text: string }[]
  value: readonly string[]
  diagramNodes: readonly string[]
  diagramNote: string
  /**
   * Вкладки «было руками / стало кнопкой» - только там, где это часть истории.
   * Одно поле, а не два: половина пары вкладок нарисовалась бы как пустая колонка.
   */
  beforeAfter?: { before: readonly string[]; after: string }
  how: readonly string[]
  owner: string
  /**
   * Липкая панель: 2-4 пары, подписи выбираются под систему - у одной это срок
   * и кто ведёт, у другой охват и ритм. Тип и статус сюда не пишутся: страница
   * выводит их из `meta`.
   */
  facts: readonly { label: string; value: string }[]
  /** По индексу совпадает с `meta.screenshots`. */
  screenshots: readonly { alt: string; caption: string }[]
  metaTitle: string
  metaDescription: string
}

export type CaseCopy = {
  /** Имя системы: страница кейса, хлебные крошки, пометка связи углов. */
  title: string
  angles: Partial<Record<BlockKey, CaseAngle>>
  detail: CaseDetail
}
