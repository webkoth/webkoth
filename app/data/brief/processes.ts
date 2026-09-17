import type { CaseSlug } from '@/app/data/cases'
import { AIAS_REPO_URL } from '@/app/data/standard'
import type { ProcessGroup, ProcessId, ReadyToolKey } from '@/lib/brief/ids'
import type { LinkRef, StepColor } from '@/lib/brief/map-types'
import type { DeepQuestionId } from '@/lib/brief/schema'
import type { TermId } from './glossary'

// Каталог процессов селлера (спека, раздел 6). Цепочка шагов повторяет разбор
// по стандарту AIAS: цвет fixed-шага не зависит от ответов, цвет dynamic-шага
// ставит вердикт. approval показывается, когда dynamic-шаг стал «ИИ готовит» и когда
// программа выполняет необратимое действие (деньги, публикация): исполняет код, утверждает человек.
// Кейсы - только из реестра; нет подходящего кейса - пустой список.

export type ChainStep =
  | { kind: 'fixed'; label: string; color: StepColor }
  | { kind: 'dynamic'; label: string }
  | { kind: 'approval'; label: string }

export type ProcessEntry = {
  id: ProcessId
  group: ProcessGroup
  label: string
  example: string
  terms?: readonly TermId[]
  hints: Partial<Record<DeepQuestionId, string>> & { etalon: string; rule: string; data: string }
  facts: {
    sideEffect: 'read' | 'notify' | 'write'
    singleRun: boolean
    personalData: boolean
    moneyData: boolean
    cabinetApi: boolean
  }
  chain: readonly ChainStep[]
  branches?: readonly { when: string; step: { label: string; color: StepColor } }[]
  readyMade?: { kind: 'cabinet' | 'service'; text: string; toolsKey?: ReadyToolKey; checked: string }
  library?: readonly LinkRef[]
  cases: readonly CaseSlug[]
  mapNote?: string
}

const fixed = (label: string, color: StepColor): ChainStep => ({ kind: 'fixed', label, color })
const dynamic = (label: string): ChainStep => ({ kind: 'dynamic', label })
const approval = (label = 'Утвердить'): ChainStep => ({ kind: 'approval', label })
const lib = (file: string, label: string): LinkRef => ({ label, href: `${AIAS_REPO_URL}/blob/main/library/${file}.md` })

const L02 = lib('02-sverka-vyplat-marketpleysa', 'Карточка 02 · Сверка выплат маркетплейса')
const L03 = lib('03-marzhinalnost-po-kabinetam', 'Карточка 03 · Маржинальность по кабинетам')
const L07 = lib('07-snimok-prodazh-vitriny', 'Карточка 07 · Снимок продаж и витрины')
const L12 = lib('12-otvety-na-otzyvy', 'Карточка 12 · Ответы на отзывы')

const RO = { personalData: false, moneyData: false } as const

