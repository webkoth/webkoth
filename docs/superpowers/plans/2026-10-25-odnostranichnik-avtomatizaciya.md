# Одностраничник «Автоматизация и ИИ» — план сборки

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** новая страница `webkoth.com/avtomatizaciya` для продавцов маркетплейсов с блоком для компаний и заявкой на бесплатный разбор; четыре старых лендинга не меняются.

**Architecture:** тексты — в данных `app/data/avtomatizaciya/`, компоненты блоков — в `components/avtomatizaciya/`, страница собирает их в одну ленту из восьми блоков. Общие части сайта (шапка, подвал, карусель кейсов, форма заявки, FAQ, плавающая кнопка) переиспользуются. Заявка идёт в существующий роут `app/api/evolution/lead` с новым источником `avtomatizaciya`.

**Tech Stack:** Next.js 16.3 (App Router), React 19, TypeScript, Tailwind 4, zod 4, vitest, lucide-react.

**Спека:** `docs/superpowers/specs/2026-10-25-odnostranichnik-avtomatizaciya-design.md`.

**Правила репозитория, которые важны здесь:**
- В текстах сайта нет длинного тире `—`: тесты лендингов это проверяют. Пишем дефис или перестраиваем фразу.
- Перед кодом Next.js сверяться с `node_modules/next/dist/docs/` (см. `AGENTS.md`): версия новее обучающих данных.
- Коммиты — по-русски, в повелительном наклонении, как в истории репозитория.
- Неотслеживаемые `AGENTS.md`, `CLAUDE.md` и изменённый `public/r/language-toggle.json` в коммиты этой работы не добавлять.

---

## Карта файлов

| Файл | Что делает |
|---|---|
| `app/data/avtomatizaciya/types.ts` | тип текстов страницы |
| `app/data/avtomatizaciya/ru.ts` | все тексты страницы |
| `app/data/avtomatizaciya/index.ts` | экспорт текстов, слаг, адрес, markdown для LLM |
| `app/data/avtomatizaciya/avtomatizaciya.test.ts` | проверки данных |
| `app/data/lead-fields.ts` | необязательные поля заявки по источнику |
| `app/data/lead-fields.test.ts` | проверки источника заявки |
| `lib/evolution/schemas.ts` | новый источник в `LEAD_LANDINGS` |
| `app/api/evolution/lead/route.ts` | поля заявки через `leadFieldsFor` |
| `app/data/landings/landings.test.ts` | сверка слагов с учётом нового источника |
| `components/avtomatizaciya/hero.tsx` | первый экран с тремя цифрами |
| `components/avtomatizaciya/services.tsx` | восемь услуг для продавцов |
| `components/avtomatizaciya/companies.tsx` | четыре плитки для компаний |
| `components/avtomatizaciya/how.tsx` | четыре шага работы |
| `components/avtomatizaciya/pricing.tsx` | три цены |
| `components/avtomatizaciya/lead.tsx` | форма заявки внизу |
| `components/avtomatizaciya/page.tsx` | сборка страницы |
| `app/avtomatizaciya/page.tsx` | маршрут и метаданные |
| `app/sitemap.ts`, `app/llms.txt/route.ts` | страница в карте сайта и в markdown для LLM |

---

### Task 1: Данные страницы

**Files:**
- Create: `app/data/avtomatizaciya/types.ts`, `app/data/avtomatizaciya/ru.ts`, `app/data/avtomatizaciya/index.ts`
- Test: `app/data/avtomatizaciya/avtomatizaciya.test.ts`

- [ ] **Step 1: Написать падающий тест**

`app/data/avtomatizaciya/avtomatizaciya.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { angleForCase, CASE_SLUGS } from '@/app/data/cases'
import { LEAD_DETAIL_KEY, LEAD_DETAILS_MAX } from '@/lib/evolution/schemas'
import { avtomatizaciya, avtomatizaciyaPath, buildAvtomatizaciyaMarkdown } from './index'

const c = avtomatizaciya

describe('тексты одностраничника', () => {
  it('восемь услуг для продавцов, заголовки не повторяются', () => {
    expect(c.services.items).toHaveLength(8)
    expect(new Set(c.services.items.map((s) => s.title)).size).toBe(8)
  })

  it('четыре плитки для компаний в утверждённом составе', () => {
    expect(c.companies.items.map((t) => t.id)).toEqual(['kontur', 'finance', 'it-director', 'training'])
  })

  it('кейсы существуют в реестре, не повторяются и у каждого есть угол', () => {
    for (const slug of c.cases.slugs) expect(CASE_SLUGS, slug).toContain(slug)
    expect(new Set(c.cases.slugs).size).toBe(c.cases.slugs.length)
    for (const slug of c.cases.slugs) expect(() => angleForCase('ru', slug)).not.toThrow()
  })

  it('разбор бесплатный', () => {
    expect(c.pricing.items[0]).toMatchObject({ title: 'Разбор', price: 'бесплатно' })
  })

  it('поля заявки проходят ограничения схемы', () => {
    expect(c.lead.fields.length).toBeLessThanOrEqual(LEAD_DETAILS_MAX)
    for (const f of c.lead.fields) expect(f.key).toMatch(LEAD_DETAIL_KEY)
  })

  it('в текстах нет длинного тире', () => {
    expect(JSON.stringify(c)).not.toMatch(/—/)
  })

  it('markdown для LLM содержит заголовок и адрес страницы', () => {
    const md = buildAvtomatizaciyaMarkdown()
    expect(md).toContain(c.hero.title)
    expect(md).toContain(avtomatizaciyaPath)
  })
})
```

