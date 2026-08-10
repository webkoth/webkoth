# Лендинг `/marketplaces` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать RU-страницу `webkoth.com/marketplaces`, которая продаёт обучение и внедрение AI для селлеров WB / Ozon / Яндекс.Маркета и ведёт к заявке на бесплатный разбор.

**Architecture:** Standalone-роут вне `[lang]` по образцу `/dev-presentation`: свой `layout.tsx` с метаданными, серверный `page.tsx`, композирующий секции, и один типизированный файл контента `app/data/marketplaces.ts`. Компоненты не содержат текста — только вёрстку и пропы. Приём заявок — свой API-роут, доставка в два независимых канала владельцу (Telegram и email-relay) с успехом по критерию «доставлен хотя бы один».

**Tech Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind v4 · shadcn/ui (base-vega + Base UI) · react-hook-form + Zod 4 · framer-motion · vitest (добавляется в Task 1)

**Спек:** `docs/superpowers/specs/2026-08-10-marketplaces-landing-design.md`

---

## Замечание о тестах

В репозитории **нет тест-раннера**: ни `vitest`, ни `jest`, ни скрипта `test`, ни единого
тестового файла. Task 1 добавляет vitest, но только ради трёх чистых модулей, где есть
реальный риск:

- `lib/marketplaces/delivery.ts` — спек §8 описывает конкретную ловушку, из-за которой роут вернёт пользователю успех при нуле доставленных заявок;
- `lib/marketplaces/schemas.ts` — валидация формы;
- `lib/marketplaces/email.ts` — экранирование пользовательского ввода в HTML-письме.

React-компоненты тестами **не покрываются** — ни jsdom, ни Testing Library не ставим.
Их проверяют `typecheck`, `build` и ручной прогон из §13 спека. Это осознанная граница:
цель — закрыть логику, а не завести в проект вторую инфраструктуру.

---

## Структура файлов

**Создаём**

| Файл | Ответственность |
|---|---|
| `vitest.config.ts` | конфиг тестов, alias `@/` |
| `app/marketplaces/layout.tsx` | метаданные, `robots: index` |
| `app/marketplaces/page.tsx` | композиция секций |
| `app/data/marketplaces.ts` | весь текст и типы контента |
| `components/marketplaces/hero.tsx` | первый экран |
| `components/marketplaces/video-questions.tsx` | видео + 3 карточки вопросов |
| `components/marketplaces/daily-processes.tsx` | 6 рутин рабочего дня |
| `components/marketplaces/tools-by-marketplace.tsx` | 3 колонки инструментов |
| `components/marketplaces/packages.tsx` | лестница офферов |
| `components/marketplaces/cases.tsx` | кейсы «было → стало → срок» |
| `components/marketplaces/security.tsx` | безопасность и границы |
| `components/marketplaces/how-review-works.tsx` | как проходит разбор |
| `components/marketplaces/faq.tsx` | аккордеон |
| `components/marketplaces/lead-form.tsx` | форма заявки |
| `components/marketplaces/sticky-cta.tsx` | плавающая кнопка |
| `components/marketplaces/json-ld-service.tsx` | JSON-LD `Service` |
| `lib/email-relay.ts` | транспорт письма (вынесен из smtp.ts) |
| `lib/marketplaces/schemas.ts` | Zod-схема заявки |
| `lib/marketplaces/delivery.ts` | нормализация результатов доставки |
| `lib/marketplaces/email.ts` | subject / text / html письма владельцу |
| `lib/marketplaces/telegram-text.ts` | текст сообщения в Telegram |
| `app/api/marketplaces/lead/route.ts` | приём заявки |

**Меняем**

| Файл | Что |
|---|---|
| `proxy.ts:33` | `/marketplaces` в whitelist |
| `app/sitemap.ts:6-11` | запись для `/marketplaces` |
| `lib/dev-presentation/smtp.ts:16-54` | экстракция `relaySend` в `lib/email-relay.ts` |
| `package.json` | скрипт `test`, devDep `vitest` |

---

## Task 1: Тест-раннер

Это задача инфраструктуры, а не фичи: красно-зелёного цикла здесь нет, первый настоящий
TDD-цикл — в Task 9. Важно, чтобы после этой задачи `npm test` был зелёным, а не красным
в ожидании модуля из будущей задачи.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Установить vitest**

```bash
npm install -D vitest@^3
```

- [ ] **Step 2: Добавить скрипт в `package.json`**

В блок `"scripts"` после `"typecheck"`:

```json
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Создать `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
    passWithNoTests: true,
  },
})
```

`passWithNoTests` нужен только сейчас: без него vitest падает, пока не появился первый
тестовый файл. Убирать после Task 9 не обязательно — он безвреден.

- [ ] **Step 4: Проверить, что раннер запускается**

Run: `npm test`
Expected: PASS с сообщением `No test files found` — конфиг корректен, тестов пока нет.

- [ ] **Step 5: Проверить, что сборка не сломалась**

Run: `npm run typecheck`
Expected: без ошибок. `vitest.config.ts` не должен попасть в ошибки `tsc`.

- [ ] **Step 6: Коммит**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add vitest runner for pure lib modules"
```

---

## Task 2: Роут доступен

Самая рискованная техническая гипотеза — маршрутизация. Проверяем её первой, до всякого контента.

**Files:**
- Modify: `proxy.ts:33`
- Modify: `app/sitemap.ts:6-11`
- Create: `app/marketplaces/layout.tsx`
- Create: `app/marketplaces/page.tsx`

- [ ] **Step 1: Добавить роут в whitelist `proxy.ts`**

В `proxy.ts` найти строку 33 `pathname.startsWith('/dev-presentation') ||` и добавить под ней:

```ts
      pathname.startsWith('/dev-presentation') ||
      pathname.startsWith('/marketplaces') ||
      pathname.startsWith('/ui-kit') ||
```

