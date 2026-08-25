# Кейсы на лендинге: карточки, карусели, страницы кейсов — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить одну инженерную плашку кейса в каждом блоке лендинга на карусель бизнес-карточек «болело → стало», где одна система может появляться в нескольких блоках со своим углом, и добавить отдельные страницы кейсов.

**Architecture:** Данные кейсов живут в новом модуле `app/data/cases/`, отдельно от `app/data/evolution/`, потому что кейс больше не принадлежит блоку. Единица данных — система (13 штук, у каждой одна страница кейса), единица показа — угол (пара «система + блок», 23 штуки) со своими «болело/стало» и характеристиками. Язык-независимая структура в `registry.ts`, тексты в `ru.ts`/`en.ts`, совпадение локалей ловится тестом. Карусель — на CSS scroll-snap без новых зависимостей.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui на Base UI, lucide-react, vitest (`environment: 'node'` — тесты только на данные, DOM недоступен).

**Спека:** `docs/superpowers/specs/2026-08-23-keysy-na-lendinge-design.md`. Матрица «система × блок × заголовок карточки» там зафиксирована — заголовки берутся из неё дословно.

**Ветка:** `feat/landing-cases` (уже создана, спека закоммичена).

---

## Структура файлов

**Создать:**

| Файл | Ответственность |
|---|---|
| `app/data/cases/types.ts` | типы: `CaseMeta`, `CaseAngle`, `CaseDetail`, `CaseCopy`, `Chip`, `ChipIcon` |
| `app/data/cases/registry.ts` | `CASE_SLUGS`, `caseMeta` — структура без языка: тип, статус, блоки, ссылки, файлы скриншотов |
| `app/data/cases/ru.ts` | русские тексты всех систем |
| `app/data/cases/en.ts` | английское зеркало |
| `app/data/cases/index.ts` | выборки: `anglesForBlock`, `getCase`, `casePath`, `isCaseSlug` |
| `app/data/cases/cases.test.ts` | тесты целостности данных |
| `components/evolution/chip-icons.ts` | словарь `ChipIcon → LucideIcon` |
| `components/evolution/case-card.tsx` | карточка кейса |
| `components/evolution/case-carousel.tsx` | карусель с автопрокруткой |
| `components/cases/case-diagram.tsx` | схема «источники → система → результат» |
| `components/cases/case-facts.tsx` | липкая панель фактов |
| `components/cases/case-page.tsx` | компоновка страницы кейса |
| `components/cases/json-ld-case.tsx` | JSON-LD страницы кейса |
| `app/[lang]/cases/[slug]/page.tsx` | маршрут страницы кейса |

**Изменить:** `app/data/evolution/types.ts`, `app/data/evolution/{ru,en}.ts`, `components/evolution/block-section.tsx`, `components/evolution/evolution-page.tsx`, `components/evolution/exhibits.tsx`, `components/evolution/header-nav.tsx`, `lib/evolution/metadata.ts`, `lib/evolution/llms-markdown.ts`, `app/sitemap.ts`, `next.config.mjs`, `README.md`.

**Удалить:** `components/evolution/case-plaque.tsx`.

---

## Task 1: Типы, реестр, выборки и четыре многоугольные системы

Начинаем с систем, у которых углов больше одного, — они задают форму данных. Остальные девять добавляются в Task 2.

**Files:**
- Create: `app/data/cases/types.ts`, `app/data/cases/registry.ts`, `app/data/cases/ru.ts`, `app/data/cases/en.ts`, `app/data/cases/index.ts`
- Test: `app/data/cases/cases.test.ts`

- [ ] **Step 1: Написать типы**

Создать `app/data/cases/types.ts`:

```ts
// Типы кейсов. Кейс принадлежит не блоку, а набору «углов»: одна система
// приносит пользу по нескольким постулатам страницы, и в каждом блоке у неё
// своё «болело → стало». Язык-независимая часть — в registry.ts, тексты —
// в ru.ts/en.ts, совпадение локалей проверяется тестом.

import type { EvolutionData } from '@/app/data/evolution/types'

/** Ключ блока лендинга: 'system' | 'money' | 'decisions' | 'automation' | 'speed' | 'resources'. */
export type BlockKey = keyof EvolutionData['blocks']

/** `internal` — обезличенная клиентская система, `product` — свой продукт, `oss` — открытый код. */
export type CaseKind = 'internal' | 'product' | 'oss'

export type CaseStatus = 'production' | 'pilot'

/** Закрытый словарь иконок чипов: ключ, а не подбор регуляркой по подписи. */
export type ChipIcon = 'scale' | 'time' | 'people' | 'replaced' | 'money' | 'trust' | 'auto' | 'coverage'

export type CaseLinks = { github?: string; npm?: string; site?: string }

export type CaseMeta = {
  kind: CaseKind
  status: CaseStatus
  /** В каких блоках система показывается; порядок здесь — порядок углов. */
  blocks: readonly BlockKey[]
  links: CaseLinks
  /** Файлы скриншотов; подписи к ним — в текстах, по тому же индексу. */
  screenshots: readonly { src: string }[]
}

/** Пара «характеристика → значение». `note` — HoverCard «как считалось». */
export type Chip = { icon: ChipIcon; label: string; value: string; note?: string }

/** Тонкая шкала под характеристиками. Заполняется только там, где доля настоящая. */
export type CaseBar = { filled: number; total: number; caption: string }

export type CaseAngle = {
  /** Заголовок карточки именно в этом блоке — результат с точки зрения постулата. */
  headline: string
  pain: string
  outcome: string
  chips: Chip[]
  bar?: CaseBar
}

export type CaseDetail = {
  lead: string
  /** Таблица эффектов по постулатам: перечисляет ровно те блоки, что в `meta.blocks`. */
  effects: { block: BlockKey; text: string }[]
  value: string[]
  diagramNodes: string[]
  diagramNote: string
  /** Вкладки «было руками / стало кнопкой» — только там, где это часть истории. */
  before?: string[]
  after?: string
  how: string[]
  owner: string
  /** Липкая панель: срок, кто ведёт, что заменило и прочее. */
  facts: { label: string; value: string }[]
  stack: string[]
  /** По индексу совпадает с `meta.screenshots`. */
  screenshots: { alt: string; caption: string }[]
  metaTitle: string
  metaDescription: string
}

export type CaseCopy = {
  /** Имя системы: страница кейса, хлебные крошки, пометка связи углов. */
  title: string
  kindLabel: string
  statusLabel: string
  angles: Partial<Record<BlockKey, CaseAngle>>
  detail: CaseDetail
}
```

- [ ] **Step 2: Написать реестр с четырьмя системами**

Создать `app/data/cases/registry.ts`:

```ts
// Язык-независимая структура кейсов: какие системы есть, в каких блоках
// показываются, куда ведут ссылки, какие файлы скриншотов подложены.
// Единственный источник правды о наборе углов — тексты обязаны ему соответствовать
// (проверяется в cases.test.ts).

import type { CaseMeta } from './types'

/** Порядок здесь задаёт порядок карточек внутри карусели любого блока. */
export const CASE_SLUGS = [
  'finance-loop',
  'data-platform',
  'product-portal',
  'project-generator',
] as const

export type CaseSlug = (typeof CASE_SLUGS)[number]

export const caseMeta: Record<CaseSlug, CaseMeta> = {
  'finance-loop': {
    kind: 'internal',
    status: 'production',
    blocks: ['system', 'money', 'speed', 'resources'],
    links: {},
    screenshots: [],
  },
  'data-platform': {
    kind: 'internal',
    status: 'production',
    blocks: ['system', 'money', 'decisions'],
    links: {},
    screenshots: [],
  },
  'product-portal': {
    kind: 'internal',
    status: 'production',
    blocks: ['automation', 'speed', 'resources'],
    links: {},
    screenshots: [],
  },
  'project-generator': {
    kind: 'oss',
    status: 'production',
    blocks: ['speed', 'resources'],
    links: { github: 'https://github.com/webkoth/starter-template-app' },
    screenshots: [],
  },
}
```

- [ ] **Step 3: Написать выборки**

Создать `app/data/cases/index.ts`:

```ts
import type { Lang } from '@/app/data/evolution/types'
import { ru } from './ru'
import { en } from './en'
import { CASE_SLUGS, caseMeta, type CaseSlug } from './registry'
import type { BlockKey, CaseAngle, CaseCopy, CaseMeta } from './types'

export type { BlockKey, CaseAngle, CaseBar, CaseCopy, CaseDetail, CaseKind, CaseMeta, Chip, ChipIcon } from './types'
export { CASE_SLUGS, caseMeta } from './registry'
export type { CaseSlug } from './registry'

export const casesCopy: Record<Lang, Record<CaseSlug, CaseCopy>> = { ru, en }

/** Кейсы живут в `/[lang]/cases/[slug]` — тот же контур, что CV. */
export const casePath = (lang: Lang, slug: CaseSlug): string => `/${lang}/cases/${slug}`

export const isCaseSlug = (v: unknown): v is CaseSlug =>
  typeof v === 'string' && (CASE_SLUGS as readonly string[]).includes(v)

export type BlockAngle = {
  slug: CaseSlug
  meta: CaseMeta
  copy: CaseCopy
  angle: CaseAngle
  /** Сколько ещё блоков закрывает та же система — для пометки связи. */
  otherBlocks: number
}

/** Карточки одного блока в порядке CASE_SLUGS. */
export function anglesForBlock(lang: Lang, block: BlockKey): BlockAngle[] {
  const copies = casesCopy[lang]
  const out: BlockAngle[] = []
  for (const slug of CASE_SLUGS) {
    const meta = caseMeta[slug]
    if (!meta.blocks.includes(block)) continue
    const copy = copies[slug]
    const angle = copy.angles[block]
    if (!angle) continue
    out.push({ slug, meta, copy, angle, otherBlocks: meta.blocks.length - 1 })
  }
  return out
}

export function getCase(lang: Lang, slug: CaseSlug): { meta: CaseMeta; copy: CaseCopy } {
  return { meta: caseMeta[slug], copy: casesCopy[lang][slug] }
}
```

- [ ] **Step 4: Написать падающие тесты**

Создать `app/data/cases/cases.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { evolutionBlockOrder } from '@/app/data/evolution'
import { CASE_SLUGS, anglesForBlock, caseMeta, casesCopy, isCaseSlug } from './index'
import type { BlockKey } from './types'

const LANGS = ['ru', 'en'] as const

describe('реестр кейсов', () => {
  it('каждая система описана в обеих локалях', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        expect(casesCopy[lang][slug], `${lang}/${slug}`).toBeDefined()
      }
    }
  })

  it('набор углов в обеих локалях совпадает с registry.blocks', () => {
    for (const slug of CASE_SLUGS) {
      const expected = [...caseMeta[slug].blocks].sort()
      for (const lang of LANGS) {
        const actual = Object.keys(casesCopy[lang][slug].angles).sort()
        expect(actual, `${lang}/${slug}`).toEqual(expected)
      }
    }
  })

  it('в каждом угле 2–3 чипа, шкала не переполнена', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        for (const [block, angle] of Object.entries(casesCopy[lang][slug].angles)) {
          expect(angle!.chips.length, `${lang}/${slug}/${block}`).toBeGreaterThanOrEqual(2)
          expect(angle!.chips.length, `${lang}/${slug}/${block}`).toBeLessThanOrEqual(3)
          if (angle!.bar) {
            expect(angle!.bar.filled).toBeGreaterThan(0)
            expect(angle!.bar.filled).toBeLessThanOrEqual(angle!.bar.total)
          }
        }
      }
    }
  })

  it('у открытого кода есть хотя бы одна ссылка', () => {
    for (const slug of CASE_SLUGS) {
      const meta = caseMeta[slug]
      if (meta.kind !== 'oss') continue
      const links = Object.values(meta.links).filter(Boolean)
      expect(links.length, slug).toBeGreaterThan(0)
    }
  })

  it('подписей скриншотов столько же, сколько файлов', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        expect(casesCopy[lang][slug].detail.screenshots.length, `${lang}/${slug}`).toBe(
          caseMeta[slug].screenshots.length,
        )
      }
    }
  })

  it('таблица эффектов перечисляет ровно блоки системы', () => {
    for (const lang of LANGS) {
      for (const slug of CASE_SLUGS) {
        const expected = [...caseMeta[slug].blocks].sort()
        const actual = casesCopy[lang][slug].detail.effects.map((e) => e.block).sort()
        expect(actual, `${lang}/${slug}`).toEqual(expected)
      }
    }
  })

  it('isCaseSlug отсекает чужое', () => {
    expect(isCaseSlug('finance-loop')).toBe(true)
    expect(isCaseSlug('nope')).toBe(false)
    expect(isCaseSlug(42)).toBe(false)
  })

  it('anglesForBlock отдаёт углы в порядке CASE_SLUGS', () => {
    for (const block of evolutionBlockOrder) {
      const slugs = anglesForBlock('ru', block as BlockKey).map((a) => a.slug)
      const ordered = CASE_SLUGS.filter((s) => slugs.includes(s))
      expect(slugs).toEqual([...ordered])
    }
  })
})
```

- [ ] **Step 5: Запустить тесты и убедиться, что они падают**

Run: `npm run test -- app/data/cases`
Expected: FAIL — `Cannot find module './ru'`, файлы текстов ещё не созданы.

- [ ] **Step 6: Написать русские тексты четырёх систем**

Создать `app/data/cases/ru.ts`. Ниже — финансовый контур целиком; это **образец**, по которому пишутся остальные. Заголовки углов берутся из таблицы спеки дословно.

```ts
// Русские тексты кейсов. Клиентские системы обезличены: без имени клиента,
// без имён сотрудников, без оборотов. Роли — «финансовый аналитик»,
// «специалист по товару», «контент-менеджер», «оператор склада».
// EN-зеркало — в `en.ts`.

import type { CaseCopy } from './types'
import type { CaseSlug } from './registry'

export const ru: Record<CaseSlug, CaseCopy> = {
  'finance-loop': {
    title: 'Управленческий финансовый контур',
    kindLabel: 'Внутренняя система',
    statusLabel: 'В проде',
    angles: {
      system: {
        headline: 'Все цифры компании — в одной системе',
        pain: 'Цифры жили в десяти таблицах, личках и головах трёх человек. При уходе ключевых людей терялись и доступы, и контекст.',
        outcome: 'Один источник: движение средств, бюджет, заявки, сверка и справочники в одном приложении с ролями и правами.',
        chips: [
          { icon: 'time', label: 'Срок', value: 'месяц' },
          { icon: 'replaced', label: 'Заменило', value: 'десять таблиц и переписку' },
          { icon: 'coverage', label: 'Охват', value: 'ДДС, БДР, заявки, сверка' },
        ],
      },
      money: {
        headline: 'Видно деньги: остаток, прибыль, кассовый разрыв',
        pain: 'Никто не знал точно реальный остаток на счетах и чистую прибыль сегодня. Заявки согласовывались в чатах, риск кассового разрыва висел постоянно.',
        outcome: 'Движение средств, бюджет и сверка на одном экране, заявки идут по маршруту согласования, и цифры на экране сходятся.',
        chips: [
          {
            icon: 'money',
            label: 'Рыночная альтернатива',
            value: '3–8 млн ₽',
            note: 'Ориентир заказной разработки одного базового финансового модуля: 7–13 недель и 3–8 млн ₽ по публичным оценкам подрядчиков. Это оценка рынка, а не наша цена.',
          },
          { icon: 'trust', label: 'Доверие', value: 'сверка с банком' },
        ],
      },
      speed: {
        headline: 'Отчёт за полчаса вместо недель',
        pain: 'Управленческую отчётность собирали руками неделями: выгрузки, сведение, перепроверка.',
        outcome: 'Отчёт собирается за полчаса, данные подтягиваются сами, расхождения по бюджету видно сразу.',
        chips: [
          { icon: 'time', label: 'Было → стало', value: 'недели → полчаса' },
          { icon: 'auto', label: 'Сбор данных', value: 'подтягивается сам' },
        ],
      },
      resources: {
        headline: 'Развивает финансист, а не программист',
        pain: 'Каждая доработка упиралась в наём и очередь к разработчику: рост зависел от того, найдётся ли человек.',
        outcome: 'Финансовый аналитик дорабатывает систему сам, инженер отвечает за ревью и вывод в production.',
        chips: [
          { icon: 'people', label: 'Ведёт', value: 'финансовый аналитик' },
          { icon: 'time', label: 'Путь специалиста', value: 'месяц до расчёта маржинальности' },
        ],
        bar: {
          filled: 339,
          total: 784,
          caption: '43 % изменений вносит специалист компании, а не программист',
        },
      },
    },
    detail: {
      lead: 'Управленческий финансовый контур торговой компании: движение денежных средств, бюджет и расхождения по нему, заявки на оплату с маршрутом согласования, «Итоги дня», сверка и справочники. Построен за месяц силами финансового аналитика компании и одного инженера.',
      effects: [
        { block: 'system', text: 'Собрал все финансовые цифры в один источник с ролями и правами' },
        { block: 'money', text: 'Остаток, прибыль и сверка видны на одном экране' },
        { block: 'speed', text: 'Отчётность собирается за полчаса вместо недель' },
        { block: 'resources', text: 'Систему развивает финансист: 43 % изменений — его' },
      ],
      value: [
        'Реальный остаток на счетах виден в любой момент, а не после сведения выгрузок.',
        'Заявка на оплату идёт по маршруту согласования, а не теряется в переписке.',
        'Расхождения с бюджетом видно в момент их появления.',
        'Рост системы не упирается в наём разработчика.',
      ],
      diagramNodes: ['Банковские выписки', 'Справочники ДДС и БДР', 'Финансовый контур', 'Заявки и согласования', 'Отчётность и «Итоги дня»'],
      diagramNote: 'Автотесты на расчёты и маршруты согласования стоят между вводом и отчётом: цифра в отчёте не разойдётся с источником незаметно.',
      how: [
        'Приложение построено генератором проектов, поэтому промышленный контур доставки был готов на следующий день после первого коммита.',
        'Предметную часть ведёт финансовый аналитик через Claude Code в жёстких рамках стека; в production код попадает только через ревью инженера.',
      ],
      owner: 'Финансовый аналитик компании. Инженер отвечает за ревью, данные, отказы и вывод в production.',
      facts: [
        { label: 'Тип', value: 'Внутренняя система' },
        { label: 'Статус', value: 'В проде' },
        { label: 'Срок', value: 'месяц до рабочей системы' },
        { label: 'Ведёт', value: 'финансовый аналитик' },
        { label: 'Заменило', value: 'десять таблиц и переписку' },
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Playwright', 'GitHub Actions', 'PM2'],
      screenshots: [],
      metaTitle: 'Кейс: управленческий финансовый контур за месяц | Минас Саркисян',
      metaDescription:
        'Движение средств, бюджет, заявки с согласованием и сверка в одной системе. Построен за месяц силами финансового аналитика компании; 43 % изменений вносит он сам.',
    },
  },

  // 'data-platform', 'product-portal', 'project-generator' — по тому же образцу.
}
```