- [ ] **Step 2: Убедиться, что тест падает**

Run: `npx vitest run app/data/avtomatizaciya`
Expected: FAIL — `Failed to resolve import "./index"`.

- [ ] **Step 3: Тип текстов**

`app/data/avtomatizaciya/types.ts`:

```ts
// Тексты одностраничника /avtomatizaciya. Только RU. Компоненты тексты не содержат.
import type { CaseSlug } from '@/app/data/cases'
import type { LandingCopy, LeadField } from '@/app/data/landings'

export type ServiceIcon = 'profit' | 'reports' | 'stock' | 'ads' | 'reviews' | 'chat' | 'agents' | 'photo'

export type Service = { icon: ServiceIcon; title: string; body: string }
export type CompanyTile = { id: 'kontur' | 'finance' | 'it-director' | 'training'; title: string; body: string; price: string; support: string }
export type Step = { title: string; body: string }
export type Price = { title: string; price: string; body: string }
export type Stat = { value: string; label: string }

export type AvtomatizaciyaCopy = {
  meta: { title: string; description: string }
  nav: { services: string; cases: string; companies: string; pricing: string; faq: string; cta: string }
  hero: {
    eyebrow: string
    title: string
    sub: string
    primaryCta: string
    secondaryCta: string
    note: string
    /** Три цифры из кейсов сайта: выразительный ход первого экрана. */
    stats: readonly [Stat, Stat, Stat]
  }
  services: { eyebrow: string; title: string; items: readonly Service[] }
  /** Тип карусели старых лендингов плюс состав кейсов. */
  cases: LandingCopy['cases'] & { slugs: readonly [CaseSlug, CaseSlug, CaseSlug, ...CaseSlug[]] }
  companies: { eyebrow: string; title: string; lead: string; items: readonly CompanyTile[] }
  how: { eyebrow: string; title: string; steps: readonly Step[]; standardLink: { label: string; href: string } }
  pricing: { eyebrow: string; title: string; note: string; items: readonly Price[] }
  faq: LandingCopy['faq']
  lead: {
    eyebrow: string
    title: string
    sub: string
    /** Подпись и подсказка главного вопроса формы вместо вопроса с главной сайта. */
    answerLabel: string
    answerPlaceholder: string
    fieldsNote: string
    fields: readonly LeadField[]
  }
}
```

- [ ] **Step 4: Тексты**

`app/data/avtomatizaciya/ru.ts` (цифры кейсов дословно из `app/data/cases/ru.ts`; длинного тире нет):