- [ ] **Step 2: Создать `app/marketplaces/layout.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI для селлеров маркетплейсов — обучение и внедрение | Минас Саркисян',
  description:
    'Подключаю Wildberries, Ozon и Яндекс.Маркет к AI и внедряю в процессы вашей команды. Менеджер спрашивает словами — получает ответ по вашим данным.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://webkoth.com/marketplaces' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://webkoth.com/marketplaces',
    title: 'AI для селлеров маркетплейсов — обучение и внедрение',
    description:
      'Подключаю WB, Ozon и Яндекс.Маркет к AI и внедряю в процессы команды. Бесплатный разбор на ваших данных.',
    siteName: 'webkoth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI для селлеров маркетплейсов — обучение и внедрение',
    description: 'Подключаю WB, Ozon и Яндекс.Маркет к AI и внедряю в процессы команды.',
  },
}

export default function MarketplacesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

- [ ] **Step 3: Создать временный `app/marketplaces/page.tsx`**

```tsx
export default function MarketplacesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-24 md:px-8" lang="ru">
      <h1 className="text-2xl font-bold">marketplaces route works</h1>
    </main>
  )
}
```

- [ ] **Step 4: Добавить URL в `app/sitemap.ts`**

Внутри возвращаемого массива, после строки с `/ru/minasarkisyan`:

```ts
    { url: `${baseUrl}/marketplaces`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
```

- [ ] **Step 5: Проверить, что редиректа нет**

```bash
npm run dev
```

В другом терминале:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/marketplaces
```

Expected: `200` и пустой `redirect_url`. Если получили `307` с `redirect_url=http://localhost:3000/ru/marketplaces` — правка whitelist в Step 1 не применилась.

- [ ] **Step 6: Проверить sitemap**

```bash
curl -s http://localhost:3000/sitemap.xml | grep marketplaces
```

Expected: строка с `<loc>https://webkoth.com/marketplaces</loc>`.

- [ ] **Step 7: Коммит**

```bash
git add proxy.ts app/sitemap.ts app/marketplaces/
git commit -m "feat(marketplaces): reachable route with metadata"
```

---

## Task 3: Файл контента

Один большой файл — весь текст страницы. Дальнейшие задачи только верстают его.

**Files:**
- Create: `app/data/marketplaces.ts`

- [ ] **Step 1: Создать `app/data/marketplaces.ts`**

```ts
// Весь текст страницы /marketplaces (RU only). Компоненты текста не содержат.
// Цены и сроки — черновые, подтверждает владелец перед публикацией.
// Каждое число на этой странице обязано иметь источник в §11 спека:
// docs/superpowers/specs/2026-08-10-marketplaces-landing-design.md

export type Metric = { value: number; suffix: string; label: string }
export type VideoQuestion = { q: string; how: string; sees: string }
export type ProcessIcon = 'sunrise' | 'package' | 'tag' | 'megaphone' | 'star' | 'wallet'
export type ProcessItem = {
  icon: ProcessIcon
  title: string
  quote: string
  body: string
}
export type ToolColumn = {
  id: 'wb' | 'ozon' | 'ym'
  label: string
  count: number
  groups: string[]
}
export type PackageItem = {
  id: 'training' | 'implementation' | 'tools'
  title: string
  priceFrom: string
  duration: string
  body: string
  bullets?: string[]
  who: string
}
export type CaseItem = {
  title: string
  before: string
  after: string
  duration?: string
  note?: string
}
export type ReviewStep = { step: number; title: string; body: string }
export type FaqItem = { q: string; a: string }

export type MarketplacesData = {
  hero: { h1: string; sub: string; ctaPrimary: string; ctaSecondary: string; metrics: Metric[] }
  video: {
    title: string
    youtubeId: string
    questions: VideoQuestion[]
    upcoming?: { title: string; note: string }
  }
  processes: { title: string; sub: string; items: ProcessItem[] }
  tools: { title: string; sub: string; columns: ToolColumn[]; note: string }
  packages: { title: string; sub: string; items: PackageItem[]; footnote: string }
  cases: { title: string; sub: string; items: CaseItem[]; honesty: string }
  security: { title: string; sub: string; items: string[] }
  review: { title: string; sub: string; steps: ReviewStep[]; note: string }
  faq: { title: string; items: FaqItem[] }
  form: { title: string; sub: string; altChannel: string }
}

export const marketplacesData: MarketplacesData = {
  hero: {
    h1: 'AI, который сам ходит в ваши кабинеты WB, Ozon и Яндекс.Маркета',
    sub: 'Менеджер спрашивает обычными словами — «что заканчивается на складах», «окупается ли реклама», «сколько придёт на счёт» — и получает ответ по вашим данным. Без выгрузок и сводных таблиц.',
    ctaPrimary: 'Бесплатный разбор на ваших данных',
    ctaSecondary: 'Посмотреть, как это работает',
    metrics: [
      { value: 3, suffix: '', label: 'площадки' },
      { value: 39, suffix: '', label: 'инструментов' },
      { value: 36, suffix: ' из 39', label: 'только на чтение' },
      { value: 5, suffix: ' мин', label: 'на подключение магазина' },
    ],
  },

  video: {
    title: 'Как это выглядит на практике',
    youtubeId: 'ae-ni9ol0mU',
    questions: [
      {
        q: 'Что у меня скоро закончится?',
        how: 'Забираю остатки и среднюю скорость заказов',
        sees: 'Список товаров с числом дней до нуля и упущенными заказами в рублях',
      },
      {
        q: 'Окупается ли реклама?',
        how: 'Собираю показы, клики, расход и заказы по кампаниям',
        sees: 'ДРР по каждой кампании и баланс рекламного счёта',
      },
      {
        q: 'Сколько мне придёт на счёт?',
        how: 'Читаю отчёт о реализации',
        sees: '«Итого к оплате» с разбивкой: продано, логистика, хранение, приёмка, штрафы',
      },
    ],
  },

  processes: {
    title: 'Где это встаёт в ваш день',
    sub: 'Шесть рутин, которые сейчас едят время менеджера. Слева — как он спрашивает, справа — что за этим стоит.',
    items: [
      {
        icon: 'sunrise',
        title: 'Утренняя сводка',
        quote: 'Что вчера продалось и что горит?',
        body: 'Заказы и продажи по всем площадкам одним вопросом. Отменённые считаются отдельно, а не размазываются по выручке.',
      },
      {
        icon: 'package',
        title: 'Закупка и остатки',
        quote: 'Что заканчивается и на сколько дней хватит?',
        body: 'Остатки по схемам (FBW, FBS, FBO), средняя скорость заказов, дни покрытия и упущенные заказы в рублях.',
      },
      {
        icon: 'tag',
        title: 'Цены и маржа',
        quote: 'Какой товар убыточен?',
        body: 'Цена, скидка, итоговая цена. У Ozon комиссия в процентах и логистика в рублях приходят отдельными числами для FBO и FBS — маржа считается, а не угадывается.',
      },
      {
        icon: 'megaphone',
        title: 'Реклама',
        quote: 'Окупается ли реклама? Почему встала кампания?',
        body: 'Ставки, баланс рекламного счёта, показы, клики, CTR, CPC, расход, заказы, выручка и ДРР. Для Ozon — причина остановки: кончился бюджет, выключил владелец или кончились баллы.',
      },
      {
        icon: 'star',
        title: 'Отзывы и рейтинг',
        quote: 'Покажи отзывы без ответа',
        body: 'Отзывы, вопросы, рейтинг со штрафными баллами и индекс качества Яндекс.Маркета — единственное число, напрямую влияющее на показы в поиске Маркета. Ответ на отзыв пишется только после вашего подтверждения.',
      },
      {
        icon: 'wallet',
        title: 'Деньги',
        quote: 'Сколько мне придёт на счёт и сколько я могу вывести?',
        body: '«Итого к оплате» из отчёта о реализации с полной разбивкой и текущий баланс кабинета.',
      },
    ],
  },

  tools: {
    title: 'Что именно подключаем',
    sub: 'Тридцать девять инструментов на три площадки. Сгруппированы по задачам, а не по названиям методов.',
    columns: [
      {
        id: 'wb',
        label: 'Wildberries',
        count: 17,
        groups: [
          'Остатки и оборачиваемость',
          'Цены',
          'Заказы и продажи',
          'Выплаты и баланс',
          'Рекламные кампании и статистика',
          'Отзывы, вопросы, рейтинг',
          'Возвраты и заблокированные карточки',
          'Воронка: переход → корзина → заказ → выкуп',
          'Список кабинетов',
        ],
      },
      {
        id: 'ozon',
        label: 'Ozon',
        count: 13,
        groups: [
          'Остатки по схемам и оборачиваемость',
          'Цены с комиссией и логистикой',
          'Заказы FBO и FBS в одном ответе',
          'Выплаты и баланс',
          'Рекламные кампании и статистика',
          'Отзывы и рейтинг',
          'Возвраты',
          'Кабинеты и срок истечения ключа',
        ],
      },
      {
        id: 'ym',
        label: 'Яндекс.Маркет',
        count: 9,
        groups: [
          'Остатки',
          'Цены',
          'Заказы по всему кабинету сразу',
          'Невыкупы и возвраты',
          'Индекс качества',
          'Отзывы и вопросы',
          'Список магазинов',
        ],
      },
    ],
    note: 'Пишущих инструментов три из тридцати девяти — все три отвечают на отзывы, и каждый показывает текст ответа целиком и ждёт вашего подтверждения. Управление рекламой — ставки, старт, пауза, пополнение — не подключено намеренно.',
  },

  packages: {
    title: 'Три способа начать',
    sub: 'От «научите нас» до «сделайте под ключ». Точная смета — после разбора.',
    items: [
      {
        id: 'training',
        title: 'Обучение',
        priceFrom: 'от 60 000 ₽',
        duration: '1 день интенсива + 2 недели сопровождения',
        body: 'Подключаю ваш кабинет вместе с вами. Разбираем ваши реальные задачи, а не абстрактные примеры. Команда уходит с набором готовых запросов под каждую роль и с записью интенсива.',
        who: 'Селлеру и менеджерам, которые хотят начать сами и быстро.',
      },
      {
        id: 'implementation',
        title: 'Внедрение',
        priceFrom: 'от 250 000 ₽',
        duration: '3–4 недели',
        body: 'Разбираю ваши процессы, ставлю сценарии под них и дописываю инструменты под вашу специфику там, где стандартных не хватает. Команда обучается по ходу, а не отдельным курсом. На выходе — работающий процесс, а не знание о том, что так можно.',
        who: 'Компаниям, где несколько человек каждый день ходят в кабинеты руками.',
      },
      {
        id: 'tools',
        title: 'Инструменты',
        priceFrom: 'от 20 000 ₽ / мес',
        duration: 'подключение за 1 день',
        body: 'То, что уже построено и подключается сразу:',
        bullets: [
          'коннектор к трём площадкам — 39 инструментов',
          '16 AI-агентов: описания товаров, анализ отзывов, рекомендации по ценам, объяснение маржи, SEO-заголовки и ключевые слова, ежедневные и еженедельные отчёты, аудит SKU',
          'аналитическая платформа: P&L, unit-экономика, реклама, сравнение площадок',
          'база знаний правил площадок — 1638 документов по комиссиям, тарифам, штрафам и возвратам, чтобы AI не выдумывал условия',
        ],
        who: 'Тем, у кого процессы уже выстроены и нужен только инструмент.',
      },
    ],
    footnote: 'Не знаете, какая ступень ваша? На разборе и решим.',
  },

  cases: {
    title: 'Что уже сделано и за какой срок',
    sub: 'Формат простой: что было, что стало, сколько заняло.',
    items: [
      {
        title: 'Один магазин на Wildberries',
        before: 'Google-таблица менеджера на восемь вкладок, которую он вёл руками.',
        after: 'Приложение, где P&L и склад считаются сами: восемь синхронизаций с WB по расписанию, оповещение о закупке при остатке меньше чем на 14 дней. Критерий приёмки был жёстким — цифры приложения за конкретную неделю сходятся с таблицей менеджера за ту же неделю.',
        duration: '4 дня',
      },
      {
        title: 'Своя платформа на три площадки',
        before: 'Данные WB, Ozon и Яндекс.Маркета живут в трёх разных кабинетах и не сводятся.',
        after: 'Единая платформа: 183 API-эндпоинта, 151 модель данных, 26 фоновых воркеров, 20 расписаний синхронизации, четыре клиента маркетплейсов.',
        duration: '5,5 месяцев',
        note: 'Собственный продукт, не клиентский заказ. Показываю его как ответ на вопрос «а вы вообще работали с этими API».',
      },
      {
        title: 'AI-слой над маркетплейсными данными',
        before: 'Описания, ответы на отзывы и отчёты писались руками по каждому товару.',
        after: 'Отдельный сервис на 16 специализированных агентов — описания, отзывы, цены, маржа, SEO, отчёты, аудит SKU — с каскадом провайдеров: если один отвалился, запрос уходит следующему.',
      },
      {
        title: 'База знаний правил площадок',
        before: 'Комиссии, тарифы и штрафы приходилось искать по справкам трёх маркетплейсов вручную.',
        after: '1638 документов по WB, Ozon и Яндекс.Маркету — API и справка по комиссиям, тарифам, штрафам, возвратам, FBS и FBO. Обновляется одной командой, изменение правил площадки видно как diff.',
        duration: '2 дня',
      },
    ],
    honesty:
      'Цифры на этой странице — про объём и сроки работ, а не про чужую выручку. Чужие проценты роста я не показываю: их нельзя проверить. Что изменится у вас — посчитаем на разборе, на ваших данных.',
  },

  security: {
    title: 'Безопасность и границы',
    sub: 'Что именно получает доступ к вашим кабинетам и чего он принципиально не умеет.',
    items: [
      'Ключи маркетплейсов хранятся зашифрованными (AES-256-GCM), ключ шифрования — только в окружении процесса. Доступ к базе не даёт доступа к ключам.',
      'Достаточно прав только на чтение. На Wildberries галочка «только чтение» делает запись физически невозможной.',
      '36 инструментов из 39 не умеют менять ничего. Пишущих три, все — ответы на отзывы, и каждый требует подтверждения.',
      'Ключ от одной площадки не открывает магазины другой — это проверяется на каждом вызове.',
      'Журнал каждого вызова: что вызывали, чем закончилось, сколько заняло. Аргументы не сохраняются — это ваши коммерческие данные, хранить их без нужды незачем.',
      'Управление рекламой — ставки, запуск, пауза, пополнение — намеренно не подключено. Деньги тратит человек.',
      'Ключ отзывается в два клика и в любой момент.',
    ],
  },

  review: {
    title: 'Как проходит разбор',
    sub: 'Сорок минут, ваш кабинет, ваши вопросы.',
    steps: [
      {
        step: 1,
        title: 'Заявка',
        body: 'Пишу в Telegram в течение дня, договариваемся на удобное время.',
      },
      {
        step: 2,
        title: 'Созвон',
        body: 'Ключ вводите вы сами, прав только на чтение достаточно. Отвечаем на три ваших реальных вопроса по вашему кабинету — прямо на звонке.',
      },
      {
        step: 3,
        title: 'Итог',
        body: 'Показываю, какие ваши рутины закрываются уже сейчас, что нужно доделать под вашу специфику, и называю смету.',
      },
    ],
    note: 'Разбор бесплатный, продажи на нём нет. Ключ можно отозвать сразу после созвона.',
  },

  faq: {
    title: 'Частые вопросы',
    items: [
      {
        q: 'Нужно ли уметь программировать?',
        a: 'Нет. Вы задаёте вопросы обычными словами в чате. Всё техническое — на моей стороне.',
      },
      {
        q: 'Безопасно ли отдавать ключи?',
        a: 'Ключи шифруются, прав только на чтение достаточно, 36 из 39 инструментов не умеют ничего менять, а ключ отзывается в два клика и в любой момент.',
      },
      {
        q: 'Работает ли с телефона?',
        a: 'Да. Claude есть в мобильном приложении, подключённые магазины доступны оттуда же.',
      },
      {
        q: 'Сколько занимает подключение?',
        a: 'Около пяти минут на магазин: получить ключ в кабинете площадки и вставить ссылку.',
      },
      {
        q: 'У нас несколько кабинетов и юрлиц.',
        a: 'Подключается несколько. В ответах они не смешиваются — каждый кабинет отвечает за себя.',
      },
      {
        q: 'А если AI ошибётся в цифрах?',
        a: 'Числа берутся из API площадки, а не сочиняются. Расчёты вроде ДРР и дней покрытия делаются кодом, не языковой моделью. Менять что-либо AI умеет ровно в трёх местах, и каждое требует подтверждения.',
      },
      {
        q: 'Что нужно от нас для внедрения?',
        a: 'Доступ к кабинетам (только чтение), один-два часа на разбор процессов и человек, который сможет отвечать на вопросы по вашей специфике.',
      },
      {
        q: 'Сколько стоит?',
        a: 'Ориентиры — в блоке «Три способа начать». Точная смета после разбора: она зависит от числа площадок, объёма каталога и того, сколько инструментов придётся дописать под вас.',
      },
    ],
  },

  form: {
    title: 'Записаться на разбор',
    sub: 'Отвечаю в течение дня. Разбор бесплатный.',
    altChannel: 'Не любите формы? Напишите в Telegram',
  },
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add app/data/marketplaces.ts
git commit -m "feat(marketplaces): page content data file"
```

---

## Task 4: Hero и блок видео

**Files:**
- Create: `components/marketplaces/hero.tsx`
- Create: `components/marketplaces/video-questions.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/hero.tsx`**

```tsx
import { AnimatedMetric } from '@/components/dev-presentation/animated-metric'
import { Button } from '@/components/ui/button'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Hero({ data }: { data: MarketplacesData['hero'] }) {
  return (
    <section id="hero" className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{data.h1}</h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{data.sub}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" nativeButton={false} render={<a href="#form" />}>
          {data.ctaPrimary}
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<a href="#video" />}>
          {data.ctaSecondary}
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {data.metrics.map((m) => (
          <AnimatedMetric key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
        ))}
      </div>
    </section>
  )
}
```

Два подводных камня этого репозитория, которые дальше повторяются в каждой секции:

1. `render={<a href="…" />}` — это Base UI вместо radix-овского `asChild`. На этом здесь уже спотыкались (`README.md:81-82`). **Вместе с `render` обязателен `nativeButton={false}`**: проп объявлен в `node_modules/@base-ui/react/internals/types.d.ts` со значением по умолчанию `true`, и без него Base UI пишет в консоль предупреждение, что ожидал нативный `<button>`. Существующий `components/dev-presentation/hero.tsx:32` этот проп не передаёт и warning даёт — чинить его не надо, это вне задачи, но повторять ошибку в новых компонентах не будем.
2. `Card` несёт в базовых классах `flex flex-col gap-6 py-6` (`components/ui/card.tsx:15`). Собственные отступы через `mt-*` внутри карточки будут складываться с `gap-6` и разъедут вёрстку, поэтому во всех карточках плана передаётся `className="block p-5"` — `block` перебивает `flex` через tailwind-merge, и `gap-6` перестаёт действовать. Там, где нужен именно flex (карточка пакета с прижатой вниз строкой), передаётся `flex flex-col gap-0 p-5`.

- [ ] **Step 2: Создать `components/marketplaces/video-questions.tsx`**

```tsx
import { PlayCircle } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function VideoQuestions({ data }: { data: MarketplacesData['video'] }) {
  return (
    <section
      id="video"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={PlayCircle}>01 · Как это работает</SectionLabel>
      <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>

      {data.youtubeId ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data.youtubeId}?rel=0`}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {data.questions.map((q) => (
          <Card key={q.q} className="block p-5">
            <p className="text-base font-semibold">«{q.q}»</p>
            <p className="mt-3 text-sm text-muted-foreground">{q.how}</p>
            <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm">{q.sees}</p>
          </Card>
        ))}
      </div>

      {data.upcoming ? (
        <p className="mt-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{data.upcoming.title}</span>{' '}
          {data.upcoming.note}
        </p>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 3: Подключить обе секции в `app/marketplaces/page.tsx`**

Заменить содержимое файла целиком:

```tsx
import { PageBackground } from '@/components/landing/page-background'
import { SectionReveal } from '@/components/landing/section-reveal'
import { Hero } from '@/components/marketplaces/hero'
import { VideoQuestions } from '@/components/marketplaces/video-questions'
import { marketplacesData as data } from '@/app/data/marketplaces'

export default function MarketplacesPage() {
  return (
    <>
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <Hero data={data.hero} />
        <SectionReveal>
          <VideoQuestions data={data.video} />
        </SectionReveal>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Проверить сборку и вид**

Run: `npm run typecheck`
Expected: без ошибок.

Открыть `http://localhost:3000/marketplaces`. Ожидаемо: заголовок, две кнопки, четыре
счётчика (анимируются при появлении), видео и три карточки вопросов.

- [ ] **Step 5: Коммит**

```bash
git add components/marketplaces/hero.tsx components/marketplaces/video-questions.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): hero and video sections"
```

---

## Task 5: Процессы и инструменты

**Files:**
- Create: `components/marketplaces/daily-processes.tsx`
- Create: `components/marketplaces/tools-by-marketplace.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/daily-processes.tsx`**

```tsx
import { Sunrise, Package, Tag, Megaphone, Star, Wallet, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData, ProcessIcon } from '@/app/data/marketplaces'

const ICONS: Record<ProcessIcon, LucideIcon> = {
  sunrise: Sunrise,
  package: Package,
  tag: Tag,
  megaphone: Megaphone,
  star: Star,
  wallet: Wallet,
}

export function DailyProcesses({ data }: { data: MarketplacesData['processes'] }) {
  return (
    <section
      id="processes"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Layers}>02 · Ваш рабочий день</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <Card key={item.title} className="block p-5">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" aria-hidden />
                <h3 className="text-base font-semibold">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm font-medium text-primary">«{item.quote}»</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать `components/marketplaces/tools-by-marketplace.tsx`**

```tsx
import { Boxes, Check } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function ToolsByMarketplace({ data }: { data: MarketplacesData['tools'] }) {
  return (
    <section
      id="tools"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Boxes}>03 · Состав</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {data.columns.map((col) => (
          <Card key={col.id} className="block p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold">{col.label}</h3>
              <Badge variant="secondary">{col.count}</Badge>
            </div>
            <ul className="mt-4 space-y-2">
              {col.groups.map((g) => (
                <li key={g} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        {data.note}
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Подключить в `app/marketplaces/page.tsx`**

Добавить импорты:

```tsx
import { DailyProcesses } from '@/components/marketplaces/daily-processes'
import { ToolsByMarketplace } from '@/components/marketplaces/tools-by-marketplace'
```

И после блока `<SectionReveal><VideoQuestions … /></SectionReveal>`:

```tsx
        <SectionReveal>
          <DailyProcesses data={data.processes} />
        </SectionReveal>
        <SectionReveal>
          <ToolsByMarketplace data={data.tools} />
        </SectionReveal>
```

- [ ] **Step 4: Проверить**

Run: `npm run typecheck`
Expected: без ошибок. На `/marketplaces` — шесть карточек рутин в две колонки и три колонки инструментов.

- [ ] **Step 5: Коммит**

```bash
git add components/marketplaces/daily-processes.tsx components/marketplaces/tools-by-marketplace.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): daily processes and tools sections"
```

---

## Task 6: Пакеты и кейсы

**Files:**
- Create: `components/marketplaces/packages.tsx`
- Create: `components/marketplaces/cases.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/packages.tsx`**

```tsx
import { Layers, ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Packages({ data }: { data: MarketplacesData['packages'] }) {
  return (
    <section
      id="packages"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Layers}>04 · Пакеты</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {data.items.map((p) => (
          <Card key={p.id} className="flex flex-col gap-0 p-5">
            <h3 className="text-base font-semibold">{p.title}</h3>
            <p className="mt-2 text-xl font-bold tabular-nums text-primary">{p.priceFrom}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.duration}</p>

            <p className="mt-4 text-sm text-muted-foreground">{p.body}</p>

            {p.bullets ? (
              <ul className="mt-3 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-auto pt-4 text-xs text-foreground/70">{p.who}</p>
          </Card>
        ))}
      </div>

      <a
        href="#form"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary transition hover:underline"
      >
        {data.footnote}
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    </section>
  )
}
```

- [ ] **Step 2: Создать `components/marketplaces/cases.tsx`**

```tsx
import { TrendingUp } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Cases({ data }: { data: MarketplacesData['cases'] }) {
  return (
    <section
      id="cases"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={TrendingUp}>05 · Кейсы</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((c) => (
          <Card key={c.title} className="block p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{c.title}</h3>
              {c.duration ? <Badge variant="secondary">{c.duration}</Badge> : null}
            </div>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Было
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{c.before}</p>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-primary">
              Стало
            </p>
            <p className="mt-1 text-sm">{c.after}</p>

            {c.note ? (
              <p className="mt-4 text-xs text-muted-foreground italic">{c.note}</p>
            ) : null}
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        {data.honesty}
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Подключить в `app/marketplaces/page.tsx`**

Импорты:

```tsx
import { Packages } from '@/components/marketplaces/packages'
import { Cases } from '@/components/marketplaces/cases'
```

После блока `ToolsByMarketplace`:

```tsx
        <SectionReveal>
          <Packages data={data.packages} />
        </SectionReveal>
        <SectionReveal>
          <Cases data={data.cases} />
        </SectionReveal>
```

- [ ] **Step 4: Проверить**

Run: `npm run typecheck`
Expected: без ошибок. Проверить, что у карточки «Инструменты» видны 4 буллета, а у остальных двух их нет.

- [ ] **Step 5: Коммит**

```bash
git add components/marketplaces/packages.tsx components/marketplaces/cases.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): packages and cases sections"
```

---

## Task 7: Безопасность, разбор, FAQ

**Files:**
- Create: `components/marketplaces/security.tsx`
- Create: `components/marketplaces/how-review-works.tsx`
- Create: `components/marketplaces/faq.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/security.tsx`**

```tsx
import { ShieldCheck } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Security({ data }: { data: MarketplacesData['security'] }) {
  return (
    <section
      id="security"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={ShieldCheck}>06 · Безопасность</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <ul className="grid gap-3 md:grid-cols-2">
        {data.items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2: Создать `components/marketplaces/how-review-works.tsx`**

```tsx
import { ListChecks } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function HowReviewWorks({ data }: { data: MarketplacesData['review'] }) {
  return (
    <section
      id="review"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={ListChecks}>07 · Разбор</SectionLabel>
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">{data.sub}</p>

      <ol className="grid gap-4 md:grid-cols-3">
        {data.steps.map((s) => (
          <li key={s.step} className="rounded-xl border border-border bg-card/50 p-5">
            <span className="font-mono text-2xl font-bold text-primary/40 tabular-nums">
              0{s.step}
            </span>
            <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-l-2 border-primary/40 pl-3 text-sm">{data.note}</p>
    </section>
  )
}
```

- [ ] **Step 3: Создать `components/marketplaces/faq.tsx`**

```tsx
import { HelpCircle } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function Faq({ data }: { data: MarketplacesData['faq'] }) {
  return (
    <section
      id="faq"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={HelpCircle}>08 · Вопросы</SectionLabel>
      <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>

      <Accordion className="w-full max-w-3xl">
        {data.items.map((item, i) => (
          <AccordionItem key={item.q} value={`q-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

Примечание: у Base UI `Accordion` **нет** пропов `type` и `collapsible` — в отличие от
radix-варианта shadcn. Образец рабочего использования: `components/landing/faq.tsx:20-35`.

- [ ] **Step 4: Подключить в `app/marketplaces/page.tsx`**

Импорты:

```tsx
import { Security } from '@/components/marketplaces/security'
import { HowReviewWorks } from '@/components/marketplaces/how-review-works'
import { Faq } from '@/components/marketplaces/faq'
```

После блока `Cases`:

```tsx
        <SectionReveal>
          <Security data={data.security} />
        </SectionReveal>
        <SectionReveal>
          <HowReviewWorks data={data.review} />
        </SectionReveal>
        <SectionReveal>
          <Faq data={data.faq} />
        </SectionReveal>
```

- [ ] **Step 5: Проверить**

Run: `npm run typecheck`
Expected: без ошибок. На странице аккордеон раскрывается по клику.

- [ ] **Step 6: Коммит**

```bash
git add components/marketplaces/security.tsx components/marketplaces/how-review-works.tsx components/marketplaces/faq.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): security, review flow and faq sections"
```

---

## Task 8: Экстракция email-транспорта

Чистый рефакторинг: поведение `/dev-presentation` обязано остаться прежним.

**Files:**
- Create: `lib/email-relay.ts`
- Modify: `lib/dev-presentation/smtp.ts:16-54`

- [ ] **Step 1: Создать `lib/email-relay.ts`**

Перенести сюда `RelayBody` и `relaySend` из `lib/dev-presentation/smtp.ts` без изменений в теле:

```ts
// Email is delivered via the hubmarket-ai microservice's /api/email/send relay,
// because outbound SMTP (25/465/587) is blocked from this hosting (85.239.51.141).
// hubmarket-ai lives on different hosting (147.45.171.40) where SMTP egress works.
//
// Shared transport: used by both /dev-presentation and /marketplaces lead routes.
// Each caller builds its own subject/text/html — only the HTTP call lives here.

export interface RelayBody {
  from: string
  to: string
  replyTo?: string
  subject: string
  text: string
  html: string
}

export async function relaySend(body: RelayBody): Promise<{ id: string }> {
  const url = process.env.AI_SERVICE_URL
  const token = process.env.AI_SERVICE_TOKEN
  if (!url || !token) {
    throw new Error('Email relay not configured: AI_SERVICE_URL and AI_SERVICE_TOKEN required')
  }
  const res = await fetch(`${url}/api/email/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`email relay ${res.status}: ${text.slice(0, 300)}`)
  }
  const json = (await res.json()) as {
    success: boolean
    messageId?: string
    error?: string
  }
  if (!json.success) {
    throw new Error(`email relay failed: ${json.error ?? 'unknown'}`)
  }
  return { id: json.messageId ?? 'unknown' }
}
```

- [ ] **Step 2: Убрать дубликат из `lib/dev-presentation/smtp.ts`**

Удалить строки 12–54 (комментарий, `interface RelayBody`, `async function relaySend`) и
добавить импорт сразу после существующего импорта из `./email-templates`:

```ts
import { relaySend } from '@/lib/email-relay'
```

Функции `sendOwnerEmail` и `sendUserCopy` не трогаем — они продолжают звать `relaySend`.

- [ ] **Step 3: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок. Если `relaySend is not defined` — импорт не добавлен.

- [ ] **Step 4: Регрессия формы `/dev-presentation`**

Запустить `npm run dev`, открыть `http://localhost:3000/dev-presentation`, заполнить форму
и отправить.
Expected: успех, письмо владельцу и копия пользователю приходят как раньше.

Если `AI_SERVICE_URL` / `AI_SERVICE_TOKEN` не настроены локально — достаточно убедиться,
что в консоли сервера ошибка та же, что и до рефакторинга (`Email relay not configured`),
а не `relaySend is not a function`.

- [ ] **Step 5: Коммит**

```bash
git add lib/email-relay.ts lib/dev-presentation/smtp.ts
git commit -m "refactor: extract relaySend into lib/email-relay"
```

---

## Task 9: Схема заявки

**Files:**
- Create: `lib/marketplaces/schemas.ts`
- Create: `lib/marketplaces/schemas.test.ts`

- [ ] **Step 1: Написать падающие тесты**

Создать `lib/marketplaces/schemas.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { marketplacesLeadSchema } from './schemas'

const valid = {
  name: 'Иван',
  phone: '+7 999 123-45-67',
  contact: '@ivan',
  marketplaces: ['wb'],
  catalogSize: 'lt100',
  role: 'owner',
  filledAtMs: 1_700_000_000_000,
}

describe('marketplacesLeadSchema', () => {
  it('принимает минимально заполненную заявку', () => {
    expect(marketplacesLeadSchema.safeParse(valid).success).toBe(true)
  })

  it('требует хотя бы одну площадку', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, marketplaces: [] })
    expect(r.success).toBe(false)
  })

  it('отклоняет телефон с буквами', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, phone: 'позвоните мне' })
    expect(r.success).toBe(false)
  })

  it('пропускает honeypot любой длины — фильтрует роут, а не схема', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, website: 'http://spam.example' })
    expect(r.success).toBe(true)
  })

  it('отклоняет неизвестную площадку', () => {
    const r = marketplacesLeadSchema.safeParse({ ...valid, marketplaces: ['avito'] })
    expect(r.success).toBe(false)
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm test -- schemas`
Expected: FAIL — `Failed to resolve import "./schemas"`.

- [ ] **Step 3: Создать `lib/marketplaces/schemas.ts`**

```ts
import { z } from 'zod'

export const MARKETPLACE_IDS = ['wb', 'ozon', 'ym'] as const
export const CATALOG_SIZES = ['lt100', '100_1000', 'gt1000'] as const
export const ROLES = ['owner', 'manager', 'other'] as const

export const marketplacesLeadSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Похоже на неполный номер')
    .max(32)
    .regex(/^[+\d\s\-()]+$/, 'Только цифры, пробелы, +-()'),
  contact: z.string().trim().min(3, 'Telegram или email').max(200),
  marketplaces: z.array(z.enum(MARKETPLACE_IDS)).min(1, 'Выберите хотя бы одну площадку'),
  catalogSize: z.enum(CATALOG_SIZES),
  role: z.enum(ROLES),
  comment: z.string().trim().max(4000).optional(),
  // honeypot: пропускаем через Zod, непустое значение ловит роут тихой двухсоткой.
  // .max(0) роняет запрос до хендлера и подсказывает боту, что это ловушка.
  website: z.string().optional(),
  filledAtMs: z.number().int().positive(),
})

export type MarketplacesLeadInput = z.infer<typeof marketplacesLeadSchema>
export type MarketplaceId = (typeof MARKETPLACE_IDS)[number]
export type CatalogSize = (typeof CATALOG_SIZES)[number]
export type Role = (typeof ROLES)[number]
```

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- schemas`
Expected: PASS, 5 тестов.

- [ ] **Step 5: Коммит**

```bash
git add lib/marketplaces/schemas.ts lib/marketplaces/schemas.test.ts
git commit -m "feat(marketplaces): lead schema with tests"
```

---

## Task 10: Нормализация доставки

Самый ценный тест плана: закрывает ловушку из §8 спека.

**Files:**
- Create: `lib/marketplaces/delivery.ts`
- Create: `lib/marketplaces/delivery.test.ts`

- [ ] **Step 1: Написать падающие тесты в `lib/marketplaces/delivery.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { settleReturning, settleThrowing, summarize } from './delivery'

describe('settleReturning — канал, который сообщает об отказе возвратом', () => {
  it('ok:true → успех', async () => {
    const r = await settleReturning('telegram', Promise.resolve({ ok: true }))
    expect(r).toEqual({ channel: 'telegram', ok: true })
  })

  it('ok:false → провал, а НЕ успех', async () => {
    const r = await settleReturning('telegram', Promise.resolve({ ok: false, error: '401' }))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('401')
  })

  it('брошенное исключение тоже провал', async () => {
    const r = await settleReturning('telegram', Promise.reject(new Error('boom')))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('boom')
  })
})

describe('settleThrowing — канал, который бросает', () => {
  it('резолв → успех', async () => {
    const r = await settleThrowing('email', Promise.resolve({ id: 'x' }))
    expect(r).toEqual({ channel: 'email', ok: true })
  })

  it('реджект → провал', async () => {
    const r = await settleThrowing('email', Promise.reject(new Error('relay 500')))
    expect(r.ok).toBe(false)
    expect(r.error).toBe('relay 500')
  })
})

describe('summarize', () => {
  it('оба канала прошли — успех без partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: true },
        { channel: 'email', ok: true },
      ]),
    ).toEqual({ ok: true, partial: false, missing: [] })
  })

  it('прошёл только Telegram — успех с partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: true },
        { channel: 'email', ok: false, error: 'relay down' },
      ]),
    ).toEqual({ ok: true, partial: true, missing: ['email'] })
  })

  it('прошёл только email — успех с partial', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: false, error: '401' },
        { channel: 'email', ok: true },
      ]),
    ).toEqual({ ok: true, partial: true, missing: ['telegram'] })
  })

  it('оба упали — провал, заявка потеряна', () => {
    expect(
      summarize([
        { channel: 'telegram', ok: false, error: '401' },
        { channel: 'email', ok: false, error: 'relay down' },
      ]),
    ).toEqual({ ok: false, partial: false, missing: ['telegram', 'email'] })
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm test -- delivery`
Expected: FAIL — `Failed to resolve import "./delivery"`.

- [ ] **Step 3: Создать `lib/marketplaces/delivery.ts`**

```ts
// Два канала доставки заявки сообщают об отказе по-разному:
//   sendTelegramMessage (lib/landing/telegram.ts) ВОЗВРАЩАЕТ { ok:false } и не бросает —
//     Promise.allSettled увидит его как fulfilled;
//   relaySend (lib/email-relay.ts) БРОСАЕТ.
// Проверка по статусу промиса посчитала бы упавший Telegram успехом и вернула бы
// пользователю 200 при нуле доставленных заявок. Поэтому оба канала нормализуются здесь.

export type DeliveryChannel = 'telegram' | 'email'
export type Delivery = { channel: DeliveryChannel; ok: boolean; error?: string }

function describe(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/** Для канала, который сообщает об отказе возвратом `{ ok:false }`. */
export async function settleReturning(
  channel: DeliveryChannel,
  p: Promise<{ ok: boolean; error?: string }>,
): Promise<Delivery> {
  try {
    const r = await p
    return r.ok ? { channel, ok: true } : { channel, ok: false, error: r.error ?? 'unknown' }
  } catch (e) {
    return { channel, ok: false, error: describe(e) }
  }
}

/** Для канала, который сообщает об отказе исключением. */
export async function settleThrowing(
  channel: DeliveryChannel,
  p: Promise<unknown>,
): Promise<Delivery> {
  try {
    await p
    return { channel, ok: true }
  } catch (e) {
    return { channel, ok: false, error: describe(e) }
  }
}

/** Успех = доставлен хотя бы один канал. */
export function summarize(deliveries: Delivery[]): {
  ok: boolean
  partial: boolean
  missing: DeliveryChannel[]
} {
  const missing = deliveries.filter((d) => !d.ok).map((d) => d.channel)
  const ok = deliveries.some((d) => d.ok)
  return { ok, partial: ok && missing.length > 0, missing }
}
```

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- delivery`
Expected: PASS, 9 тестов.

- [ ] **Step 5: Коммит**

```bash
git add lib/marketplaces/delivery.ts lib/marketplaces/delivery.test.ts
git commit -m "feat(marketplaces): delivery normalizer with tests"
```

---

## Task 11: Тексты письма и Telegram

**Files:**
- Create: `lib/marketplaces/email.ts`
- Create: `lib/marketplaces/telegram-text.ts`
- Create: `lib/marketplaces/email.test.ts`

- [ ] **Step 1: Написать падающие тесты**

Создать `lib/marketplaces/email.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildLeadSubject, buildLeadText, buildLeadHtml, type LeadEmailData } from './email'

const lead: LeadEmailData = {
  name: 'Иван',
  phone: '+79991234567',
  contact: '@ivan',
  marketplaces: ['wb', 'ozon'],
  catalogSize: '100_1000',
  role: 'owner',
  comment: 'Хотим внедрить',
  ip: '1.2.3.4',
}

describe('buildLeadSubject', () => {
  it('естественная тема, без служебных префиксов', () => {
    expect(buildLeadSubject(lead)).toBe('Заявка на разбор от Иван')
  })
})

describe('buildLeadText', () => {
  it('содержит человекочитаемые площадки и роль', () => {
    const t = buildLeadText(lead)
    expect(t).toContain('Wildberries')
    expect(t).toContain('Ozon')
    expect(t).toContain('Владелец')
    expect(t).toContain('100–1000')
  })
})

describe('buildLeadHtml', () => {
  it('экранирует пользовательский ввод', () => {
    const html = buildLeadHtml({ ...lead, name: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('не падает без комментария', () => {
    expect(() => buildLeadHtml({ ...lead, comment: undefined })).not.toThrow()
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm test -- email`
Expected: FAIL — `Failed to resolve import "./email"`.

- [ ] **Step 3: Создать `lib/marketplaces/email.ts`**

```ts
import type { CatalogSize, MarketplaceId, Role } from './schemas'

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const MARKETPLACE_LABELS: Record<MarketplaceId, string> = {
  wb: 'Wildberries',
  ozon: 'Ozon',
  ym: 'Яндекс.Маркет',
}

export const CATALOG_LABELS: Record<CatalogSize, string> = {
  lt100: 'до 100 SKU',
  '100_1000': '100–1000 SKU',
  gt1000: 'больше 1000 SKU',
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  other: 'Другое',
}

export type LeadEmailData = {
  name: string
  phone: string
  contact: string
  marketplaces: MarketplaceId[]
  catalogSize: CatalogSize
  role: Role
  comment?: string
  ip: string
}

// Тема письма нарочно естественная: Timeweb SMTP помечает шаблоны вида
// "[marketplaces] new lead" как высоковероятный спам (README.md:95-98).
export function buildLeadSubject(d: LeadEmailData): string {
  return `Заявка на разбор от ${d.name}`
}

function marketplacesLine(d: LeadEmailData): string {
  return d.marketplaces.map((m) => MARKETPLACE_LABELS[m]).join(', ')
}

export function buildLeadText(d: LeadEmailData): string {
  const lines = [
    `👤 Имя:      ${d.name}`,
    `📞 Телефон:  ${d.phone}`,
    `💬 Контакт:  ${d.contact}`,
    `🛒 Площадки: ${marketplacesLine(d)}`,
    `📦 Каталог:  ${CATALOG_LABELS[d.catalogSize]}`,
    `🎭 Роль:     ${ROLE_LABELS[d.role]}`,
    `🌐 IP:       ${d.ip}`,
  ]
  if (d.comment) {
    lines.push('', 'Комментарий:', d.comment)
  }
  return lines.join('\n')
}

export function buildLeadHtml(d: LeadEmailData): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;width:110px">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`

  const commentBlock = d.comment
    ? `<div style="margin-top:20px">
    <div style="color:#666;font-size:13px;margin-bottom:8px">Комментарий</div>
    <div style="background:#f8f8f8;padding:14px 16px;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(d.comment)}</div>
  </div>`
    : ''

  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:18px">Заявка на разбор — /marketplaces</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${row('👤 Имя', d.name)}
    ${row('📞 Телефон', d.phone)}
    ${row('💬 Контакт', d.contact)}
    ${row('🛒 Площадки', marketplacesLine(d))}
    ${row('📦 Каталог', CATALOG_LABELS[d.catalogSize])}
    ${row('🎭 Роль', ROLE_LABELS[d.role])}
    ${row('🌐 IP', d.ip)}
  </table>
  ${commentBlock}
</body></html>`
}
```

- [ ] **Step 4: Создать `lib/marketplaces/telegram-text.ts`**

```ts
import { escapeHtml } from '@/lib/landing/telegram'
import {
  CATALOG_LABELS,
  MARKETPLACE_LABELS,
  ROLE_LABELS,
  type LeadEmailData,
} from './email'

export function buildLeadTelegramText(d: LeadEmailData): string {
  const base =
    `<b>📨 Заявка на разбор — /marketplaces</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Телефон:</b> ${escapeHtml(d.phone)}\n` +
    `<b>Контакт:</b> ${escapeHtml(d.contact)}\n` +
    `<b>Площадки:</b> ${escapeHtml(d.marketplaces.map((m) => MARKETPLACE_LABELS[m]).join(', '))}\n` +
    `<b>Каталог:</b> ${escapeHtml(CATALOG_LABELS[d.catalogSize])}\n` +
    `<b>Роль:</b> ${escapeHtml(ROLE_LABELS[d.role])}\n` +
    `<b>IP:</b> ${escapeHtml(d.ip)}`

  return d.comment ? `${base}\n\n<b>Комментарий:</b>\n${escapeHtml(d.comment)}` : base
}
```

- [ ] **Step 5: Запустить тесты**

Run: `npm test`
Expected: PASS — все три файла тестов (schemas, delivery, email).

- [ ] **Step 6: Коммит**

```bash
git add lib/marketplaces/email.ts lib/marketplaces/email.test.ts lib/marketplaces/telegram-text.ts
git commit -m "feat(marketplaces): lead email and telegram builders with tests"
```

---

## Task 12: API-роут заявки

**Files:**
- Create: `app/api/marketplaces/lead/route.ts`

- [ ] **Step 1: Создать `app/api/marketplaces/lead/route.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { marketplacesLeadSchema } from '@/lib/marketplaces/schemas'
import { buildLeadHtml, buildLeadSubject, buildLeadText, type LeadEmailData } from '@/lib/marketplaces/email'
import { buildLeadTelegramText } from '@/lib/marketplaces/telegram-text'
import { settleReturning, settleThrowing, summarize } from '@/lib/marketplaces/delivery'
import { relaySend } from '@/lib/email-relay'
import { sendTelegramMessage } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

const MIN_FILL_MS = 1500

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // 1. Rate limit
  const rl = rateLimitTake(`mplead:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) },
      },
    )
  }

  // 2. Parse JSON
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  // 3. Zod
  const parsed = marketplacesLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // 4. Honeypot — тихая двухсотка, бот не должен понять, что попался
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // 5. Слишком быстрое заполнение — тоже тихая двухсотка
  if (Date.now() - parsed.data.filledAtMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const lead: LeadEmailData = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    contact: parsed.data.contact,
    marketplaces: parsed.data.marketplaces,
    catalogSize: parsed.data.catalogSize,
    role: parsed.data.role,
    comment: parsed.data.comment,
    ip,
  }

  // 6. Два независимых канала владельцу
  const from = process.env.SMTP_FROM
  const to = process.env.OWNER_EMAIL

  const emailPromise =
    from && to
      ? relaySend({
          from,
          to,
          subject: buildLeadSubject(lead),
          text: buildLeadText(lead),
          html: buildLeadHtml(lead),
        })
      : Promise.reject(new Error('SMTP_FROM or OWNER_EMAIL not configured'))

  const deliveries = await Promise.all([
    settleReturning('telegram', sendTelegramMessage(buildLeadTelegramText(lead))),
    settleThrowing('email', emailPromise),
  ])

  const result = summarize(deliveries)

  for (const d of deliveries) {
    if (!d.ok) console.warn(`[mplead] ${d.channel} failed: ${d.error}`)
  }

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'delivery' }, { status: 502 })
  }

  return NextResponse.json(
    result.partial ? { ok: true, partial: true, missing: result.missing } : { ok: true },
    { status: 200 },
  )
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Проверить валидацию вручную**