export const processCatalog: Record<ProcessId, ProcessEntry> = {
  cards: {
    id: 'cards',
    group: 'content',
    label: 'Карточки товаров и SEO',
    example: 'Описания, характеристики, ключевые слова',
    hints: {
      frequency: 'Карточки заводите партиями при новом товаре или обновляете постоянно',
      etalon: 'Например, 5–10 карточек, которые хорошо продают и нравятся вам по тону',
      rule: 'Характеристики обычно заполняются по правилу; текст описания чаще требует суждения',
      risk: 'Запрещённые слова площадки ведут к блокировке карточки',
      data: 'Состав, размеры, материалы: в таблице, в учёте или в кабинете',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Данные товара из учёта', 'auto'),
      fixed('Характеристики по полям площадки', 'auto'),
      dynamic('Текст описания и ключи'),
      approval(),
      fixed('Проверка запрещённых слов', 'auto'),
      fixed('Публикация', 'auto'),
    ],
    readyMade: {
      kind: 'cabinet',
      text: 'генерация описаний в кабинете WB, генератор названий и описаний на Маркете',
      checked: '2026-09',
    },
    library: [lib('05-kartochki-tovara-i-seo', 'Карточка 05 · Карточки товара и SEO')],
    cases: ['product-portal'],
  },
  media: {
    id: 'media',
    group: 'content',
    label: 'Фото и инфографика',
    example: 'Инфографика, обработка фото, обложки',
    hints: {
      etalon: 'Например, 5 карточек, где инфографика вам нравится и хорошо кликается',
      rule: 'Шаблон и шрифты задаются правилом; сама картинка требует суждения',
      data: 'Фото товара и характеристики: где они лежат',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Шаблон инфографики', 'auto'),
      dynamic('Варианты изображений'),
      approval(),
      fixed('Сверка с реальным товаром', 'human'),
      fixed('Загрузка', 'auto'),
    ],
    readyMade: { kind: 'cabinet', text: 'обработка фото и видеообложка в кабинете WB', checked: '2026-09' },
    cases: ['content-factory'],
  },
  reviews: {
    id: 'reviews',
    group: 'buyers',
    label: 'Ответы на отзывы',
    example: 'Ответить на новые отзывы в кабинете',
    hints: {
      frequency: 'Сколько новых отзывов в день по всем площадкам',
      etalon: 'Например, 10–20 ответов из кабинета, под которыми вы бы подписались',
      rule: 'Спасибо-ответы пишутся по правилу; ответ на жалобу требует суждения',
      risk: 'Ответ публичный и остаётся навсегда',
      data: 'Отзывы приходят в кабинет площадки',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Собрать новые отзывы', 'auto'),
      fixed('Разделить по типу и оценке', 'auto'),
      dynamic('Черновик ответа'),
      approval(),
      fixed('Опубликовать', 'auto'),
    ],
    branches: [{ when: 'Отзывы 1–3★', step: { label: 'Сразу к вам, без черновика', color: 'human' } }],
    readyMade: {
      kind: 'cabinet',
      text: 'автоответы WB на отзывы 4–5★, генерация ответа в Ozon по тарифу',
      toolsKey: 'reviewsCabinet',
      checked: '2026-09',
    },
    library: [L12],
    cases: [],
  },
  questions: {
    id: 'questions',
    group: 'buyers',
    label: 'Вопросы покупателей',
    example: 'Ответить на вопросы о товаре до покупки',
    hints: {
      etalon: 'Например, 10 ответов на частые вопросы: про размер, состав, сроки',
      rule: 'Если ответ есть в характеристиках, это правило; если нет, нужен человек',
      data: 'Вопросы приходят в кабинет, ответы берутся из карточки',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Собрать вопросы', 'auto'),
      dynamic('Ответ по данным карточки'),
      approval(),
      fixed('Опубликовать', 'auto'),
    ],
    branches: [{ when: 'Ответа нет в данных', step: { label: 'К вам', color: 'human' } }],
    library: [L12],
    cases: [],
  },
  returns: {
    id: 'returns',
    group: 'buyers',
    label: 'Возвраты и претензии',
    example: 'Возвраты, претензии, переписка с поддержкой площадки',
    hints: {
      etalon: 'Например, 5 претензий площадке, которые приняли, и ответы покупателям, которыми вы довольны',
      rule: 'Тип обращения определяется по правилу; текст претензии требует суждения',
      risk: 'Ошибка в претензии стоит денег, в ответе покупателю: репутации',
      data: 'Обращения в кабинете, в почте или в чате поддержки',
    },
    facts: { sideEffect: 'write', singleRun: true, personalData: true, moneyData: false, cabinetApi: true },
    chain: [
      fixed('Собрать обращения', 'auto'),
      fixed('Разобрать по типу', 'auto'),
      dynamic('Черновик ответа или претензии'),
      approval(),
      fixed('Отправить', 'auto'),
    ],
    branches: [{ when: 'Спор с площадкой', step: { label: 'Ведёте вы', color: 'human' } }],
    library: [lib('15-triazh-pochty', 'Карточка 15 · Триаж входящей почты')],
    cases: [],
  },
  ads: {
    id: 'ads',
    group: 'pricing',
    label: 'Реклама и ставки',
    example: 'Ставки, бюджеты, проверка кампаний',
    hints: {
      frequency: 'Как часто смотрите кампании и меняете ставки',
      etalon: 'Например, расчёт ставки, которому вы доверяете, или удобный вам отчёт по кампаниям',
      rule: 'Ставка считается формулой от маржи; «что делать с кампанией» отчасти суждение',
      risk: 'Ставки и бюджеты это деньги каждый день',
      data: 'Статистика кампаний в кабинете, маржа в таблице или учёте',
    },
    facts: { sideEffect: 'notify', singleRun: true, personalData: false, moneyData: true, cabinetApi: true },
    chain: [
      fixed('Статистика кампаний', 'auto'),
      fixed('Ставка от вашей маржи', 'auto'),
      dynamic('Сводка «что случилось»'),
      fixed('Менять ставки', 'human'),
    ],
    readyMade: { kind: 'service', text: 'биддеры: MP Manager, Sellego и другие', toolsKey: 'bidder', checked: '2026-09' },
    library: [lib('08-daydzhest-reklamy-i-stavki', 'Карточка 08 · Дайджест рекламы и ставки')],
    cases: ['ads-agents'],
  },
  prices: {
    id: 'prices',
    group: 'pricing',
    label: 'Цены и акции',
    example: 'Цены, скидки, участие в акциях площадки',
    hints: {
      etalon: 'Например, прошлая акция, где вы точно знаете, сколько заработали',
      rule: 'Маржа при цене считается по правилу; решение об участии часто суждение',
      risk: 'Цена ниже себестоимости это прямой убыток',
      data: 'Цены в кабинете, себестоимость в таблице или учёте',
    },
    facts: { sideEffect: 'write', singleRun: true, personalData: false, moneyData: true, cabinetApi: true },
    chain: [
      fixed('Цены и условия акций', 'auto'),
      fixed('Маржа при цене или акции', 'auto'),
      dynamic('Решение о цене или участии'),
      approval(),
      fixed('Применить цену', 'auto'),
    ],
    readyMade: { kind: 'service', text: 'репрайсеры: MPStats, Imprice и другие', toolsKey: 'repricer', checked: '2026-09' },
    library: [L03],
    cases: ['data-marts'],
  },
  competitors: {
    id: 'competitors',
    group: 'pricing',
    label: 'Мониторинг конкурентов',
    example: 'Цены, позиции и новинки конкурентов',
    hints: {
      etalon: 'Например, таблица сравнения с конкурентами, которую вы уже вели',
      rule: 'Собрать и сравнить можно по правилу; вывод «что делать» требует суждения',
      data: 'Сервис аналитики, выдача площадки или ручной обход',
    },
    facts: { sideEffect: 'notify', singleRun: true, ...RO, cabinetApi: false },
    chain: [
      fixed('Собрать цены и позиции конкурентов', 'auto'),
      fixed('Сравнить с вашими', 'auto'),
      dynamic('Сводка изменений'),
      fixed('Что с этим делать', 'human'),
    ],
    readyMade: { kind: 'service', text: 'сервисы аналитики: MPStats, Маяк и другие', toolsKey: 'analytics', checked: '2026-09' },
    cases: ['seller-workspace'],
  },
  stocks: {
    id: 'stocks',
    group: 'warehouse',
    label: 'Остатки между складом и площадками',
    example: 'Остатки на своём складе и на площадках',
    hints: {
      etalon: 'Например, инвентаризация, где остатки на складе и в кабинетах сошлись',
      rule: 'Сколько отдать на каждую площадку обычно записывается таблицей',
      risk: 'Продали то, чего нет: отмена, штраф, падение рейтинга',
      data: 'Остатки в учёте, в таблице или только в кабинетах',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Забрать остатки', 'auto'),
      dynamic('Разнести по площадкам'),
      approval(),
      fixed('Предупредить о расхождении', 'auto'),
    ],
    readyMade: { kind: 'service', text: 'учётные системы: МойСклад и аналоги', toolsKey: 'ledgerSystem', checked: '2026-09' },
    library: [L07],
    cases: ['stock-sync'],
  },
  supply: {
    id: 'supply',
    group: 'warehouse',
    label: 'Планирование поставок',
    example: 'Что и сколько везти на склады площадок',
    hints: {
      etalon: 'Например, поставка, после которой не было ни дефицита, ни залежей',
      rule: 'Потребность считается по продажам; поправка на сезон и акции чаще суждение',
      data: 'Продажи и остатки по складам в кабинете или сервисе',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Продажи и остатки по складам', 'auto'),
      fixed('Потребность по складам', 'auto'),
      dynamic('Поправка на сезон и акции'),
      approval(),
      fixed('Создать поставку', 'human'),
    ],
    readyMade: { kind: 'service', text: 'расчёт поставки в сервисах аналитики', toolsKey: 'analytics', checked: '2026-09' },
    library: [L07],
    cases: ['data-platform'],
  },
  labels: {
    id: 'labels',
    group: 'warehouse',
    label: 'Этикетки, маркировка, сборка FBS',
    example: 'Этикетки, коды маркировки, листы подбора',
    terms: ['marking'],
    hints: {
      etalon: 'Например, партия, собранная без единой ошибки в этикетках',
      rule: 'Что печатать и куда клеить задаётся правилом площадки',
      risk: 'Ошибка в этикетке: штраф и возврат',
      data: 'Задания на сборку в кабинете, коды в «Честном знаке»',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Задания на сборку', 'auto'),
      fixed('Этикетки и листы подбора', 'auto'),
      fixed('Коды маркировки', 'auto'),
      dynamic('Расхождения при сборке'),
      approval(),
    ],
    readyMade: { kind: 'service', text: 'учётные системы: МойСклад, SelSup и другие', toolsKey: 'ledgerSystem', checked: '2026-09' },
    library: [lib('04-pechat-etiketok-i-pdf', 'Карточка 04 · Печать этикеток и PDF')],
    cases: ['product-portal'],
  },
  unit: {
    id: 'unit',
    group: 'money',
    label: 'Юнит-экономика и прибыль по товару',
    example: 'Сколько на самом деле приносит каждый товар',
    terms: ['unitEconomics'],
    hints: {
      etalon: 'Например, месяц, где вы вручную посчитали прибыль по товарам и уверены в цифрах',
      rule: 'Формула прибыли записывается полностью; объяснение «почему упала» требует суждения',
      data: 'Отчёты площадки и себестоимость',
    },
    facts: { sideEffect: 'read', singleRun: true, personalData: false, moneyData: true, cabinetApi: true },
    chain: [
      fixed('Продажи, комиссии, логистика', 'auto'),
      fixed('Себестоимость', 'auto'),
      fixed('Прибыль по товару', 'auto'),
      dynamic('Комментарий «почему изменилось»'),
    ],
    library: [L03],
    cases: ['data-marts', 'seller-workspace', 'finance-loop'],
  },
  payouts: {
    id: 'payouts',
    group: 'money',
    label: 'Сверка выплат и удержаний',
    example: 'Сходится ли выплата площадки с продажами, что за удержания',
    hints: {
      etalon: 'Например, месяц, где выплата сошлась до рубля и понятно, из чего она сложилась',
      rule: 'Сверка строк отчёта и выплаты это правило; разбор непонятного удержания суждение',
      risk: 'Незамеченное удержание: потерянные деньги',
      data: 'Отчёты о реализации и выплатах в кабинете',
    },
    facts: { sideEffect: 'read', singleRun: true, personalData: false, moneyData: true, cabinetApi: true },
    chain: [
      fixed('Выгрузить отчёты площадки', 'auto'),
      fixed('Сохранить как есть', 'auto'),
      fixed('Сверка до рубля', 'auto'),
      dynamic('Непонятные удержания'),
      fixed('Спор с площадкой', 'human'),
    ],
    library: [L02],
    cases: ['data-platform', 'payout-documents'],
  },
  accounting: {
    id: 'accounting',
    group: 'money',
    label: 'Отчёты площадок в 1С или МойСклад',
    example: 'Разнести продажи, комиссии и выплаты в учёт',
    hints: {
      etalon: 'Например, месяц, который бухгалтер уже разнёс и проверил',
      rule: 'Строка отчёта переходит в учёт по таблице соответствия',
      risk: 'Ошибка в учёте всплывает в налогах',
      data: 'Отчёты площадки и ваша 1С или МойСклад',
    },
    facts: { sideEffect: 'write', singleRun: true, personalData: false, moneyData: true, cabinetApi: true },
    chain: [
      fixed('Забрать отчёты', 'auto'),
      dynamic('Разнести в учёт'),
      approval(),
      fixed('Новые типы строк', 'human'),
      fixed('Проверка бухгалтером', 'human'),
    ],
    library: [L02],
    cases: ['finance-loop', 'payout-documents'],
  },
  digest: {
    id: 'digest',
    group: 'management',
    label: 'Ежедневная сводка',
    example: 'Утром знать, что важно: продажи, остатки, блокировки',
    hints: {
      etalon: 'Например, сообщение или таблица, которую вы бы хотели видеть каждое утро',
      rule: 'Пороги «что считать проблемой» записываются; текст сводки требует суждения',
      data: 'Цифры из кабинетов площадок',
    },
    facts: { sideEffect: 'notify', singleRun: true, ...RO, cabinetApi: true },
    chain: [
      fixed('Цифры дня по площадкам', 'auto'),
      fixed('Отклонения по порогам', 'auto'),
      dynamic('Текст «что важно сегодня»'),
    ],
    library: [L07],
    cases: ['store-to-claude', 'seller-workspace'],
  },
  sourcing: {
    id: 'sourcing',
    group: 'management',
    label: 'Поиск ниш, товаров и поставщиков',
    example: 'Что ещё продавать и у кого закупать',
    terms: ['agent'],
    hints: {
      etalon: 'Например, товар, который вы нашли и который хорошо продаётся: как вы его выбирали',
      rule: 'Фильтры ниши записываются; итоговый выбор всегда суждение',
      data: 'Сервисы аналитики ниш, сайты поставщиков',
    },
    facts: { sideEffect: 'read', singleRun: false, ...RO, cabinetApi: false },
    chain: [fixed('Данные по нише', 'auto'), dynamic('Исследовать и сравнить'), fixed('Решение о закупке', 'human')],
    readyMade: { kind: 'service', text: 'сервисы аналитики ниш: MPStats, Маяк и другие', toolsKey: 'analytics', checked: '2026-09' },
    cases: ['store-to-claude'],
  },
  custom: {
    id: 'custom',
    group: 'custom',
    label: 'Своё',
    example: 'Процесс, которого нет в списке',
    hints: {
      etalon: 'Например, результат этой работы, которым вы довольны',
      rule: 'Можно ли записать, как это делать, чтобы двое сделали одинаково',
      data: 'Где берутся данные для этой работы',
    },
    facts: { sideEffect: 'write', singleRun: true, ...RO, cabinetApi: false },
    chain: [dynamic('Ваш процесс'), approval()],
    cases: [],
    mapNote: 'На созвоне разобьём на шаги.',
  },
}

export const processGroups: Record<ProcessGroup, string> = {
  content: 'Товар и контент',
  buyers: 'Покупатели',
  pricing: 'Цены и реклама',
  warehouse: 'Склад и поставки',
  money: 'Деньги и цифры',
  management: 'Управление',
  custom: 'Своё',
}

export const GROUP_ORDER: readonly ProcessGroup[] = ['content', 'buyers', 'pricing', 'warehouse', 'money', 'management', 'custom']

export function processesByGroup(group: ProcessGroup): ProcessEntry[] {
  return Object.values(processCatalog).filter((p) => p.group === group)
}
