# Четыре лендинга под пять кампаний Директа: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Четыре автономные RU-страницы `/kontur`, `/it-director`, `/agent`, `/finance` на одном движке: контент в данных, квиз вердикта с пресетами, заявка с контекстом страницы, Яндекс Метрика с тремя целями.

**Architecture:** Новый модуль данных `app/data/landings/` (реестр, пресеты, четыре файла текстов) и набор компонентов `components/landings/`, собирающих страницу из существующих частей (`HeaderNav`, `Footer`, `StickyCta`, `LeadDialogProvider`, `CaseCarousel`, `CaseCard`, `VerdictQuiz`). Квиз получает необязательный «режим лендинга» с шагом выбора пресета и результатом, ведущим в заявку с заполненным контекстом. API заявки принимает поле `source`. Спека: `docs/superpowers/specs/2026-09-02-chetyre-lendinga-pyat-kampaniy-design.md`.

**Tech Stack:** Next.js (App Router, `app/`), React, TypeScript, Tailwind, shadcn/ui (`components/ui`), zod, vitest. Тесты: `npm run test` (vitest, `{lib,app,components}/**/*.test.{ts,tsx}`), `npm run typecheck`, `npm run lint`, `npm run build`.

**Отступления от спеки, принятые в плане:**
- Playwright в репозитории нет, и ставить его ради четырёх страниц не будем. Сквозная проверка заменена юнит-тестами данных, схемы и текстов уведомлений плюс ручным чеклистом в последней задаче.
- Поле `landings` в реестре кейсов не добавляется: порядок и состав карусели уже задаёт `landingMeta.cases`, второй источник правды был бы лишним.
- Тексты «что это значит для вас» (`meaning`) живут на уровне страницы (`copy.quiz.meaning`), а не в каждом пресете: девять форм вердикта на шестнадцать пресетов дали бы 144 абзаца, которые никто не отличит друг от друга.

**Стиль кода:** как в `components/evolution/*` и `lib/*`: одинарные кавычки, без точек с запятой, комментарии по-русски и только там, где объясняют неочевидное. Тексты страниц: первое лицо, без длинных тире («—»), без обещаний процентов.

---

## Карта файлов

Создать:
- `lib/analytics/ym.ts`, `lib/analytics/ym.test.ts`: помощник целей Метрики.
- `components/analytics/yandex-metrika.tsx`: счётчик из переменной окружения.
- `app/data/landings/types.ts`, `registry.ts`, `presets.ts`, `kontur.ts`, `it-director.ts`, `agent.ts`, `finance.ts`, `index.ts`, `landings.test.ts`.
- `lib/standard/quiz-summary.ts`, `lib/standard/quiz-summary.test.ts`: строка ответов и контекст заявки.
- `components/landings/landing-page.tsx`, `landing-hero.tsx`, `symptoms.tsx`, `hero-case.tsx`, `how-it-works.tsx`, `standard-note.tsx`, `landing-cases.tsx`, `pricing-steps.tsx`, `faq.tsx`, `landing-quiz.tsx`, `lead-section.tsx`.
- `lib/landings/llms-markdown.ts`.
- `app/kontur/page.tsx`, `app/it-director/page.tsx`, `app/agent/page.tsx`, `app/finance/page.tsx`.

Изменить:
- `app/layout.tsx`: счётчик.
- `.env.example`: `NEXT_PUBLIC_YM_ID`.
- `lib/evolution/schemas.ts`, `schemas.test.ts`: поле `source`.
- `lib/evolution/email.ts`, `telegram-text.ts`, `telegram-text.test.ts`: строка источника.
- `app/api/evolution/lead/route.ts`: передача `source`.
- `components/evolution/lead-dialog.tsx`, `lead-form.tsx`: открытие с контекстом.
- `app/data/cases/index.ts`: `angleForCase`.
- `components/standard/verdict-quiz.tsx`: режим лендинга.
- `lib/evolution/metadata.ts`: `buildLandingMetadata`.
- `app/sitemap.ts`, `app/llms.txt/route.ts`: четыре адреса.

---

### Task 1: Помощник целей Метрики

**Files:**
- Create: `lib/analytics/ym.ts`
- Test: `lib/analytics/ym.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
// lib/analytics/ym.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ymGoal } from './ym'

describe('ymGoal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('не падает без window (серверный рендер)', () => {
    expect(() => ymGoal('quiz_start')).not.toThrow()
  })

  it('не падает, когда счётчик не подключён', () => {
    vi.stubGlobal('window', {})
    expect(() => ymGoal('lead_sent')).not.toThrow()
  })

  it('вызывает ym(id, "reachGoal", цель), когда счётчик есть', () => {
    const ym = vi.fn()
    vi.stubGlobal('window', { ym })
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '12345')
    ymGoal('quiz_result')
    expect(ym).toHaveBeenCalledWith(12345, 'reachGoal', 'quiz_result')
  })
})
```

- [ ] **Step 2: Запустить тест, убедиться, что падает**

Run: `npx vitest run lib/analytics/ym.test.ts`
Expected: FAIL, `Cannot find module './ym'`

- [ ] **Step 3: Реализовать помощник**

```ts
// lib/analytics/ym.ts
// Цели Яндекс Метрики. Три события на все страницы: старт квиза, показ
// результата, отправка заявки. Без счётчика (нет NEXT_PUBLIC_YM_ID или
// скрипт не загрузился) вызов ничего не делает: аналитика не должна ронять
// страницу и не должна требовать моков в тестах компонентов.
export type YmGoal = 'quiz_start' | 'quiz_result' | 'lead_sent'

type YmFn = (id: number, action: 'reachGoal', goal: string) => void

export function ymGoal(goal: YmGoal): void {
  if (typeof window === 'undefined') return
  const id = Number(process.env.NEXT_PUBLIC_YM_ID)
  const ym = (window as unknown as { ym?: YmFn }).ym
  if (!id || typeof ym !== 'function') return
  ym(id, 'reachGoal', goal)
}
```

- [ ] **Step 4: Запустить тест, убедиться, что проходит**

Run: `npx vitest run lib/analytics/ym.test.ts`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add lib/analytics/ym.ts lib/analytics/ym.test.ts
git commit -m "feat(analytics): помощник целей Метрики ymGoal"
```

---

### Task 2: Счётчик Метрики в корневом layout

**Files:**
- Create: `components/analytics/yandex-metrika.tsx`
- Modify: `app/layout.tsx`
- Modify: `.env.example`

- [ ] **Step 1: Компонент счётчика**

```tsx
// components/analytics/yandex-metrika.tsx
import Script from 'next/script'

// Счётчик подключается только при заданном NEXT_PUBLIC_YM_ID: в dev и в
// тестовых сборках переменной нет, и страница отдаётся без внешнего скрипта.
// Код вставки стандартный из кабинета Метрики; webvisor выключен намеренно.
export function YandexMetrika() {
  const id = Number(process.env.NEXT_PUBLIC_YM_ID)
  if (!id) return null
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });`}
      </Script>
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${id}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  )
}
```

- [ ] **Step 2: Подключить в layout**

В `app/layout.tsx` добавить импорт и вставить компонент в конец `<body>` после `<Toaster />`:

```tsx
import { YandexMetrika } from "@/components/analytics/yandex-metrika"
```

```tsx
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <YandexMetrika />
```

- [ ] **Step 3: Переменная окружения в примере**

Run: `grep -q NEXT_PUBLIC_YM_ID .env.example 2>/dev/null || printf '\n# Номер счётчика Яндекс Метрики; без него счётчик не рендерится\nNEXT_PUBLIC_YM_ID=\n' >> .env.example`

Если файла `.env.example` нет, создать его этой же строкой.

- [ ] **Step 4: Проверить типы и сборку**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок

- [ ] **Step 5: Commit**

```bash
git add components/analytics/yandex-metrika.tsx app/layout.tsx .env.example
git commit -m "feat(analytics): счётчик Яндекс Метрики из NEXT_PUBLIC_YM_ID"
```

---

### Task 3: Заявка с полем `source`: схема

**Files:**
- Modify: `lib/evolution/schemas.ts`
- Test: `lib/evolution/schemas.test.ts`

- [ ] **Step 1: Дописать падающие тесты**

В конец `describe('evolutionLeadSchema', ...)` в `lib/evolution/schemas.test.ts` добавить:

```ts
  it('принимает source с лендинга, пресетом и вердиктом', () => {
    const r = evolutionLeadSchema.safeParse({
      ...valid,
      source: { landing: 'finance', preset: 'finance-pervichka', verdict: 'F4' },
    })
    expect(r.success).toBe(true)
  })

  it('принимает source только с лендингом', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, source: { landing: 'agent' } }).success).toBe(true)
  })

  it('отклоняет source с неизвестным лендингом', () => {
    expect(evolutionLeadSchema.safeParse({ ...valid, source: { landing: 'shop' } }).success).toBe(false)
  })
```

- [ ] **Step 2: Запустить, убедиться, что падают**

Run: `npx vitest run lib/evolution/schemas.test.ts`
Expected: FAIL: два первых теста проходят по случайности (лишние ключи zod по умолчанию отбрасывает), третий падает: `expected true to be false`. Это и есть сигнал: схема пока не знает про `source`.

- [ ] **Step 3: Добавить схему источника**

В `lib/evolution/schemas.ts` после импорта zod:

```ts
// Слаги лендингов дублируются здесь строкой, а не импортом из app/data:
// схема живёт в lib и не должна тянуть за собой тексты страниц.
export const LEAD_LANDINGS = ['kontur', 'it-director', 'agent', 'finance'] as const

// Откуда пришла заявка с лендинга: страница, пресет квиза и тег вердикта.
// Всё необязательное: заявка с главной идёт без source.
export const leadSourceSchema = z.object({
  landing: z.enum(LEAD_LANDINGS),
  preset: z.string().trim().max(60).optional(),
  verdict: z.string().trim().max(20).optional(),
})

export type LeadSource = z.infer<typeof leadSourceSchema>
```

и в объект `evolutionLeadSchema` после `lang`:

```ts
  source: leadSourceSchema.optional(),
```

- [ ] **Step 4: Запустить, убедиться, что проходят**

Run: `npx vitest run lib/evolution/schemas.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/evolution/schemas.ts lib/evolution/schemas.test.ts
git commit -m "feat(lead): поле source в схеме заявки"
```

---

### Task 4: Заявка с полем `source`: тексты уведомлений и роут

**Files:**
- Modify: `lib/evolution/email.ts`
- Modify: `lib/evolution/telegram-text.ts`
- Modify: `app/api/evolution/lead/route.ts`
- Test: `lib/evolution/telegram-text.test.ts`

- [ ] **Step 1: Падающий тест на строку источника**

В `lib/evolution/telegram-text.test.ts` добавить тест (рядом с существующими, используя их базовый объект заявки; если базового объекта нет, объявить `const d = { name: 'Иван', contact: '@ivan', answer: 'Нужна первичка в 1С', ip: '1.2.3.4' }`):

```ts
  it('заявка с лендинга подписана страницей, пресетом и вердиктом', () => {
    const text = buildLeadTelegramText({
      ...d,
      source: { landing: 'finance', preset: 'finance-pervichka', verdict: 'F4' },
    })
    expect(text).toContain('Лендинг /finance')
    expect(text).toContain('finance-pervichka')
    expect(text).toContain('F4')
  })
```