При запущенном `npm run dev`:

```bash
curl -s -X POST http://localhost:3000/api/marketplaces/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"И"}' | head -c 200
```

Expected: `{"ok":false,"error":"validation",...}` со статусом 400.

- [ ] **Step 4: Проверить honeypot**

```bash
curl -s -X POST http://localhost:3000/api/marketplaces/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Иван","phone":"+79991234567","contact":"@ivan","marketplaces":["wb"],"catalogSize":"lt100","role":"owner","website":"spam","filledAtMs":1}'
```

Expected: `{"ok":true}` со статусом 200 и **без** сообщения в Telegram.

- [ ] **Step 5: Коммит**

```bash
git add app/api/marketplaces/lead/route.ts
git commit -m "feat(marketplaces): lead API route"
```

---

## Task 13: Форма и sticky CTA

**Files:**
- Create: `components/marketplaces/lead-form.tsx`
- Create: `components/marketplaces/sticky-cta.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/lead-form.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Check, Loader2, CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { contacts } from '@/lib/landing/contacts'
import {
  marketplacesLeadSchema,
  type MarketplacesLeadInput,
  type MarketplaceId,
  type CatalogSize,
  type Role,
} from '@/lib/marketplaces/schemas'

const MARKETPLACE_OPTIONS: { id: MarketplaceId; label: string }[] = [
  { id: 'wb', label: 'Wildberries' },
  { id: 'ozon', label: 'Ozon' },
  { id: 'ym', label: 'Яндекс.Маркет' },
]
const CATALOG_OPTIONS: { id: CatalogSize; label: string }[] = [
  { id: 'lt100', label: 'до 100' },
  { id: '100_1000', label: '100–1000' },
  { id: 'gt1000', label: 'больше 1000' },
]
const ROLE_OPTIONS: { id: Role; label: string }[] = [
  { id: 'owner', label: 'Владелец' },
  { id: 'manager', label: 'Менеджер' },
  { id: 'other', label: 'Другое' },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm transition',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

// Пропов нет: заголовок и подпись секции рисует page.tsx, форма отвечает только за поля.
export function LeadForm() {
  const [state, setState] = useState<SubmitState>('idle')

  // Момент монтирования — анти-бот метка: роут отсекает отправки быстрее 1.5 с.
  // Ленивый useState, а не useRef: значение вычисляется один раз и переживает
  // ре-рендеры, при этом не читается из ref во время рендера (react-hooks/refs).
  const [mountedAt] = useState(() => Date.now())

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarketplacesLeadInput>({
    resolver: zodResolver(marketplacesLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      contact: '',
      marketplaces: [],
      catalogSize: 'lt100',
      role: 'owner',
      comment: '',
      website: '',
      filledAtMs: 1,
    },
  })

  const onSubmit = async (values: MarketplacesLeadInput) => {
    setState('submitting')
    try {
      const res = await fetch('/api/marketplaces/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, filledAtMs: mountedAt }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('success')
      reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-primary/40 bg-card/50 p-6">
        <div className="flex items-center gap-2 text-primary">
          <Check className="size-5" aria-hidden />
          <p className="text-base font-semibold">Заявка получена</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Напишу в течение дня. Если нужно быстрее —{' '}
          <a href={contacts.telegram} className="text-primary hover:underline">
            Telegram
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* honeypot: скрыт от людей, виден ботам */}
      <input
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Имя</label>
          <Input {...register('name')} placeholder="Иван" />
          {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Телефон</label>
          <Input {...register('phone')} placeholder="+7 999 123-45-67" inputMode="tel" />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Telegram или email</label>
          <Input {...register('contact')} placeholder="@ivan" />
          {errors.contact ? <p className="mt-1 text-xs text-destructive">{errors.contact.message}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Площадки</label>
        <Controller
          control={control}
          name="marketplaces"
          render={({ field }) => (
            <div role="group" className="flex flex-wrap gap-2">
              {MARKETPLACE_OPTIONS.map((o) => {
                const active = field.value.includes(o.id)
                return (
                  <Chip
                    key={o.id}
                    active={active}
                    onClick={() =>
                      field.onChange(
                        active ? field.value.filter((v) => v !== o.id) : [...field.value, o.id],
                      )
                    }
                  >
                    {o.label}
                  </Chip>
                )
              })}
            </div>
          )}
        />
        {errors.marketplaces ? (
          <p className="mt-1 text-xs text-destructive">{errors.marketplaces.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Размер каталога</label>
          <Controller
            control={control}
            name="catalogSize"
            render={({ field }) => (
              <div role="group" className="flex flex-wrap gap-2">
                {CATALOG_OPTIONS.map((o) => (
                  <Chip key={o.id} active={field.value === o.id} onClick={() => field.onChange(o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Ваша роль</label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div role="group" className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((o) => (
                  <Chip key={o.id} active={field.value === o.id} onClick={() => field.onChange(o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Комментарий (необязательно)</label>
        <Textarea {...register('comment')} rows={3} placeholder="Что сейчас болит больше всего?" />
      </div>

      {state === 'error' ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <span>
            Не получилось отправить. Попробуйте ещё раз или напишите в{' '}
            <a href={contacts.telegram} className="text-primary hover:underline">
              Telegram
            </a>
            .
          </span>
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={state === 'submitting'}>
        {state === 'submitting' ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {state === 'submitting' ? 'Отправляю…' : 'Записаться на разбор'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Создать секцию-обёртку и sticky CTA**

Создать `components/marketplaces/sticky-cta.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function StickyCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-80px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <Button size="lg" nativeButton={false} render={<a href="#form" />}>
        {label}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Собрать финальный `app/marketplaces/page.tsx`**