```ts
import type { AvtomatizaciyaCopy } from './types'

export const ru: AvtomatizaciyaCopy = {
  meta: {
    title: 'Автоматизация и ИИ для продавцов Wildberries, Ozon и Маркета · webkoth',
    description:
      'Прибыль по артикулу, отчёты, остатки, реклама и ответы на отзывы без ручной работы. Разработчик, который сам ведёт магазин на трёх площадках. Разбор бесплатно.',
  },
  nav: { services: 'Что делаю', cases: 'Кейсы', companies: 'Компаниям', pricing: 'Цены', faq: 'Вопросы', cta: 'Бесплатный разбор' },
  hero: {
    eyebrow: 'Wildberries · Ozon · Яндекс Маркет',
    title: 'Автоматизация и ИИ для продавцов Wildberries, Ozon и Маркета',
    sub: 'Я разработчик. Мы с супругой сами ведём магазин украшений на этих трёх площадках, поэтому я делаю то, чем пользуюсь каждый день: прибыль по артикулу, отчёты, остатки, рекламу и ответы покупателям без ручной работы.',
    primaryCta: 'Бесплатный разбор',
    secondaryCta: 'Написать в Telegram',
    note: 'Разбор 30 минут, бесплатно. План остаётся у вас.',
    stats: [
      { value: '48', label: 'инструментов магазина в чате на трёх площадках' },
      { value: '22 000', label: 'товаров в сверке остатков склада' },
      { value: '11', label: 'агентов управления рекламой' },
    ],
  },
  services: {
    eyebrow: 'Что делаю',
    title: 'Восемь задач, которые снимаю с продавца',
    items: [
      { icon: 'profit', title: 'Прибыль по каждому артикулу', body: 'Комиссия, логистика, хранение, штрафы, реклама и себестоимость в одной таблице. Видно, какие товары зарабатывают, а какие съедают деньги.' },
      { icon: 'reports', title: 'Отчёты и финансы в одной системе', body: 'Деньги, бюджет, заявки на оплату и сверка собираются сами. В одной торговой компании отчёт стал собираться за полчаса вместо недель.' },
      { icon: 'stock', title: 'Остатки без ручной сверки', body: 'Склад, магазин и площадки сверяются сами, чтобы не продать то, чего нет. В одном из проектов так сводится каталог около 22 000 товаров.' },
      { icon: 'ads', title: 'Реклама под контролем', body: 'Ночью программа считает показатели и готовит предложения по ставкам. Утром вы получаете сводку и принимаете решение.' },
      { icon: 'reviews', title: 'Ответы на отзывы и вопросы', body: 'Программа готовит ответ по вашим правилам. Вы подтверждаете его или включаете отправку без проверки.' },
      { icon: 'chat', title: 'Магазин в чате', body: 'Вместо обхода трёх кабинетов задаёте вопрос и получаете ответ словами. Любое изменение идёт в два шага: сначала предпросмотр, потом отправка.' },
      { icon: 'agents', title: 'ИИ-агенты под вашу рутину', body: 'Сверки, проверки, еженедельные отчёты. Повторяющееся делает агент, решение остаётся за вами.' },
      { icon: 'photo', title: 'Фото и инфографика карточек', body: 'Главные фото и инфографика для карточек с помощью нейросетей. Так сделаны главные фото нашего магазина.' },
    ],
  },
  cases: {
    eyebrow: 'Кейсы',
    title: 'Что уже работает',
    slugs: ['store-to-claude', 'seller-workspace', 'stock-sync', 'ads-agents', 'content-factory', 'finance-loop'],
  },
  companies: {
    eyebrow: 'Компаниям',
    title: 'Для торговых и производственных компаний',
    lead: 'То же самое для компаний на 10-200 человек, где учёт и отчёты держатся на ручной работе.',
    items: [
      { id: 'kontur', title: '1С и площадки, сверка выплат', body: 'Отчёты Wildberries, Ozon и Маркета сами попадают в 1С по расписанию и сходятся с выплатами. Расхождения видны сразу, данные остаются у вас.', price: '150-600 тыс. ₽', support: 'сопровождение 15-50 тыс. ₽ в месяц' },
      { id: 'finance', title: 'Первичка и управленческий отчёт', body: 'Счета и акты из почты уходят в 1С с проверкой по справочникам, спорное попадает бухгалтеру в очередь. Отчёт собирается за полчаса, формулы в нём меняет сам финансист.', price: '150-500 тыс. ₽', support: 'сопровождение 10-60 тыс. ₽ в месяц' },
      { id: 'it-director', title: 'ИТ-директор на аутсорсе', body: 'Аудит серверов, сервисов и доступов за неделю, только на чтение. Потом держу бэкапы, мониторинг, доступы и приёмку подрядчиков за фиксированную плату.', price: '90-300 тыс. ₽ за аудит', support: 'дальше 80-200 тыс. ₽ в месяц' },
      { id: 'training', title: 'Обучение вайбкодингу', body: 'Учу специалистов компании делать свои рабочие приложения с ИИ и доводить их до запуска. На моих проектах финансист сам вносит 43 % изменений в свою систему, специалист по товару 73 %.', price: 'цена после разбора', support: 'программа под ваших специалистов' },
    ],
  },
  how: {
    eyebrow: 'Как работаем',
    title: 'Четыре шага от разбора до работающей системы',
    steps: [
      { title: 'Бесплатный разбор', body: '30 минут. Смотрим ваш кабинет и то, как устроена работа. Если моя схема вам не подходит, скажу сразу.' },
      { title: 'План', body: 'Что автоматизировать первым, сколько это стоит и что даст. План остаётся у вас, даже если внедрять будете сами.' },
      { title: 'Внедрение по этапам', body: 'Договор с ИП, оплата по этапам. Каждый этап вы принимаете на своих данных.' },
      { title: 'Сопровождение', body: 'Площадки меняют API и правила. Слежу, чиню, добавляю новое.' },
    ],
    standardLink: { label: 'Работаю по открытому стандарту AIAS', href: '/ru/standard' },
  },
  pricing: {
    eyebrow: 'Цены',
    title: 'Сколько стоит',
    note: 'Цены для компаний указаны в блоке выше.',
    items: [
      { title: 'Разбор', price: 'бесплатно', body: '30 минут: что автоматизировать первым и с чего начать.' },
      { title: 'Внедрение', price: 'от 200 тыс. ₽', body: 'Для продавцов. Оплата по этапам, точная цена после разбора.' },
      { title: 'Сопровождение', price: 'от 15 тыс. ₽ в месяц', body: 'Площадки меняют API, правила и отчёты. Система продолжает работать.' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что обычно спрашивают',
    items: [
      { q: 'Мои данные куда-то уходят?', a: 'Нет. Система ставится на ваш сервер или в ваш аккаунт, данные лежат у вас. Код, документация и доступы тоже остаются у вас.' },
      { q: 'Нужно отдавать доступ к кабинету?', a: 'Ключи доступа выпускаете вы сами. Там, где мне нужно только смотреть цифры, ключ даёт право только на чтение. После работы его можно отозвать.' },
      { q: 'А вы один?', a: 'Один. Поэтому всё сделанное остаётся у вас: код, документация, доступы. Поддерживать систему сможет и другой инженер.' },
      { q: 'У нас нетиповая 1С с доработками', a: 'Почти у всех так. Обмен идёт через API или OData, доработки конфигурации не трогаю.' },
      { q: 'Площадки постоянно меняют API', a: 'Поэтому ответы площадок сохраняются как есть, и расчёт идёт из них. Когда площадка меняет формат, переписывается один разбор, история не теряется.' },
      { q: 'Сколько занимает внедрение?', a: 'Зависит от числа площадок и процессов. Например, управленческий финансовый контур собран за месяц. Точный срок называю после разбора.' },
    ],
  },
  lead: {
    eyebrow: 'Заявка',
    title: 'Бесплатный разбор',
    sub: 'Напишите, на каких площадках продаёте и что отнимает больше всего времени. Отвечу в течение дня.',
    answerLabel: 'Что отнимает больше всего времени?',
    answerPlaceholder: 'Например: каждую неделю вручную сводим прибыль по артикулам в таблице',
    fieldsNote: 'Необязательно, но поможет подготовиться к разбору.',
    fields: [{ key: 'marketplaces', label: 'Площадки', placeholder: 'Wildberries, Ozon, Маркет' }],
  },
}
```