- [ ] **Step 2: Запустить, убедиться, что падает**

Run: `npx vitest run lib/evolution/telegram-text.test.ts`
Expected: FAIL: `expected ... to contain 'Лендинг /finance'` (и ошибка типов на `source` при typecheck)

- [ ] **Step 3: Источник в данных заявки и подписи**

В `lib/evolution/email.ts`:

```ts
import type { Lang } from '@/app/data/evolution/types'
import type { LeadSource } from './schemas'
```

В тип `EvolutionLeadData` добавить поле:

```ts
  /** Заявка с лендинга: страница, пресет квиза, тег вердикта. С главной нет. */
  source?: LeadSource
```

Заменить `sourceLabel`:

```ts
// Уведомления владельцу всегда на русском - меняется только пометка источника.
// Для лендинга подпись читается как паспорт: «/finance · finance-pervichka · F4».
export const sourceLabel = (lang?: Lang, source?: LeadSource): string => {
  if (source) {
    return ['Лендинг /' + source.landing, source.preset, source.verdict].filter(Boolean).join(' · ')
  }
  return `Главная webkoth.com (${lang === 'en' ? 'EN · /en' : 'RU · /'})`
}
```

В `buildLeadText` и `buildLeadHtml` заменить вызовы `sourceLabel(d.lang)` на `sourceLabel(d.lang, d.source)` (в файле их два).

В `lib/evolution/telegram-text.ts` заменить `escapeHtml(sourceLabel(d.lang))` на `escapeHtml(sourceLabel(d.lang, d.source))`.

- [ ] **Step 4: Роут передаёт `source`**

В `app/api/evolution/lead/route.ts` в объект `lead`:

```ts
  const lead: EvolutionLeadData = {
    name: parsed.data.name,
    contact: parsed.data.contact,
    answer: parsed.data.answer,
    ip,
    lang: parsed.data.lang,
    source: parsed.data.source,
  }
```

- [ ] **Step 5: Запустить тесты и типы**

Run: `npx vitest run lib/evolution && npm run typecheck`
Expected: PASS, без ошибок типов

- [ ] **Step 6: Commit**

```bash
git add lib/evolution/email.ts lib/evolution/telegram-text.ts lib/evolution/telegram-text.test.ts app/api/evolution/lead/route.ts
git commit -m "feat(lead): источник заявки в Telegram и письме"
```

---

### Task 5: Диалог заявки открывается с контекстом

**Files:**
- Modify: `components/evolution/lead-dialog.tsx`
- Modify: `components/evolution/lead-form.tsx`

- [ ] **Step 1: API диалога принимает заполнение**

В `components/evolution/lead-dialog.tsx`:

```ts
import type { LeadSource } from '@/lib/evolution/schemas'

export type LeadPrefill = { answer?: string; source?: LeadSource }

type LeadDialogApi = { open: (prefill?: LeadPrefill) => void }
```

В `LeadDialogProvider` состояние и открытие:

```ts
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)
  const [prefill, setPrefill] = useState<LeadPrefill>({})
  const mobile = useMediaQuery('(max-width: 639px)')

  // Квиз открывает форму с готовым паспортом: ответ и источник. Остальные
  // кнопки открывают пустую; прошлое заполнение не наследуется.
  const openDialog = useCallback((next?: LeadPrefill) => {
    setPrefill(next ?? {})
    setOpenedAt(Date.now())
    setOpen(true)
  }, [])
```

И вызов формы:

```tsx
      <LeadForm
        key={openedAt}
        copy={copy}
        lang={lang}
        startedAt={openedAt}
        defaultAnswer={prefill.answer}
        source={prefill.source}
        onSuccess={close}
      />
```

- [ ] **Step 2: Форма принимает ответ и источник**

В `components/evolution/lead-form.tsx` расширить пропсы (в сигнатуре `export function LeadForm({ ... })` и её типе):

```ts
  defaultAnswer?: string
  source?: LeadSource
```

с импортом `import type { LeadSource } from '@/lib/evolution/schemas'`.

В `defaultValues` заменить `answer: ''` на `answer: defaultAnswer ?? ''`.

В `fetch` тело: `body: JSON.stringify({ ...values, filledAtMs: filledAt, lang, source })`.

После успешного ответа (там, где вызывается `onSuccess`) добавить цель:

```ts
import { ymGoal } from '@/lib/analytics/ym'
```

```ts
      ymGoal('lead_sent')
      onSuccess?.()
```

(если `onSuccess` вызывается в другом виде, вставить `ymGoal('lead_sent')` строкой перед ним).

- [ ] **Step 3: Проверить типы и существующие тесты**

Run: `npm run typecheck && npm run test`
Expected: без ошибок; все тесты зелёные. Существующие вызовы `open()` без аргумента остаются валидными.

- [ ] **Step 4: Commit**

```bash
git add components/evolution/lead-dialog.tsx components/evolution/lead-form.tsx
git commit -m "feat(lead): диалог заявки открывается с ответом и источником, цель lead_sent"
```

---

### Task 6: Типы и реестр лендингов

**Files:**
- Create: `app/data/landings/types.ts`
- Create: `app/data/landings/registry.ts`
- Create: `app/data/landings/index.ts` (черновик, дополняется в Task 12)
- Test: `app/data/landings/landings.test.ts`

- [ ] **Step 1: Типы**

```ts
// app/data/landings/types.ts
// Лендинги под кампании Директа. Язык-независимая часть - registry.ts,
// пресеты квиза - presets.ts, тексты - по файлу на страницу. Только RU.
import type { CaseSlug } from '@/app/data/cases'
import type { QuizInput, VerdictForm } from '@/lib/standard/verdict'

export type LandingSlug = 'kontur' | 'it-director' | 'agent' | 'finance'

/** A «симптомы первыми» или C «кейс первым» из спеки, секция 6. */
export type LandingSkeleton = 'symptoms-first' | 'case-first'

export type QuizPresetId =
  | 'kontur-stocks'
  | 'kontur-reports'
  | 'kontur-orders'
  | 'kontur-payouts'
  | 'it-access'
  | 'it-backups'
  | 'it-unknown'
  | 'it-vendors'
  | 'agent-inbox'
  | 'agent-reports'
  | 'agent-calls'
  | 'agent-content'
  | 'finance-pervichka'
  | 'finance-otchet'
  | 'finance-statements'
  | 'finance-payments'

export type LandingMeta = {
  slug: LandingSlug
  skeleton: LandingSkeleton
  /** Главный кейс для case-first; у symptoms-first его нет. */
  heroCase?: CaseSlug
  /** Порядок карусели. Минимум три, иначе карусель бессмысленна. */
  cases: readonly [CaseSlug, CaseSlug, CaseSlug, ...CaseSlug[]]
  presets: readonly [QuizPresetId, ...QuizPresetId[]]
  /** Имя кампании Директа: попадает в utm_campaign и в отчёты. */
  campaign: string
}

/** Ключи вопросов квиза, к которым пресет даёт подсказку. */
export type QuizQuestionKey = keyof QuizInput

export type QuizPreset = {
  id: QuizPresetId
  landing: LandingSlug
  /** «остатки склад ↔ площадки»: имя процесса для заявки и для кнопки выбора. */
  label: string
  /** Подсказки на языке аудитории; не заданные вопросы показывают общую подсказку квиза. */
  hints: Partial<Record<QuizQuestionKey, string>>
  /** Карточки библиотеки стандарта в результате; заменяют общие ссылки формы. */
  library: readonly { label: string; href: string }[]
}

export type LandingStep = { title: string; body: string }
export type PricingStep = { title: string; price: string; body: string }
export type FaqItem = { q: string; a: string }

export type LandingCopy = {
  meta: { title: string; description: string }
  /** Подписи якорей в шапке: квиз, как работает, кейсы, цены, вопросы. */
  nav: { quiz: string; how: string; cases: string; pricing: string; faq: string; cta: string }
  hero: { eyebrow: string; title: string; sub: string; primaryCta: string; secondaryCta: string }
  /** Только для symptoms-first. */
  symptoms?: { eyebrow: string; title: string; items: readonly [string, string, string, ...string[]] }
  /** Только для case-first: подпись над главным кейсом. */
  heroCase?: { eyebrow: string; title: string }
  quiz: {
    eyebrow: string
    title: string
    lead: string
    /** «Ответы никуда не уходят, пока вы не нажмёте кнопку». */
    disclaimer: string
    presetQuestion: string
    ownLabel: string
    ownPlaceholder: string
    ownSubmit: string
    /** «Что это значит для вас» под вердиктом, по форме. */
    meaning: Record<VerdictForm, string>
    cta: string
  }
  how: { eyebrow: string; title: string; steps: readonly [LandingStep, LandingStep, LandingStep, LandingStep] }
  standardNote: { title: string; standard: string; individual: string }
  cases: { eyebrow: string; title: string }
  pricing: { eyebrow: string; title: string; note: string; steps: readonly [PricingStep, ...PricingStep[]] }
  faq: { eyebrow: string; title: string; items: readonly [FaqItem, FaqItem, FaqItem, ...FaqItem[]] }
  lead: { eyebrow: string; title: string; sub: string }
}
```

- [ ] **Step 2: Реестр**

```ts
// app/data/landings/registry.ts
import type { LandingMeta, LandingSlug } from './types'

export const LANDING_SLUGS = ['kontur', 'it-director', 'agent', 'finance'] as const

export const isLandingSlug = (v: unknown): v is LandingSlug =>
  typeof v === 'string' && (LANDING_SLUGS as readonly string[]).includes(v)

export const landingMeta: Record<LandingSlug, LandingMeta> = {
  kontur: {
    slug: 'kontur',
    skeleton: 'case-first',
    heroCase: 'data-platform',
    cases: ['data-platform', 'finance-loop', 'stock-sync', 'payout-documents'],
    presets: ['kontur-stocks', 'kontur-reports', 'kontur-orders', 'kontur-payouts'],
    campaign: 'kontur',
  },
  'it-director': {
    slug: 'it-director',
    skeleton: 'symptoms-first',
    cases: ['it-inventory', 'legacy-db-map', 'deploy-from-chat', 'project-generator'],
    presets: ['it-access', 'it-backups', 'it-unknown', 'it-vendors'],
    campaign: 'it-director',
  },
  agent: {
    slug: 'agent',
    skeleton: 'symptoms-first',
    cases: ['ads-agents', 'agents-platform', 'store-to-claude', 'marketplace-knowledge'],
    presets: ['agent-inbox', 'agent-reports', 'agent-calls', 'agent-content'],
    campaign: 'agent',
  },
  finance: {
    slug: 'finance',
    skeleton: 'case-first',
    heroCase: 'finance-loop',
    cases: ['finance-loop', 'data-marts', 'payout-documents', 'data-platform'],
    presets: ['finance-pervichka', 'finance-otchet', 'finance-statements', 'finance-payments'],
    campaign: 'finance',
  },
}
```

- [ ] **Step 3: Черновик index.ts**