Заменить файл целиком:

```tsx
import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { PageBackground } from '@/components/landing/page-background'
import { SectionReveal } from '@/components/landing/section-reveal'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { ModeToggle } from '@/components/mode-toggle'
import { PaletteToggle } from '@/components/palette-toggle'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/marketplaces/hero'
import { VideoQuestions } from '@/components/marketplaces/video-questions'
import { DailyProcesses } from '@/components/marketplaces/daily-processes'
import { ToolsByMarketplace } from '@/components/marketplaces/tools-by-marketplace'
import { Packages } from '@/components/marketplaces/packages'
import { Cases } from '@/components/marketplaces/cases'
import { Security } from '@/components/marketplaces/security'
import { HowReviewWorks } from '@/components/marketplaces/how-review-works'
import { Faq } from '@/components/marketplaces/faq'
import { LeadForm } from '@/components/marketplaces/lead-form'
import { StickyCta } from '@/components/marketplaces/sticky-cta'
import { contacts } from '@/lib/landing/contacts'
import { marketplacesData as data } from '@/app/data/marketplaces'

export default function MarketplacesPage() {
  return (
    <>
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              webkoth.com
            </Link>
            <div className="flex items-center gap-1">
              <PaletteToggle />
              <ModeToggle />
              {/* На 375px кнопка вместе с тогглами не влезает и даёт 17px
                  горизонтального скролла. На мобильном её работу делает StickyCta. */}
              <Button
                size="sm"
                className="ml-2 hidden sm:inline-flex"
                nativeButton={false}
                render={<a href="#form" />}
              >
                Разбор бесплатно
              </Button>
            </div>
          </div>
        </header>

        <Hero data={data.hero} />
        <SectionReveal><VideoQuestions data={data.video} /></SectionReveal>
        <SectionReveal><DailyProcesses data={data.processes} /></SectionReveal>
        <SectionReveal><ToolsByMarketplace data={data.tools} /></SectionReveal>
        <SectionReveal><Packages data={data.packages} /></SectionReveal>
        <SectionReveal><Cases data={data.cases} /></SectionReveal>
        <SectionReveal><Security data={data.security} /></SectionReveal>
        <SectionReveal><HowReviewWorks data={data.review} /></SectionReveal>
        <SectionReveal><Faq data={data.faq} /></SectionReveal>

        <section
          id="form"
          className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
        >
          <SectionLabel icon={MessageSquare}>09 · Заявка</SectionLabel>
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{data.form.title}</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {data.form.sub}{' '}
            <a href={contacts.telegram} className="text-primary hover:underline">
              {data.form.altChannel}
            </a>
            .
          </p>
          <div className="max-w-3xl">
            <LeadForm />
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Минас Саркисян
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="text-foreground/80 transition hover:text-primary">
                webkoth.com
              </Link>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition hover:text-primary"
              >
                Telegram
              </a>
            </div>
          </div>
        </footer>

        <StickyCta label="Разбор бесплатно" />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Проверить типы и линт**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок.

- [ ] **Step 5: Отправить форму вручную**

При `npm run dev` открыть `http://localhost:3000/marketplaces`, заполнить форму, выбрать хотя
бы одну площадку, отправить.
Expected: экран «Заявка получена», сообщение пришло в Telegram.