Остальные три системы этого задания пишутся по той же форме. Входные данные зафиксированы:

**`data-platform`** — заголовки углов: `system` «Один источник правды вместо своих отчётов у каждого», `money` «Выплаты и комиссии площадки сходятся до копейки», `decisions` «Цифра сверена с первоисточником до единицы товара». Источник фактуры: `docs/how-it-works.md` озера данных (семь звеньев: инфраструктура, конфигурация, сбор из 33 доменов, слои `raw → staging → core → marts`, оркестрация, четыре двери доступа, эксплуатация), `verification.md` (сверено до единицы и до копейки), `analyst-guide.md`, `app-connection.md`. Обязательно передать, что это **платформа**, а не хранилище продаж: сбор по расписанию, архив сырья до разбора (площадка хранит историю 90 дней), витрины наружу через четыре двери — BI и прямой SQL, REST API для приложений, Claude Code, MCP-инструменты для агентов. `diagramNodes`: `['API площадок', 'Архив сырья', 'raw → staging → core', 'Витрины', 'BI · REST API · Claude · MCP-агенты']`. Чип `coverage` = «4 двери наружу», чип `trust` = «сверка до единицы товара». Шкалы нет.

**`product-portal`** — заголовки: `automation` «Каталог, этикетки и PDF — одной кнопкой», `speed` «Замена внешней PLM за дни», `resources` «Ведёт специалист по товару: 73 % изменений — его». Источник: закрытая заметка `business-os` со сводкой по репозиториям (репозитория локально нет). `detail.before` = `['Открыть внешнюю PLM-систему', 'Найти товар, скопировать атрибуты', 'Вставить в шаблон этикетки', 'Сконвертировать картинку под формат', 'Собрать PDF, отправить на печать']`, `detail.after` = `'Печать этикетки'` — переносится из `app/data/evolution/ru.ts:210-221`. Шкала угла `resources`: `{ filled: 67, total: 92, caption: '73 % изменений вносит специалист по товару' }` — 67 из 92 принадлежат специалисту по товару, доля контент-менеджера (11 из 15) относится к другой системе.

**`project-generator`** — заголовки: `speed` «От первого коммита до промышленного контура — один день», `resources` «Семь приложений за месяц без расширения команды». Источник: `README.md` стартового шаблона (`webkoth/starter-template-app`). Обязательно назвать, что это настроенное рабочее место, а не только генератор: стек, база, вход с ролями, тесты, CI, два контура с автооткатом, плюс скиллы и команды `/ship`, `/status`, `/logs`, `/reset-dev`, `/request-prod`, `/onboarding`. Шкала угла `speed`: `{ filled: 3, total: 7, caption: 'три из семи приложений вышли в прод в день первого коммита' }`.

Формулировка «без расширения команды» в угле `resources` относится к разделу «со слов владельца» из спеки. Пока владелец её не подтвердил, писать `headline` как «Семь приложений за месяц одной командой» — это факт из git.

- [ ] **Step 7: Написать английское зеркало**

Создать `app/data/cases/en.ts` — та же структура, `Record<CaseSlug, CaseCopy>`, тон «я»-формы как в `app/data/evolution/en.ts`. `kindLabel`: `Internal system` / `Own product` / `Open source`; `statusLabel`: `In production`. Числа и доли те же, подписи чипов переводятся: `Срок → Timeline`, `Ведёт → Maintained by`, `Заменило → Replaced`, `Рыночная альтернатива → Market alternative`, `Охват → Coverage`, `Доверие → Verified against`.

- [ ] **Step 8: Запустить тесты и убедиться, что они проходят**

Run: `npm run test -- app/data/cases`
Expected: PASS, 8 тестов.

- [ ] **Step 9: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 10: Коммит**

```bash
git add app/data/cases
git commit -m "feat(cases): case data module with four multi-angle systems"
```

---

> **Правки после ревью Task 1** (внесены до Task 2, учтены в коде задач 3 и 7):
> `before`/`after` в `CaseDetail` сгруппированы в `beforeAfter?: { before, after }`;
> `stack` переехал из `CaseDetail` в `CaseMeta` — это язык-независимые имена собственные;
> `kindLabel`/`statusLabel` убраны из `CaseCopy` и заменены словарями `CASE_KIND_LABELS`
> и `CASE_STATUS_LABELS` (по локали), а строки «Тип» и «Статус» больше не хранятся
> в `detail.facts` — панель фактов выводит их из `meta`; `angles` типизирован
> отображением `CasesCopy`, поэтому лишний или забытый угол — ошибка компиляции,
> а не падение теста; `otherBlocks` стал `BlockKey[]` вместо числа;
> `blocks` — непустой кортеж. Тесты дополнены проверкой структурного совпадения
> RU и EN, запретом ссылок у `kind: 'internal'` и сверкой процента в подписи шкалы
> с `filled/total`.

## Task 2: Остальные девять систем

**Files:**
- Modify: `app/data/cases/registry.ts`, `app/data/cases/ru.ts`, `app/data/cases/en.ts`
- Test: `app/data/cases/cases.test.ts:` (добавляется одна проверка)

- [ ] **Step 1: Добавить проверку баланса блоков**

В `app/data/cases/cases.test.ts` добавить внутрь `describe`:

```ts
  it('в каждом блоке 3–4 карточки', () => {
    for (const block of evolutionBlockOrder) {
      const n = anglesForBlock('ru', block as BlockKey).length
      expect(n, block).toBeGreaterThanOrEqual(3)
      expect(n, block).toBeLessThanOrEqual(4)
    }
  })
```