- [ ] **Step 5: Экспорт и markdown**

`app/data/avtomatizaciya/index.ts`:

```ts
import { ru } from './ru'

export type { AvtomatizaciyaCopy, CompanyTile, Price, Service, ServiceIcon, Stat, Step } from './types'

/** Источник заявки и имя страницы; дублируется строкой в lib/evolution/schemas.ts. */
export const AVTOMATIZACIYA_SLUG = 'avtomatizaciya' as const
export const avtomatizaciyaPath = '/avtomatizaciya'
export const avtomatizaciya = ru

// Markdown страницы для модалки «документация для LLM» и для /llms.txt.
export function buildAvtomatizaciyaMarkdown(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const c = ru
  return [
    `## ${c.hero.title}`,
    '',
    `URL: ${baseUrl}${avtomatizaciyaPath}`,
    '',
    c.hero.sub,
    '',
    `### ${c.services.title}`,
    ...c.services.items.map((s) => `- **${s.title}.** ${s.body}`),
    '',
    `### ${c.companies.title}`,
    ...c.companies.items.map((t) => `- **${t.title}** (${t.price}; ${t.support}). ${t.body}`),
    '',
    `### ${c.how.title}`,
    ...c.how.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`),
    '',
    `### ${c.pricing.title}`,
    ...c.pricing.items.map((p) => `- **${p.title}:** ${p.price}. ${p.body}`),
    '',
    `### ${c.faq.title}`,
    ...c.faq.items.map((f) => `- **${f.q}** ${f.a}`),
    '',
  ].join('\n')
}
```

- [ ] **Step 6: Тест проходит**

Run: `npx vitest run app/data/avtomatizaciya`
Expected: PASS, 7 tests.

- [ ] **Step 7: Коммит**

```bash
git add app/data/avtomatizaciya
git commit -m "Данные одностраничника /avtomatizaciya: тексты, тип и проверки"
```

---

### Task 2: Новый источник заявки

**Files:**
- Modify: `lib/evolution/schemas.ts:5` (`LEAD_LANDINGS`)
- Create: `app/data/lead-fields.ts`
- Modify: `app/api/evolution/lead/route.ts:2,64-68`
- Modify: `app/data/landings/landings.test.ts` (тест «слаги лендингов совпадают со слагами в схеме заявки»)
- Test: `app/data/lead-fields.test.ts`

- [ ] **Step 1: Падающий тест**

`app/data/lead-fields.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { LEAD_LANDINGS, leadSourceSchema } from '@/lib/evolution/schemas'
import { landingCopy } from '@/app/data/landings'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya } from '@/app/data/avtomatizaciya'
import { leadFieldsFor } from './lead-fields'

