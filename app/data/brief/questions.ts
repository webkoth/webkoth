import type { HoursBand } from '@/lib/brief/ids'
import type { BriefAnswers, DeepAnswers, DeepQuestionId } from '@/lib/brief/schema'
import { needsCheck } from '@/lib/brief/deep'
import type { GeneralField } from '@/lib/brief/state'
import type { TermId } from './glossary'

// Вопросы брифа. Значения вариантов совпадают с ids.ts (проверяет brief-data.test.ts).

export type Option = { value: string; label: string; hint?: string }

/** Поля строки «другое»: появляются при выборе варианта trigger. */
export type OtherField = 'marketplacesOther' | 'categoryOther' | 'ledgerOther' | 'aiTried'

export type QuestionDef = {
  id: GeneralField
  title: string
  hint?: string
  terms?: readonly TermId[]
  multi?: boolean
  max?: number
  /** Варианты, которые снимают остальные: «ничем из этого», «не знаю». */
  exclusive?: readonly string[]
  options: readonly Option[]
  /** Строка, которая появляется при выборе варианта trigger. */
  other?: { trigger: string; field: OtherField; placeholder: string; max: number; multiline?: boolean }
  showIf?: (a: BriefAnswers) => boolean
}

export type DeepQuestionDef = {
  id: DeepQuestionId
  title: string
  terms?: readonly TermId[]
  options: readonly Option[]
  optional?: boolean
  showIf?: (d: DeepAnswers) => boolean
}

const opts = (pairs: readonly (readonly [string, string])[]): Option[] =>
  pairs.map(([value, label]) => ({ value, label }))