Проверить также: отправка без выбранной площадки показывает ошибку под чипами и запрос не уходит.

- [ ] **Step 6: Коммит**

```bash
git add components/marketplaces/lead-form.tsx components/marketplaces/sticky-cta.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): lead form, sticky CTA and full page composition"
```

---

## Task 14: JSON-LD и финальная приёмка

**Files:**
- Create: `components/marketplaces/json-ld-service.tsx`
- Modify: `app/marketplaces/page.tsx`

- [ ] **Step 1: Создать `components/marketplaces/json-ld-service.tsx`**

```tsx
export function JsonLdService() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Обучение и внедрение AI для селлеров маркетплейсов',
    serviceType: 'AI-внедрение для Wildberries, Ozon и Яндекс.Маркета',
    description:
      'Обучение команды и внедрение AI в процессы компаний, торгующих на Wildberries, Ozon и Яндекс.Маркете.',
    areaServed: { '@type': 'Country', name: 'Россия' },
    provider: {
      '@type': 'Person',
      name: 'Минас Саркисян',
      url: 'https://webkoth.com',
    },
    url: 'https://webkoth.com/marketplaces',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Подключить в `app/marketplaces/page.tsx`**

Добавить импорт:

```tsx
import { JsonLdService } from '@/components/marketplaces/json-ld-service'
```

И первой строкой внутри внешнего фрагмента, перед `<PageBackground />`:

```tsx
      <JsonLdService />