describe('источник заявки', () => {
  it('схема принимает заявку с новой страницы', () => {
    expect(leadSourceSchema.safeParse({ landing: AVTOMATIZACIYA_SLUG }).success).toBe(true)
  })

  it('новая страница отдаёт свои необязательные поля', () => {
    expect(leadFieldsFor(AVTOMATIZACIYA_SLUG)).toBe(avtomatizaciya.lead.fields)
  })

  it('старый лендинг отдаёт свои поля, как раньше', () => {
    expect(leadFieldsFor('kontur')).toBe(landingCopy.kontur.lead.fields)
  })

  it('для каждого источника схемы поля находятся без ошибки', () => {
    for (const landing of LEAD_LANDINGS) expect(() => leadFieldsFor(landing)).not.toThrow()
  })
})
```

- [ ] **Step 2: Тест падает**

Run: `npx vitest run app/data/lead-fields.test.ts`
Expected: FAIL — `Failed to resolve import "./lead-fields"`.

- [ ] **Step 3: Источник в схеме**

В `lib/evolution/schemas.ts` заменить строку 5:

```ts
export const LEAD_LANDINGS = ['kontur', 'it-director', 'agent', 'finance', 'avtomatizaciya'] as const
```

- [ ] **Step 4: Поля по источнику**

`app/data/lead-fields.ts`:

```ts
import { landingCopy, type LeadField } from '@/app/data/landings'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya } from '@/app/data/avtomatizaciya'
import type { LeadSource } from '@/lib/evolution/schemas'

// Подписи необязательных полей заявки по источнику: клиент присылает только ключи,
// подписи для уведомления берутся из данных страницы.
export function leadFieldsFor(landing: LeadSource['landing']): readonly LeadField[] | undefined {
  if (landing === AVTOMATIZACIYA_SLUG) return avtomatizaciya.lead.fields
  return landingCopy[landing].lead.fields
}
```

- [ ] **Step 5: Роут заявки**

В `app/api/evolution/lead/route.ts`:
- строку `import { landingCopy } from '@/app/data/landings'` заменить на `import { leadFieldsFor } from '@/app/data/lead-fields'`;
- вызов в `details` заменить на:

```ts
    details: leadDetailRows(
      parsed.data.details,
      parsed.data.source ? leadFieldsFor(parsed.data.source.landing) : undefined,
    ),
```

- [ ] **Step 6: Сверка слагов в тесте лендингов**

В `app/data/landings/landings.test.ts` тест «слаги лендингов совпадают со слагами в схеме заявки» заменить на:

```ts
  // Слаги дублируются в схеме заявки (lib не импортирует app/data); тест не даёт им разойтись.
  // Кроме четырёх лендингов в схеме есть одностраничник /avtomatizaciya.
  it('слаги лендингов совпадают со слагами в схеме заявки', () => {
    expect([...LEAD_LANDINGS].sort()).toEqual([...LANDING_SLUGS, 'avtomatizaciya'].sort())
  })
```

- [ ] **Step 7: Все тесты и типы**

Run: `npx vitest run && npx tsc --noEmit`
Expected: все тесты PASS, `tsc` без ошибок.

- [ ] **Step 8: Коммит**

```bash
git add lib/evolution/schemas.ts app/data/lead-fields.ts app/data/lead-fields.test.ts app/api/evolution/lead/route.ts app/data/landings/landings.test.ts
git commit -m "Заявка: источник avtomatizaciya и поля формы по источнику"
```

---

### Task 3: Блоки страницы

Оформление по спеке: страница всегда тёмная, один акцент (`primary`), крупная типографика, один выразительный ход на блок. Все секции — `mx-auto max-w-6xl px-4 md:px-8`, на мобильном одна колонка, без горизонтальной прокрутки.

**Files:**
- Create: `components/avtomatizaciya/hero.tsx`, `services.tsx`, `companies.tsx`, `how.tsx`, `pricing.tsx`, `lead.tsx`

- [ ] **Step 1: Первый экран**

`components/avtomatizaciya/hero.tsx`. `id="hero"` обязателен: по нему плавающая кнопка прячется, пока первый экран виден (`sticky-cta.tsx`).

```tsx
'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'