export const shopQuestions: readonly QuestionDef[] = [
  {
    id: 'marketplaces',
    title: 'Где продаёте?',
    multi: true,
    options: opts([
      ['wb', 'Wildberries'],
      ['ozon', 'Ozon'],
      ['ym', 'Яндекс Маркет'],
      ['site', 'Свой сайт'],
      ['other', 'Другое'],
    ]),
    other: { trigger: 'other', field: 'marketplacesOther', placeholder: 'Где ещё', max: 60 },
  },
  {
    id: 'fulfillment',
    title: 'Как отгружаете заказы?',
    terms: ['fulfillment'],
    multi: true,
    exclusive: ['unknown'],
    options: opts([
      ['fbo', 'Со склада площадки (FBO)'],
      ['fbs', 'Со своего склада (FBS)'],
      ['dbs', 'Сами доставляете (DBS)'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'category',
    title: 'Что продаёте?',
    options: opts([
      ['apparel', 'Одежда и обувь'],
      ['home', 'Дом и сад'],
      ['beauty', 'Красота и здоровье'],
      ['kids', 'Детские товары'],
      ['electronics', 'Электроника'],
      ['sport', 'Спорт и отдых'],
      ['food', 'Продукты'],
      ['auto', 'Авто'],
      ['hobby', 'Хобби и творчество'],
      ['jewelry', 'Украшения и аксессуары'],
      ['other', 'Другое'],
    ]),
    other: { trigger: 'other', field: 'categoryOther', placeholder: 'Что именно', max: 60 },
  },
  {
    id: 'sku',
    title: 'Сколько товаров в продаже?',
    terms: ['sku'],
    options: opts([
      ['lt50', 'До 50'],
      ['50to300', '50–300'],
      ['300to1000', '300–1000'],
      ['gt1000', 'Больше 1000'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'ordersPerDay',
    title: 'Сколько заказов в день?',
    options: opts([
      ['lt10', 'До 10'],
      ['10to100', '10–100'],
      ['100to500', '100–500'],
      ['gt500', 'Больше 500'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'revenue',
    title: 'Оборот в месяц?',
    options: opts([
      ['lt1m', 'До 1 млн ₽'],
      ['1to5m', '1–5 млн ₽'],
      ['5to20m', '5–20 млн ₽'],
      ['gt20m', 'Больше 20 млн ₽'],
      ['hidden', 'Не хочу указывать'],
    ]),
  },
  {
    id: 'teamSize',
    title: 'Сколько человек работает с магазином?',
    options: opts([
      ['solo', 'Только я'],
      ['2to5', '2–5'],
      ['6to20', '6–20'],
      ['gt20', 'Больше 20'],
    ]),
  },
  {
    id: 'roles',
    title: 'Кто есть в команде?',
    multi: true,
    exclusive: ['onlyMe'],
    options: opts([
      ['manager', 'Менеджер'],
      ['content', 'Контент и карточки'],
      ['ads', 'Реклама'],
      ['warehouse', 'Склад и сборка'],
      ['accountant', 'Бухгалтер'],
      ['freelancers', 'Фрилансеры или агентство'],
      ['onlyMe', 'Никого, кроме меня'],
    ]),
  },
]

export const nowQuestions: readonly QuestionDef[] = [
  {
    id: 'ledger',
    title: 'Где ведёте учёт товаров и денег?',
    multi: true,
    options: opts([
      ['head', 'В голове'],
      ['sheets', 'Excel или Google Таблицы'],
      ['moysklad', 'МойСклад'],
      ['1c', '1С'],
      ['other', 'Другая система'],
    ]),
    other: { trigger: 'other', field: 'ledgerOther', placeholder: 'Какая', max: 60 },
  },
  {
    id: 'costKnown',
    title: 'Знаете себестоимость каждого товара?',
    terms: ['cost'],
    options: opts([
      ['exact', 'Да, точно'],
      ['approx', 'Примерно'],
      ['no', 'Нет'],
    ]),
  },
  {
    id: 'tools',
    title: 'Чем уже пользуетесь?',
    terms: ['bidder', 'repricer'],
    multi: true,
    exclusive: ['none'],
    options: opts([
      ['mpstats', 'MPStats'],
      ['mayak', 'Маяк'],
      ['analyticsOther', 'Другой сервис аналитики'],
      ['bidder', 'Биддер для рекламы'],
      ['repricer', 'Репрайсер для цен'],
      ['reviewsCabinet', 'Автоответы на отзывы в кабинете'],
      ['reviewsService', 'Сторонний сервис ответов на отзывы'],
      ['none', 'Ничем из этого'],
    ]),
  },
  {
    id: 'apiTokens',
    title: 'Выпускали ключи доступа к кабинету?',
    terms: ['apiToken'],
    options: opts([
      ['yes', 'Да'],
      ['no', 'Нет'],
      ['unknown', 'Не знаю, что это'],
    ]),
  },
  {
    id: 'aiNow',
    title: 'Как сейчас с ИИ?',
    options: opts([
      ['none', 'Не пользуемся'],
      ['chatSelf', 'Я сам спрашиваю в чате: ChatGPT, GigaChat, Алиса'],
      ['teamRegular', 'Сотрудники пользуются регулярно'],
      ['automations', 'Есть настроенные автоматизации или сервисы с ИИ'],
      ['triedFailed', 'Пробовали сделать своё, не пошло'],
    ]),
    other: { trigger: 'triedFailed', field: 'aiTried', placeholder: 'Что пробовали и что пошло не так', max: 500, multiline: true },
  },
  {
    id: 'docs',
    title: 'Есть записанные инструкции, как что делать?',
    options: opts([
      ['yes', 'Да'],
      ['partial', 'Частично'],
      ['head', 'Всё в голове'],
    ]),
  },
]

export const deepQuestions: readonly DeepQuestionDef[] = [
  {
    id: 'frequency',
    title: 'Как часто это приходится делать?',
    options: opts([
      ['manyPerDay', 'Несколько раз в день'],
      ['daily', 'Раз в день'],
      ['weekly', 'Раз в неделю'],
      ['rare', 'Реже раза в неделю'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'who',
    title: 'Кто делает сейчас?',
    options: opts([
      ['me', 'Я сам'],
      ['employee', 'Сотрудник'],
      ['freelancer', 'Фрилансер или агентство'],
      ['nobody', 'Никто, руки не доходят'],
      ['service', 'Уже делает сервис'],
    ]),
  },
  {
    id: 'etalon',
    title: 'Есть образец «вот так правильно»?',
    terms: ['etalon'],
    options: opts([
      ['many', 'Да, несколько'],
      ['few', 'Есть 1–2'],
      ['no', 'Нет'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'rule',
    title: 'Если объяснять новичку, чего ему хватит?',
    options: opts([
      ['sheet', 'Инструкции на листке: «если так, то так»'],
      ['readInput', 'Инструкции, но придётся читать фото, письма, отзывы'],
      ['experience', 'Без опыта не справится'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'check',
    title: 'Как понять, что результат хороший?',
    showIf: needsCheck,
    options: opts([
      ['instant', 'Видно сразу, цифра сходится'],
      ['glance', 'Посмотреть глазами за 10 секунд'],
      ['expert', 'Разберусь только я или опытный человек'],
    ]),
  },
  {
    id: 'risk',
    title: 'Что будет, если ошибиться?',
    options: opts([
      ['nothing', 'Ничего страшного, поправим'],
      ['buyersSee', 'Увидят покупатели'],
      ['money', 'Потеряем деньги'],
      ['penalty', 'Штраф или блокировка площадки'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'data',
    title: 'Откуда берутся данные для этой работы?',
    options: opts([
      ['cabinet', 'Из кабинета площадки'],
      ['file', 'Выгружаем файлом'],
      ['sheet', 'Из нашей таблицы или учёта'],
      ['head', 'В голове или в переписке'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'handover',
    title: 'Как хотите?',
    terms: ['program', 'aiPrepares'],
    optional: true,
    options: opts([
      ['give', 'Отдать полностью'],
      ['keep', 'Оставить себе, но с помощником'],
    ]),
  },
]

export const goalsQuestions: readonly QuestionDef[] = [
  {
    id: 'goals',
    title: 'Что важнее всего через 3 месяца? Не больше двух.',
    multi: true,
    max: 2,
    options: opts([
      ['myTime', 'Освободить моё время'],
      ['noHiring', 'Не нанимать ещё людей'],
      ['fewerErrors', 'Меньше ошибок и штрафов'],
      ['realProfit', 'Видеть реальную прибыль'],
      ['moreSales', 'Больше продаж'],
    ]),
  },
  {
    id: 'implementer',
    title: 'Кто с вашей стороны займётся внедрением?',
    options: opts([
      ['self', 'Я сам'],
      ['employee', 'Сотрудник'],
      ['nobody', 'Некому, нужно под ключ'],
    ]),
  },
  {
    id: 'implementerHours',
    title: 'Сколько часов в неделю у него будет?',
    showIf: (a) => a.implementer === 'self' || a.implementer === 'employee',
    options: opts([
      ['lt2', 'До 2'],
      ['2to5', '2–5'],
      ['gt5', 'Больше 5'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'access',
    title: 'Готовы дать доступ к кабинетам?',
    terms: ['access'],
    options: opts([
      ['yes', 'Да'],
      ['readOnly', 'Только на чтение'],
      ['no', 'Нет'],
      ['discuss', 'Обсудим'],
    ]),
  },
  {
    id: 'ruOnly',
    title: 'Данные должны оставаться в российских сервисах?',
    options: opts([
      ['required', 'Да, обязательно'],
      ['preferred', 'Желательно'],
      ['no', 'Неважно'],
      ['unknown', 'Не знаю'],
    ]),
  },
  {
    id: 'budget',
    title: 'Ориентир бюджета на внедрение',
    options: opts([
      ['lt50', 'До 50 тыс ₽'],
      ['50to150', '50–150 тыс ₽'],
      ['150to400', '150–400 тыс ₽'],
      ['gt400', 'Больше 400 тыс ₽'],
      ['unknown', 'Пока не знаю'],
    ]),
  },
]

export const hoursOptions: readonly { value: HoursBand; label: string }[] = [
  { value: 'lt1', label: '<1 ч' },
  { value: '1to3', label: '1–3 ч' },
  { value: '3to5', label: '3–5 ч' },
  { value: '5to10', label: '5–10 ч' },
  { value: '10plus', label: '10+ ч' },
]

export function optionLabel(q: { options: readonly Option[] }, value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  return q.options.find((o) => o.value === value)?.label ?? value
}