```

- [ ] **Step 3: Полная сборка**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: всё зелёное, сборка проходит.

- [ ] **Step 4: Приёмка маршрутизации**

```bash
npm run dev
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/marketplaces
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ru
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/dev-presentation
curl -s http://localhost:3000/sitemap.xml | grep -c marketplaces
```

Expected: `200`, `200`, `200`, `200`, `1`.

- [ ] **Step 5: Приёмка формы**

- Заполнить и отправить → успех, заявка в Telegram.
- Заполнить honeypot через DevTools (`document.querySelector('input[name=website]').value='x'`) → `200`, в Telegram ничего.
- Отправить быстрее 1.5 с после загрузки → `200`, в Telegram ничего.
- Шесть заявок подряд → шестая отдаёт `429`.
- Снять `TELEGRAM_BOT_TOKEN` в `.env.local`, перезапустить → форма всё равно показывает успех, в ответе `partial:true`.
- Снять и `AI_SERVICE_TOKEN` тоже → форма показывает ошибку с кнопкой повтора, статус `502`.
- Вернуть переменные обратно.

- [ ] **Step 6: Приёмка вёрстки**

- Переключить тему (`ModeToggle`) — светлая и тёмная читаемы.
- Переключить палитру (`PaletteToggle`) — обе читаемы.
- DevTools, ширина 375 px: горизонтального скролла нет, три колонки инструментов складываются в одну, чипы формы переносятся.
- Проскроллить вниз — появляется sticky CTA, клик ведёт к форме.

- [ ] **Step 7: Приёмка содержания**

- Каждое число на странице есть в таблице §11 спека.
- В первом экране нет слов «MCP», «API», «tool calling».

- [ ] **Step 8: Коммит**

```bash
git add components/marketplaces/json-ld-service.tsx app/marketplaces/page.tsx
git commit -m "feat(marketplaces): JSON-LD service schema"
```

---

## Перед публикацией

Не входит в реализацию — требует решения владельца (§12 спека):

1. **Подтвердить цены и сроки** в `app/data/marketplaces.ts` → `packages.items[].priceFrom` и `.duration`. Черновые значения: 60 000 ₽ / 250 000 ₽ / 20 000 ₽ в месяц.
2. **Проверить FAQ №3** про мобильный Claude на своём аккаунте. Не подтвердится — удалить пункт из `faq.items`, а не смягчать формулировку.
3. **Второе видео** — когда снимут, заменить `video.youtubeId` и при желании заполнить `video.upcoming`.