Правило не косметическое: меньше трёх — карусель бессмысленна, больше четырёх — при автопрокрутке в семь секунд блок растягивается почти на минуту.

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npm run test -- app/data/cases`
Expected: FAIL — блоки `decisions` и `automation` пока пустые, `system` содержит 2 карточки.

- [ ] **Step 3: Дописать реестр**

В `app/data/cases/registry.ts` расширить `CASE_SLUGS` и `caseMeta`:

```ts
export const CASE_SLUGS = [
  'finance-loop',
  'data-platform',
  'product-portal',
  'project-generator',
  'ads-agents',
  'store-to-claude',
  'it-inventory',
  'legacy-db-map',
  'payout-documents',
  'marketplace-knowledge',
  'stock-sync',
  'deploy-from-chat',
  'seller-workspace',
] as const
```

```ts
  'ads-agents': {
    kind: 'internal',
    status: 'production',
    blocks: ['decisions', 'automation'],
    links: {},
    screenshots: [],
  },
  'store-to-claude': {
    kind: 'product',
    status: 'production',
    blocks: ['decisions', 'automation'],
    links: { site: 'https://mcp.hubmarket.ru' },
    screenshots: [],
  },
  'it-inventory': {
    kind: 'internal',
    status: 'production',
    blocks: ['system'],
    links: {},
    screenshots: [],
  },
  'legacy-db-map': {
    kind: 'internal',
    status: 'production',
    blocks: ['system'],
    links: {},
    screenshots: [],
  },
  'payout-documents': {
    kind: 'product',
    status: 'production',
    blocks: ['money'],
    links: { site: 'https://hubmarket.ru' },
    screenshots: [],
  },
  'marketplace-knowledge': {
    kind: 'oss',
    status: 'production',
    blocks: ['decisions'],
    links: { github: 'https://github.com/webkoth/rag-market' },
    screenshots: [],
  },
  'stock-sync': {
    kind: 'internal',
    status: 'production',
    blocks: ['automation'],
    links: {},
    screenshots: [],
  },
  'deploy-from-chat': {
    kind: 'oss',
    status: 'production',
    blocks: ['speed'],
    links: {
      github: 'https://github.com/webkoth/claude-code-plugins',
      npm: 'https://www.npmjs.com/package/@webkoth/mcp-timeweb',
    },
    screenshots: [],
  },
  'seller-workspace': {
    kind: 'oss',
    status: 'production',
    blocks: ['resources'],
    links: { github: 'https://github.com/webkoth/sellerai' },
    screenshots: [],
  },
```

- [ ] **Step 4: Дописать тексты**

Дописать девять записей в `ru.ts` и `en.ts` по образцу из Task 1. Заголовки углов — из таблицы спеки дословно. Входные данные:

| slug | Углы и заголовки | Источник фактуры | Обязательное |
|---|---|---|---|
| `ads-agents` | `decisions` «Ставки меняются по данным: ДРР в плане ≤ 10 %» · `automation` «Ежедневный цикл оператора идёт сам» | `CLAUDE.md` агентов рекламы | ДРР подаётся как **план**, не как достигнутый результат. Обязательно сказать, что любая запись в кабинет площадки идёт только после подтверждения оператора, а KPI считаются по «зрелому окну», потому что статистика дозаливается 5–7 дней. Названия брендов и кабинетов не выносить. |
| `store-to-claude` | `decisions` «Ответ о магазине — словами, без дашборда» · `automation` «Рутинные проверки закрываются вопросом в чат» | `README.md`, `docs/QUICKSTART.md` (`mcp.hubmarket.ru`) | 48 инструментов, три площадки; ключи площадок в базе зашифрованы, ключ от одной не открывает магазины другой; пишущие вызовы — под обязательным подтверждением. Чип `coverage` = «3 площадки, 48 инструментов». |
| `it-inventory` | `system` «Сервисы, доступы и ответственные — в одном месте» | `README.md` учёта ИТ-хозяйства, маршруты `app/(panel)/*` | Разделы: дерево сервисов, матрица доступов, ключи и порталы, задания, проблемы, изменения, аудит. Ценность — уход человека не уносит доступы и контекст. Заменила унаследованную панель. |
| `legacy-db-map` | `system` «Что лежит в унаследованной базе — теперь известно» | `README.md` карты старой базы | Переиспользуемый клиент, CLI для запросов, автогенерируемая карта данных. Внутренние адреса и схему не публиковать. |
| `payout-documents` | `money` «Видно, сколько придёт и сколько отдать налогом» | `README.md` разбора финдокументов | Разбор финансовых документов площадки и расчёт налога самозанятого. |
| `marketplace-knowledge` | `decisions` «Агент отвечает по правилам площадок, а не по памяти» | `CLAUDE.md`, `PLAN.md` (`webkoth/rag-market`) | Открытая база знаний в markdown для LLM-агентов; ссылка на GitHub обязательна. |
| `stock-sync` | `automation` «Остатки склада доезжают в магазин сами» | `README.md` синхронизации остатков | ~22 000 товаров, ежедневный прогон, состояние пересчитывается целиком, поэтому расхождения не копятся. Названия склада и магазина заменить на «фулфилмент-склад» и «интернет-магазин». |
| `deploy-from-chat` | `speed` «Выкат без ручного SSH, прямо из чата» | `README.md` пакета `@webkoth/mcp-timeweb` и плагина `webkoth/claude-code-plugins` | Две ссылки: npm-пакет и плагин. |
| `seller-workspace` | `resources` «Селлер ведёт продажи без найма аналитика» | `README.md` (`webkoth/sellerai`) | Формулировка про «без найма аналитика» относится к разделу «со слов владельца»: до подтверждения описывать как назначение шаблона, а не как измеренный результат. |

- [ ] **Step 5: Запустить тесты**

Run: `npm run test -- app/data/cases`
Expected: PASS, 9 тестов. Счёт по блокам: `system` 4, `money` 3, `decisions` 4, `automation` 4, `speed` 4, `resources` 4.

- [ ] **Step 6: Коммит**

```bash
git add app/data/cases
git commit -m "feat(cases): remaining nine systems, 23 angles total"
```

---

## Task 3: Подписи карточки, словарь иконок и карточка кейса

Подписи добавляются здесь, а не в Task 5, чтобы задача заканчивалась зелёным typecheck: карточка на них ссылается.

**Files:**
- Modify: `app/data/evolution/types.ts:113-125`, `app/data/evolution/ru.ts`, `app/data/evolution/en.ts`
- Create: `components/evolution/chip-icons.ts`, `components/evolution/case-card.tsx`

- [ ] **Step 1: Добавить подписи карточки**

В `app/data/evolution/types.ts` в блок `labels` добавить:

```ts
    /** Подписи карточки кейса. */
    casePain: string
    caseOutcome: string
    caseMore: string
    /** Пометка связи углов; `{n}` подставляется числом. */
    caseAlsoIn: string
```

В `app/data/evolution/ru.ts` в `labels`:

```ts
    casePain: 'Болело',
    caseOutcome: 'Стало',
    caseMore: 'Смотреть кейс',
    caseAlsoIn: 'Та же система даёт эффект ещё по {n} шагам',
```

В `app/data/evolution/en.ts` в `labels`:

```ts
    casePain: 'The pain',
    caseOutcome: 'Now',
    caseMore: 'Open the case',
    caseAlsoIn: 'The same system pays off across {n} more steps',
```

- [ ] **Step 2: Написать словарь иконок**

Создать `components/evolution/chip-icons.ts`:

```ts
import { Boxes, CalendarClock, Coins, Layers, Replace, ShieldCheck, Users, Zap, type LucideIcon } from 'lucide-react'
import type { ChipIcon } from '@/app/data/cases/types'

// Иконка чипа задаётся ключом, а не подбирается регуляркой по подписи: подпись
// переводится, а ключ — нет.
export const CHIP_ICONS: Record<ChipIcon, LucideIcon> = {
  scale: Boxes,
  time: CalendarClock,
  people: Users,
  replaced: Replace,
  money: Coins,
  trust: ShieldCheck,
  auto: Zap,
  coverage: Layers,
}
```

- [ ] **Step 3: Написать карточку**

Создать `components/evolution/case-card.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight, Check, Github, Info, Link2, Package, X } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, casePath, type BlockAngle, type CaseBar } from '@/app/data/cases'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import { CHIP_ICONS } from './chip-icons'

// Шкала доли: всегда 12 делений, независимо от знаменателя, — «339 из 784»
// и «3 из 7» должны читаться одинаково. Заполнено минимум одно деление,
// иначе честная, но маленькая доля выглядит как ноль.
const BAR_CELLS = 12

