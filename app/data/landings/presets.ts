// app/data/landings/presets.ts
// Шаг 0 квиза на лендинге: «какой процесс разбираем». Пресет не подменяет
// ответы, факты про эталон и данные знает только клиент. Он даёт подсказки на
// языке аудитории, карточки библиотеки в результате и имя процесса для заявки.
import { landingMeta } from './registry'
import type { LandingSlug, QuizPreset, QuizPresetId } from './types'

const REPO = 'https://github.com/webkoth/ai-automation-standard/blob/main/library'

const card = (n: string, label: string) => ({ label, href: `${REPO}/${n}.md` })

export const quizPresets: Record<QuizPresetId, QuizPreset> = {
  'kontur-stocks': {
    id: 'kontur-stocks',
    landing: 'kontur',
    label: 'Остатки: склад и площадки',
    hints: {
      hasEtalon: 'Например, инвентаризация прошлого месяца, где остатки на складе и в кабинетах сошлись',
      dataReady: 'Остатки лежат в 1С или в учётной системе, а не в чьей-то таблице',
      rule: 'Правило «сколько отдать на площадку» записывается таблицей: категория, запас, срок',
    },
    library: [card('07-snimok-prodazh-vitriny', 'Карточка 07 · Снимок продаж → витрины')],
  },
  'kontur-reports': {
    id: 'kontur-reports',
    landing: 'kontur',
    label: 'Отчёты площадок в 1С',
    hints: {
      hasEtalon: 'Отчёт о реализации за месяц, который бухгалтер уже разнёс руками и проверил',
      dataReady: 'Отчёты доступны по API кабинета, не только вручную скачанным файлом',
      rule: 'Строка отчёта переходит в проводку по таблице соответствия: тип строки → счёт',
    },
    library: [card('02-sverka-vyplat-marketpleysa', 'Карточка 02 · Сверка выплат маркетплейса')],
  },
  'kontur-orders': {
    id: 'kontur-orders',
    landing: 'kontur',
    label: 'Заказы из CRM в 1С',
    hints: {
      hasEtalon: 'Заказ, который менеджер завёл в CRM, а бухгалтер повторил в 1С: два экрана рядом',
      dataReady: 'У CRM есть API, у 1С есть обмен; поля заказа совпадают хотя бы наполовину',
      rule: 'Какой заказ попадает в 1С и когда: статус, сумма, предоплата',
    },
    library: [card('01-zayavki-na-oplatu', 'Карточка 01 · Заявки на оплату')],
  },
  'kontur-payouts': {
    id: 'kontur-payouts',
    landing: 'kontur',
    label: 'Сверка выплат площадок',
    hints: {
      hasEtalon: 'Месяц, где выплата площадки сошлась с учётом до копейки, и известно, из чего она сложилась',
      dataReady: 'Отчёты о реализации и выписки банка за один и тот же период есть в одном месте',
      rule: 'Сверка это правило: строка отчёта ↔ строка выписки ↔ проводка',
    },
    library: [card('02-sverka-vyplat-marketpleysa', 'Карточка 02 · Сверка выплат маркетплейса')],
  },
  'it-access': {
    id: 'it-access',
    landing: 'it-director',
    label: 'Доступы и учётки',
    hints: {
      hasEtalon: 'Список «кто к чему имеет доступ», который хоть раз сверяли с реальностью',
      dataReady: 'Есть хотя бы таблица серверов и сервисов, пусть неполная',
      rule: 'Кому какой доступ положен по роли: таблица роль → системы → уровень',
    },
    library: [card('06-uchet-it-infrastruktury', 'Карточка 06 · Учёт ИТ-инфраструктуры')],
  },
  'it-backups': {
    id: 'it-backups',
    landing: 'it-director',
    label: 'Бэкапы и восстановление',
    hints: {
      hasEtalon: 'Последнее восстановление из бэкапа, которое действительно делали, с датой',
      dataReady: 'Известно, где лежат данные каждой системы и кто за них отвечает',
      rule: 'Что бэкапим, как часто, сколько храним, кто проверяет: это таблица',
    },
    library: [card('06-uchet-it-infrastruktury', 'Карточка 06 · Учёт ИТ-инфраструктуры')],
  },
  'it-unknown': {
    id: 'it-unknown',
    landing: 'it-director',
    label: 'Сервисы, которые никто не знает',
    hints: {
      hasEtalon: 'Одна система, про которую точно известно: что делает, где живёт, кто владелец',
      dataReady: 'Есть доступ к серверам или хотя бы список хостингов и подрядчиков',
      rule: 'Признаки живого сервиса записываются: трафик, коммиты, владелец, платежи',
    },
    library: [card('06-uchet-it-infrastruktury', 'Карточка 06 · Учёт ИТ-инфраструктуры')],
  },
  'it-vendors': {
    id: 'it-vendors',
    landing: 'it-director',
    label: 'Подрядчики и их системы',
    hints: {
      hasEtalon: 'Договор с подрядчиком, где записано, что он передаёт при уходе',
      dataReady: 'Известно, какие системы у каких подрядчиков и где лежит код',
      rule: 'Что подрядчик обязан передать: репозиторий, доступы, документация, среда',
    },
    library: [card('10-onbording-sotrudnika', 'Карточка 10 · Онбординг сотрудника')],
  },
  'agent-inbox': {
    id: 'agent-inbox',
    landing: 'agent',
    label: 'Входящие письма и заявки',
    hints: {
      hasEtalon: 'Двадцать размеченных писем: что это было и куда ушло',
      dataReady: 'Почта и формы сайта доступны по API, а не только в чьём-то ящике',
      rule: 'Куда идёт заявка по типу: таблица тег → ответственный',
    },
    library: [card('11-triazh-lidov', 'Карточка 11 · Триаж входящих лидов'), card('15-triazh-pochty', 'Карточка 15 · Триаж входящей почты')],
  },
  'agent-reports': {
    id: 'agent-reports',
    landing: 'agent',
    label: 'Отчёты и сводки',
    hints: {
      hasEtalon: 'Отчёт за прошлую неделю, который руководитель принял без правок',
      dataReady: 'Цифры отчёта берутся из систем, а не собираются по чатам',
      rule: 'Какие цифры входят и как считаются: формулы записаны',
    },
    library: [card('03-marzhinalnost-po-kabinetam', 'Карточка 03 · Маржинальность по кабинетам'), card('08-daydzhest-reklamy-i-stavki', 'Карточка 08 · Дайджест рекламы и ставки')],
  },
  'agent-calls': {
    id: 'agent-calls',
    landing: 'agent',
    label: 'Протоколы созвонов',
    hints: {
      hasEtalon: 'Пять протоколов, написанных человеком, с решениями и задачами',
      dataReady: 'Записи созвонов сохраняются, участники известны',
      rule: 'Что считать решением и задачей: правило записано хотя бы примерами',
    },
    library: [card('09-transkribaciya-sozvona', 'Карточка 09 · Транскрибация созвона')],
  },
  'agent-content': {
    id: 'agent-content',
    landing: 'agent',
    label: 'Контент и карточки товара',
    hints: {
      hasEtalon: 'Пять утверждённых карточек по категории: тон, структура, запреты площадки',
      dataReady: 'Характеристики товара лежат в каталоге, а не в головах',
      rule: 'Что можно писать и что запрещено: список площадки и список компании',
    },
    library: [card('05-kartochki-tovara-i-seo', 'Карточка 05 · Карточки товара и SEO')],
  },
  'finance-pervichka': {
    id: 'finance-pervichka',
    landing: 'finance',
    label: 'Первичка в 1С',
    hints: {
      hasEtalon: 'Десять счетов и актов, которые бухгалтер уже завёл в 1С правильно',
      dataReady: 'Документы приходят на одну почту или в одну папку; справочники контрагентов в 1С актуальны',
      rule: 'Как документ становится проводкой: контрагент, договор, статья, НДС',
    },
    library: [card('13-schet-iz-pisma-v-zayavku', 'Карточка 13 · Счёт из письма → заявка')],
  },
  'finance-otchet': {
    id: 'finance-otchet',
    landing: 'finance',
    label: 'Управленческий отчёт',
    hints: {
      hasEtalon: 'Отчёт за прошлый месяц, с которым собственник согласился',
      dataReady: '1С, банки и площадки отдают данные по API или выгрузкой по расписанию',
      rule: 'Формулы маржи и отнесения затрат записаны, а не «как в прошлый раз»',
    },
    library: [card('03-marzhinalnost-po-kabinetam', 'Карточка 03 · Маржинальность по кабинетам')],
  },
  'finance-statements': {
    id: 'finance-statements',
    landing: 'finance',
    label: 'Сверка выписок',
    hints: {
      hasEtalon: 'Месяц, где выписка сошлась с учётом и известно, как',
      dataReady: 'Выписки приходят файлом в одно место или по API банка',
      rule: 'Строка выписки ↔ документ в 1С: правило записывается',
    },
    library: [card('02-sverka-vyplat-marketpleysa', 'Карточка 02 · Сверка выплат маркетплейса')],
  },
  'finance-payments': {
    id: 'finance-payments',
    landing: 'finance',
    label: 'Согласование платежей',
    hints: {
      hasEtalon: 'Согласованная заявка с полным следом: кто, когда, что утвердил',
      dataReady: 'Справочники статей, счетов и контрагентов лежат в системе',
      rule: 'Маршрут согласования по сумме и статье: таблица решений',
    },
    library: [card('01-zayavki-na-oplatu', 'Карточка 01 · Заявки на оплату')],
  },
}

export function presetsForLanding(slug: LandingSlug): QuizPreset[] {
  return landingMeta[slug].presets.map((id) => quizPresets[id])
}

/**
 * `?p=` из адреса кампании: короткое имя («pervichka») или полный id.
 * Чужой или незнакомый пресет отбрасывается: квиз начнётся с выбора.
 */
export function resolvePresetParam(slug: LandingSlug, p: string | null | undefined): QuizPresetId | undefined {
  if (!p) return undefined
  const candidates = [p, `${slug}-${p}`]
  for (const id of landingMeta[slug].presets) {
    if (candidates.includes(id)) return id
  }
  return undefined
}