```ts
// app/data/landings/index.ts
import type { LandingSlug } from './types'

export type {
  FaqItem,
  LandingCopy,
  LandingMeta,
  LandingSkeleton,
  LandingSlug,
  LandingStep,
  PricingStep,
  QuizPreset,
  QuizPresetId,
  QuizQuestionKey,
} from './types'
export { LANDING_SLUGS, isLandingSlug, landingMeta } from './registry'

/** Лендинги живут в корне, латиницей: `/kontur`, `/finance`. */
export const landingPath = (slug: LandingSlug): string => `/${slug}`
```

- [ ] **Step 4: Падающий тест реестра**

```ts
// app/data/landings/landings.test.ts
import { describe, expect, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { LANDING_SLUGS, landingMeta } from './index'

describe('реестр лендингов', () => {
  it('у каждого лендинга есть запись, слаг совпадает с ключом', () => {
    for (const slug of LANDING_SLUGS) {
      expect(landingMeta[slug].slug).toBe(slug)
    }
  })

  it('кейсы карусели и главный кейс существуют в реестре кейсов', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      for (const c of meta.cases) expect(CASE_SLUGS, `${slug}/${c}`).toContain(c)
      if (meta.heroCase) expect(CASE_SLUGS, `${slug}/hero`).toContain(meta.heroCase)
    }
  })

  it('case-first обязан иметь главный кейс, symptoms-first не имеет', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      if (meta.skeleton === 'case-first') expect(meta.heroCase, slug).toBeDefined()
      else expect(meta.heroCase, slug).toBeUndefined()
    }
  })

  it('кейсы внутри карусели не повторяются', () => {
    for (const slug of LANDING_SLUGS) {
      const meta = landingMeta[slug]
      expect(new Set(meta.cases).size, slug).toBe(meta.cases.length)
    }
  })
})
```

- [ ] **Step 5: Запустить тесты и типы**

Run: `npx vitest run app/data/landings && npm run typecheck`
Expected: PASS, 4 tests; типы без ошибок

- [ ] **Step 6: Commit**

```bash
git add app/data/landings/types.ts app/data/landings/registry.ts app/data/landings/index.ts app/data/landings/landings.test.ts
git commit -m "feat(landings): типы и реестр четырёх лендингов"
```

---

### Task 7: Пресеты квиза

**Files:**
- Create: `app/data/landings/presets.ts`
- Modify: `app/data/landings/index.ts`
- Modify: `app/data/landings/landings.test.ts`

- [ ] **Step 1: Падающие тесты пресетов**

Добавить в `landings.test.ts`:

```ts
import { presetsForLanding, quizPresets, resolvePresetParam } from './index'

describe('пресеты квиза', () => {
  it('каждый пресет лендинга существует и привязан к нему', () => {
    for (const slug of LANDING_SLUGS) {
      for (const id of landingMeta[slug].presets) {
        expect(quizPresets[id], `${slug}/${id}`).toBeDefined()
        expect(quizPresets[id].landing, `${slug}/${id}`).toBe(slug)
      }
    }
  })

  it('presetsForLanding отдаёт пресеты в порядке реестра', () => {
    expect(presetsForLanding('finance').map((p) => p.id)).toEqual([...landingMeta.finance.presets])
  })

  it('?p= принимает короткое имя и полный id, чужое отбрасывает', () => {
    expect(resolvePresetParam('finance', 'pervichka')).toBe('finance-pervichka')
    expect(resolvePresetParam('finance', 'finance-otchet')).toBe('finance-otchet')
    expect(resolvePresetParam('finance', 'kontur-stocks')).toBeUndefined()
    expect(resolvePresetParam('finance', null)).toBeUndefined()
  })

  it('у каждого пресета есть подсказка хотя бы к эталону', () => {
    for (const p of Object.values(quizPresets)) {
      expect(p.hints.hasEtalon, p.id).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: Запустить, убедиться, что падают**

Run: `npx vitest run app/data/landings`
Expected: FAIL, `presetsForLanding` is not exported

- [ ] **Step 3: Пресеты**

```ts
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
```

- [ ] **Step 4: Экспорт из index.ts**

Добавить в `app/data/landings/index.ts`:

```ts
export { presetsForLanding, quizPresets, resolvePresetParam } from './presets'
```

- [ ] **Step 5: Запустить тесты**

Run: `npx vitest run app/data/landings && npm run typecheck`
Expected: PASS, 8 tests

- [ ] **Step 6: Commit**

```bash
git add app/data/landings/presets.ts app/data/landings/index.ts app/data/landings/landings.test.ts
git commit -m "feat(landings): шестнадцать пресетов квиза и разбор ?p="
```

---

### Task 8: Тексты `/kontur`

**Files:**
- Create: `app/data/landings/kontur.ts`

- [ ] **Step 1: Файл текстов**

```ts
// app/data/landings/kontur.ts
import type { LandingCopy } from './types'