// Первый экран: заголовок для продавца, две кнопки и полоса из трёх цифр кейсов.
// Цифры и есть выразительный ход экрана: крупно, акцентным цветом, без иллюстраций.
export function Hero({ copy }: { copy: AvtomatizaciyaCopy['hero'] }) {
  const { open } = useLeadDialog()
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:px-8 md:pt-28 md:pb-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-3xl text-base text-muted-foreground md:text-xl">{copy.sub}</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => open()}>
          {copy.primaryCta}
        </Button>
        <TelegramLink
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:border-primary/50 hover:bg-muted"
        >
          <Send className="size-4 text-primary" aria-hidden />
          {copy.secondaryCta}
        </TelegramLink>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{copy.note}</p>
      <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {copy.stats.map((s) => (
          <div key={s.value} className="bg-background/80 p-6 backdrop-blur md:p-8">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-4xl font-bold tracking-tight text-primary md:text-5xl">{s.value}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

- [ ] **Step 2: Услуги**

`components/avtomatizaciya/services.tsx` (имена иконок проверены в установленной lucide-react):

```tsx
import { Bot, Boxes, ChartColumn, FileSpreadsheet, Image, Megaphone, MessageSquareText, MessagesSquare, type LucideIcon } from 'lucide-react'
import type { AvtomatizaciyaCopy, ServiceIcon } from '@/app/data/avtomatizaciya'

const ICONS: Record<ServiceIcon, LucideIcon> = {
  profit: ChartColumn,
  reports: FileSpreadsheet,
  stock: Boxes,
  ads: Megaphone,
  reviews: MessageSquareText,
  chat: MessagesSquare,
  agents: Bot,
  photo: Image,
}

// Восемь услуг сеткой: одна колонка на телефоне, две на планшете, четыре на широком экране.
// Номер карточки крупно и бледно в углу: ход блока, по нему глаз идёт по сетке.
export function Services({ copy }: { copy: AvtomatizaciyaCopy['services'] }) {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {copy.items.map((s, i) => {
          const Icon = ICONS[s.icon]
          return (
            <li
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/40"
            >
              <span aria-hidden className="absolute top-3 right-4 font-mono text-5xl font-bold text-foreground/5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Icon className="size-6 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Компании**

`components/avtomatizaciya/companies.tsx`:

```tsx
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Четыре плитки для компаний: суть и вилка цены. Цена крупно внизу плитки: ход блока.
// id плитки - якорь: со старых страниц и из рекламы можно вести прямо на направление.
export function Companies({ copy }: { copy: AvtomatizaciyaCopy['companies'] }) {
  return (
    <section id="companies" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{copy.lead}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {copy.items.map((t) => (
          <li
            key={t.id}
            id={`companies-${t.id}`}
            className="flex scroll-mt-28 flex-col rounded-2xl border border-border bg-card/60 p-6 md:p-8"
          >
            <h3 className="text-xl font-semibold tracking-tight">{t.title}</h3>
            <p className="mt-3 flex-1 text-sm text-muted-foreground md:text-base">{t.body}</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-2xl font-bold tracking-tight text-primary">{t.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.support}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Как работаем**

`components/avtomatizaciya/how.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Четыре шага линией: крупный номер шага - ход блока. Под шагами ссылка на стандарт
// вместо прежнего квиза (решение 24.10).
export function How({ copy }: { copy: AvtomatizaciyaCopy['how'] }) {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
        {copy.steps.map((s, i) => (
          <li key={s.title} className="border-t-2 border-primary/60 pt-4">
            <span className="font-mono text-4xl font-bold text-primary">{i + 1}</span>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
      <Link
        href={copy.standardLink.href}
        className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        {copy.standardLink.label}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  )
}
```

- [ ] **Step 5: Цены**

`components/avtomatizaciya/pricing.tsx`:

```tsx
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'

// Три цены. Первая (бесплатный разбор) выделена рамкой акцента: ход блока.
export function Pricing({ copy }: { copy: AvtomatizaciyaCopy['pricing'] }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {copy.items.map((p, i) => (
          <li
            key={p.title}
            className={
              i === 0
                ? 'rounded-2xl border-2 border-primary bg-primary/5 p-6 md:p-8'
                : 'rounded-2xl border border-border bg-card/60 p-6 md:p-8'
            }
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.title}</h3>
            <p className="mt-3 text-3xl font-bold tracking-tight">{p.price}</p>
            <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">{copy.note}</p>
    </section>
  )
}
```

- [ ] **Step 6: Заявка**

`components/avtomatizaciya/lead.tsx`. `id="form"` обязателен: по нему плавающая кнопка прячется, когда форма на экране.

```tsx
'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { evolutionData } from '@/app/data/evolution'
import { AVTOMATIZACIYA_SLUG, type AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { LeadForm } from '@/components/evolution/lead-form'
import { TelegramLink } from '@/components/analytics/telegram-link'
import { contacts } from '@/lib/landing/contacts'

/** Форма главной с вопросом этой страницы вместо вопроса главной. */
export function leadFormCopy(copy: AvtomatizaciyaCopy['lead']) {
  const base = evolutionData.ru.finale.form
  return {
    ...base,
    fields: { ...base.fields, answer: copy.answerLabel },
    placeholders: { ...base.placeholders, answer: copy.answerPlaceholder },
  }
}

// startedAt от монтирования: антибот-таймер роута отсчитывает от него (как в lead-section.tsx).
export function Lead({ copy }: { copy: AvtomatizaciyaCopy['lead'] }) {
  const [startedAt] = useState(() => Date.now())
  const form = leadFormCopy(copy)
  return (
    <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{copy.sub}</p>
          <TelegramLink
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition hover:border-primary/50 hover:bg-muted"
          >
            <Send className="size-3.5 text-primary" aria-hidden />
            <span>{form.telegramCta}</span>
          </TelegramLink>
        </div>
        <div id="form" className="min-w-0 scroll-mt-28 lg:col-span-7">
          <LeadForm
            copy={form}
            lang="ru"
            startedAt={startedAt}
            source={{ landing: AVTOMATIZACIYA_SLUG }}
            fields={copy.fields}
            fieldsNote={copy.fieldsNote}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Типы**

Run: `npx tsc --noEmit`
Expected: без ошибок. Если `LeadForm` не принимает `copy` с переопределёнными полями из-за `as const` в данных главной — привести тип: `const form: EvolutionData['finale']['form'] = leadFormCopy(copy)` с импортом `type EvolutionData` из `@/app/data/evolution` и повторить.

- [ ] **Step 8: Коммит**

```bash
git add components/avtomatizaciya
git commit -m "Блоки одностраничника /avtomatizaciya"
```

---

### Task 4: Страница, маршрут, карта сайта

**Files:**
- Create: `components/avtomatizaciya/page.tsx`, `app/avtomatizaciya/page.tsx`
- Modify: `app/sitemap.ts`, `app/llms.txt/route.ts`

- [ ] **Step 1: Сборка страницы**

`components/avtomatizaciya/page.tsx`:

```tsx
import { evolutionData } from '@/app/data/evolution'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya, avtomatizaciyaPath, buildAvtomatizaciyaMarkdown } from '@/app/data/avtomatizaciya'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LandingCases } from '@/components/landings/landing-cases'
import { Faq } from '@/components/landings/faq'
import { Hero } from './hero'
import { Services } from './services'
import { Companies } from './companies'
import { How } from './how'
import { Pricing } from './pricing'
import { Lead, leadFormCopy } from './lead'

// Одна лента: первый экран → услуги → кейсы → компании → как работаем → цены → вопросы → заявка.
// Обёртка с классом dark держит страницу тёмной при любой теме сайта (спека, «Внешний вид»).
export function AvtomatizaciyaPage() {
  const c = avtomatizaciya
  const data = evolutionData.ru
  const navItems = [
    { id: 'services', label: c.nav.services },
    { id: 'cases', label: c.nav.cases },
    { id: 'companies', label: c.nav.companies },
    { id: 'pricing', label: c.nav.pricing },
    { id: 'faq', label: c.nav.faq },
  ]
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <HtmlLang lang="ru" />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider
          copy={leadFormCopy(c.lead)}
          lang="ru"
          defaultSource={{ landing: AVTOMATIZACIYA_SLUG }}
          fields={c.lead.fields}
          fieldsNote={c.lead.fieldsNote}
        >
          <main className="relative z-[1] min-h-screen" lang="ru">
            <HeaderNav
              lang="ru"
              brand={data.brand}
              owner={data.footer.owner}
              nav={{ ...data.nav, cta: c.nav.cta }}
              labels={data.labels}
              items={navItems}
              llmMarkdown={buildAvtomatizaciyaMarkdown()}
              anchorBase={avtomatizaciyaPath}
              minimal
            />
            <Hero copy={c.hero} />
            <Services copy={c.services} />
            <LandingCases copy={c.cases} slugs={c.cases.slugs} />
            <Companies copy={c.companies} />
            <How copy={c.how} />
            <Pricing copy={c.pricing} />
            <Faq copy={c.faq} />
            <Lead copy={c.lead} />
            <Footer data={data} />
            <StickyCta label={c.nav.cta} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </div>
  )
}
```

Примечание: `leadFormCopy` экспортируется из клиентского модуля `lead.tsx`. Если сборка ругается на вызов функции клиентского модуля из серверного компонента, перенести `leadFormCopy` в `app/data/avtomatizaciya/lead-form-copy.ts` (без `'use client'`) и импортировать оттуда в оба места.

- [ ] **Step 2: Маршрут и метаданные**

Перед кодом: `ls node_modules/next/dist/docs/01-app` и сверить раздел про `metadata` в App Router — экспорт `metadata` из `page.tsx`, как в `app/kontur/page.tsx`.

`app/avtomatizaciya/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { evolutionData } from '@/app/data/evolution'
import { avtomatizaciya, avtomatizaciyaPath } from '@/app/data/avtomatizaciya'
import { AvtomatizaciyaPage } from '@/components/avtomatizaciya/page'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
const url = `${baseUrl}${avtomatizaciyaPath}`
const { title, description } = avtomatizaciya.meta

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'ru_RU', url, title, description, siteName: evolutionData.ru.brand },
  twitter: { card: 'summary_large_image', title, description },
}

export default function Page() {
  return <AvtomatizaciyaPage />
}
```

- [ ] **Step 3: Карта сайта**

В `app/sitemap.ts`:
- добавить импорт `import { avtomatizaciyaPath } from "@/app/data/avtomatizaciya";`
- в возвращаемый массив перед `...landings,` вставить:

```ts
    { url: `${baseUrl}${avtomatizaciyaPath}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
```

- [ ] **Step 4: Markdown для LLM**

В `app/llms.txt/route.ts`:
- добавить импорт `import { buildAvtomatizaciyaMarkdown } from '@/app/data/avtomatizaciya'`
- в массив `body` сразу после строки `'',` под `'# Страницы услуг',` вставить `buildAvtomatizaciyaMarkdown(),` перед `...LANDING_SLUGS.map(...)`.

- [ ] **Step 5: Тесты, типы, линтер, сборка**

Run: `npx vitest run && npx tsc --noEmit && npm run lint && npm run build`
Expected: тесты PASS; `tsc` и `eslint` без ошибок; в выводе `next build` есть маршрут `/avtomatizaciya`.

- [ ] **Step 6: Коммит**

```bash
git add components/avtomatizaciya/page.tsx app/avtomatizaciya app/sitemap.ts app/llms.txt/route.ts
git commit -m "Страница /avtomatizaciya: сборка блоков, метаданные, карта сайта"
```

---

### Task 5: Проверка глазами

- [ ] **Step 1: Запуск**

Run: `npm run dev` (в фоне), открыть `http://localhost:3000/avtomatizaciya`.

- [ ] **Step 2: Снимки**

Снять страницу целиком на ширине 375 и 1440 (браузер или `gstack-browse`). Проверить:
- нет горизонтальной прокрутки на 375;
- фон тёмный и при светлой системной теме;
- плавающая кнопка не видна на первом экране и у формы;
- пункты меню шапки ведут к своим блокам;
- карусель показывает шесть кейсов;
- кнопка «Бесплатный разбор» открывает форму с вопросом «Что отнимает больше всего времени?» и полем «Площадки».

- [ ] **Step 3: Заявка без отправки владельцу**

Проверить ответ роута на заявку с новым источником, не отправляя её в Telegram: заполнить поле-ловушку `website`, тогда роут отвечает `{ ok: true, skipped: true }`:

```bash
curl -s -X POST http://localhost:3000/api/evolution/lead -H 'Content-Type: application/json' \
  -d '{"name":"Проверка","contact":"@test","answer":"проверка источника","consent":true,"website":"x","filledAtMs":1,"source":{"landing":"avtomatizaciya"},"details":{"marketplaces":"WB"}}'
```

Expected: `{"ok":true,"skipped":true}` (не `validation`).

- [ ] **Step 4: Снимки собственнику**

Показать снимки собственнику. Правки — отдельными коммитами. Выкладка на сервер — только после его «да».

---

## Вне плана

- Выкладка на сервер и реклама на новую страницу.
- Цена разбора в объявлении на Авито и в карточке услуг.
- Новые кейсы (фотоворонка, finstock).