function CaseBarStrip({ bar }: { bar: CaseBar }) {
  const filled = Math.max(1, Math.round((bar.filled / bar.total) * BAR_CELLS))
  return (
    <div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: BAR_CELLS }, (_, i) => (
          <span key={i} className={i < filled ? 'h-1.5 flex-1 rounded-full bg-primary' : 'h-1.5 flex-1 rounded-full bg-muted'} />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{bar.caption}</p>
    </div>
  )
}

// Карточка кейса: бейдж «тип · статус» → заголовок-результат → «болело/стало»
// знаками без заливки → пары «характеристика → значение» → необязательная шкала
// → пометка связи углов → футер-ссылка. Вся карточка кликабельна растянутой
// ссылкой на заголовке; внешние ссылки поднимаются над ней через relative z-10.
export function CaseCard({
  item,
  lang,
  labels,
}: {
  item: BlockAngle
  lang: Lang
  labels: EvolutionData['labels']
}) {
  const { slug, meta, copy, angle, otherBlocks } = item
  const labelsByKind = CASE_KIND_LABELS[lang]
  const labelsByStatus = CASE_STATUS_LABELS[lang]
  const href = casePath(lang, slug)

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition hover:border-primary/40">
      <header className="border-b border-border px-5 py-4 md:px-6 md:py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {labelsByKind[meta.kind]} · {labelsByStatus[meta.status]}
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight md:text-xl">
          <Link href={href} className="outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring/50">
            {angle.headline}
          </Link>
        </h3>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4 md:px-6 md:py-5">
        <dl className="grid grid-cols-[auto_1fr] items-start gap-x-2.5 gap-y-2.5">
          <X className="mt-0.5 size-3.5 shrink-0 text-destructive" aria-hidden />
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{labels.casePain}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{angle.pain}</dd>
          </div>
          <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{labels.caseOutcome}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed">{angle.outcome}</dd>
          </div>
        </dl>

        <dl className="grid gap-2">
          {angle.chips.map((chip) => {
            const Icon = CHIP_ICONS[chip.icon]
            return (
              <div key={chip.label} className="flex items-center justify-between gap-3 text-xs">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {chip.label}
                </dt>
                <dd className="shrink-0">
                  {chip.note ? (
                    <HoverCard>
                      <HoverCardTrigger
                        render={<button type="button" />}
                        className="relative z-10 cursor-help rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold underline decoration-primary/40 decoration-dotted underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        {chip.value}
                      </HoverCardTrigger>
                      <HoverCardContent side="top" className="w-80">
                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                          <Info className="size-3" aria-hidden />
                          {labels.factHint}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{chip.note}</p>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold">{chip.value}</span>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>

        {angle.bar ? <CaseBarStrip bar={angle.bar} /> : null}

        {otherBlocks.length > 0 ? (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-primary">
            <Link2 className="size-3" aria-hidden />
            {labels.caseAlsoIn.replace('{n}', String(otherBlocks.length))}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {meta.links.github ? (
            <a
              href={meta.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Github className="size-3.5" aria-hidden />
              GitHub
            </a>
          ) : null}
          {meta.links.npm ? (
            <a
              href={meta.links.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Package className="size-3.5" aria-hidden />
              npm
            </a>
          ) : null}
          {meta.links.site ? (
            <a
              href={meta.links.site}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Link2 className="size-3.5" aria-hidden />
              {new URL(meta.links.site).hostname}
            </a>
          ) : null}
        </div>
      </div>

      <footer className="border-t border-border px-5 py-3 text-center md:px-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          {labels.caseMore}
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </footer>
    </article>
  )
}
```

- [ ] **Step 4: Проверить типы и тесты**

Run: `npm run typecheck && npm run test`
Expected: зелёное. Старая плашка `case-plaque.tsx` пока на месте и продолжает работать — её снимает Task 5.

- [ ] **Step 5: Коммит**

```bash
git add app/data/evolution components/evolution/chip-icons.ts components/evolution/case-card.tsx
git commit -m "feat(cases): case card component and its labels"
```

---

## Task 4: Карусель с автопрокруткой

**Files:**
- Create: `components/evolution/case-carousel.tsx`

- [ ] **Step 1: Написать карусель**

Создать `components/evolution/case-carousel.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from './animations/use-reduced-motion'
import type { ReactNode } from 'react'

const INTERVAL_MS = 7000

export type CarouselLabels = {
  aria: string
  prev: string
  next: string
  counter: string // «{i} из {n}»
  goTo: string // «Кейс {i}»
}

// Карусель кейсов: одна карточка на всю ширину, прокрутка через scroll-snap —
// без внешних зависимостей и с сохранением всех карточек в DOM, поэтому она
// индексируется и работает без JS. Автопрокрутка встаёт при наведении, при
// фокусе внутри, когда секция ушла из вьюпорта, навсегда — после первого
// ручного переключения, и не запускается при prefers-reduced-motion.
export function CaseCarousel({ items, labels }: { items: ReactNode[]; labels: CarouselLabels }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduce = useReducedMotionSafe()
  const count = items.length

  const scrollTo = useCallback((i: number, smooth = true) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  // Индекс ведём по факту прокрутки, а не по состоянию: свайп пальцем
  // не проходит через наши обработчики.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (el.clientWidth > 0) setIndex(Math.round(el.scrollLeft / el.clientWidth))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || stopped || hover || focused || !inView || count < 2) return
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || el.clientWidth === 0) return
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % count
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduce, stopped, hover, focused, inView, count])

  const go = (i: number) => {
    setStopped(true)
    scrollTo((i + count) % count)
  }

  if (count === 0) return null

  return (
    <div
      className="mt-10 md:mt-14"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {count > 1 ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {labels.counter.replace('{i}', String(index + 1)).replace('{n}', String(count))}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={labels.prev}
              onClick={() => go(index - 1)}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => go(index + 1)}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <ul
        ref={trackRef}
        aria-label={labels.aria}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li key={i} className="w-full shrink-0 snap-start">
            {item}
          </li>
        ))}
      </ul>

      {count > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels.goTo.replace('{i}', String(i + 1))}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                i === index ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Коммит**

```bash
git add components/evolution/case-carousel.tsx
git commit -m "feat(cases): scroll-snap carousel with pausable autoplay"
```

---

## Task 5: Подписи карусели, врезка в блоки, удаление старой плашки

**Files:**
- Modify: `app/data/evolution/types.ts:23-38`, `app/data/evolution/types.ts:113-125`, `app/data/evolution/ru.ts`, `app/data/evolution/en.ts`, `components/evolution/block-section.tsx`, `components/evolution/evolution-page.tsx`
- Delete: `components/evolution/case-plaque.tsx`

- [ ] **Step 1: Убрать поля кейса из типа блока и добавить подписи**

В `app/data/evolution/types.ts` заменить `EvolutionBlock` на:

```ts
export type EvolutionBlock = {
  /** Якорь секции и ключ навигации. */
  id: string
  /** Порядковый номер шага («01» … «06»). */
  step: string
  /** Постулат — он же пункт навигации и заголовок блока. */
  slogan: string
  /** Симптом: как проблема болит у клиента сейчас. */
  symptom: string
  description: string[]
}
```

Тип `Fact` остаётся — им пользуется `AnimationCopy`. Подписи карточки уже добавлены в Task 3; здесь в блок `labels` добавляются только подписи карусели:

```ts
    /** Подписи управления каруселью; `{i}` и `{n}` подставляются. */
    carouselAria: string
    carouselPrev: string
    carouselNext: string
    carouselCounter: string
    carouselGoTo: string
```

- [ ] **Step 2: Заполнить подписи и вычистить блоки в текстах**

В `app/data/evolution/ru.ts` в `labels` добавить:

```ts
    carouselAria: 'Кейсы шага',
    carouselPrev: 'Предыдущий кейс',
    carouselNext: 'Следующий кейс',
    carouselCounter: '{i} из {n}',
    carouselGoTo: 'Кейс {i}',
```

В `app/data/evolution/en.ts`:

```ts
    carouselAria: 'Cases for this step',
    carouselPrev: 'Previous case',
    carouselNext: 'Next case',
    carouselCounter: '{i} of {n}',
    carouselGoTo: 'Case {i}',
```

Из всех шести блоков в обоих файлах удалить поля `caseLabel`, `caseBody`, `mainFact`, `facts`. Тексты не выбрасывать: они уже перенесены в `app/data/cases/` в задачах 1–2. Поля `exhibits.beforeAfter` и `exhibits.dataFlow` пока оставить — они переезжают в Task 6.

- [ ] **Step 3: Заменить плашку каруселью в блоке**

Заменить `components/evolution/block-section.tsx` целиком:

```tsx
import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { anglesForBlock } from '@/app/data/cases'
import type { EvolutionBlock, EvolutionData, Lang } from '@/app/data/evolution/types'
import { CaseCard } from './case-card'
import { CaseCarousel } from './case-carousel'
import { STEP_ICONS, type StepKey } from './step-icons'
import { StepChip } from './step-chip'

// Ритм блока: eyebrow → слоган → плашка симптома → 2–3 предложения → анимация
// → экспонат (только там, где он говорит сразу о нескольких системах)
// → карусель кейсов этого шага.
export function BlockSection({
  stepKey,
  block,
  labels,
  lang,
  animation,
  exhibit,
}: {
  stepKey: StepKey
  block: EvolutionBlock
  labels: EvolutionData['labels']
  lang: Lang
  animation: ReactNode
  exhibit?: ReactNode
}) {
  const Icon = STEP_ICONS[stepKey]
  const items = anglesForBlock(lang, stepKey)
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-title`}
      className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-16 md:px-8 md:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            <Icon className="size-4" aria-hidden />
            <span>{labels.step}</span>
            <StepChip>{block.step}</StepChip>
          </p>
          <h2 id={`${block.id}-title`} className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {block.slogan}
          </h2>

          {block.symptom ? (
            <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-destructive">
                <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                <span>{labels.symptom}</span>
              </div>
              <p>{block.symptom}</p>
            </div>
          ) : null}

          <div className="mt-5 space-y-4 text-base text-muted-foreground md:text-lg">
            {block.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-sm md:p-5">{animation}</div>
        </div>
      </div>

      {exhibit ? (
        <div className="mt-10 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:mt-14 md:p-6">{exhibit}</div>
      ) : null}

      <CaseCarousel
        labels={{
          aria: labels.carouselAria,
          prev: labels.carouselPrev,
          next: labels.carouselNext,
          counter: labels.carouselCounter,
          goTo: labels.carouselGoTo,
        }}
        items={items.map((item) => (
          <CaseCard key={item.slug} entry={item} lang={lang} labels={labels} />
        ))}
      />
    </section>
  )
}
```

- [ ] **Step 4: Передать язык и убрать два экспоната**

В `components/evolution/evolution-page.tsx` каждому `<BlockSection>` добавить `lang={lang}`. У блоков `decisions` и `automation` убрать проп `exhibit` — их экспонаты переезжают в кейсы (Task 6). У `speed` и `resources` `exhibit` остаётся. Удалить из импорта `BeforeAfterExhibit` и `DataFlowExhibit`.

- [ ] **Step 5: Удалить старую плашку**

```bash
git rm components/evolution/case-plaque.tsx
```

- [ ] **Step 6: Проверить сборку**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: всё зелёное. Если typecheck ругается на `data.exhibits.dataFlow` — значит `DataFlowExhibit` остался в импортах `evolution-page.tsx`, убрать.

- [ ] **Step 7: Посмотреть глазами**

Run: `npm run dev`, открыть `http://localhost:3000`
Expected: в каждом блоке карусель, карточки листаются сами каждые 7 секунд, при наведении останавливаются, после клика по стрелке больше не крутятся. В блоках 05 и 06 над каруселью — таблица запусков и три доли.

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "feat(cases): case carousel replaces the single plaque in every block"
```

---

## Task 6: Перенос экспонатов в кейсы

**Files:**
- Create: `components/cases/case-diagram.tsx`
- Modify: `components/evolution/exhibits.tsx`, `app/data/evolution/types.ts`, `app/data/evolution/{ru,en}.ts`

- [ ] **Step 1: Вынести схему в переиспользуемый компонент**

Создать `components/cases/case-diagram.tsx`:

```tsx
import { ArrowRight } from 'lucide-react'

// Цепочка «источники → система → результат». Последний узел выделен: это
// то, ради чего система существует. Разметка перенесена из DataFlowExhibit.
export function CaseDiagram({ nodes, note }: { nodes: readonly string[]; note: string }) {
  return (
    <div>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-2">
            <span
              className={
                i === nodes.length - 1
                  ? 'rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 font-medium text-primary'
                  : 'rounded-lg border border-border bg-background/60 px-3 py-1.5'
              }
            >
              {n}
            </span>
            {i < nodes.length - 1 ? <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}
```

- [ ] **Step 2: Обобщить «было / стало» и удалить схему из экспонатов**

В `components/evolution/exhibits.tsx` удалить `DataFlowExhibit` целиком (переехал в `CaseDiagram`) и заменить сигнатуру `BeforeAfterExhibit`, чтобы она принимала данные, а не срез `EvolutionData`:

```tsx
export function BeforeAfterExhibit({
  data,
}: {
  data: { beforeTitle: string; before: readonly string[]; afterTitle: string; after: string }
}) {
```

Тело функции не меняется; массивы объявлены `readonly`, потому что данные кейсов приходят
именно такими и `readonly string[]` не присваивается в `string[]`. Импорт `EvolutionData` остаётся — им пользуются `LaunchTableExhibit` и `SharesExhibit`.

- [ ] **Step 3: Убрать переехавшие данные из типов и текстов**

В `app/data/evolution/types.ts` из `exhibits` удалить поля `dataFlow` и `beforeAfter`, оставив `launchTable` и `shares`. В `app/data/evolution/{ru,en}.ts` удалить соответствующие объекты (`ru.ts:206-221` и то же место в `en.ts`).

Тексты не пропадают: `dataFlow` уже живёт в `detail.diagramNodes` кейса `data-platform`, `beforeAfter` — в `detail.beforeAfter` кейса `product-portal` (задачи 1–2).

- [ ] **Step 4: Проверить сборку**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: всё зелёное.

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "refactor(cases): move data-flow and before/after exhibits into case data"
```

---

## Task 7: Страница кейса

**Files:**
- Create: `components/cases/case-facts.tsx`, `components/cases/case-page.tsx`, `components/cases/json-ld-case.tsx`, `app/[lang]/cases/[slug]/page.tsx`
- Modify: `components/evolution/header-nav.tsx`, `lib/evolution/metadata.ts`

- [ ] **Step 1: Дать шапке необязательную базу якорей**

В `components/evolution/header-nav.tsx` добавить проп:

```tsx
  /** База для якорей шагов: пусто на главной, `homePath(lang)` на странице кейса. */
  anchorBase = '',
```

в деструктуризацию пропсов и в тип `{ ...; anchorBase?: string }`. Заменить две ссылки: `href="#hero"` на `href={`${anchorBase}#hero`}` (строка 97) и `href={`#${item.id}`}` на `href={`${anchorBase}#${item.id}`}` (строка 168). Наблюдатель секций трогать не нужно: он уже выходит, когда секций на странице нет (`header-nav.tsx:66`).

- [ ] **Step 2: Написать липкую панель фактов**

Создать `components/cases/case-facts.tsx`:

```tsx
'use client'

import { Github, Link2, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, type CaseCopy, type CaseMeta } from '@/app/data/cases'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'

// Паспорт кейса: едет со скроллом, поэтому «что это и куда нажать» видно
// на любой высоте страницы. На узких экранах липкость выключена.
export function CaseFacts({
  meta,
  copy,
  lang,
  labels,
  cta,
}: {
  meta: CaseMeta
  copy: CaseCopy
  lang: Lang
  labels: EvolutionData['labels']
  cta: string
}) {
  const lead = useLeadDialog()
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
        <dl className="grid gap-2 text-sm">
          {/* Тип и статус выводим из meta, а не храним в текстах: иначе одна и та же
              строка пишется у каждой системы заново и расходится между локалями. */}
          {[
            { label: labels.caseKindRow, value: CASE_KIND_LABELS[lang][meta.kind] },
            { label: labels.caseStatusRow, value: CASE_STATUS_LABELS[lang][meta.status] },
            ...copy.detail.facts,
          ].map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="text-right text-xs font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
          {meta.stack.map((s) => (
            <Badge key={s} variant="outline" className="border-primary/40 bg-primary/5 font-mono text-[11px] text-primary">
              {s}
            </Badge>
          ))}
        </div>

        {meta.links.github || meta.links.npm || meta.links.site ? (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {meta.links.github ? (
              <a href={meta.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary">
                <Github className="size-3.5" aria-hidden />
                GitHub
              </a>
            ) : null}
            {meta.links.npm ? (
              <a href={meta.links.npm} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary">
                <Package className="size-3.5" aria-hidden />
                npm
              </a>
            ) : null}
            {meta.links.site ? (
              <a href={meta.links.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary">
                <Link2 className="size-3.5" aria-hidden />
                {new URL(meta.links.site).hostname}
              </a>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={lead.open}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {cta}
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Написать JSON-LD**

Создать `components/cases/json-ld-case.tsx`:

```tsx
import { casePath, type CaseCopy, type CaseMeta, type CaseSlug } from '@/app/data/cases'
import { cvPath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'

export function JsonLdCase({
  lang,
  slug,
  meta,
  copy,
  owner,
}: {
  lang: Lang
  slug: CaseSlug
  meta: CaseMeta
  copy: CaseCopy
  owner: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: copy.title,
    headline: copy.detail.metaTitle,
    description: copy.detail.metaDescription,
    inLanguage: lang,
    url: `${baseUrl}${casePath(lang, slug)}`,
    creator: {
      '@type': 'Person',
      name: owner,
      url: `${baseUrl}${cvPath(lang)}`,
    },
    ...(meta.links.github ? { codeRepository: meta.links.github } : {}),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

- [ ] **Step 4: Написать компоновку страницы**

Создать `components/cases/case-page.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, X } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { evolutionBlockOrder, evolutionData, homePath } from '@/app/data/evolution'
import type { Lang } from '@/app/data/evolution/types'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, anglesForBlock, getCase, type CaseSlug } from '@/app/data/cases'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { BeforeAfterExhibit } from '@/components/evolution/exhibits'
import { CaseCard } from '@/components/evolution/case-card'
import { HtmlLang } from '@/components/evolution/html-lang'
import { CaseDiagram } from './case-diagram'
import { CaseFacts } from './case-facts'
import { JsonLdCase } from './json-ld-case'

export function CasePage({ lang, slug }: { lang: Lang; slug: CaseSlug }) {
  const data = evolutionData[lang]
  const { meta, copy } = getCase(lang, slug)
  // Якоря шагов и хлебная крошка ведут на главную своей локали: '/' для RU, '/en' для EN.
  const anchorBase = homePath(lang)
  const primaryBlock = meta.blocks[0]
  const backBlock = data.blocks[primaryBlock]
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = evolutionBlockOrder.map((key) => ({
    id: data.blocks[key].id,
    label: data.blocks[key].slogan,
  }))
  const siblings = anglesForBlock(lang, primaryBlock).filter((a) => a.slug !== slug)

  return (
    <>
      <HtmlLang lang={lang} />
      <JsonLdCase lang={lang} slug={slug} meta={meta} copy={copy} owner={data.footer.owner} />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang={lang}>
          <main className="relative z-[1] min-h-screen" lang={lang}>
            <HeaderNav
              lang={lang}
              brand={data.brand}
              owner={data.footer.owner}
              nav={data.nav}
              labels={data.labels}
              items={navItems}
              llmMarkdown={llmMarkdown}
              anchorBase={anchorBase}
            />

            <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
              <Link
                href={`${anchorBase}#${backBlock.id}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                {backBlock.slogan}
              </Link>

              <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="min-w-0 lg:col-span-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {CASE_KIND_LABELS[lang][meta.kind]} · {CASE_STATUS_LABELS[lang][meta.status]}
                  </p>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{copy.title}</h1>
                  <p className="mt-5 text-base text-muted-foreground md:text-lg">{copy.detail.lead}</p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                      <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-destructive">
                        <X className="size-3.5" aria-hidden />
                        {data.labels.casePain}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {copy.angles[primaryBlock]!.pain}
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                        <Check className="size-3.5" aria-hidden />
                        {data.labels.caseOutcome}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed">{copy.angles[primaryBlock]!.outcome}</p>
                    </div>
                  </div>

                  {copy.detail.effects.length > 1 ? (
                    <section className="mt-10">
                      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {data.labels.caseEffectsTitle}
                      </h2>
                      <ul className="mt-4 grid gap-2">
                        {copy.detail.effects.map((e) => (
                          <li
                            key={e.block}
                            className="grid gap-1 rounded-lg bg-muted/50 px-4 py-3 text-sm sm:grid-cols-[14rem_1fr] sm:gap-4"
                          >
                            <span className="font-mono text-xs text-muted-foreground">
                              {data.blocks[e.block].step} · {data.blocks[e.block].slogan}
                            </span>
                            <span>{e.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  <section className="mt-10">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {data.labels.caseValueTitle}
                    </h2>
                    <ul className="mt-4 grid gap-2.5">
                      {copy.detail.value.map((v) => (
                        <li key={v} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-10 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
                    <CaseDiagram nodes={copy.detail.diagramNodes} note={copy.detail.diagramNote} />
                  </section>

                  {copy.detail.beforeAfter ? (
                    <section className="mt-6 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
                      <BeforeAfterExhibit
                        data={{
                          beforeTitle: data.labels.caseBeforeTitle,
                          before: copy.detail.beforeAfter.before,
                          afterTitle: data.labels.caseAfterTitle,
                          after: copy.detail.beforeAfter.after,
                        }}
                      />
                    </section>
                  ) : null}

                  {meta.screenshots.length > 0 ? (
                    <section className="mt-10">
                      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {data.labels.caseScreensTitle}
                      </h2>
                      <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
                        {meta.screenshots.map((s, i) => (
                          <li key={s.src} className="w-[82vw] max-w-[34rem] shrink-0 snap-start sm:w-[28rem]">
                            <figure className="overflow-hidden rounded-2xl border border-border bg-card/70">
                              <Image
                                src={s.src}
                                alt={copy.detail.screenshots[i].alt}
                                width={2300}
                                height={1440}
                                sizes="(max-width: 640px) 82vw, 34rem"
                                className="h-auto w-full"
                              />
                              <figcaption className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                                {copy.detail.screenshots[i].caption}
                              </figcaption>
                            </figure>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  <section className="mt-10">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {data.labels.caseHowTitle}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {copy.detail.how.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </section>

                  <section className="mt-10">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {data.labels.caseOwnerTitle}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.detail.owner}</p>
                  </section>

                  {siblings.length > 0 ? (
                    <section className="mt-14">
                      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {data.labels.caseSiblingsTitle}
                      </h2>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {siblings.map((item) => (
                          <CaseCard key={item.slug} entry={item} lang={lang} labels={data.labels} />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>

                <div className="min-w-0 lg:col-span-4">
                  <CaseFacts meta={meta} copy={copy} lang={lang} labels={data.labels} cta={data.nav.cta} />
                </div>
              </div>
            </div>

            <Footer data={data} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
```

Добавить недостающие подписи в `labels` (`types.ts` и оба текстовых файла):

| Ключ | RU | EN |
|---|---|---|
| `caseEffectsTitle` | `Эффект по шагам` | `Effect across the steps` |
| `caseValueTitle` | `Что это даёт бизнесу` | `What the business gets` |
| `caseBeforeTitle` | `Было: руками, каждый день` | `Before: by hand, every day` |
| `caseAfterTitle` | `Стало: одна кнопка` | `Now: one button` |
| `caseScreensTitle` | `Интерфейс` | `Interface` |
| `caseHowTitle` | `Как устроено` | `How it works` |
| `caseOwnerTitle` | `Кто ведёт систему сейчас` | `Who maintains it now` |
| `caseSiblingsTitle` | `Другие кейсы этого шага` | `Other cases for this step` |
| `caseKindRow` | `Тип` | `Type` |
| `caseStatusRow` | `Статус` | `Status` |

- [ ] **Step 5: Написать метаданные кейса**

Дописать в `lib/evolution/metadata.ts`:

```ts
import { casePath, getCase, type CaseSlug } from '@/app/data/cases'

// Metadata страницы кейса: canonical на свой URL, hreflang на обе локали,
// x-default — русская версия, как на главной.
export function buildCaseMetadata(lang: Lang, slug: CaseSlug): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData[lang]
  const { copy } = getCase(lang, slug)
  const url = `${baseUrl}${casePath(lang, slug)}`

  return {
    title: copy.detail.metaTitle,
    description: copy.detail.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ru: `${baseUrl}${casePath('ru', slug)}`,
        en: `${baseUrl}${casePath('en', slug)}`,
        'x-default': `${baseUrl}${casePath('ru', slug)}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      url,
      title: copy.detail.metaTitle,
      description: copy.detail.metaDescription,
      siteName: d.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.detail.metaTitle,
      description: copy.detail.metaDescription,
    },
  }
}
```

- [ ] **Step 6: Написать маршрут**

Создать `app/[lang]/cases/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CASE_SLUGS, isCaseSlug } from '@/app/data/cases'
import { LANGS, isLang } from '@/app/data/evolution'
import { CasePage } from '@/components/cases/case-page'
import { buildCaseMetadata } from '@/lib/evolution/metadata'

type Params = { lang: string; slug: string }

export function generateStaticParams() {
  return LANGS.flatMap((lang) => CASE_SLUGS.map((slug) => ({ lang, slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang) || !isCaseSlug(slug)) return {}
  return buildCaseMetadata(lang, slug)
}

export default async function Case({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params
  if (!isLang(lang) || !isCaseSlug(slug)) notFound()
  return <CasePage lang={lang} slug={slug} />
}
```

- [ ] **Step 7: Собрать и проверить**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: зелёное; в выводе `build` — 26 страниц вида `/[lang]/cases/[slug]`.

- [ ] **Step 8: Посмотреть глазами**

Run: `npm run dev`, открыть `http://localhost:3000/ru/cases/finance-loop`
Expected: панель фактов едет со скроллом; таблица эффектов из четырёх строк; переключатель языка ведёт на `/en/cases/finance-loop`; хлебная крошка возвращает на `/#system`; кнопка в панели открывает форму заявки. Проверить `http://localhost:3000/ru/cases/product-portal` — там должны быть вкладки «было / стало». Проверить `http://localhost:3000/ru/cases/nope` — 404.

- [ ] **Step 9: Коммит**

```bash
git add -A
git commit -m "feat(cases): case pages at /[lang]/cases/[slug]"
```

---

## Task 8: Хвосты — llms.txt, sitemap, редирект, README

**Files:**
- Modify: `lib/evolution/llms-markdown.ts:50-57`, `app/sitemap.ts`, `next.config.mjs`, `README.md`

- [ ] **Step 1: Перечислить углы в llms.txt**

В `lib/evolution/llms-markdown.ts` расширить импорт и заголовки:

```ts
import { anglesForBlock, casePath } from '@/app/data/cases'
```

В объект `H` добавить в обе локали `casesTag`: `'Кейсы шага'` / `'Cases for this step'`.

Заменить блок `lib/evolution/llms-markdown.ts:53-56` (строки с `caseTag`, `mainFact` и `facts`) на:

```ts
    const angles = anglesForBlock(d.lang, key)
    if (angles.length > 0) {
      out.push(`**${h.casesTag}:**`, '')
      for (const a of angles) {
        out.push(`- **${a.angle.headline}** (${a.copy.title})`)
        out.push(`  - ${d.labels.casePain}: ${a.angle.pain}`)
        out.push(`  - ${d.labels.caseOutcome}: ${a.angle.outcome}`)
        for (const c of a.angle.chips) out.push(`  - ${c.label}: ${c.value}`)
        out.push(`  - ${baseUrl}${casePath(d.lang, a.slug)}`)
      }
      out.push('')
    }
```

В начале `buildEvolutionMarkdown` добавить:

```ts
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
```

- [ ] **Step 2: Добавить кейсы в sitemap**

Заменить `app/sitemap.ts`:

```ts
import { MetadataRoute } from "next";
import { CASE_SLUGS, casePath } from "@/app/data/cases";
import { LANGS } from "@/app/data/evolution";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";
  const now = new Date();

  const cases: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    CASE_SLUGS.map((slug) => ({
      url: `${baseUrl}${casePath(lang, slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ru/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/en/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...cases,
  ];
}
```

- [ ] **Step 3: Добавить редирект без локали**

В `next.config.mjs` в массив `redirects()` добавить строкой после `/minasarkisyan`:

```js
      { source: '/cases/:slug', destination: '/ru/cases/:slug', permanent: true },
```

- [ ] **Step 4: Проверить всё**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: зелёное.

Run: `npm run dev`, открыть `http://localhost:3000/llms.txt`
Expected: под каждым шагом список кейсов с «болело», «стало», характеристиками и адресом страницы.

Открыть `http://localhost:3000/sitemap.xml`
Expected: 4 старых адреса + 26 адресов кейсов = 30.

Открыть `http://localhost:3000/cases/stock-sync`
Expected: 308-редирект на `/ru/cases/stock-sync`.

- [ ] **Step 5: Проверить мобильную ширину**

Открыть страницу в iframe шириной 390 px (не ресайзом окна — MCP-вкладка Chrome живёт неактивной, скриншоты выходят пустыми):

```bash
cat > /tmp/m.html <<'EOF'
<iframe src="http://localhost:3000/" style="width:390px;height:844px;border:1px solid #ccc"></iframe>
<iframe src="http://localhost:3000/ru/cases/finance-loop" style="width:390px;height:844px;border:1px solid #ccc"></iframe>
EOF
open /tmp/m.html
```

Expected: карусель по одной карточке, панель фактов на странице кейса уехала под контент и не липкая, горизонтальной прокрутки страницы нет.

- [ ] **Step 6: Записать в Changelog**

В `README.md` над записью `### 2026-08-22 — «Эволюция бизнеса» becomes the home page` вставить:

```markdown
### 2026-08-23 — Cases: business-level cards, carousels, case pages

- Cases no longer belong to a single block. The unit of data is a **system** (13 of them, one case page each), the unit of display is an **angle** — a system × block pair with its own pain/outcome and characteristics (23 angles). A system spanning several blocks carries a «same system, N more steps» link
- Card characteristics are business-level (timeline, who maintains it, what it replaced, scale, market alternative) — lines of code, commits and DB models are gone. Optional share bar renders only where a real ratio exists
- New `app/data/cases/`: `registry.ts` (language-neutral structure), `ru.ts`/`en.ts` (copy), `index.ts` (selectors), `cases.test.ts` (locale parity, chip count, block balance 3–4, oss links, screenshot captions)
- `components/evolution/case-card.tsx` + `case-carousel.tsx` — one card per view, autoplay every 7s, paused on hover, on focus within, off-viewport and under `prefers-reduced-motion`, stopped for good after manual navigation. CSS scroll-snap, no new dependency
- Case pages at `/[lang]/cases/[slug]` (26 static pages): sticky facts panel, effects-across-steps table, diagram, before/after tabs, screenshots, stack, links, sibling cases. `/cases/:slug` → `/ru/cases/:slug`
- Data-flow and before/after exhibits moved into case data; launch table and the 43/73/73 % shares stay on the landing and move **above** the carousel
- `case-plaque.tsx` removed; `/llms.txt` and `sitemap.xml` list every case
```

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat(cases): llms.txt, sitemap, redirect and changelog"
```

---

## Проверка целиком

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Глазами на `/` и `/en`:
- в каждом блоке карусель, счётчик «N из M», стрелки и точки;
- автопрокрутка идёт, встаёт при наведении и при табе внутрь, после клика по стрелке не возобновляется;
- при системной настройке «уменьшить движение» автопрокрутки нет вовсе;
- в блоках 05 и 06 экспонат стоит **над** каруселью.

На страницах кейсов:
- `/ru/cases/finance-loop` — таблица эффектов из четырёх строк, липкая панель;
- `/ru/cases/product-portal` — вкладки «было / стало»;
- `/ru/cases/marketplace-knowledge` — ссылка на GitHub в панели и на карточке;
- переключатель языка остаётся на том же кейсе;
- `/ru/cases/nope` — 404.

## Что остаётся за рамками плана

Обезличенные скриншоты клиентских систем (готовятся отдельно, добавляются правкой
`registry.screenshots` и `detail.screenshots` без изменений в компонентах), вторая волна кейсов,
публикация `yandex-mcp`, подтверждение владельцем цифр из раздела «со слов владельца»
в спеке — до подтверждения соответствующие формулировки идут без числа.