export const kontur: LandingCopy = {
  meta: {
    title: 'Интеграция 1С с маркетплейсами и CRM: один контур данных · webkoth',
    description:
      'Подключаю кабинеты Wildberries, Ozon и Яндекс Маркета к 1С, собираю продажи, выплаты и остатки в одно место и сверяю до единицы. Данные лежат у вас. Разбор бесплатно.',
  },
  nav: { quiz: 'Разобрать процесс', how: 'Как это работает', cases: 'Кейсы', pricing: 'Цены', faq: 'Вопросы', cta: 'Заявка' },
  hero: {
    eyebrow: 'Интеграционный контур · 1С, маркетплейсы, CRM',
    title: '1С, маркетплейсы и CRM в одном контуре. Без ручных выгрузок',
    sub: 'Подключаю кабинеты Wildberries, Ozon и Яндекс Маркета к 1С, собираю продажи, выплаты и остатки в одно место и сверяю до единицы товара. Данные лежат у вас, а не у сервиса.',
    primaryCta: 'Оставить заявку',
    secondaryCta: 'Посмотреть кейс',
  },
  heroCase: { eyebrow: 'Кейс', title: 'Выплаты и комиссии площадок сходятся до копейки' },
  quiz: {
    eyebrow: 'Три минуты',
    title: 'Какой процесс разбираем',
    lead: 'Восемь вопросов из открытого стандарта. В конце вердикт: программа по расписанию, конвейер с ИИ-шагом, агент или человек. Результат можно сразу отправить мне вместе с заявкой.',
    disclaimer: 'Ответы никуда не уходят, пока вы не нажмёте кнопку. Внутри таблица решений, без модели.',
    presetQuestion: 'Что связываем?',
    ownLabel: 'Свой процесс',
    ownPlaceholder: 'Например: возвраты с Ozon в 1С',
    ownSubmit: 'Дальше',
    meaning: {
      stopEtalon: 'Интеграцию нечем принять: нет месяца, где всё сошлось. Начинаем со сверки руками за один период, это и будет эталон.',
      stopData: 'Данные разрознены. Первый шаг: снимок отчётов площадок и выгрузок 1С как есть, в одно место. Потом интеграция.',
      f0: 'Этот обмен можно не делать: измените соседний шаг, и сверять будет нечего.',
      f1: 'Редкий обмен дешевле делать руками с помощником. Вернёмся, когда частота вырастет.',
      f3: 'Это программа по расписанию: правило полное, модель внутри не нужна. Обычный случай для обмена 1С с площадками.',
      f4: 'Вход свободный, правило чёткое: модель читает, код проверяет и пишет в 1С только после проверки по справочникам.',
      f1f2: 'Проверить может только ваш бухгалтер. Значит, инструмент ему в руки, а не автомат вместо него.',
      split: 'Это не один обмен, а цепочка. Разложим на шаги с контрольными точками, каждому свой вердикт.',
      f5: 'Шаги заранее не известны: агент, но только на чтение и с бюджетом. Запись в 1С остаётся за кодом.',
    },
    cta: 'Обсудить этот вердикт',
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Четыре шага от кабинетов до сходящихся цифр',
    steps: [
      { title: 'Карта систем и API', body: 'Какие конфигурации 1С, какие кабинеты, какая CRM, что уже обменивается. Один день, только чтение.' },
      { title: 'Снимок данных как есть', body: 'Каждый ответ площадки и каждая выгрузка 1С сохраняются до разбора. История не зависит от того, что площадка хранит 90 дней.' },
      { title: 'Витрины и сверка', body: 'Продажи, выплаты, комиссии и остатки в одной модели. Сверка до единицы товара, расхождения именованы, а не спрятаны.' },
      { title: 'Подключение 1С и CRM', body: 'Обмен по расписанию с журналом, идемпотентностью и мониторингом. Сломалось: узнаём мы, а не ваш бухгалтер в конце месяца.' },
    ],
  },
  standardNote: {
    title: 'Что стандартизировано, а что под вас',
    standard: 'Процедура: вердикт по каждому шагу, снимок данных как есть, контур production с журналом и выключателем. Это открытый стандарт, его можно прочитать до разговора.',
    individual: 'Всё внутри вашего процесса: конфигурация 1С, набор кабинетов, правила сверки, кому и что показывать. Это видно по кейсам, они не похожи друг на друга.',
  },
  cases: { eyebrow: 'Кейсы', title: 'Что уже сделано по этой схеме' },
  pricing: {
    eyebrow: 'Цены',
    title: 'Вилки, после разбора точнее',
    note: 'Цена зависит от числа кабинетов и конфигурации 1С. Точную называю после карты систем, не раньше.',
    steps: [
      { title: 'Карта систем', price: 'бесплатно', body: 'Разбор за 30 минут и карта: что связываем, что нет.' },
      { title: 'Интеграция', price: '150–600 тыс. ₽', body: 'Снимок, витрины, сверка, обмен с 1С и CRM, контур production.' },
      { title: 'Сопровождение', price: '15–50 тыс. ₽ в месяц', body: 'Площадки меняют API, 1С обновляется. Слежу, чиню, расширяю.' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что обычно спрашивают',
    items: [
      { q: 'У нас нетиповая 1С с доработками', a: 'Это норма, а не исключение. Обмен идёт через API или OData, доработки конфигурации не трогаю. Карта систем покажет, где что подключено.' },
      { q: 'Площадки постоянно меняют API', a: 'Поэтому снимок хранится как есть и расчёт идёт из снимка. Когда площадка меняет формат, переписывается один разбор, история не теряется.' },
      { q: 'Мы не отдадим данные наружу', a: 'Контур ставится на ваш сервер, данные лежат у вас. Мне нужен доступ на чтение к кабинетам и к 1С на время работы, потом его можно отозвать.' },
      { q: 'А вы один?', a: 'Один, и это видно по кейсам: несколько систем в production у одной компании. Код, документация и доступы остаются у вас, поддерживать может не только я.' },
    ],
  },
  lead: { eyebrow: 'Заявка', title: 'Разобрать ваш контур', sub: 'Напишите, какие системы у вас есть и что не сходится. Отвечаю в тот же день.' },
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок (файл ещё не подключён, но компилируется)

- [ ] **Step 3: Commit**

```bash
git add app/data/landings/kontur.ts
git commit -m "content(landings): тексты страницы /kontur"
```

---

### Task 9: Тексты `/it-director`

**Files:**
- Create: `app/data/landings/it-director.ts`

- [ ] **Step 1: Файл текстов**

```ts
// app/data/landings/it-director.ts
import type { LandingCopy } from './types'

export const itDirector: LandingCopy = {
  meta: {
    title: 'ИТ-директор на аутсорсе для компании 10–200 человек · webkoth',
    description:
      'Знаю, что у вас крутится, где, кто имеет доступ и что сломается завтра. Аудит инфраструктуры за неделю, потом держу контур за фиксированную плату в месяц.',
  },
  nav: { quiz: 'Разобрать процесс', how: 'Как это работает', cases: 'Кейсы', pricing: 'Цены', faq: 'Вопросы', cta: 'Заявка' },
  hero: {
    eyebrow: 'ИТ-директор на аутсорсе',
    title: 'ИТ-директор на аутсорсе для компании 10–200 человек',
    sub: 'Знаю, что у вас крутится, где, кто имеет доступ и что сломается завтра. Аудит за неделю, только на чтение. Потом держу контур за фиксированную плату в месяц.',
    primaryCta: 'Разобрать мою инфраструктуру',
    secondaryCta: 'Заявка',
  },
  symptoms: {
    eyebrow: 'Узнаёте себя',
    title: 'Три признака, что ИТ живёт само по себе',
    items: [
      'Пароли и ключи лежат в переписке, а кто к чему имеет доступ, не знает никто.',
      'На сервере крутится сервис, который никто не может назвать. Выключить страшно.',
      'Бэкап есть, но восстановление из него не делали ни разу.',
      'Подрядчик ушёл, а код, доступы и документация ушли вместе с ним.',
    ],
  },
  quiz: {
    eyebrow: 'Три минуты',
    title: 'Какой процесс разбираем',
    lead: 'Восемь вопросов из открытого стандарта. В конце вердикт: что закрывается программой и регламентом, где нужен человек, а что не трогать. Результат можно отправить мне вместе с заявкой.',
    disclaimer: 'Ответы никуда не уходят, пока вы не нажмёте кнопку. Внутри таблица решений, без модели.',
    presetQuestion: 'Что болит сильнее?',
    ownLabel: 'Своя задача',
    ownPlaceholder: 'Например: переезд с одного хостинга на другой',
    ownSubmit: 'Дальше',
    meaning: {
      stopEtalon: 'Нет примера «как правильно», значит нет и приёмки. Начинаем с одной системы, описанной полностью: что, где, кто.',
      stopData: 'Данных об инфраструктуре нет. Первый шаг всегда один: аудит только на чтение и учёт систем, доступов и владельцев.',
      f0: 'Этот шаг можно убрать. Часть инфраструктуры держится по привычке, а не по нужде.',
      f1: 'Редкое и дешёвое делаем руками с помощником. Регламент на одну страницу закроет это лучше системы.',
      f3: 'Это программа или скрипт по расписанию: бэкапы, проверки, оповещения. Модель здесь не нужна.',
      f4: 'Вход свободный, правило чёткое: модель читает, код проверяет и действует только после подтверждения.',
      f1f2: 'Оценить может только инженер. Значит, инструмент ему, а не автомат вместо него.',
      split: 'Это не шаг, а проект. Разложим на этапы с контрольными точками, каждому свой вердикт.',
      f5: 'Шаги заранее не известны: агент на чтение с бюджетом, например аудит. Изменения в инфраструктуре остаются за человеком.',
    },
    cta: 'Обсудить этот вердикт',
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Четыре шага от «никто не знает» к контуру',
    steps: [
      { title: 'Аудит только на чтение', body: 'Прохожу серверы, репозитории и домены коллектором, который не пишет и не собирает секреты. Через неделю отчёт: что живое, что мёртвое, что срочно.' },
      { title: 'Учёт систем и доступов', body: 'Панель: серверы, сервисы, домены, базы, кто имеет доступ, кто владелец. Один ответ на вопрос «что у нас есть».' },
      { title: 'Контур production', body: 'Бэкапы с проверкой восстановления, мониторинг с оповещением, выключатель у каждого сервиса, доступы по ролям.' },
      { title: 'Ежемесячный ретейнер', body: 'План изменений, ревью работы подрядчиков, приёмка новых систем по чеклисту. Вы знаете, что происходит, до того как сломалось.' },
    ],
  },
  standardNote: {
    title: 'Что стандартизировано, а что под вас',
    standard: 'Чеклист контура production и процедура аудита. Это открытый стандарт: что должно быть у каждой системы, чтобы она считалась внедрённой, а не навайбкоженной.',
    individual: 'Ваш набор систем, ваши подрядчики, ваши риски. Что чинить первым, решаем по фактам аудита, а не по прайсу.',
  },
  cases: { eyebrow: 'Кейсы', title: 'Что уже сделано по этой схеме' },
  pricing: {
    eyebrow: 'Цены',
    title: 'Вилки, после разбора точнее',
    note: 'Аудит стоит по объёму инфраструктуры, ретейнер по числу систем и подрядчиков. Точную цену называю после первого разговора.',
    steps: [
      { title: 'Разбор', price: 'бесплатно', body: '30 минут: что у вас есть по вашим словам и с чего начать.' },
      { title: 'Аудит и карта', price: '90–300 тыс. ₽', body: 'Неделя, только чтение. Отчёт с находками и планом: срочное, важное, не трогать.' },
      { title: 'Ретейнер', price: '80–200 тыс. ₽ в месяц', body: 'Функция ИТ-директора: учёт, контур, план, приёмка подрядчиков.' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что обычно спрашивают',
    items: [
      { q: 'А если вы заболеете?', a: 'Учёт и документация лежат у вас, а не у меня. Первую линию, замену клавиатур и принтеры, держит ваш админ или аутсорсер, я держу управленческий слой.' },
      { q: 'У нас есть системный администратор', a: 'Хорошо, он остаётся. Я не заменяю админа, я отвечаю на вопросы «что у нас есть, что сломается и что делать первым», которые админу обычно не задают.' },
      { q: 'Нужна поддержка 24/7', a: 'Круглосуточную первую линию я не продаю. Мониторинг с оповещением стоит так, чтобы вы узнали о поломке первыми, а не от клиента.' },
      { q: 'Что вы делаете с нашими доступами', a: 'Аудит идёт только на чтение, секреты не собираются по построению коллектора. Доступы выдаются на время и отзываются после.' },
    ],
  },
  lead: { eyebrow: 'Заявка', title: 'Разобрать вашу инфраструктуру', sub: 'Напишите, сколько у вас систем и подрядчиков и что беспокоит. Отвечаю в тот же день.' },
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок

- [ ] **Step 3: Commit**

```bash
git add app/data/landings/it-director.ts
git commit -m "content(landings): тексты страницы /it-director"
```

---

### Task 10: Тексты `/agent`

**Files:**
- Create: `app/data/landings/agent.ts`

- [ ] **Step 1: Файл текстов**

```ts
// app/data/landings/agent.ts
import type { LandingCopy } from './types'

export const agent: LandingCopy = {
  meta: {
    title: 'Нужен ли вам ИИ-агент: вердикт по процессу за 30 минут · webkoth',
    description:
      'ИИ у вас уже есть. Он просто не работает. За 30 минут разбираю один процесс и говорю честно: где нужен агент, где хватит программы, что не трогать. Бесплатно, по открытому стандарту.',
  },
  nav: { quiz: 'Вердикт онлайн', how: 'Как это работает', cases: 'Кейсы', pricing: 'Цены', faq: 'Вопросы', cta: 'Заявка' },
  hero: {
    eyebrow: 'Агенты для бизнеса · вердикт по стандарту',
    title: 'ИИ у вас уже есть. Он просто не работает',
    sub: 'За 30 минут разбираю один ваш процесс и говорю честно: где нужен агент, где хватит программы, а что не трогать вообще. Бесплатно, по открытому стандарту, без презумпции внедрения.',
    primaryCta: 'Получить вердикт',
    secondaryCta: 'Заявка на разбор',
  },
  symptoms: {
    eyebrow: 'Узнаёте себя',
    title: 'Три признака, что агент появился раньше процесса',
    items: [
      'Навайбкодили прототип, все обрадовались, через месяц им никто не пользуется.',
      'Агент работает, но никто не знает, сколько он стоит в месяц и что он может сделать сам.',
      'Отчёт «собирается автоматически», а потом его всё равно правят руками.',
      'Три захода на одну задачу, три мёртвых репозитория, вопрос «а нужен ли тут ИИ» не задавали.',
    ],
  },
  quiz: {
    eyebrow: 'Три минуты',
    title: 'Какой процесс разбираем',
    lead: 'Восемь вопросов открытого стандарта AIAS. В конце вердикт: программа, конвейер с ИИ-шагом, агент, человек с помощником или не трогать. Половина вердиктов по этому стандарту не про ИИ.',
    disclaimer: 'Ответы никуда не уходят, пока вы не нажмёте кнопку. Внутри таблица решений, без модели.',
    presetQuestion: 'Какой процесс разбираем?',
    ownLabel: 'Свой процесс',
    ownPlaceholder: 'Например: ответы на отзывы на площадках',
    ownSubmit: 'Дальше',
    meaning: {
      stopEtalon: 'Прошлые попытки умерли здесь: не было примера «вот так правильно». Соберите пять пар вход и правильный выход, это и эталон, и будущие тесты.',
      stopData: 'Агент поверх хаоса выдаёт уверенные ошибки. Сначала данные в одном месте, потом любой разговор об агентах.',
      f0: 'Лучшая автоматизация та, которой нет. Этот шаг можно убрать.',
      f1: 'Редкое и дешёвое не окупит разработку никогда. Руками с помощником в диалоге.',
      f3: 'Правило записывается полностью: это программа, без модели внутри. ИИ уместен, когда её пишут, а не когда она работает.',
      f4: 'Модель делает один шаг: читает свободный вход и отдаёт структуру по схеме. Ходом управляет код, спорное уходит человеку.',
      f1f2: 'Проверить может только эксперт. ИИ помогает эксперту, а не заменяет его.',
      split: 'Это процесс без карты, а не агент. Разложим на шаги и прогоним каждый через те же вопросы.',
      f5: 'Здесь агент уместен: шаги заранее не известны, ошибка дешёвая, только чтение. С бюджетом, журналом и выключателем.',
    },
    cta: 'Обсудить этот вердикт',
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Четыре шага от прототипа до процесса',
    steps: [
      { title: 'Разбор за 30 минут', body: 'Паспорт одного процесса вашими словами и восемь вопросов на глазах. Вы уходите с вердиктом по шагам, даже если дальше не идём.' },
      { title: 'Аудит и карта', body: 'Кладбище прототипов: что живое, что мёртвое, почему. Карта процессов: что программе, что ИИ-шагу, что агенту, что человеку.' },
      { title: 'Первый процесс до production', body: 'Один процесс с контуром: эталон, очередь исключений, журнал, бюджет, выключатель. Ваш специалист пишет логику, я держу рельсы.' },
      { title: 'Сопровождение', body: 'Ревью изменений, вывод в production, следующие процессы по той же процедуре.' },
    ],
  },
  standardNote: {
    title: 'Что стандартизировано, а что под вас',
    standard: 'Восемь вопросов, шесть форм автоматизации, шкала автономии и чеклист приёмки. Открытый стандарт AIAS, спецификация и библиотека процессов лежат на GitHub.',
    individual: 'Ваш процесс, ваш эталон, ваша цена ошибки. Вердикт ставится шагу, а не индустрии, поэтому двух одинаковых карт не бывает.',
  },
  cases: { eyebrow: 'Кейсы', title: 'Агенты, которые дожили до production' },
  pricing: {
    eyebrow: 'Цены',
    title: 'Ступени, после разбора точнее',
    note: 'Первый шаг бесплатный и ни к чему не обязывает. Дальше цена по объёму: сколько процессов, сколько систем.',
    steps: [
      { title: 'Разбор', price: 'бесплатно', body: '30 минут, один процесс, вердикт по шагам.' },
      { title: 'Аудит и карта', price: '150–250 тыс. ₽', body: 'Две-три недели: кладбище, карта процессов, базовая линия, что первым.' },
      { title: 'Первый процесс', price: '400–800 тыс. ₽', body: 'Четыре-шесть недель: контур, обучение вашего специалиста, production.' },
      { title: 'Сопровождение', price: '100–200 тыс. ₽ в месяц', body: 'Ревью, вывод в production, следующие процессы.' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что обычно спрашивают',
    items: [
      { q: 'Мы уже пробовали, не взлетело', a: 'Обычно у пробы не было эталона или данных, и это выясняется за первые десять минут разбора. Это находка, а не приговор: половина вердиктов по стандарту не про ИИ.' },
      { q: 'А вы один?', a: 'Один, и кейсы это показывают: несколько систем в production, где логику пишут специалисты компании, а я держу рельсы. Код и доступы остаются у вас.' },
      { q: '152-ФЗ и зарубежные модели', a: 'Персональные данные это ворота стандарта: либо российский контур модели, либо маскирование до отправки. Выбор модели не влияет на процедуру.' },
      { q: 'Сколько стоит агент в месяц?', a: 'Отдельная строка в карточке процесса: бюджет на ключ, который агент физически не может превысить. Без этой строки агент в production не выпускается.' },
    ],
  },
  lead: { eyebrow: 'Заявка', title: 'Разобрать ваш процесс', sub: 'Напишите, какой процесс болит и что уже пробовали. Отвечаю в тот же день.' },
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок

- [ ] **Step 3: Commit**

```bash
git add app/data/landings/agent.ts
git commit -m "content(landings): тексты страницы /agent"
```

---

### Task 11: Тексты `/finance`

**Files:**
- Create: `app/data/landings/finance.ts`

- [ ] **Step 1: Файл текстов**

```ts
// app/data/landings/finance.ts
import type { LandingCopy } from './types'

export const finance: LandingCopy = {
  meta: {
    title: 'Первичка сама в 1С, отчёт за полчаса: управленческий финансовый контур · webkoth',
    description:
      'Счета и акты из почты уходят в 1С с проверкой по справочникам, спорное к вам в очередь. Выручка, выплаты площадок и кассовый разрыв в одном отчёте, который развивает ваш финансист.',
  },
  nav: { quiz: 'Разобрать процесс', how: 'Как это работает', cases: 'Кейсы', pricing: 'Цены', faq: 'Вопросы', cta: 'Заявка' },
  hero: {
    eyebrow: 'Финансовый контур · первичка и отчётность',
    title: 'Видно деньги: первичка сама попадает в 1С, отчёт собирается за полчаса',
    sub: 'Счета и акты из почты уходят в 1С с проверкой по справочникам, спорное к вам в очередь. Выручка, выплаты площадок и кассовый разрыв в одном отчёте, который развивает ваш финансист, а не программист.',
    primaryCta: 'Оставить заявку',
    secondaryCta: 'Посмотреть кейс',
  },
  heroCase: { eyebrow: 'Кейс', title: 'Отчёт за полчаса вместо недель, и его развивает финансист' },
  quiz: {
    eyebrow: 'Три минуты',
    title: 'Какой процесс разбираем',
    lead: 'Восемь вопросов из открытого стандарта. В конце вердикт: программа, конвейер с ИИ-шагом или человек. Канонические цифры считает только код, это правило стандарта.',
    disclaimer: 'Ответы никуда не уходят, пока вы не нажмёте кнопку. Внутри таблица решений, без модели.',
    presetQuestion: 'Что автоматизируем?',
    ownLabel: 'Свой процесс',
    ownPlaceholder: 'Например: акты сверки с контрагентами',
    ownSubmit: 'Дальше',
    meaning: {
      stopEtalon: 'Нет месяца, который сошёлся и принят. Начинаем с него руками, это эталон и будущие тесты.',
      stopData: 'Данные в головах и чатах. Первый шаг: 1С, банки и площадки в одно место по расписанию. Потом отчёт.',
      f0: 'Этот отчёт никто не читает. Уберём шаг, а не автоматизируем его.',
      f1: 'Редкое и дешёвое делаем руками с помощником в диалоге.',
      f3: 'Правило полное: это программа. Маржа, выплаты и остатки считаются кодом с тестами, без модели.',
      f4: 'Вход свободный, правило чёткое: модель читает документ, код проверяет по справочникам и пишет в 1С. Спорное к вам в очередь.',
      f1f2: 'Проверить может только главбух. Инструмент ему в руки, черновик по умолчанию.',
      split: 'Это цепочка, а не шаг: сбор, проверка, проводка, отчёт. Каждому свой вердикт.',
      f5: 'Агент здесь только на чтение: спросить «сколько мы заработали в марте» поверх витрин. Считать канон он не будет.',
    },
    cta: 'Обсудить этот вердикт',
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Четыре шага от почты до отчёта',
    steps: [
      { title: 'Источники', body: '1С, банки, кабинеты площадок, почта с документами. Что отдаёт API, что приходит файлом, что руками. Один день на карту.' },
      { title: 'Первичка', body: 'Распознавание счетов и актов, проверка по справочникам контрагентов и номенклатуры, загрузка в 1С. Всё, что не прошло проверку, в очередь бухгалтеру с контекстом.' },
      { title: 'Витрины и отчёт', body: 'Выручка, выплаты, комиссии, остатки и кассовый разрыв в одной модели. Каждая цифра кликается до документа.' },
      { title: 'Финансист развивает сам', body: 'Правила и формулы правит ваш специалист в рельсах: тесты, две среды, путь в production только через проверку. Я держу рельсы.' },
    ],
  },
  standardNote: {
    title: 'Что стандартизировано, а что под вас',
    standard: 'Процедура из открытого стандарта: канонические цифры считает только код, у ИИ-шага есть эталон и очередь исключений, необратимое исполняет код после утверждения человеком.',
    individual: 'Ваш план счетов, ваши статьи, ваши площадки и банки. Формулы маржи и правила отнесения затрат записываются под вас и лежат у вас.',
  },
  cases: { eyebrow: 'Кейсы', title: 'Что уже сделано по этой схеме' },
  pricing: {
    eyebrow: 'Цены',
    title: 'Вилки, после разбора точнее',
    note: 'Первичка и отчёт это два разных проекта, их можно делать по отдельности. Цена зависит от числа источников и объёма документов.',
    steps: [
      { title: 'Разбор', price: 'бесплатно', body: '30 минут: какие источники, сколько документов в месяц, что не сходится.' },
      { title: 'Первичка в 1С', price: '150–400 тыс. ₽ + 10–30 тыс. ₽ в месяц', body: 'Распознавание, проверка по справочникам, загрузка в 1С, очередь исключений.' },
      { title: 'Управленческий отчёт', price: '200–500 тыс. ₽ + 20–60 тыс. ₽ в месяц', body: 'Витрины из 1С, банков и площадок, отчёт с кликом до документа, обучение финансиста.' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что обычно спрашивают',
    items: [
      { q: 'У нас есть SaaS для управленки за 5 тысяч в месяц', a: 'Если у вас один банк и одна 1С, он вам подходит, и я так и скажу на разборе. Я нужен там, где несколько 1С, кабинеты площадок, выписки и себестоимость, которую сервис не подтягивает.' },
      { q: 'Бухгалтер не программист', a: 'И не должен быть. Он правит правила и формулы в понятной форме, а тесты и две среды не дают сломать production. В кейсе финансового контура так написана большая часть кода.' },
      { q: 'Кто отвечает за ошибку в 1С?', a: 'Первичка попадает в 1С только после проверки по справочникам, а спорное идёт человеку в очередь. Необратимое, платежи и документы, исполняет код после утверждения человеком. Это правило стандарта, не пожелание.' },
      { q: '1С уже умеет распознавать документы', a: 'Умеет, и иногда этого хватает. Я продаю не распознавание, а сквозной процесс: письмо пришло, документ в 1С, спорное у бухгалтера, ничего не потерялось.' },
    ],
  },
  lead: { eyebrow: 'Заявка', title: 'Разобрать ваши финансы', sub: 'Напишите, откуда приходят документы и какой отчёт собирается руками. Отвечаю в тот же день.' },
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок

- [ ] **Step 3: Commit**

```bash
git add app/data/landings/finance.ts
git commit -m "content(landings): тексты страницы /finance"
```

---

### Task 12: Индекс текстов и тесты содержания

**Files:**
- Modify: `app/data/landings/index.ts`
- Modify: `app/data/landings/landings.test.ts`

- [ ] **Step 1: Падающие тесты содержания**

Добавить в `landings.test.ts`:

```ts
import { landingCopy } from './index'

const NO_DASH = /—/

describe('тексты лендингов', () => {
  it('у каждого лендинга есть тексты, скелет совпадает с наличием блоков', () => {
    for (const slug of LANDING_SLUGS) {
      const copy = landingCopy[slug]
      const meta = landingMeta[slug]
      expect(copy.meta.title.length, `${slug}/title`).toBeLessThanOrEqual(80)
      expect(copy.meta.description.length, `${slug}/description`).toBeLessThanOrEqual(200)
      if (meta.skeleton === 'symptoms-first') {
        expect(copy.symptoms, slug).toBeDefined()
        expect(copy.heroCase, slug).toBeUndefined()
      } else {
        expect(copy.heroCase, slug).toBeDefined()
        expect(copy.symptoms, slug).toBeUndefined()
      }
    }
  })

  it('в текстах нет длинных тире', () => {
    for (const slug of LANDING_SLUGS) {
      expect(JSON.stringify(landingCopy[slug]), slug).not.toMatch(NO_DASH)
    }
  })

  it('«что это значит для вас» задано для всех форм вердикта', () => {
    const forms = ['stopEtalon', 'stopData', 'f0', 'f1', 'f3', 'f4', 'f1f2', 'split', 'f5'] as const
    for (const slug of LANDING_SLUGS) {
      for (const form of forms) {
        expect(landingCopy[slug].quiz.meaning[form].length, `${slug}/${form}`).toBeGreaterThan(20)
      }
    }
  })

  it('первый экран трёх страниц не начинается со слова ИИ', () => {
    for (const slug of ['kontur', 'it-director', 'finance'] as const) {
      expect(landingCopy[slug].hero.title.startsWith('ИИ'), slug).toBe(false)
    }
  })
})
```

- [ ] **Step 2: Запустить, убедиться, что падают**

Run: `npx vitest run app/data/landings`
Expected: FAIL, `landingCopy` is not exported

- [ ] **Step 3: Собрать индекс**

Дополнить `app/data/landings/index.ts`:

```ts
import { kontur } from './kontur'
import { itDirector } from './it-director'
import { agent } from './agent'
import { finance } from './finance'
import type { LandingCopy, LandingSlug } from './types'

export const landingCopy: Record<LandingSlug, LandingCopy> = {
  kontur,
  'it-director': itDirector,
  agent,
  finance,
}
```

(импорт `LandingSlug` уже есть, добавить `LandingCopy` в него.)

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run app/data/landings && npm run typecheck`
Expected: PASS, 12 tests

- [ ] **Step 5: Commit**

```bash
git add app/data/landings/index.ts app/data/landings/landings.test.ts
git commit -m "feat(landings): индекс текстов и тесты содержания"
```

---

### Task 13: Строка ответов и контекст заявки

**Files:**
- Create: `lib/standard/quiz-summary.ts`
- Test: `lib/standard/quiz-summary.test.ts`

- [ ] **Step 1: Падающий тест**

```ts
// lib/standard/quiz-summary.test.ts
import { describe, expect, it } from 'vitest'
import { verdictQuizData } from '@/app/data/standard-quiz'
import { buildLeadContext, summarizeAnswers } from './quiz-summary'

const copy = verdictQuizData.ru

describe('summarizeAnswers', () => {
  it('перечисляет только данные ответы, подписями из копии квиза', () => {
    const s = summarizeAnswers({ hasEtalon: true, dataReady: true, useful: 'yes', rule: 'freeInput' }, copy)
    expect(s).toBe('эталон есть · данные есть · часто или дорого · правило чёткое, вход свободный')
  })

  it('пустые ответы дают пустую строку', () => {
    expect(summarizeAnswers({}, copy)).toBe('')
  })

  it('последствия подписываются кратко', () => {
    const s = summarizeAnswers({ sideEffect: 'write', irreversible: true, personalData: false }, copy)
    expect(s).toBe('пишет наружу · необратимое есть · персданных нет')
  })
})

describe('buildLeadContext', () => {
  it('собирает паспорт для поля заявки', () => {
    const text = buildLeadContext({
      landingTitle: 'Видно деньги',
      presetLabel: 'Первичка в 1С',
      formTag: 'F4',
      formTitle: 'Конвейер с ИИ-шагом',
      summary: 'эталон есть · данные есть',
    })
    expect(text).toBe('Страница: Видно деньги\nПроцесс: Первичка в 1С\nВердикт: F4, Конвейер с ИИ-шагом\nОтветы: эталон есть · данные есть\n\nЧто хочу обсудить: ')
  })
})
```

- [ ] **Step 2: Запустить, убедиться, что падает**

Run: `npx vitest run lib/standard/quiz-summary.test.ts`
Expected: FAIL, `Cannot find module './quiz-summary'`

- [ ] **Step 3: Реализовать**

```ts
// lib/standard/quiz-summary.ts
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
```

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run lib/standard`
Expected: PASS (включая старые тесты вердикта)

- [ ] **Step 5: Commit**

```bash
git add lib/standard/quiz-summary.ts lib/standard/quiz-summary.test.ts
git commit -m "feat(quiz): строка ответов и контекст заявки"
```

---

### Task 14: Квиз в режиме лендинга

**Files:**
- Modify: `components/standard/verdict-quiz.tsx`

- [ ] **Step 1: Импорты и тип режима**

В начало `components/standard/verdict-quiz.tsx` после существующих импортов:

```ts
import { useEffect, useState } from 'react'   // заменить существующий import { useState } from 'react'
import type { LandingCopy, LandingSlug, QuizPreset, QuizPresetId } from '@/app/data/landings'
import { ymGoal } from '@/lib/analytics/ym'
import { buildLeadContext, summarizeAnswers } from '@/lib/standard/quiz-summary'

// Режим лендинга: шаг 0 «какой процесс разбираем», подсказки пресета, абзац
// «что это значит для вас» и заявка с контекстом. Без него квиз работает как
// на странице стандарта.
export type QuizLandingMode = {
  slug: LandingSlug
  title: string
  copy: LandingCopy['quiz']
  presets: QuizPreset[]
  initialPresetId?: QuizPresetId
}

type ChosenPreset = { id?: QuizPresetId; label: string; hints: QuizPreset['hints']; library: QuizPreset['library'] }
```

- [ ] **Step 2: Экран выбора пресета**

Добавить компонент перед `ResultView`:

```tsx
function PresetStep({
  copy,
  presets,
  onPick,
}: {
  copy: LandingCopy['quiz']
  presets: QuizPreset[]
  onPick: (p: ChosenPreset) => void
}) {
  const [own, setOwn] = useState('')
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">0 / {TOTAL_STEPS}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{copy.presetQuestion}</h2>
      <div className="mt-5 grid gap-3">
        {presets.map((p) => (
          <OptionButton key={p.id} label={p.label} onClick={() => onPick({ id: p.id, label: p.label, hints: p.hints, library: p.library })} />
        ))}
        <form
          className="rounded-xl border border-dashed border-border p-4"
          onSubmit={(e) => {
            e.preventDefault()
            const label = own.trim()
            if (label.length < 3) return
            onPick({ label, hints: {}, library: [] })
          }}
        >
          <label className="block text-sm font-medium">{copy.ownLabel}</label>
          <div className="mt-2 flex gap-2">
            <input
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              placeholder={copy.ownPlaceholder}
              maxLength={120}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {copy.ownSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Результат с абзацем лендинга и заявкой с контекстом**

Изменить сигнатуру и тело `ResultView`:

```tsx
function ResultView({
  lang,
  answers,
  ctaLabel,
  onRestart,
  landing,
  preset,
}: {
  lang: Lang
  answers: Answers
  ctaLabel: string
  onRestart: () => void
  landing?: QuizLandingMode
  preset?: ChosenPreset | null
}) {
  const copy = verdictQuizData[lang].result
  const verdict: Verdict = decideVerdict(toInput(answers))
  const form = copy.forms[verdict.form]
  const lead = useLeadDialog()
  const linkCls =
    'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-foreground/80 transition hover:text-primary'

  useEffect(() => {
    ymGoal('quiz_result')
  }, [])

  const library = preset && preset.library.length > 0 ? preset.library : form.library
  const openLead = () => {
    if (!landing || !preset) {
      lead.open()
      return
    }
    lead.open({
      answer: buildLeadContext({
        landingTitle: landing.title,
        presetLabel: preset.label,
        formTag: form.tag,
        formTitle: form.title,
        summary: summarizeAnswers(answers, verdictQuizData[lang]),
      }),
      source: { landing: landing.slug, preset: preset.id, verdict: form.tag },
    })
  }
```

Дальше в разметке результата:
- после `<p className="mt-4 ...">{form.text}</p>` добавить:

```tsx
      {landing ? (
        <p className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
          {landing.copy.meaning[verdict.form]}
        </p>
      ) : null}
```

- заменить `{form.library?.map((l) => (` на `{library?.map((l) => (`;
- у кнопки заявки заменить `onClick={lead.open}` на `onClick={openLead}` и текст `{ctaLabel}` на `{landing ? landing.copy.cta : ctaLabel}`.

- [ ] **Step 4: Пропсы квиза, шаг 0, подсказки и цель старта**

Изменить сигнатуру `VerdictQuiz` и начало тела:

```tsx
export function VerdictQuiz({ lang, ctaLabel, landing }: { lang: Lang; ctaLabel: string; landing?: QuizLandingMode }) {
  const copy = verdictQuizData[lang]
  const [answers, setAnswers] = useState<Answers>({})
  const [history, setHistory] = useState<Answers[]>([])
  const [preset, setPreset] = useState<ChosenPreset | null>(() => {
    const initial = landing?.presets.find((p) => p.id === landing.initialPresetId)
    return initial ? { id: initial.id, label: initial.label, hints: initial.hints, library: initial.library } : null
  })
  const [started, setStarted] = useState(false)

  const needPreset = !!landing && preset === null
  const step = nextStep(answers)
```

В `set`:

```tsx
  const set = (patch: Answers) => {
    if (!started) {
      setStarted(true)
      ymGoal('quiz_start')
    }
    setHistory((h) => [...h, answers])
    setAnswers((a) => ({ ...a, ...patch }))
  }
```

В `restart` добавить `if (landing) setPreset(null)` первой строкой (если пришли с `?p=`, повторный старт тоже возвращает к выбору: так честнее, чем скрытый пресет).

Подсказки: объявить после `const q = copy.questions`:

```tsx
  // Подсказка пресета перекрывает общую подсказку вопроса, если она есть.
  const hint = (key: keyof QuizInput, fallback: string) => preset?.hints[key] ?? fallback
```

и в каждом `QuestionShell` заменить `hint={q.<key>.hint}` на `hint={hint('<key>', q.<key>.hint)}` для `hasEtalon`, `dataReady`, `useful`, `rule`, `check`, `singleRun`. Экран `consequences` оставить без изменений.

В разметке перед первым `{step === 'hasEtalon' && (` добавить:

```tsx
      {needPreset && landing ? (
        <PresetStep
          copy={landing.copy}
          presets={landing.presets}
          onPick={(p) => {
            setPreset(p)
            if (!started) {
              setStarted(true)
              ymGoal('quiz_start')
            }
          }}
        />
      ) : null}
```

и обернуть остальные экраны условием `!needPreset && step === '...'` (добавить `!needPreset &&` к каждому из семи условий, включая `result`).

Вызов результата: `<ResultView lang={lang} answers={answers} ctaLabel={ctaLabel} onRestart={restart} landing={landing} preset={preset} />`.

- [ ] **Step 5: Проверить, что страница стандарта не изменилась**

Run: `npm run typecheck && npm run lint && npx vitest run lib/standard`
Expected: без ошибок. Ручная проверка: `npm run dev`, открыть `/ru/standard/verdict`, пройти квиз до результата, кнопка открывает пустую форму. Без `landing` шаг 0 не показывается.

- [ ] **Step 6: Commit**

```bash
git add components/standard/verdict-quiz.tsx
git commit -m "feat(quiz): режим лендинга: пресеты, подсказки, заявка с контекстом, цели"
```

---

### Task 15: Угол кейса для лендинга

**Files:**
- Modify: `app/data/cases/index.ts`
- Modify: `app/data/cases/cases.test.ts`

- [ ] **Step 1: Падающий тест**

Добавить в `cases.test.ts`:

```ts
import { angleForCase } from './index'

describe('angleForCase', () => {
  it('отдаёт угол первого блока системы с полным набором полей', () => {
    const a = angleForCase('ru', 'finance-loop')
    expect(a.slug).toBe('finance-loop')
    expect(a.angle.headline.length).toBeGreaterThan(0)
    expect(a.otherBlocks.length).toBe(caseMeta['finance-loop'].blocks.length - 1)
  })
})
```

- [ ] **Step 2: Запустить, убедиться, что падает**

Run: `npx vitest run app/data/cases`
Expected: FAIL, `angleForCase` is not exported

- [ ] **Step 3: Реализовать**

В `app/data/cases/index.ts` после `anglesForBlock`:

```ts
/**
 * Угол системы для лендинга: карусель лендинга показывает каждую систему один
 * раз, углом её первого блока. `blocks[0]` есть всегда, тип кортежа непустой.
 */
export function angleForCase(lang: Lang, slug: CaseSlug): BlockAngle {
  const meta = caseMeta[slug]
  const copy = casesCopy[lang][slug]
  const block = meta.blocks[0]
  const angle = copy.angles[block]
  if (!angle) throw new Error(`angleForCase: ${lang}/${slug} has no angle for ${block}`)
  return { slug, meta, copy, angle, otherBlocks: meta.blocks.filter((b) => b !== block) }
}
```

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run app/data/cases`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/data/cases/index.ts app/data/cases/cases.test.ts
git commit -m "feat(cases): angleForCase для каруселей лендингов"
```

---

### Task 16: Блоки лендинга: первый экран, симптомы, главный кейс

**Files:**
- Create: `components/landings/landing-hero.tsx`
- Create: `components/landings/symptoms.tsx`
- Create: `components/landings/hero-case.tsx`

- [ ] **Step 1: Первый экран**

```tsx
// components/landings/landing-hero.tsx
'use client'

import { Button } from '@/components/ui/button'
import type { LandingCopy, LandingSkeleton } from '@/app/data/landings'
import { useLeadDialog } from '@/components/evolution/lead-dialog'

// Первый экран без анимаций главной: у кампании одна задача, довести до
// квиза или заявки. Пара кнопок зависит от скелета: symptoms-first ведёт в
// квиз и в заявку, case-first в заявку и к главному кейсу.
export function LandingHero({ copy, skeleton }: { copy: LandingCopy['hero']; skeleton: LandingSkeleton }) {
  const { open } = useLeadDialog()
  const quizFirst = skeleton === 'symptoms-first'
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-8 md:pt-24 md:pb-16">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{copy.sub}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {quizFirst ? (
          <>
            <Button size="lg" asChild>
              <a href="#quiz">{copy.primaryCta}</a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => open()}>
              {copy.secondaryCta}
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" onClick={() => open()}>
              {copy.primaryCta}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#hero-case">{copy.secondaryCta}</a>
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Симптомы**

```tsx
// components/landings/symptoms.tsx
import { AlertTriangle } from 'lucide-react'
import type { LandingCopy } from '@/app/data/landings'

export function Symptoms({ copy }: { copy: NonNullable<LandingCopy['symptoms']> }) {
  return (
    <section id="symptoms" className="mx-auto max-w-6xl border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.items.map((item) => (
          <li key={item} className="flex gap-3 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed md:text-[15px]">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Главный кейс**

```tsx
// components/landings/hero-case.tsx
import { angleForCase, type CaseSlug } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy } from '@/app/data/landings'
import { CaseCard } from '@/components/evolution/case-card'

// Скелет C: главный кейс сразу после первого экрана. Карточка та же, что в
// каруселях, чтобы «болело → стало» и характеристики читались одинаково везде.
export function HeroCase({ copy, slug }: { copy: NonNullable<LandingCopy['heroCase']>; slug: CaseSlug }) {
  const entry = angleForCase('ru', slug)
  const labels = evolutionData.ru.labels
  return (
    <section id="hero-case" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <div className="mt-8 max-w-3xl">
        <CaseCard entry={entry} lang="ru" labels={labels} />
      </div>
    </section>
  )
}
```

Если `CaseCard` требует другие пропсы (проверить сигнатуру в `components/evolution/case-card.tsx`, строка с `export function CaseCard`), передать ровно их: `entry`, `lang`, `labels` по образцу `block-section.tsx`.

- [ ] **Step 4: Проверить типы**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок

- [ ] **Step 5: Commit**

```bash
git add components/landings/landing-hero.tsx components/landings/symptoms.tsx components/landings/hero-case.tsx
git commit -m "feat(landings): первый экран, симптомы, главный кейс"
```

---

### Task 17: Блоки лендинга: как работает, стандарт, кейсы, цены, вопросы

**Files:**
- Create: `components/landings/how-it-works.tsx`
- Create: `components/landings/standard-note.tsx`
- Create: `components/landings/landing-cases.tsx`
- Create: `components/landings/pricing-steps.tsx`
- Create: `components/landings/faq.tsx`

- [ ] **Step 1: Как это работает и заметка о стандарте**

```tsx
// components/landings/how-it-works.tsx
import type { LandingCopy } from '@/app/data/landings'
import { StepChip } from '@/components/evolution/step-chip'
import { StandardNote } from './standard-note'

export function HowItWorks({ copy, note }: { copy: LandingCopy['how']; note: LandingCopy['standardNote'] }) {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              <StepChip>{String(i + 1).padStart(2, '0')}</StepChip>
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{step.body}</p>
          </li>
        ))}
      </ol>
      <StandardNote copy={note} />
    </section>
  )
}
```

```tsx
// components/landings/standard-note.tsx
import { ArrowUpRight } from 'lucide-react'
import type { LandingCopy } from '@/app/data/landings'

const STANDARD_URL = '/ru/standard'

export function StandardNote({ copy }: { copy: LandingCopy['standardNote'] }) {
  return (
    <div className="mt-8 grid gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 md:grid-cols-2 md:p-6">
      <h3 className="text-lg font-semibold tracking-tight md:col-span-2">{copy.title}</h3>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Стандарт</p>
        <p className="mt-2 text-sm leading-relaxed">{copy.standard}</p>
        <a href={STANDARD_URL} className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-primary">
          Открытый стандарт AIAS <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Под вас</p>
        <p className="mt-2 text-sm leading-relaxed">{copy.individual}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Карусель кейсов**

```tsx
// components/landings/landing-cases.tsx
import { angleForCase, type CaseSlug } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy } from '@/app/data/landings'
import { CaseCard } from '@/components/evolution/case-card'
import { CaseCarousel } from '@/components/evolution/case-carousel'

// Карусель та же, что на главной; состав и порядок задаёт реестр лендинга.
export function LandingCases({ copy, slugs }: { copy: LandingCopy['cases']; slugs: readonly CaseSlug[] }) {
  const labels = evolutionData.ru.labels
  const items = slugs.map((slug) => angleForCase('ru', slug))
  return (
    <section id="cases" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <div className="mt-8">
        <CaseCarousel
          items={items.map((item) => (
            <CaseCard key={item.slug} entry={item} lang="ru" labels={labels} />
          ))}
          labels={{
            aria: `${labels.carouselAria}: ${copy.title}`,
            prev: labels.carouselPrev,
            next: labels.carouselNext,
            counter: labels.carouselCounter,
            goTo: labels.carouselGoTo,
          }}
        />
      </div>
    </section>
  )
}
```

Сверить поля `CarouselLabels` с `components/evolution/case-carousel.tsx` (тип экспортируется там) и `block-section.tsx`, строки 33–38: набор ключей должен совпасть.

- [ ] **Step 3: Цены и вопросы**

```tsx
// components/landings/pricing-steps.tsx
import type { LandingCopy } from '@/app/data/landings'

export function PricingSteps({ copy }: { copy: LandingCopy['pricing'] }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{copy.note}</p>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {copy.steps.map((step) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 font-mono text-sm text-primary">{step.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

```tsx
// components/landings/faq.tsx
import type { LandingCopy } from '@/app/data/landings'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function Faq({ copy }: { copy: LandingCopy['faq'] }) {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
      <Accordion className="mt-8 max-w-3xl">
        {copy.items.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

Сверить API аккордеона с `components/ui/accordion.tsx` (это base-ui, не radix): если корню нужен проп режима, например `openMultiple`, добавить его по типу компонента.

- [ ] **Step 4: Проверить типы**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок

- [ ] **Step 5: Commit**

```bash
git add components/landings/how-it-works.tsx components/landings/standard-note.tsx components/landings/landing-cases.tsx components/landings/pricing-steps.tsx components/landings/faq.tsx
git commit -m "feat(landings): как работает, стандарт, кейсы, цены, вопросы"
```

---

### Task 18: Обёртка квиза и секция заявки

**Files:**
- Create: `components/landings/landing-quiz.tsx`
- Create: `components/landings/lead-section.tsx`

- [ ] **Step 1: Квиз с чтением `?p=`**

```tsx
// components/landings/landing-quiz.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { presetsForLanding, resolvePresetParam, type LandingCopy, type LandingSlug } from '@/app/data/landings'
import { VerdictQuiz } from '@/components/standard/verdict-quiz'

// `?p=` читается на клиенте, чтобы страница осталась статической. Suspense
// обязателен вокруг useSearchParams при статической сборке.
function QuizWithParams({ slug, title, copy }: { slug: LandingSlug; title: string; copy: LandingCopy['quiz'] }) {
  const params = useSearchParams()
  const initialPresetId = resolvePresetParam(slug, params.get('p'))
  return (
    <VerdictQuiz
      lang="ru"
      ctaLabel={copy.cta}
      landing={{ slug, title, copy, presets: presetsForLanding(slug), initialPresetId }}
    />
  )
}

export function LandingQuiz({ slug, title, copy }: { slug: LandingSlug; title: string; copy: LandingCopy['quiz'] }) {
  return (
    <section id="quiz" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
        <p className="mt-4 text-base text-muted-foreground">{copy.lead}</p>
        <p className="mt-2 text-xs text-muted-foreground">{copy.disclaimer}</p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <QuizWithParams slug={slug} title={title} copy={copy} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Секция заявки**

```tsx
// components/landings/lead-section.tsx
'use client'

import { useState } from 'react'
import { evolutionData } from '@/app/data/evolution'
import type { LandingCopy, LandingSlug } from '@/app/data/landings'
import { LeadForm } from '@/components/evolution/lead-form'

// Форма внизу страницы, как в финале главной, но с источником лендинга.
// startedAt считается от монтирования: антибот-таймер роута отсчитывает от него.
export function LeadSection({ copy, slug }: { copy: LandingCopy['lead']; slug: LandingSlug }) {
  const [startedAt] = useState(() => Date.now())
  const form = evolutionData.ru.finale.form
  return (
    <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 border-t border-border px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-base text-muted-foreground">{copy.sub}</p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm copy={form} lang="ru" startedAt={startedAt} source={{ landing: slug }} />
        </div>
      </div>
    </section>
  )
}
```

Сверить обязательные пропсы `LeadForm` в `components/evolution/lead-form.tsx` (`copy`, `lang`, `startedAt`, `onSuccess?`): если `onSuccess` обязателен, передать `onSuccess={() => undefined}`.

- [ ] **Step 3: Проверить типы**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок

- [ ] **Step 4: Commit**

```bash
git add components/landings/landing-quiz.tsx components/landings/lead-section.tsx
git commit -m "feat(landings): квиз с ?p= и секция заявки"
```

---

### Task 19: Сборка страницы

**Files:**
- Create: `components/landings/landing-page.tsx`

- [ ] **Step 1: Компонент-сборщик**

```tsx
// components/landings/landing-page.tsx
import { evolutionData } from '@/app/data/evolution'
import { landingCopy, landingMeta, landingPath, type LandingSlug } from '@/app/data/landings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Footer } from '@/components/evolution/footer'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { LeadDialogProvider } from '@/components/evolution/lead-dialog'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LandingHero } from './landing-hero'
import { Symptoms } from './symptoms'
import { HeroCase } from './hero-case'
import { LandingQuiz } from './landing-quiz'
import { HowItWorks } from './how-it-works'
import { LandingCases } from './landing-cases'
import { PricingSteps } from './pricing-steps'
import { Faq } from './faq'
import { LeadSection } from './lead-section'

// Один скелет, два порядка (спека, секция 6). Порядок задаёт landingMeta.skeleton:
// symptoms-first: hero → симптомы → квиз → как работает → кейсы → цены → вопросы → заявка;
// case-first:     hero → главный кейс → как работает → квиз → кейсы → цены → вопросы → заявка.
export function LandingPage({ slug }: { slug: LandingSlug }) {
  const meta = landingMeta[slug]
  const copy = landingCopy[slug]
  const data = evolutionData.ru
  const llmMarkdown = buildEvolutionMarkdown(data)
  const navItems = [
    { id: 'quiz', label: copy.nav.quiz },
    { id: 'how', label: copy.nav.how },
    { id: 'cases', label: copy.nav.cases },
    { id: 'pricing', label: copy.nav.pricing },
    { id: 'faq', label: copy.nav.faq },
  ]

  const quiz = <LandingQuiz slug={slug} title={copy.hero.title} copy={copy.quiz} />
  const how = <HowItWorks copy={copy.how} note={copy.standardNote} />

  return (
    <>
      <HtmlLang lang="ru" />
      <ParticleField />
      <TooltipProvider delay={200}>
        <LeadDialogProvider copy={data.finale.form} lang="ru">
          <main className="relative z-[1] min-h-screen" lang="ru">
            <HeaderNav
              lang="ru"
              brand={data.brand}
              owner={data.footer.owner}
              nav={{ ...data.nav, cta: copy.nav.cta }}
              labels={data.labels}
              items={navItems}
              llmMarkdown={llmMarkdown}
              anchorBase={landingPath(slug)}
            />

            <LandingHero copy={copy.hero} skeleton={meta.skeleton} />

            {meta.skeleton === 'symptoms-first' ? (
              <>
                {copy.symptoms ? <Symptoms copy={copy.symptoms} /> : null}
                {quiz}
                {how}
              </>
            ) : (
              <>
                {copy.heroCase && meta.heroCase ? <HeroCase copy={copy.heroCase} slug={meta.heroCase} /> : null}
                {how}
                {quiz}
              </>
            )}

            <LandingCases copy={copy.cases} slugs={meta.cases} />
            <PricingSteps copy={copy.pricing} />
            <Faq copy={copy.faq} />
            <LeadSection copy={copy.lead} slug={slug} />

            <Footer data={data} />
            <StickyCta label={copy.nav.cta} />
          </main>
        </LeadDialogProvider>
      </TooltipProvider>
    </>
  )
}
```

Сверить тип `nav` у `HeaderNav` (`EvolutionData['nav']`): если в нём есть поля кроме `cta`, спред `{ ...data.nav, cta: copy.nav.cta }` их сохраняет. Если `HeaderNav` использует `items` как якоря вида `${anchorBase}#${id}`, секции лендинга уже имеют такие `id`.

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок

- [ ] **Step 3: Commit**

```bash
git add components/landings/landing-page.tsx
git commit -m "feat(landings): сборка страницы из блоков по скелету"
```

---

### Task 20: Метаданные и четыре маршрута

**Files:**
- Modify: `lib/evolution/metadata.ts`
- Create: `app/kontur/page.tsx`, `app/it-director/page.tsx`, `app/agent/page.tsx`, `app/finance/page.tsx`

- [ ] **Step 1: Построитель метаданных**

В `lib/evolution/metadata.ts` добавить импорт и функцию:

```ts
import { landingCopy, landingPath, type LandingSlug } from '@/app/data/landings'
```

```ts
// Лендинги только RU: без alternates по языкам, канонический адрес без ?p=,
// чтобы две кампании /finance не плодили дубли в индексе.
export function buildLandingMetadata(slug: LandingSlug): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const d = evolutionData.ru
  const c = landingCopy[slug]
  const url = `${baseUrl}${landingPath(slug)}`

  return {
    title: c.meta.title,
    description: c.meta.description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      title: c.meta.title,
      description: c.meta.description,
      siteName: d.brand,
    },
    twitter: { card: 'summary_large_image', title: c.meta.title, description: c.meta.description },
  }
}
```

- [ ] **Step 2: Четыре маршрута**

`app/kontur/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { LandingPage } from '@/components/landings/landing-page'
import { buildLandingMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildLandingMetadata('kontur')

export default function KonturPage() {
  return <LandingPage slug="kontur" />
}
```

`app/it-director/page.tsx`: то же с `'it-director'` и именем `ItDirectorPage`.
`app/agent/page.tsx`: то же с `'agent'` и именем `AgentPage`.
`app/finance/page.tsx`: то же с `'finance'` и именем `FinancePage`.

- [ ] **Step 3: Собрать и посмотреть**

Run: `npm run typecheck && npm run build`
Expected: сборка проходит, в выводе четыре статических маршрута `/kontur`, `/it-director`, `/agent`, `/finance` со значком статики (`○`).

Run: `npm run dev`, открыть `http://localhost:3000/finance?p=pervichka`
Expected: квиз стартует с первого вопроса и подсказкой пресета «Десять счетов и актов…»; `http://localhost:3000/finance` без параметра показывает шаг 0 с четырьмя пресетами и полем «Свой процесс».

- [ ] **Step 4: Commit**

```bash
git add lib/evolution/metadata.ts app/kontur/page.tsx app/it-director/page.tsx app/agent/page.tsx app/finance/page.tsx
git commit -m "feat(landings): маршруты /kontur, /it-director, /agent, /finance"
```

---

### Task 21: Sitemap и llms.txt

**Files:**
- Modify: `app/sitemap.ts`
- Create: `lib/landings/llms-markdown.ts`
- Modify: `app/llms.txt/route.ts`

- [ ] **Step 1: Sitemap**

В `app/sitemap.ts` добавить импорт и записи:

```ts
import { LANDING_SLUGS, landingPath } from "@/app/data/landings";
```

```ts
  const landings: MetadataRoute.Sitemap = LANDING_SLUGS.map((slug) => ({
    url: `${baseUrl}${landingPath(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
```

и в возвращаемый массив перед `...cases`: `...landings,`.

- [ ] **Step 2: Markdown лендинга для LLM**

```ts
// lib/landings/llms-markdown.ts
import type { LandingCopy, LandingSlug } from '@/app/data/landings'
import { landingPath } from '@/app/data/landings'

// Короткая markdown-версия лендинга для /llms.txt: заголовок, суть, шаги, цены.
// Квиз и кейсы в текст не попадают: у них свои страницы.
export function buildLandingMarkdown(slug: LandingSlug, c: LandingCopy): string {
  return [
    `## ${c.hero.title}`,
    '',
    `URL: https://webkoth.com${landingPath(slug)}`,
    '',
    c.hero.sub,
    '',
    `### ${c.how.title}`,
    ...c.how.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`),
    '',
    `### ${c.pricing.title}`,
    ...c.pricing.steps.map((s) => `- ${s.title}: ${s.price}. ${s.body}`),
    '',
    `### ${c.faq.title}`,
    ...c.faq.items.map((f) => `- **${f.q}** ${f.a}`),
    '',
  ].join('\n')
}
```

- [ ] **Step 3: Подключить в /llms.txt**

В `app/llms.txt/route.ts`:

```ts
import { LANDING_SLUGS, landingCopy } from '@/app/data/landings'
import { buildLandingMarkdown } from '@/lib/landings/llms-markdown'
```

и в массив `body` после `...sections`:

```ts
    '',
    '# Страницы услуг',
    '',
    ...LANDING_SLUGS.map((slug) => buildLandingMarkdown(slug, landingCopy[slug])),
```

- [ ] **Step 4: Проверить**

Run: `npm run typecheck && npm run build`
Expected: сборка проходит. `npm run dev`, открыть `/sitemap.xml` и `/llms.txt`: четыре адреса и четыре раздела на месте.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts lib/landings/llms-markdown.ts app/llms.txt/route.ts
git commit -m "feat(landings): четыре адреса в sitemap и llms.txt"
```

---

### Task 22: Финальная проверка и ручной чеклист

**Files:**
- Нет новых файлов; при находках правки по месту.

- [ ] **Step 1: Полный прогон**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: всё зелёное; в тестах не меньше 12 новых (`landings.test.ts`), 3 (`ym.test.ts`), 4 (`quiz-summary.test.ts`), 3 (`schemas.test.ts`), 1 (`telegram-text.test.ts`), 1 (`cases.test.ts`).

- [ ] **Step 2: Ручной чеклист в dev с задан NEXT_PUBLIC_YM_ID тестового счётчика**

Run: `NEXT_PUBLIC_YM_ID=<тестовый номер> npm run dev`

Проверить и отметить:
- [ ] `/kontur`: главный кейс сразу после первого экрана, кнопка «Посмотреть кейс» скроллит к нему; квиз четвёртым блоком.
- [ ] `/it-director`, `/agent`: симптомы вторым блоком, кнопка первого экрана скроллит к квизу.
- [ ] `/finance?p=otchet`: квиз стартует сразу с подсказкой «Отчёт за прошлый месяц…»; `/finance?p=kontur-stocks` игнорирует чужой пресет и показывает шаг 0.
- [ ] Квиз до результата: под вердиктом абзац «что это значит для вас»; кнопка «Обсудить этот вердикт» открывает форму с текстом «Страница: … Процесс: … Вердикт: …».
- [ ] Отправка формы с тестовыми данными: в Telegram приходит «Лендинг /finance · finance-otchet · F3» (или другой тег); письмо содержит ту же строку.
- [ ] В отладчике Метрики (вкладка Network, запросы к `mc.yandex.ru` с `goal`) видны `quiz_start`, `quiz_result`, `lead_sent`.
- [ ] `/ru/standard/verdict`: квиз без шага 0, кнопка результата открывает пустую форму, как раньше.
- [ ] Липкая кнопка и якоря шапки ведут на секции той же страницы, а не на главную.
- [ ] Мобильная ширина 375px: первый экран, карусель и форма не ломают горизонтальную прокрутку.

- [ ] **Step 3: Обновить README, если в нём есть список страниц**

Run: `grep -n "standard/verdict\|/marketplaces" README.md`
Если список страниц есть, добавить четыре адреса одной строкой каждый по образцу существующих.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(landings): финальная проверка, README"
```

---

## Что после плана

Не входит в план и делается отдельно после деплоя: создать счётчик Метрики и три цели с теми же именами, задать `NEXT_PUBLIC_YM_ID` на сервере, собрать кампании Директа по кластерам из спеки (секция 10) с UTM `utm_source=yandex&utm_medium=cpc&utm_campaign=<кампания>&utm_content=<группа>` и адресами `/finance?p=pervichka`, `/finance?p=otchet`.
