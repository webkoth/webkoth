# Бриф селлера с картой автоматизаций: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** страница `webkoth.com/brief`, на которой селлер за 15–20 минут заполняет бриф, видит растущий черновик карты и получает итоговую карту автоматизаций; нам в Telegram приходят сообщение и файл с полной картой.

**Architecture:** вся логика карты — чистые функции в `lib/brief/` поверх неизменённого движка `decideVerdict` (`lib/standard/verdict.ts`); тексты и каталог процессов — данные в `app/data/brief/`; интерфейс — клиентские компоненты в `components/brief/` с состоянием в `useReducer` и сохранением в localStorage; сервер `app/api/brief/route.ts` сам пересчитывает карту и отправляет документ в Telegram.

**Tech Stack:** Next.js 16.3 (App Router), React 19, TypeScript, Tailwind 4, shadcn на Base UI, zod 4, vitest (среда `node`, без тестов компонентов).

**Спека:** `docs/superpowers/specs/2026-09-17-brif-karta-avtomatizaciy-design.md`.

---

## Перед началом

- Работать в отдельной ветке `feat/brief` (worktree или `git switch -c feat/brief`).
- В основном рабочем дереве есть **чужие незакоммиченные правки** (`app/data/landings/agent.ts`, `public/r/language-toggle.json`, `AGENTS.md`, `CLAUDE.md`, `marketing/vacancies/`). Их не добавлять в коммиты. Из-за длинного тире в `agent.ts` два существующих теста падают в основном дереве; в чистом worktree их нет.
- В текстах сайта **нет длинных тире «—»**: это проверяют тесты лендингов, то же правило вводится для брифа. Короткое «–» в диапазонах можно.
- Стиль кода: без точек с запятой, одинарные кавычки, два пробела (кроме `lib/landing/telegram.ts`, где двойные кавычки и точки с запятой — сохранить стиль файла).
- Команды: `npx vitest run <путь>`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run dev`.

## Уточнения к спеке, принятые при планировании

1. В вопросе `tools` нет МойСклад и 1С: они уже есть в вопросе `ledger`; «учётная система» для «уже есть готовое» берётся из `ledger`.
2. У процесса в каталоге есть факт `cabinetApi` (работа идёт через кабинет площадки) — для фразы «выпустите ключ доступа».
3. Причина `stopData` бывает трёх видов: `data` (данные «в голове» или «не знаю»), `cost` (себестоимость неизвестна), `ledger` (учёт только «в голове»); у каждой своя фраза «что подготовить».
4. «Начните с этого» выбирается только среди процессов с цветом dynamic-шага `auto` или `ai`: процесс, оставшийся человеку, не бывает стартовым.
5. Порядок причин в «что подготовить»: сначала то, что блокирует (образец, данные), потом остальное.
6. Шаги 1 и 2 рисует один компонент `step-questions.tsx`; добавлены `question-block.tsx`, `legend.tsx`, `map-item.tsx`, `colors.ts`, `lib/brief/client.ts`, `lib/brief/labels.ts`, `lib/brief/deliver.ts`, `lib/brief/map-types.ts`, `lib/brief/ids.ts`, `app/data/brief/copy.ts`.
7. Статус отправки `rateLimited` отдельно от `failed`; ответ 400 показывается как `failed`.
8. Стадия `unknown`, если на вопрос про ИИ не ответили.
9. Отмеченные процессы хранятся упорядоченным массивом `picked: { id, hours }[]`.
10. У процесса есть необязательная `mapNote` (для «Своё»: «на созвоне разобьём на шаги»).
11. Названия и адреса кейсов считаются на сервере и передаются в клиент готовыми: реестр кейсов в клиентский бандл не попадает.
12. Шапка страницы простая (бренд и «Бриф»), без навигации лендинга; подвал из `components/evolution/footer.tsx`.

Эти уточнения вносятся в спеку в задаче 19.

## Карта файлов

```
lib/brief/
  ids.ts              константы идентификаторов (процессы, варианты ответов)
  schema.ts           zod-схемы ответов и отправки, emptyAnswers()
  state.ts            состояние брифа, редьюсер, навигация, проверка шагов
  map-types.ts        типы карты
  to-quiz-input.ts    ответы процесса → вход вердикта
  step-color.ts       вердикт → цвет и подпись dynamic-шага
  stage.ts            стадия магазина
  priority.ts         часы, приоритет, выбор «начните с», формат часов
  explain.ts          «почему первым», «что подготовить»
  offer-step.ts       ступень для нас
  flags.ts            флаги и «что уточнить»
  labels.ts           подписи процессов, площадок, категорий, ответов
  build-map.ts        сборка карты
  fixtures.ts         три эталонных магазина для тестов
  render-telegram.ts  короткое сообщение
  render-markdown.ts  полный файл
  deliver.ts          документ или текст частями
  storage.ts          localStorage
  client.ts           отправка из браузера
app/data/brief/
  glossary.ts  questions.ts  copy.ts  coefficients.ts  processes.ts  brief-data.test.ts
lib/landing/telegram.ts          + sendTelegramDocument
lib/analytics/ym.ts              + цели брифа
app/globals.css                  + токены цветов карты, печать
app/api/brief/route.ts
app/brief/page.tsx
components/brief/
  colors.ts  choice-chips.tsx  term-notes.tsx  question-block.tsx  legend.tsx
  process-chain.tsx  map-item.tsx  step-intro.tsx  step-questions.tsx
  process-picker.tsx  step-deep.tsx  step-goals.tsx  live-map.tsx  brief-map.tsx  brief-page.tsx
app/data/privacy.ts              + данные брифа
```

---

### Task 1: Идентификаторы и схема ответов

**Files:**
- Create: `lib/brief/ids.ts`
- Create: `lib/brief/schema.ts`
- Test: `lib/brief/schema.test.ts`

- [ ] **Step 1: Создать `lib/brief/ids.ts`**

```ts
// Идентификаторы брифа: общие для схемы (lib), данных (app/data/brief) и интерфейса.
// Живут в lib, чтобы схема не тянула за собой тексты страницы.

export const PROCESS_IDS = [
  'cards',
  'media',
  'reviews',
  'questions',
  'returns',
  'ads',
  'prices',
  'competitors',
  'stocks',
  'supply',
  'labels',
  'unit',
  'payouts',
  'accounting',
  'digest',
  'sourcing',
  'custom',
] as const
export type ProcessId = (typeof PROCESS_IDS)[number]

export const PROCESS_GROUPS = ['content', 'buyers', 'pricing', 'warehouse', 'money', 'management', 'custom'] as const
export type ProcessGroup = (typeof PROCESS_GROUPS)[number]

export const HOURS_BANDS = ['lt1', '1to3', '3to5', '5to10', '10plus'] as const
export type HoursBand = (typeof HOURS_BANDS)[number]

// Шаг 1
export const MARKETPLACES = ['wb', 'ozon', 'ym', 'site', 'other'] as const
export const FULFILLMENT = ['fbo', 'fbs', 'dbs', 'unknown'] as const
export const CATEGORIES = [
  'apparel',
  'home',
  'beauty',
  'kids',
  'electronics',
  'sport',
  'food',
  'auto',
  'hobby',
  'jewelry',
  'other',
] as const
export const SKU_BANDS = ['lt50', '50to300', '300to1000', 'gt1000', 'unknown'] as const
export const ORDER_BANDS = ['lt10', '10to100', '100to500', 'gt500', 'unknown'] as const
export const REVENUE_BANDS = ['lt1m', '1to5m', '5to20m', 'gt20m', 'hidden'] as const
export const TEAM_SIZES = ['solo', '2to5', '6to20', 'gt20'] as const
export const ROLES = ['manager', 'content', 'ads', 'warehouse', 'accountant', 'freelancers', 'onlyMe'] as const

// Шаг 2
export const LEDGERS = ['head', 'sheets', 'moysklad', '1c', 'other'] as const
export const COST_KNOWN = ['exact', 'approx', 'no'] as const
export const TOOLS = [
  'mpstats',
  'mayak',
  'analyticsOther',
  'bidder',
  'repricer',
  'reviewsCabinet',
  'reviewsService',
  'none',
] as const
export const API_TOKENS = ['yes', 'no', 'unknown'] as const
export const AI_NOW = ['none', 'chatSelf', 'teamRegular', 'automations', 'triedFailed'] as const
export const DOCS = ['yes', 'partial', 'head'] as const

// Шаг 4
export const FREQUENCY = ['manyPerDay', 'daily', 'weekly', 'rare', 'unknown'] as const
export const WHO = ['me', 'employee', 'freelancer', 'nobody', 'service'] as const
export const ETALON = ['many', 'few', 'no', 'unknown'] as const
export const RULE = ['sheet', 'readInput', 'experience', 'unknown'] as const
export const CHECK = ['instant', 'glance', 'expert'] as const
export const RISK = ['nothing', 'buyersSee', 'money', 'penalty', 'unknown'] as const
export const DATA_SOURCE = ['cabinet', 'file', 'sheet', 'head', 'unknown'] as const
export const HANDOVER = ['give', 'keep'] as const

// Шаг 5
export const GOALS = ['myTime', 'noHiring', 'fewerErrors', 'realProfit', 'moreSales'] as const
export const IMPLEMENTERS = ['self', 'employee', 'nobody'] as const
export const IMPLEMENTER_HOURS = ['lt2', '2to5', 'gt5', 'unknown'] as const
export const ACCESS = ['yes', 'readOnly', 'no', 'discuss'] as const
export const RU_ONLY = ['required', 'preferred', 'no', 'unknown'] as const
export const BUDGETS = ['lt50', '50to150', '150to400', 'gt400', 'unknown'] as const

// «Уже есть готовое»: какой ответ селлера означает, что похожим он уже пользуется.
export const READY_TOOL_KEYS = ['reviewsCabinet', 'bidder', 'repricer', 'analytics', 'ledgerSystem'] as const
export type ReadyToolKey = (typeof READY_TOOL_KEYS)[number]

export const LABEL_RE = /^[a-z0-9-]{1,32}$/
```

- [ ] **Step 2: Написать падающий тест `lib/brief/schema.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { briefAnswersSchema, briefSubmitSchema, emptyAnswers } from './schema'

const filled = () => ({
  ...emptyAnswers(),
  marketplaces: ['wb' as const],
  picked: [{ id: 'reviews' as const, hours: '1to3' as const }],
  name: 'Анна',
  contact: '@anna',
  consent: true,
})

describe('briefAnswersSchema', () => {
  it('пустые ответы проходят: это состояние черновика', () => {
    expect(briefAnswersSchema.safeParse(emptyAnswers()).success).toBe(true)
  })

  it('незнакомый процесс отклоняется', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'nope', hours: '1to3' }] }
    expect(briefAnswersSchema.safeParse(a).success).toBe(false)
  })
})

describe('briefSubmitSchema', () => {
  const base = { startedAtMs: 1_700_000_000_000 }

  it('заполненный бриф проходит', () => {
    expect(briefSubmitSchema.safeParse({ ...base, answers: filled() }).success).toBe(true)
  })

  it('без согласия отклоняется с путём consent', () => {
    const r = briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), consent: false } })
    expect(r.success).toBe(false)
    expect(r.error?.issues.some((i) => i.path.join('.') === 'answers.consent')).toBe(true)
  })

  it('без площадок, процессов, имени или контакта отклоняется', () => {
    for (const patch of [{ marketplaces: [] }, { picked: [] }, { name: 'А' }, { contact: '' }]) {
      expect(briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), ...patch } }).success).toBe(false)
    }
  })

  it('перенос строки в имени отклоняется', () => {
    expect(briefSubmitSchema.safeParse({ ...base, answers: { ...filled(), name: 'Анна\nBcc' } }).success).toBe(false)
  })

  it('метка k только латиница, цифры и дефис', () => {
    expect(briefSubmitSchema.safeParse({ ...base, k: 'anna-1', answers: filled() }).success).toBe(true)
    expect(briefSubmitSchema.safeParse({ ...base, k: 'Анна', answers: filled() }).success).toBe(false)
  })

  it('больше трёх процессов в подробном выборе отклоняется', () => {
    const a = { ...filled(), deepChoice: ['reviews', 'ads', 'stocks', 'unit'] }
    expect(briefSubmitSchema.safeParse({ ...base, answers: a }).success).toBe(false)
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падает**

Run: `npx vitest run lib/brief/schema.test.ts`
Expected: FAIL, `Failed to resolve import "./schema"`.

- [ ] **Step 4: Создать `lib/brief/schema.ts`**

```ts
import { z } from 'zod'
import * as ids from './ids'

// Схема ответов брифа. Одна на браузер (черновик, localStorage) и сервер (отправка).
// Черновик допускает пустые поля; строгие требования к отправке - в briefSubmitSchema.

// Переносы строк запрещены в однострочных полях: имя и контакт уходят в заголовок
// сообщения и в имя файла, «\r\n» там ломает разметку.
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(/^[^\r\n]*$/, 'no_newline')

export const deepAnswersSchema = z.object({
  frequency: z.enum(ids.FREQUENCY).optional(),
  who: z.enum(ids.WHO).optional(),
  etalon: z.enum(ids.ETALON).optional(),
  rule: z.enum(ids.RULE).optional(),
  check: z.enum(ids.CHECK).optional(),
  risk: z.enum(ids.RISK).optional(),
  data: z.enum(ids.DATA_SOURCE).optional(),
  handover: z.enum(ids.HANDOVER).optional(),
})
export type DeepAnswers = z.infer<typeof deepAnswersSchema>
export type DeepQuestionId = keyof DeepAnswers

export const briefAnswersSchema = z.object({
  // Шаг 1
  marketplaces: z.array(z.enum(ids.MARKETPLACES)).max(ids.MARKETPLACES.length),
  marketplacesOther: line(60).optional(),
  fulfillment: z.array(z.enum(ids.FULFILLMENT)).max(ids.FULFILLMENT.length),
  category: z.enum(ids.CATEGORIES).optional(),
  categoryOther: line(60).optional(),
  sku: z.enum(ids.SKU_BANDS).optional(),
  ordersPerDay: z.enum(ids.ORDER_BANDS).optional(),
  revenue: z.enum(ids.REVENUE_BANDS).optional(),
  teamSize: z.enum(ids.TEAM_SIZES).optional(),
  roles: z.array(z.enum(ids.ROLES)).max(ids.ROLES.length),
  // Шаг 2
  ledger: z.array(z.enum(ids.LEDGERS)).max(ids.LEDGERS.length),
  ledgerOther: line(60).optional(),
  costKnown: z.enum(ids.COST_KNOWN).optional(),
  tools: z.array(z.enum(ids.TOOLS)).max(ids.TOOLS.length),
  apiTokens: z.enum(ids.API_TOKENS).optional(),
  aiNow: z.enum(ids.AI_NOW).optional(),
  aiTried: line(500).optional(),
  docs: z.enum(ids.DOCS).optional(),
  // Шаг 3: порядок массива - порядок, в котором селлер отмечал процессы
  picked: z
    .array(z.object({ id: z.enum(ids.PROCESS_IDS), hours: z.enum(ids.HOURS_BANDS) }))
    .max(ids.PROCESS_IDS.length),
  customLabel: line(80).optional(),
  deepChoice: z.array(z.enum(ids.PROCESS_IDS)).max(3),
  // Шаг 4
  deepAnswers: z.partialRecord(z.enum(ids.PROCESS_IDS), deepAnswersSchema),
  // Шаг 5
  goals: z.array(z.enum(ids.GOALS)).max(2),
  implementer: z.enum(ids.IMPLEMENTERS).optional(),
  implementerHours: z.enum(ids.IMPLEMENTER_HOURS).optional(),
  access: z.enum(ids.ACCESS).optional(),
  ruOnly: z.enum(ids.RU_ONLY).optional(),
  budget: z.enum(ids.BUDGETS).optional(),
  notes: z.string().trim().max(1000).optional(),
  name: line(80).optional(),
  contact: line(120).optional(),
  consent: z.boolean(),
})
export type BriefAnswers = z.infer<typeof briefAnswersSchema>

export function emptyAnswers(): BriefAnswers {
  return {
    marketplaces: [],
    fulfillment: [],
    roles: [],
    ledger: [],
    tools: [],
    picked: [],
    deepChoice: [],
    deepAnswers: {},
    goals: [],
    consent: false,
  }
}

export const briefSubmitSchema = z.object({
  answers: briefAnswersSchema.superRefine((a, ctx) => {
    const need = (ok: boolean, path: string, message: string) => {
      if (!ok) ctx.addIssue({ code: 'custom', path: [path], message })
    }
    need(a.marketplaces.length > 0, 'marketplaces', 'required')
    need(a.picked.length > 0, 'picked', 'required')
    need((a.name ?? '').length >= 2, 'name', 'name_min')
    need((a.contact ?? '').length >= 3, 'contact', 'contact_min')
    need(a.consent, 'consent', 'consent_required')
  }),
  k: z.string().regex(ids.LABEL_RE).optional(),
  startedAtMs: z.number().int().positive(),
  // honeypot: непустое значение роут ловит тихой двухсоткой
  website: z.string().max(200).optional(),
})
export type BriefSubmit = z.infer<typeof briefSubmitSchema>
```

- [ ] **Step 5: Запустить тест**

Run: `npx vitest run lib/brief/schema.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/brief/ids.ts lib/brief/schema.ts lib/brief/schema.test.ts
git commit -m "feat(brief): идентификаторы и zod-схема ответов брифа"
```

---

### Task 2: Состояние брифа и навигация

**Files:**
- Create: `lib/brief/state.ts`
- Test: `lib/brief/state.test.ts`

- [ ] **Step 1: Написать падающий тест `lib/brief/state.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import type { ProcessId } from './ids'
import {
  briefReducer,
  deepList,
  initialState,
  invalidFields,
  isDeepComplete,
  stepNumber,
  type BriefState,
} from './state'

const started = (): BriefState => briefReducer(initialState(0), { type: 'start', now: 1000 })

const pick = (s: BriefState, ids: ProcessId[]) =>
  ids.reduce((acc, id) => briefReducer(acc, { type: 'toggleProcess', id }), s)

const completeDeep = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'sheet', risk: 'nothing', data: 'cabinet' } as const

describe('старт и сброс', () => {
  it('start открывает шаг 1 и запоминает время начала', () => {
    const s = started()
    expect(s.step).toBe('shop')
    expect(s.startedAtMs).toBe(1000)
  })

  it('reset возвращает к вводному экрану с пустыми ответами', () => {
    const s = briefReducer(pick(started(), ['reviews']), { type: 'reset' })
    expect(s).toEqual(initialState(0))
  })
})

describe('выбор процессов', () => {
  it('отметка добавляет процесс с часами 1–3, повторная убирает вместе с подробностями', () => {
    let s = pick(started(), ['reviews'])
    expect(s.answers.picked).toEqual([{ id: 'reviews', hours: '1to3' }])
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'etalon', value: 'many' })
    s = briefReducer(s, { type: 'toggleDeepChoice', id: 'reviews' })
    s = pick(s, ['reviews'])
    expect(s.answers.picked).toEqual([])
    expect(s.answers.deepAnswers.reviews).toBeUndefined()
    expect(s.answers.deepChoice).toEqual([])
  })

  it('до трёх отмеченных разбираются все, по порядку отметки', () => {
    const s = pick(started(), ['stocks', 'reviews'])
    expect(deepList(s.answers)).toEqual(['stocks', 'reviews'])
  })

  it('больше трёх: разбираются выбранные, не больше трёх', () => {
    let s = pick(started(), ['stocks', 'reviews', 'ads', 'unit'])
    for (const id of ['unit', 'ads', 'reviews', 'stocks'] as const) {
      s = briefReducer(s, { type: 'toggleDeepChoice', id })
    }
    expect(s.answers.deepChoice).toEqual(['unit', 'ads', 'reviews'])
    expect(deepList(s.answers)).toEqual(['unit', 'ads', 'reviews'])
  })

  it('смена правила на «инструкции на листке» стирает ответ про проверку', () => {
    let s = pick(started(), ['reviews'])
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'rule', value: 'experience' })
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'check', value: 'glance' })
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'rule', value: 'sheet' })
    expect(s.answers.deepAnswers.reviews?.check).toBeUndefined()
  })
})

describe('isDeepComplete', () => {
  it('нужны шесть ответов, проверка только при суждении', () => {
    expect(isDeepComplete(completeDeep)).toBe(true)
    expect(isDeepComplete({ ...completeDeep, rule: 'experience' })).toBe(false)
    expect(isDeepComplete({ ...completeDeep, rule: 'experience', check: 'glance' })).toBe(true)
    expect(isDeepComplete({ ...completeDeep, data: undefined })).toBe(false)
    expect(isDeepComplete(undefined)).toBe(false)
  })
})

describe('навигация', () => {
  it('подробные экраны идут по одному на процесс, назад возвращает на последний', () => {
    let s = pick(started(), ['reviews', 'stocks'])
    s = { ...s, step: 'time' }
    s = briefReducer(s, { type: 'next' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 0])
    s = briefReducer(s, { type: 'next' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 1])
    s = briefReducer(s, { type: 'next' })
    expect(s.step).toBe('goals')
    s = briefReducer(s, { type: 'back' })
    expect([s.step, s.deepIndex]).toEqual(['deep', 1])
    s = briefReducer(briefReducer(s, { type: 'back' }), { type: 'back' })
    expect(s.step).toBe('time')
  })

  it('номера шагов для прогресса', () => {
    expect(['intro', 'shop', 'now', 'time', 'deep', 'goals', 'map'].map((k) => stepNumber(k as BriefState['step']))).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ])
  })
})

describe('invalidFields', () => {
  it('шаг 1 требует площадку', () => {
    expect(invalidFields(started())).toEqual(['marketplaces'])
  })

  it('шаг 3 требует процесс, подробный выбор при >3 и название своего', () => {
    let s: BriefState = { ...started(), step: 'time' }
    expect(invalidFields(s)).toEqual(['picked'])
    s = pick(s, ['custom', 'reviews', 'ads', 'unit'])
    expect(invalidFields(s)).toEqual(['deepChoice', 'customLabel'])
  })

  it('подробный шаг перечисляет пропущенные вопросы', () => {
    let s = pick(started(), ['reviews'])
    s = { ...s, step: 'deep', deepIndex: 0 }
    s = briefReducer(s, { type: 'setDeep', id: 'reviews', field: 'frequency', value: 'daily' })
    expect(invalidFields(s)).toEqual(['who', 'etalon', 'rule', 'risk', 'data'])
  })

  it('шаг 5 требует имя, контакт и согласие', () => {
    const s: BriefState = { ...started(), step: 'goals' }
    expect(invalidFields(s)).toEqual(['name', 'contact', 'consent'])
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run lib/brief/state.test.ts`
Expected: FAIL, `Failed to resolve import "./state"`.

- [ ] **Step 3: Создать `lib/brief/state.ts`**

```ts
import type { HoursBand, ProcessId } from './ids'
import { emptyAnswers, type BriefAnswers, type DeepAnswers, type DeepQuestionId } from './schema'

// Состояние брифа и переходы между шагами. Чистые функции: компонент только
// рисует и диспатчит, проверка шагов и порядок экранов тестируются здесь.

export const STEP_KEYS = ['intro', 'shop', 'now', 'time', 'deep', 'goals', 'map'] as const
export type StepKey = (typeof STEP_KEYS)[number]

export const SEND_STATUSES = ['idle', 'sending', 'sent', 'failed', 'rateLimited'] as const
export type SendStatus = (typeof SEND_STATUSES)[number]

export const MAX_DEEP = 3
const DEFAULT_HOURS: HoursBand = '1to3'
const REQUIRED_DEEP: readonly DeepQuestionId[] = ['frequency', 'who', 'etalon', 'rule', 'risk', 'data']

export type BriefState = {
  version: 1
  step: StepKey
  deepIndex: number
  /** 0 - бриф ещё не начат. */
  startedAtMs: number
  answers: BriefAnswers
  send: SendStatus
}

/** Поля ответов, которые меняются одним действием setField. */
export type GeneralField = Exclude<keyof BriefAnswers, 'picked' | 'deepChoice' | 'deepAnswers' | 'consent'>

export type BriefAction =
  | { type: 'start'; now: number }
  | { type: 'reset' }
  | { type: 'restore'; state: BriefState }
  | { type: 'setField'; field: GeneralField; value: string | string[] | undefined }
  | { type: 'setConsent'; value: boolean }
  | { type: 'toggleProcess'; id: ProcessId }
  | { type: 'setHours'; id: ProcessId; hours: HoursBand }
  | { type: 'toggleDeepChoice'; id: ProcessId }
  | { type: 'setDeep'; id: ProcessId; field: DeepQuestionId; value: string | undefined }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; step: StepKey }
  | { type: 'send'; status: SendStatus }

export function initialState(startedAtMs: number): BriefState {
  return { version: 1, step: 'intro', deepIndex: 0, startedAtMs, answers: emptyAnswers(), send: 'idle' }
}

export function needsCheck(d: DeepAnswers): boolean {
  return d.rule === 'experience' || d.rule === 'unknown'
}

export function isDeepComplete(d: DeepAnswers | undefined): boolean {
  if (!d) return false
  if (REQUIRED_DEEP.some((f) => d[f] === undefined)) return false
  return !needsCheck(d) || d.check !== undefined
}

/** Процессы для подробного разбора, в порядке отметки или выбора. */
export function deepList(a: BriefAnswers): ProcessId[] {
  const picked = a.picked.map((p) => p.id)
  if (picked.length <= MAX_DEEP) return picked
  return a.deepChoice.filter((id) => picked.includes(id)).slice(0, MAX_DEEP)
}

export function stepNumber(step: StepKey): number {
  return STEP_KEYS.indexOf(step)
}

export function invalidFields(s: BriefState): string[] {
  const a = s.answers
  switch (s.step) {
    case 'shop':
      return a.marketplaces.length === 0 ? ['marketplaces'] : []
    case 'time': {
      if (a.picked.length === 0) return ['picked']
      const out: string[] = []
      if (a.picked.length > MAX_DEEP && deepList(a).length === 0) out.push('deepChoice')
      if (a.picked.some((p) => p.id === 'custom') && !a.customLabel?.trim()) out.push('customLabel')
      return out
    }
    case 'deep': {
      const id = deepList(a)[s.deepIndex]
      if (!id) return []
      const d = a.deepAnswers[id] ?? {}
      const missing: string[] = REQUIRED_DEEP.filter((f) => d[f] === undefined)
      if (needsCheck(d) && d.check === undefined) missing.push('check')
      return missing
    }
    case 'goals': {
      const out: string[] = []
      if ((a.name ?? '').trim().length < 2) out.push('name')
      if ((a.contact ?? '').trim().length < 3) out.push('contact')
      if (!a.consent) out.push('consent')
      return out
    }
    default:
      return []
  }
}

function withAnswers(s: BriefState, answers: BriefAnswers): BriefState {
  return { ...s, answers }
}

function nextStep(s: BriefState): BriefState {
  const count = deepList(s.answers).length
  switch (s.step) {
    case 'intro':
      return { ...s, step: 'shop' }
    case 'shop':
      return { ...s, step: 'now' }
    case 'now':
      return { ...s, step: 'time' }
    case 'time':
      return count > 0 ? { ...s, step: 'deep', deepIndex: 0 } : { ...s, step: 'goals' }
    case 'deep':
      return s.deepIndex < count - 1 ? { ...s, deepIndex: s.deepIndex + 1 } : { ...s, step: 'goals' }
    case 'goals':
      return { ...s, step: 'map' }
    default:
      return s
  }
}

function prevStep(s: BriefState): BriefState {
  const count = deepList(s.answers).length
  switch (s.step) {
    case 'shop':
      return { ...s, step: 'intro' }
    case 'now':
      return { ...s, step: 'shop' }
    case 'time':
      return { ...s, step: 'now' }
    case 'deep':
      return s.deepIndex > 0 ? { ...s, deepIndex: s.deepIndex - 1 } : { ...s, step: 'time' }
    case 'goals':
      return count > 0 ? { ...s, step: 'deep', deepIndex: count - 1 } : { ...s, step: 'time' }
    case 'map':
      return { ...s, step: 'goals' }
    default:
      return s
  }
}

export function briefReducer(s: BriefState, action: BriefAction): BriefState {
  const a = s.answers
  switch (action.type) {
    case 'start':
      return { ...initialState(action.now), step: 'shop' }
    case 'reset':
      return initialState(0)
    case 'restore':
      return action.state
    case 'setField':
      return withAnswers(s, { ...a, [action.field]: action.value } as BriefAnswers)
    case 'setConsent':
      return withAnswers(s, { ...a, consent: action.value })
    case 'toggleProcess': {
      if (a.picked.some((p) => p.id === action.id)) {
        const deepAnswers = { ...a.deepAnswers }
        delete deepAnswers[action.id]
        return withAnswers(s, {
          ...a,
          picked: a.picked.filter((p) => p.id !== action.id),
          deepChoice: a.deepChoice.filter((id) => id !== action.id),
          deepAnswers,
        })
      }
      return withAnswers(s, { ...a, picked: [...a.picked, { id: action.id, hours: DEFAULT_HOURS }] })
    }
    case 'setHours':
      return withAnswers(s, {
        ...a,
        picked: a.picked.map((p) => (p.id === action.id ? { ...p, hours: action.hours } : p)),
      })
    case 'toggleDeepChoice': {
      if (a.deepChoice.includes(action.id)) {
        return withAnswers(s, { ...a, deepChoice: a.deepChoice.filter((id) => id !== action.id) })
      }
      if (a.deepChoice.length >= MAX_DEEP) return s
      return withAnswers(s, { ...a, deepChoice: [...a.deepChoice, action.id] })
    }
    case 'setDeep': {
      const next = { ...(a.deepAnswers[action.id] ?? {}), [action.field]: action.value } as DeepAnswers
      if (!needsCheck(next)) delete next.check
      return withAnswers(s, { ...a, deepAnswers: { ...a.deepAnswers, [action.id]: next } })
    }
    case 'next':
      return nextStep(s)
    case 'back':
      return prevStep(s)
    case 'goto':
      return { ...s, step: action.step }
    case 'send':
      return { ...s, send: action.status }
  }
}
```

- [ ] **Step 4: Запустить тест**

Run: `npx vitest run lib/brief/state.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/brief/state.ts lib/brief/state.test.ts
git commit -m "feat(brief): состояние брифа, редьюсер и проверка шагов"
```

---

### Task 3: Типы карты, глоссарий, вопросы и тексты

Файлы данных без собственной логики; проверяются тестом данных в задаче 4.

**Files:**
- Create: `lib/brief/map-types.ts`
- Create: `app/data/brief/glossary.ts`
- Create: `app/data/brief/questions.ts`
- Create: `app/data/brief/copy.ts`

- [ ] **Step 1: Создать `lib/brief/map-types.ts`**

```ts
import type { CaseSlug } from '@/app/data/cases'
import type { QuizInput, Verdict } from '@/lib/standard/verdict'
import type { HoursBand, ProcessId } from './ids'

// Типы карты. Карта - результат buildMap: и для экрана селлера, и для файла нам.

/** Цвет шага для владельца (AIAS-01): сам, ИИ готовит, человек, не трогать. */
export type StepColor = 'auto' | 'ai' | 'human' | 'skip'

/** Ключ доли часов, которую возвращает dynamic-шаг (coefficients.ts). */
export type ShareKey = 'f3' | 'aiAuto' | 'aiPrepares' | 'split' | 'human' | 'skip'

/** Почему данные не готовы: ответ селлера, себестоимость или учёт «в голове». */
export type DataReason = 'data' | 'cost' | 'ledger'

export type DynamicOutcome = {
  color: StepColor
  caption: string
  notes: string[]
  shareKey: ShareKey
  /** Показывать ли шаг approval после dynamic-шага. */
  showApproval: boolean
}

export type MapStep = { label: string; color: StepColor; caption?: string }
export type MapBranch = { when: string; step: MapStep }
export type LinkRef = { label: string; href: string }
export type ReadyMadeView = { kind: 'cabinet' | 'service'; text: string; alreadyUsing: boolean }

export type MapItem = {
  processId: ProcessId
  label: string
  hoursBand: HoursBand
  /** Часов в неделю по шкале шага 3. */
  hours: number
  /** pending - подробности ещё не заполнены (живой черновик). */
  status: 'pending' | 'ready'
  input?: QuizInput
  verdict?: Verdict
  dataReason?: DataReason
  outcome?: DynamicOutcome
  returnedHours: number
  priority: number
  chain: MapStep[]
  branches: MapBranch[]
  why: string[]
  prepare: string[]
  entryNote?: string
  readyMade?: ReadyMadeView
  cases: readonly CaseSlug[]
  library: readonly LinkRef[]
}

export type StageKey = 'stage0' | 'stage1' | 'stage1to2' | 'stage1stuck' | 'unknown'
export type StageInfo = {
  key: StageKey
  label: string
  forUs: string
  /** Стадии 0 и 1: агент не предлагается первым шагом. */
  early: boolean
  stuckPilot: boolean
}

export type OfferStep = 'pilot' | 'audit' | 'firstProcess' | 'review'

export type BriefMap = {
  stage: StageInfo
  /** Разобранные процессы, по приоритету. */
  items: MapItem[]
  startId?: ProcessId
  startFallback?: { processId: ProcessId; text: string }
  totalReturnedHours: number
  notDeep: { processId: ProcessId; label: string; hours: number }[]
  offer: OfferStep
  flags: string[]
  clarify: string[]
}
```

- [ ] **Step 2: Создать `app/data/brief/glossary.ts`**

```ts
import { AIAS_REPO_URL } from '@/app/data/standard'

// Сноски к терминам брифа. Одно-два предложения простым языком; без длинных тире.

export const TERM_IDS = [
  'fulfillment',
  'sku',
  'apiToken',
  'cost',
  'unitEconomics',
  'bidder',
  'repricer',
  'marking',
  'etalon',
  'access',
  'stage',
  'program',
  'aiPrepares',
  'agent',
] as const
export type TermId = (typeof TERM_IDS)[number]

export type Term = { title: string; text: string; href?: string }

export const glossary: Record<TermId, Term> = {
  fulfillment: {
    title: 'FBO, FBS, DBS',
    text: 'Схемы работы с площадкой. FBO: товар лежит на складе площадки, она сама собирает и везёт заказ. FBS: товар у вас, вы собираете заказ и сдаёте площадке. DBS: товар у вас, и доставляете вы сами.',
  },
  sku: {
    title: 'артикул',
    text: 'Отдельная позиция товара в кабинете. Футболка в трёх цветах обычно три артикула.',
  },
  apiToken: {
    title: 'ключ доступа',
    text: 'Длинный код, который вы создаёте в настройках кабинета площадки. По нему программа читает заказы, остатки и отчёты без вашего логина и пароля. Ключ можно ограничить только чтением и отозвать в любой момент.',
  },
  cost: {
    title: 'себестоимость',
    text: 'Сколько вам обошёлся один товар до продажи: закупка, доставка до склада, упаковка, маркировка. Без неё нельзя честно посчитать прибыль.',
  },
  unitEconomics: {
    title: 'юнит-экономика',
    text: 'Расчёт прибыли с одной проданной штуки: цена минус себестоимость, комиссия, логистика, хранение, реклама и возвраты.',
  },
  bidder: {
    title: 'биддер',
    text: 'Сервис, который сам меняет ставки рекламы на площадке по заданным правилам.',
  },
  repricer: {
    title: 'репрайсер',
    text: 'Сервис, который сам меняет цены по правилам: например, держит цену не ниже заданной и реагирует на конкурентов.',
  },
  marking: {
    title: 'маркировка',
    text: 'Коды «Честного знака», обязательные для части категорий: одежды, обуви, косметики и других. Код печатается на каждую единицу товара.',
  },
  etalon: {
    title: 'образец',
    text: 'Готовый пример результата, про который вы скажете «вот так правильно». Например, удачный ответ на отзыв или месяц, где выплата площадки сошлась до рубля. По образцам настраивают и проверяют автоматизацию.',
  },
  access: {
    title: 'доступ на чтение',
    text: 'Ключ или учётная запись, через которые можно только смотреть данные, но ничего не менять в кабинете. С него обычно и начинают.',
  },
  stage: {
    title: 'стадия',
    text: 'Где магазин на лестнице внедрения ИИ. Стадия 0: ИИ не пробовали. Стадия 1: пользуются кто как умеет, в чате. Дальше появляются общие правила и программы, а решение «кому отдать шаг» принимается по каждому процессу.',
    href: `${AIAS_REPO_URL}/blob/main/guide/lestnica-stadiy.md`,
  },
  program: {
    title: 'программа',
    text: 'Обычный код без ИИ. Делает одно и то же одинаково, запуск стоит копейки, и там, где правило записано полностью, она не ошибается.',
  },
  aiPrepares: {
    title: 'ИИ готовит',
    text: 'ИИ делает черновик: ответ, текст, сводку. Отправляет или публикует программа и только после вашего «да».',
  },
  agent: {
    title: 'ИИ-агент',
    text: 'ИИ, который сам решает, какие шаги сделать и какими инструментами пользоваться. Нужен там, где шаги заранее не известны, например в исследовании ниши.',
  },
}
```

- [ ] **Step 3: Создать `app/data/brief/questions.ts`**

```ts
import type { HoursBand } from '@/lib/brief/ids'
import type { BriefAnswers, DeepAnswers, DeepQuestionId } from '@/lib/brief/schema'
import { needsCheck, type GeneralField } from '@/lib/brief/state'
import type { TermId } from './glossary'

// Вопросы брифа. Значения вариантов совпадают с ids.ts (проверяет brief-data.test.ts).

export type Option = { value: string; label: string; hint?: string }

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
  other?: { trigger: string; field: GeneralField; placeholder: string; max: number }
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
    other: { trigger: 'triedFailed', field: 'aiTried', placeholder: 'Что пробовали и что пошло не так', max: 500 },
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
```

- [ ] **Step 4: Создать `app/data/brief/copy.ts`**

```ts
import type { OfferStep, StageKey, StepColor } from '@/lib/brief/map-types'
import type { StepKey } from '@/lib/brief/state'

// Все тексты брифа: экран, карта, правила. Без длинных тире (проверяет brief-data.test.ts).

function plural(n: number, forms: readonly [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

const stepTitles: Record<StepKey, string> = {
  intro: 'Начало',
  shop: 'О магазине',
  now: 'Как всё устроено сейчас',
  time: 'Где уходит время',
  deep: 'Подробно',
  goals: 'Цели и рамки',
  map: 'Карта',
}

export const briefCopy = {
  meta: {
    title: 'Бриф: карта автоматизаций магазина · webkoth.com',
    description:
      'Бриф для продавца на маркетплейсах: 15–20 минут, в конце карта, что отдать программе, что ИИ, а что оставить себе.',
    headerLabel: 'Бриф',
  },
  intro: {
    eyebrow: 'Бриф · магазин на маркетплейсах',
    title: 'Карта: что отдать программе, что ИИ, а что оставить себе',
    lead: 'Ответьте на вопросы о магазине, и в конце увидите предварительную карту автоматизаций по вашим процессам.',
    points: [
      'Займёт 15–20 минут. Можно закрыть страницу и вернуться: ответы сохраняются в этом браузере.',
      'Ответы уходят мне только по кнопке в конце.',
      '«Не знаю» тоже ответ. Такие места уточним на созвоне.',
    ],
    start: 'Начать',
    resume: 'Продолжить с места остановки',
    restart: 'Начать заново',
    outdated: 'Бриф обновился, поэтому начнём заново.',
    unavailable: 'Этот браузер не сохраняет ответы: пройдите бриф за один раз.',
  },
  stepTitles,
  progress: (n: number, title: string) => `Шаг ${n} из 6 · ${title}`,
  saved: 'сохранено ✓',
  notSaved: 'не сохраняется в этом браузере',
  nav: { back: '← Назад', next: 'Дальше →', submit: 'Показать карту' },
  errors: {
    required: 'Выберите вариант',
    picked: 'Отметьте хотя бы один процесс',
    deepChoice: 'Выберите от одного до трёх процессов для подробного разбора',
    customLabel: 'Напишите, что это за процесс',
    name: 'Как к вам обращаться?',
    contact: 'Оставьте Telegram или телефон',
    consent: 'Нужно согласие на обработку данных',
  },
  time: {
    lead: 'Отметьте всё, что отнимает у вас или команды время, и укажите, сколько часов в неделю на это уходит.',
    hoursLabel: 'Часов в неделю',
    deepBanner: (n: number) =>
      `Отмечено ${n}. Выберите до трёх, что болит сильнее всего: по ним зададим несколько вопросов.`,
    deepToggle: 'Разобрать подробно',
    customPlaceholder: 'Например: заказ упаковки у поставщика',
  },
  deep: {
    eyebrow: (i: number, total: number) => `Подробно · процесс ${i} из ${total}`,
  },
  goals: {
    notesTitle: 'Что ещё важно знать?',
    notesPlaceholder: 'Например: в ноябре распродажа, до неё хочу разгрузить отзывы',
    nameTitle: 'Как к вам обращаться',
    contactTitle: 'Telegram или телефон',
    consentBefore: 'Согласен на обработку персональных данных по ',
    consentLink: 'политике конфиденциальности',
  },
  live: {
    title: 'Ваша карта · черновик',
    empty: 'Карта начнёт собираться, когда вы отметите процессы на шаге 3.',
    bar: (n: number) => `Карта: ${n} ${plural(n, ['пункт', 'пункта', 'пунктов'])}`,
  },
  map: {
    eyebrow: 'Предварительная карта · по вашим ответам',
    title: (shops: string) =>
      shops
        ? `Магазин на ${shops}: что отдать программе, что ИИ, а что оставить себе`
        : 'Что отдать программе, что ИИ, а что оставить себе',
    kpiHours: 'можно вернуть в неделю · оценка',
    kpiProcesses: 'процессов разобрано',
    kpiStage: 'стадия',
    lessThanHour: 'меньше часа',
    lessThanHourNote: 'Меньше часа в неделю: обсудим, стоит ли автоматизировать.',
    startHere: 'Начните с этого',
    startFallback: 'Начните с порядка',
    why: 'Почему первым',
    prepare: 'Что подготовить',
    similar: 'Похожий проект',
    library: 'Разбор по стандарту',
    notDeep: 'Не разбирали',
    notDeepTail: 'можно дополнить на созвоне',
    pending: 'ждёт подробностей',
    legend: 'Цвета шагов',
    pdf: 'Скачать PDF',
    reset: 'Начать новый бриф',
  },
  send: {
    sending: 'Отправляю карту…',
    sent: 'Карта отправлена. Свяжусь с вами по указанному контакту.',
    failed: 'Не отправилось.',
    rateLimited: 'Слишком много попыток. Повторите через минуту.',
    retry: 'Отправить ещё раз',
    writeTelegram: 'Написать в Telegram',
  },
}

export const colorCopy: Record<StepColor, string> = {
  auto: 'делает программа или ИИ сам',
  ai: 'ИИ готовит, вы утверждаете',
  human: 'решаете вы',
  skip: 'пока не трогать',
}

export const colorShort: Record<StepColor, string> = {
  auto: 'сам',
  ai: 'ИИ готовит',
  human: 'вы',
  skip: 'не трогать',
}

export const outcomeCopy = {
  captions: {
    program: 'Программа, без ИИ',
    aiAuto: 'ИИ делает сам и сообщает',
    aiPrepares: 'ИИ готовит черновик',
    split: 'По этапам, с проверками',
    human: 'Вы, ИИ-помощник подсказывает',
    f0: 'Пока не трогать',
    stopEtalon: 'Сначала образец',
    stopData: 'Сначала порядок в данных',
    pending: 'Ждёт подробностей',
  },
  approvalCaption: 'Вы утверждаете',
  notes: {
    program: 'Правило записывается полностью: это работа программы.',
    split: 'Разобьём на этапы на созвоне.',
    f0: 'Редко и недолго: автоматизация не окупится.',
    stopData: 'ИИ поверх неточных цифр даёт уверенные ошибки.',
    kept: 'Могла бы программа: оставили вам по вашему выбору.',
    personalData: 'В процессе данные покупателей: только российская модель или обезличивание.',
    rope: 'Черновиков не больше, чем вы успеваете проверить.',
  },
}

export const explainCopy = {
  why: {
    mostHours: 'больше всего часов в неделю',
    hasEtalon: 'образцы у вас уже есть',
    approval: 'ошибку видно до того, как её увидят покупатели',
    program: 'без ИИ: программа работает предсказуемо',
  },
  prepare: {
    etalon: (hint: string) => `Соберите образцы «вот так правильно». ${hint}`,
    moreEtalons: 'Соберите ещё 10–20 примеров «вот так правильно».',
    data: 'Сведите данные в одну таблицу или учётную систему.',
    cost: 'Посчитайте себестоимость каждого товара.',
    ledger: 'Начните вести учёт хотя бы в таблице.',
    approver: 'Решите, кто утверждает и сколько минут в день у него есть.',
    apiToken: 'Выпустите ключ доступа к кабинету: покажу как.',
  },
}

export const readyMadeCopy = {
  cabinet: (text: string) => `Уже есть в кабинете: ${text}. Попробуйте до любой разработки.`,
  service: (text: string) => `Есть готовые сервисы: ${text}.`,
  using: 'Вы уже пользуетесь похожим: встроим, а не заменим.',
}

export const stageCopy: Record<StageKey, { label: string; forUs: string }> = {
  stage0: { label: 'Стадия 0 · ИИ пока не пробовали', forUs: 'стадия 0 по лестнице AIAS' },
  stage1: { label: 'Стадия 1 · ИИ пробуют в работе', forUs: 'стадия 1, стихийное использование' },
  stage1to2: { label: 'Стадия 1–2 · уточним на разборе', forUs: 'стадия 1–2 по самоотчёту, уточняет аудит' },
  stage1stuck: { label: 'Стадия 1 · есть опыт, который не взлетел', forUs: 'стадия 1, застрявший пилот' },
  unknown: { label: 'Стадия не указана', forUs: 'стадия не указана' },
}

export const offerCopy: Record<OfferStep, string> = {
  pilot: 'доведение пилота до production',
  audit: 'аудит и карта',
  firstProcess: 'первый процесс до production',
  review: 'разбор процесса, 30 минут',
}

export const flagCopy = {
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
}

export const deliverCopy = {
  documentFailed: 'Файл не прошёл, отправляю текстом частями.',
  noDeep: 'Подробности не заполнены',
  start: 'начать с этого',
}
```

- [ ] **Step 5: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок в новых файлах (`lib/brief/*`, `app/data/brief/*`).

- [ ] **Step 6: Commit**

```bash
git add lib/brief/map-types.ts app/data/brief/glossary.ts app/data/brief/questions.ts app/data/brief/copy.ts
git commit -m "feat(brief): типы карты, глоссарий, вопросы и тексты брифа"
```

---

### Task 4: Коэффициенты, каталог процессов и тест данных

**Files:**
- Create: `app/data/brief/coefficients.ts`
- Create: `app/data/brief/processes.ts`
- Test: `app/data/brief/brief-data.test.ts`

- [ ] **Step 1: Создать `app/data/brief/coefficients.ts`**

```ts
import type { HoursBand } from '@/lib/brief/ids'
import type { ShareKey } from '@/lib/brief/map-types'

// Допущения карты. Оценки без замера: пересматриваем после трёх брифов по расхождению
// с тем, что выяснилось на созвонах (спека, раздел 14).

/** Часов в неделю для деления шкалы шага 3. */
export const HOURS_VALUE: Record<HoursBand, number> = {
  lt1: 0.5,
  '1to3': 2,
  '3to5': 4,
  '5to10': 7.5,
  '10plus': 12,
}

/** Какую долю часов процесса возвращает вердикт dynamic-шага. */
export const RETURN_SHARE: Record<ShareKey, number> = {
  f3: 0.9,
  aiAuto: 0.8,
  aiPrepares: 0.6,
  split: 0.5,
  human: 0.2,
  skip: 0,
}

/** Пригодность агента первым шагом на стадиях 0 и 1. */
export const AGENT_EARLY_FITNESS = 0.5

/** Реже раза в неделю и меньше стольких часов → «редко» (В1). */
export const RARE_HOURS_THRESHOLD = 1

/** «Уже есть готовое» старше стольких месяцев требует перепроверки. */
export const READY_MADE_MAX_AGE_MONTHS = 6
```

- [ ] **Step 2: Создать `app/data/brief/processes.ts`**

```ts
import type { CaseSlug } from '@/app/data/cases'
import { AIAS_REPO_URL } from '@/app/data/standard'
import type { ProcessGroup, ProcessId, ReadyToolKey } from '@/lib/brief/ids'
import type { LinkRef, StepColor } from '@/lib/brief/map-types'
import type { DeepQuestionId } from '@/lib/brief/schema'
import type { TermId } from './glossary'

// Каталог процессов селлера (спека, раздел 6). Цепочка шагов повторяет разбор
// по стандарту AIAS: цвет fixed-шага не зависит от ответов, цвет dynamic-шага
// ставит вердикт, approval показывается, только если dynamic-шаг стал «ИИ готовит».
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
```

- [ ] **Step 3: Написать тест данных `app/data/brief/brief-data.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { CASE_SLUGS } from '@/app/data/cases'
import { PROCESS_IDS } from '@/lib/brief/ids'
import { briefAnswersSchema, deepAnswersSchema } from '@/lib/brief/schema'
import { READY_MADE_MAX_AGE_MONTHS } from './coefficients'
import { briefCopy, clarifyCopy, colorCopy, explainCopy, flagCopy, offerCopy, outcomeCopy, readyMadeCopy, stageCopy } from './copy'
import { glossary, TERM_IDS } from './glossary'
import { processCatalog } from './processes'
import { deepQuestions, goalsQuestions, nowQuestions, shopQuestions } from './questions'

const entries = Object.values(processCatalog)

describe('каталог процессов', () => {
  it('запись на каждый id, ключ совпадает с id', () => {
    expect(Object.keys(processCatalog).sort()).toEqual([...PROCESS_IDS].sort())
    for (const [key, e] of Object.entries(processCatalog)) expect(e.id).toBe(key)
  })

  it('ровно один dynamic-шаг, approval только сразу после него', () => {
    for (const e of entries) {
      const kinds = e.chain.map((s) => s.kind)
      expect(kinds.filter((k) => k === 'dynamic'), e.id).toHaveLength(1)
      kinds.forEach((k, i) => {
        if (k === 'approval') expect(kinds[i - 1], e.id).toBe('dynamic')
      })
    }
  })

  it('у write-процессов approval есть, у read и notify нет', () => {
    for (const e of entries) {
      const has = e.chain.some((s) => s.kind === 'approval')
      expect(has, e.id).toBe(e.facts.sideEffect === 'write')
    }
  })

  it('подсказки к образцу, правилу и данным не пустые', () => {
    for (const e of entries) {
      for (const k of ['etalon', 'rule', 'data'] as const) expect(e.hints[k].length, `${e.id}.${k}`).toBeGreaterThan(10)
    }
  })

  it('кейсы есть в реестре', () => {
    for (const e of entries) for (const c of e.cases) expect(CASE_SLUGS, e.id).toContain(c)
  })

  it('«уже есть готовое» проверено не раньше чем полгода назад', () => {
    const now = new Date()
    for (const e of entries) {
      if (!e.readyMade) continue
      const [y, m] = e.readyMade.checked.split('-').map(Number)
      const age = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
      expect(age, `${e.id}: перепроверить readyMade`).toBeLessThanOrEqual(READY_MADE_MAX_AGE_MONTHS)
    }
  })

  it('упомянутые термины есть в глоссарии', () => {
    const used = [
      ...entries.flatMap((e) => e.terms ?? []),
      ...[...shopQuestions, ...nowQuestions, ...goalsQuestions, ...deepQuestions].flatMap((q) => q.terms ?? []),
    ]
    for (const t of used) expect(TERM_IDS).toContain(t)
  })
})

describe('вопросы', () => {
  it('значения вариантов общих вопросов проходят схему ответов', () => {
    const shape = briefAnswersSchema.shape
    for (const q of [...shopQuestions, ...nowQuestions, ...goalsQuestions]) {
      for (const o of q.options) {
        const value = q.multi ? [o.value] : o.value
        expect(shape[q.id].safeParse(value).success, `${q.id}=${o.value}`).toBe(true)
      }
    }
  })

  it('значения вариантов подробных вопросов проходят схему', () => {
    const shape = deepAnswersSchema.shape
    for (const q of deepQuestions) {
      for (const o of q.options) expect(shape[q.id].safeParse(o.value).success, `${q.id}=${o.value}`).toBe(true)
    }
  })
})

describe('тексты брифа', () => {
  it('без длинных тире', () => {
    const texts = JSON.stringify({
      glossary,
      processCatalog,
      shopQuestions,
      nowQuestions,
      goalsQuestions,
      deepQuestions,
      briefCopy,
      colorCopy,
      outcomeCopy,
      explainCopy,
      stageCopy,
      offerCopy,
      samples: [
        briefCopy.map.title('Wildberries'),
        briefCopy.time.deepBanner(4),
        briefCopy.live.bar(2),
        explainCopy.prepare.etalon('x'),
        readyMadeCopy.cabinet('x'),
        readyMadeCopy.service('x'),
        flagCopy.category('x'),
        flagCopy.stuckPilot('x'),
        clarifyCopy.deep('x', 'y'),
      ],
    })
    expect(texts).not.toMatch(/—/)
  })
})
```

- [ ] **Step 4: Запустить тест**

Run: `npx vitest run app/data/brief/brief-data.test.ts`
Expected: PASS, 10 tests. Если падает «approval» или «термины», исправить данные, а не тест.

- [ ] **Step 5: Commit**

```bash
git add app/data/brief/coefficients.ts app/data/brief/processes.ts app/data/brief/brief-data.test.ts
git commit -m "feat(brief): каталог процессов селлера, коэффициенты и тест данных"
```

---

### Task 5: Ответы процесса → вход вердикта и цвет шага

**Files:**
- Create: `lib/brief/to-quiz-input.ts`
- Create: `lib/brief/step-color.ts`
- Test: `lib/brief/to-quiz-input.test.ts`
- Test: `lib/brief/step-color.test.ts`

- [ ] **Step 1: Написать падающий тест `lib/brief/to-quiz-input.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { processCatalog } from '@/app/data/brief/processes'
import { emptyAnswers, type BriefAnswers, type DeepAnswers } from './schema'
import { toQuizInput } from './to-quiz-input'

const shop = (patch: Partial<BriefAnswers> = {}): BriefAnswers => ({
  ...emptyAnswers(),
  costKnown: 'exact',
  ledger: ['sheets'],
  ...patch,
})
const d: DeepAnswers = { frequency: 'daily', who: 'me', etalon: 'many', rule: 'readInput', risk: 'buyersSee', data: 'cabinet' }

describe('toQuizInput', () => {
  it('отзывы: полный вход вердикта', () => {
    expect(toQuizInput(processCatalog.reviews, d, '1to3', shop())).toEqual({
      input: {
        hasEtalon: true,
        dataReady: true,
        useful: 'yes',
        rule: 'freeInput',
        check: 'expert',
        singleRun: true,
        sideEffect: 'write',
        irreversible: true,
        personalData: false,
      },
      dataReason: undefined,
    })
  })

  it('образец: «есть 1–2» считается, «нет» и «не знаю» нет', () => {
    const r = (etalon: DeepAnswers['etalon']) => toQuizInput(processCatalog.reviews, { ...d, etalon }, '1to3', shop()).input.hasEtalon
    expect([r('many'), r('few'), r('no'), r('unknown')]).toEqual([true, true, false, false])
  })

  it('данные «в голове» или «не знаю»: причина data', () => {
    for (const data of ['head', 'unknown'] as const) {
      const r = toQuizInput(processCatalog.reviews, { ...d, data }, '1to3', shop())
      expect([r.input.dataReady, r.dataReason]).toEqual([false, 'data'])
    }
  })

  it('денежный процесс без себестоимости: причина cost', () => {
    const r = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ costKnown: 'no' }))
    expect([r.input.dataReady, r.dataReason]).toEqual([false, 'cost'])
  })

  it('денежный процесс при учёте только «в голове»: причина ledger', () => {
    const r = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ ledger: ['head'] }))
    expect(r.dataReason).toBe('ledger')
    const ok = toQuizInput(processCatalog.unit, { ...d, data: 'sheet' }, '1to3', shop({ ledger: ['head', 'sheets'] }))
    expect(ok.dataReason).toBeUndefined()
  })

  it('не денежный процесс себестоимость не волнует', () => {
    expect(toQuizInput(processCatalog.reviews, d, '1to3', shop({ costKnown: 'no', ledger: ['head'] })).input.dataReady).toBe(true)
  })

  it('редко и меньше часа: rare; редко, но долго: yes', () => {
    expect(toQuizInput(processCatalog.reviews, { ...d, frequency: 'rare' }, 'lt1', shop()).input.useful).toBe('rare')
    expect(toQuizInput(processCatalog.reviews, { ...d, frequency: 'rare' }, '3to5', shop()).input.useful).toBe('yes')
  })

  it('правило и проверка', () => {
    const r = (patch: DeepAnswers) => toQuizInput(processCatalog.reviews, { ...d, ...patch }, '1to3', shop()).input
    expect(r({ rule: 'sheet' }).rule).toBe('full')
    expect(r({ rule: 'experience' }).rule).toBe('judgment')
    expect(r({ rule: 'unknown' }).rule).toBe('judgment')
    expect(r({ check: 'instant' }).check).toBe('auto')
    expect(r({ check: 'glance' }).check).toBe('quick')
  })

  it('необратимость только у процессов, которые пишут наружу', () => {
    expect(toQuizInput(processCatalog.reviews, { ...d, risk: 'nothing' }, '1to3', shop()).input.irreversible).toBe(false)
    expect(toQuizInput(processCatalog.reviews, { ...d, risk: 'unknown' }, '1to3', shop()).input.irreversible).toBe(true)
    expect(toQuizInput(processCatalog.ads, { ...d, risk: 'money' }, '1to3', shop()).input.irreversible).toBe(false)
  })

  it('персональные данные берутся из каталога', () => {
    expect(toQuizInput(processCatalog.returns, d, '1to3', shop()).input.personalData).toBe(true)
  })
})
```

- [ ] **Step 2: Написать падающий тест `lib/brief/step-color.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { outcomeCopy } from '@/app/data/brief/copy'
import type { Verdict, VerdictFlag, VerdictForm } from '@/lib/standard/verdict'
import { dynamicOutcome } from './step-color'

const v = (form: VerdictForm, act?: 'A2' | 'A4' | 'A5', flags: VerdictFlag[] = []): Verdict => ({
  form,
  autonomy: act ? { collect: 'A5', analyze: 'A5', decide: 'A1', act } : undefined,
  flags,
})
const c = outcomeCopy.captions
const n = outcomeCopy.notes

describe('dynamicOutcome', () => {
  it('F3: программа', () => {
    expect(dynamicOutcome(v('f3'), 'give')).toEqual({ color: 'auto', caption: c.program, notes: [n.program], shareKey: 'f3', showApproval: false })
  })

  it('F4 с действием A2: ИИ готовит, шаг утверждения показан', () => {
    expect(dynamicOutcome(v('f4', 'A2', ['irreversible', 'rope']), undefined)).toEqual({
      color: 'ai',
      caption: c.aiPrepares,
      notes: [n.rope],
      shareKey: 'aiPrepares',
      showApproval: true,
    })
  })

  it('F5 с действием A4: ИИ делает сам', () => {
    const o = dynamicOutcome(v('f5', 'A4'), 'give')
    expect([o.color, o.caption, o.shareKey, o.showApproval]).toEqual(['auto', c.aiAuto, 'aiAuto', false])
  })

  it('split: по этапам', () => {
    expect(dynamicOutcome(v('split'), 'give')).toEqual({ color: 'ai', caption: c.split, notes: [n.split], shareKey: 'split', showApproval: false })
  })

  it('F1 и F1/F2: человек с помощником', () => {
    for (const form of ['f1', 'f1f2'] as const) {
      expect(dynamicOutcome(v(form), 'give')).toMatchObject({ color: 'human', caption: c.human, shareKey: 'human' })
    }
  })

  it('F0 и остановки: не трогать', () => {
    expect(dynamicOutcome(v('f0'), 'give')).toMatchObject({ color: 'skip', caption: c.f0, notes: [n.f0], shareKey: 'skip' })
    expect(dynamicOutcome(v('stopEtalon'), 'give')).toMatchObject({ color: 'skip', caption: c.stopEtalon, notes: [] })
    expect(dynamicOutcome(v('stopData'), 'give')).toMatchObject({ color: 'skip', caption: c.stopData, notes: [n.stopData] })
  })

  it('«оставить себе»: человек; при F3 пометка, что могла бы программа', () => {
    expect(dynamicOutcome(v('f3'), 'keep')).toEqual({ color: 'human', caption: c.human, notes: [n.kept], shareKey: 'human', showApproval: false })
    expect(dynamicOutcome(v('f1'), 'keep').notes).toEqual([])
    expect(dynamicOutcome(v('stopData'), 'keep').color).toBe('skip')
  })

  it('флаг персональных данных даёт пометку; rope без шага утверждения не пишется', () => {
    expect(dynamicOutcome(v('f3', undefined, ['personalData']), 'give').notes).toEqual([n.program, n.personalData])
    expect(dynamicOutcome(v('f4', 'A2', ['rope']), 'keep').notes).toEqual([n.kept])
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падают**

Run: `npx vitest run lib/brief/to-quiz-input.test.ts lib/brief/step-color.test.ts`
Expected: FAIL, не найдены модули `./to-quiz-input` и `./step-color`.

- [ ] **Step 4: Создать `lib/brief/to-quiz-input.ts`**

```ts
import { HOURS_VALUE, RARE_HOURS_THRESHOLD } from '@/app/data/brief/coefficients'
import type { ProcessEntry } from '@/app/data/brief/processes'
import type { QuizInput } from '@/lib/standard/verdict'
import type { HoursBand } from './ids'
import type { DataReason } from './map-types'
import type { BriefAnswers, DeepAnswers } from './schema'

// Ответы селлера о процессе → вход движка вердикта (спека, 7.1). Вопросы, на которые
// селлер не ответит (один прогон, эффект, персональные данные), берутся из каталога.

export function ledgerHeadOnly(a: BriefAnswers): boolean {
  return a.ledger.length > 0 && a.ledger.every((l) => l === 'head')
}

export function dataReasonOf(entry: ProcessEntry, d: DeepAnswers, a: BriefAnswers): DataReason | undefined {
  if (d.data === 'head' || d.data === 'unknown') return 'data'
  if (entry.facts.moneyData && a.costKnown === 'no') return 'cost'
  if (entry.facts.moneyData && ledgerHeadOnly(a)) return 'ledger'
  return undefined
}

export function toQuizInput(
  entry: ProcessEntry,
  d: DeepAnswers,
  hours: HoursBand,
  a: BriefAnswers,
): { input: QuizInput; dataReason?: DataReason } {
  const dataReason = dataReasonOf(entry, d, a)
  // Необратимость имеет смысл только там, где шаг пишет наружу: у read и notify
  // деньги двигают отдельные шаги человека, и «ИИ готовит» без утверждения не нужен.
  const writes = entry.facts.sideEffect === 'write'
  return {
    input: {
      hasEtalon: d.etalon === 'many' || d.etalon === 'few',
      dataReady: dataReason === undefined,
      useful: d.frequency === 'rare' && HOURS_VALUE[hours] < RARE_HOURS_THRESHOLD ? 'rare' : 'yes',
      rule: d.rule === 'sheet' ? 'full' : d.rule === 'readInput' ? 'freeInput' : 'judgment',
      check: d.check === 'instant' ? 'auto' : d.check === 'glance' ? 'quick' : 'expert',
      singleRun: entry.facts.singleRun,
      sideEffect: entry.facts.sideEffect,
      irreversible: writes && d.risk !== 'nothing',
      personalData: entry.facts.personalData,
    },
    dataReason,
  }
}
```

- [ ] **Step 5: Создать `lib/brief/step-color.ts`**

```ts
import { outcomeCopy } from '@/app/data/brief/copy'
import type { Verdict } from '@/lib/standard/verdict'
import type { DynamicOutcome } from './map-types'
import type { DeepAnswers } from './schema'

// Вердикт → цвет и подпись dynamic-шага (спека, 7.2). Цвет всегда идёт с подписью:
// цвет не единственный сигнал.

const c = outcomeCopy.captions
const n = outcomeCopy.notes

function base(v: Verdict): DynamicOutcome {
  switch (v.form) {
    case 'f3':
      return { color: 'auto', caption: c.program, notes: [n.program], shareKey: 'f3', showApproval: false }
    case 'f4':
    case 'f5':
      return v.autonomy?.act === 'A2'
        ? { color: 'ai', caption: c.aiPrepares, notes: [], shareKey: 'aiPrepares', showApproval: true }
        : { color: 'auto', caption: c.aiAuto, notes: [], shareKey: 'aiAuto', showApproval: false }
    case 'split':
      return { color: 'ai', caption: c.split, notes: [n.split], shareKey: 'split', showApproval: false }
    case 'f1':
    case 'f1f2':
      return { color: 'human', caption: c.human, notes: [], shareKey: 'human', showApproval: false }
    case 'f0':
      return { color: 'skip', caption: c.f0, notes: [n.f0], shareKey: 'skip', showApproval: false }
    case 'stopEtalon':
      return { color: 'skip', caption: c.stopEtalon, notes: [], shareKey: 'skip', showApproval: false }
    case 'stopData':
      return { color: 'skip', caption: c.stopData, notes: [n.stopData], shareKey: 'skip', showApproval: false }
  }
}

function flagNotes(v: Verdict, withApproval: boolean): string[] {
  const out: string[] = []
  if (v.flags.includes('personalData')) out.push(n.personalData)
  if (withApproval && v.flags.includes('rope')) out.push(n.rope)
  return out
}

export function dynamicOutcome(v: Verdict, handover: DeepAnswers['handover']): DynamicOutcome {
  const b = base(v)
  if (handover === 'keep' && b.color !== 'skip') {
    const couldAutomate = v.form === 'f3' || v.form === 'f4' || v.form === 'f5'
    return {
      color: 'human',
      caption: c.human,
      notes: [...(couldAutomate ? [n.kept] : []), ...flagNotes(v, false)],
      shareKey: 'human',
      showApproval: false,
    }
  }
  return { ...b, notes: [...b.notes, ...flagNotes(v, b.showApproval)] }
}
```

- [ ] **Step 6: Запустить тесты**

Run: `npx vitest run lib/brief/to-quiz-input.test.ts lib/brief/step-color.test.ts`
Expected: PASS, 10 + 8 tests.

- [ ] **Step 7: Commit**

```bash
git add lib/brief/to-quiz-input.ts lib/brief/to-quiz-input.test.ts lib/brief/step-color.ts lib/brief/step-color.test.ts
git commit -m "feat(brief): ответы селлера во вход вердикта и цвет шага карты"
```

---

### Task 6: Стадия, часы и приоритет, объяснения

**Files:**
- Create: `lib/brief/stage.ts`
- Create: `lib/brief/priority.ts`
- Create: `lib/brief/explain.ts`
- Test: `lib/brief/priority.test.ts`
- Test: `lib/brief/explain.test.ts`

- [ ] **Step 1: Создать `lib/brief/stage.ts`** (без логики, кроме таблицы; проверяется через build-map в задаче 8)

```ts
import { stageCopy } from '@/app/data/brief/copy'
import type { StageInfo } from './map-types'
import type { BriefAnswers } from './schema'

// Стадия магазина по самооценке (спека, 7.3). Стадии 3 и 4 лестницы AIAS из брифа
// не определяются: их показывает только аудит.

export function stageOf(aiNow: BriefAnswers['aiNow']): StageInfo {
  switch (aiNow) {
    case 'none':
      return { key: 'stage0', ...stageCopy.stage0, early: true, stuckPilot: false }
    case 'chatSelf':
    case 'teamRegular':
      return { key: 'stage1', ...stageCopy.stage1, early: true, stuckPilot: false }
    case 'automations':
      return { key: 'stage1to2', ...stageCopy.stage1to2, early: false, stuckPilot: false }
    case 'triedFailed':
      return { key: 'stage1stuck', ...stageCopy.stage1stuck, early: true, stuckPilot: true }
    default:
      return { key: 'unknown', ...stageCopy.unknown, early: true, stuckPilot: false }
  }
}
```

- [ ] **Step 2: Написать падающий тест `lib/brief/priority.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import type { Verdict } from '@/lib/standard/verdict'
import type { DynamicOutcome, MapItem } from './map-types'
import { fitness, formatHours, pickStart, returnedHours, sortByPriority } from './priority'
import { stageOf } from './stage'

const outcome = (color: DynamicOutcome['color'], shareKey: DynamicOutcome['shareKey']): DynamicOutcome => ({
  color,
  caption: '',
  notes: [],
  shareKey,
  showApproval: false,
})
const verdict = (form: Verdict['form']): Verdict => ({ form, flags: [] })

const item = (processId: MapItem['processId'], priority: number, color: DynamicOutcome['color']): MapItem => ({
  processId,
  label: processId,
  hoursBand: '1to3',
  hours: 2,
  status: 'ready',
  outcome: outcome(color, 'f3'),
  returnedHours: priority,
  priority,
  chain: [],
  branches: [],
  why: [],
  prepare: [],
  cases: [],
  library: [],
})

describe('returnedHours', () => {
  it('часы × доля вердикта', () => {
    expect(returnedHours(7.5, outcome('ai', 'aiPrepares'))).toBeCloseTo(4.5)
    expect(returnedHours(2, outcome('auto', 'f3'))).toBeCloseTo(1.8)
    expect(returnedHours(4, outcome('skip', 'skip'))).toBe(0)
  })
})

describe('fitness', () => {
  it('агент на ранней стадии: половина, на стадии 1–2: полностью', () => {
    const auto = outcome('auto', 'aiAuto')
    expect(fitness(auto, verdict('f5'), stageOf('chatSelf'))).toBe(0.5)
    expect(fitness(auto, verdict('f5'), stageOf('automations'))).toBe(1)
    expect(fitness(auto, verdict('f4'), stageOf('none'))).toBe(1)
  })

  it('агент, оставленный человеку, не штрафуется; skip даёт ноль', () => {
    expect(fitness(outcome('human', 'human'), verdict('f5'), stageOf('none'))).toBe(1)
    expect(fitness(outcome('skip', 'skip'), verdict('stopData'), stageOf('none'))).toBe(0)
  })
})

describe('sortByPriority и pickStart', () => {
  it('по убыванию, равные сохраняют порядок', () => {
    const items = [item('stocks', 0, 'skip'), item('reviews', 3, 'ai'), item('ads', 0, 'skip'), item('unit', 3, 'auto')]
    expect(sortByPriority(items).map((i) => i.processId)).toEqual(['reviews', 'unit', 'stocks', 'ads'])
  })

  it('стартовый процесс только с цветом auto или ai', () => {
    expect(pickStart([item('competitors', 0.1, 'human'), item('digest', 0, 'skip')])).toBeUndefined()
    expect(pickStart([item('competitors', 2, 'human'), item('stocks', 1, 'auto')])).toBe('stocks')
  })

  it('незаполненный процесс не стартовый', () => {
    expect(pickStart([{ ...item('reviews', 3, 'ai'), status: 'pending' }])).toBeUndefined()
  })
})

describe('formatHours', () => {
  it('меньше часа и округление', () => {
    expect([formatHours(0), formatHours(0.4), formatHours(1.8), formatHours(6.3)]).toEqual(['<1', '<1', '2', '6'])
  })
})
```

- [ ] **Step 3: Написать падающий тест `lib/brief/explain.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { explainCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { prepareFor, whyFirst } from './explain'
import type { DynamicOutcome, MapItem } from './map-types'
import { emptyAnswers, type DeepAnswers } from './schema'

const outcome = (patch: Partial<DynamicOutcome>): DynamicOutcome => ({
  color: 'auto',
  caption: '',
  notes: [],
  shareKey: 'f3',
  showApproval: false,
  ...patch,
})
const base = (processId: MapItem['processId'], hours: number, patch: Partial<MapItem> = {}): MapItem => ({
  processId,
  label: processId,
  hoursBand: '1to3',
  hours,
  status: 'ready',
  returnedHours: 0,
  priority: 0,
  chain: [],
  branches: [],
  why: [],
  prepare: [],
  cases: [],
  library: [],
  ...patch,
})
const d: DeepAnswers = { etalon: 'many' }
const w = explainCopy.why
const p = explainCopy.prepare

describe('whyFirst', () => {
  it('часы, образцы и утверждение, не больше трёх', () => {
    const start = base('reviews', 7.5, { verdict: { form: 'f4', flags: [] }, outcome: outcome({ color: 'ai', showApproval: true }) })
    expect(whyFirst(start, [start, base('stocks', 2)], d)).toEqual([w.mostHours, w.hasEtalon, w.approval])
  })

  it('программа без ИИ и не самый долгий процесс', () => {
    const start = base('stocks', 2, { verdict: { form: 'f3', flags: [] }, outcome: outcome({}) })
    expect(whyFirst(start, [start, base('reviews', 7.5)], { etalon: 'few' })).toEqual([w.program])
  })
})

describe('prepareFor', () => {
  const a = { ...emptyAnswers(), apiTokens: 'yes' as const }

  it('сначала блокирующее: образец', () => {
    const item = { verdict: { form: 'stopEtalon' as const, flags: [] }, outcome: outcome({ color: 'skip' }) }
    expect(prepareFor(processCatalog.digest, item, { etalon: 'no' }, a)).toEqual([p.etalon(processCatalog.digest.hints.etalon)])
  })

  it('данные: по причине, затем «ещё образцы»', () => {
    const item = { verdict: { form: 'stopData' as const, flags: [] }, outcome: outcome({ color: 'skip' }), dataReason: 'cost' as const }
    expect(prepareFor(processCatalog.unit, item, { etalon: 'few' }, a)).toEqual([p.cost, p.moreEtalons])
  })

  it('утверждение и ключ доступа, если ключей нет и процесс идёт через кабинет', () => {
    const item = { verdict: { form: 'f4' as const, flags: [] }, outcome: outcome({ color: 'ai', showApproval: true }) }
    expect(prepareFor(processCatalog.reviews, item, d, { ...a, apiTokens: 'no' })).toEqual([p.approver, p.apiToken])
    expect(prepareFor(processCatalog.competitors, item, d, { ...a, apiTokens: 'no' })).toEqual([p.approver])
  })

  it('для остановленного процесса про ключ не говорим', () => {
    const item = { verdict: { form: 'stopData' as const, flags: [] }, outcome: outcome({ color: 'skip' }), dataReason: 'data' as const }
    expect(prepareFor(processCatalog.payouts, item, d, { ...a, apiTokens: 'unknown' })).toEqual([p.data])
  })
})
```

- [ ] **Step 4: Запустить и убедиться, что падают**

Run: `npx vitest run lib/brief/priority.test.ts lib/brief/explain.test.ts`
Expected: FAIL, не найдены `./priority` и `./explain`.

- [ ] **Step 5: Создать `lib/brief/priority.ts`**

```ts
import { AGENT_EARLY_FITNESS, RETURN_SHARE } from '@/app/data/brief/coefficients'
import type { Verdict } from '@/lib/standard/verdict'
import type { ProcessId } from './ids'
import type { DynamicOutcome, MapItem, StageInfo } from './map-types'

// Часы и приоритет (спека, 7.4). Коэффициенты - допущения в coefficients.ts.

export function returnedHours(hours: number, outcome: DynamicOutcome): number {
  return hours * RETURN_SHARE[outcome.shareKey]
}

export function fitness(outcome: DynamicOutcome, verdict: Verdict, stage: StageInfo): number {
  if (outcome.color === 'skip') return 0
  // Агент не первым шагом, пока ИИ в компании не освоен (OpenAI, five AI value models).
  if (verdict.form === 'f5' && outcome.color !== 'human' && stage.early) return AGENT_EARLY_FITNESS
  return 1
}

/** По убыванию приоритета; Array.prototype.sort стабилен, равные сохраняют порядок выбора. */
export function sortByPriority(items: readonly MapItem[]): MapItem[] {
  return [...items].sort((a, b) => b.priority - a.priority)
}

/** Первый процесс, с которого начать: заполнен, приоритет > 0, цвет «сам» или «ИИ готовит». */
export function pickStart(sorted: readonly MapItem[]): ProcessId | undefined {
  return sorted.find(
    (i) => i.status === 'ready' && i.priority > 0 && (i.outcome?.color === 'auto' || i.outcome?.color === 'ai'),
  )?.processId
}

export function formatHours(n: number): string {
  return n < 1 ? '<1' : String(Math.round(n))
}
```

- [ ] **Step 6: Создать `lib/brief/explain.ts`**

```ts
import { explainCopy } from '@/app/data/brief/copy'
import type { ProcessEntry } from '@/app/data/brief/processes'
import type { MapItem } from './map-types'
import type { BriefAnswers, DeepAnswers } from './schema'

// «Почему первым» и «что подготовить» (спека, 7.9): фиксированные фразы по условиям,
// не больше трёх на пункт. Сначала то, что блокирует, потом остальное.

const MAX_PHRASES = 3

export function whyFirst(item: MapItem, items: readonly MapItem[], d: DeepAnswers): string[] {
  const out: string[] = []
  const maxHours = Math.max(...items.filter((i) => i.status === 'ready').map((i) => i.hours))
  if (item.hours === maxHours) out.push(explainCopy.why.mostHours)
  if (d.etalon === 'many') out.push(explainCopy.why.hasEtalon)
  if (item.outcome?.showApproval) out.push(explainCopy.why.approval)
  if (item.verdict?.form === 'f3' && item.outcome?.color === 'auto') out.push(explainCopy.why.program)
  return out.slice(0, MAX_PHRASES)
}

export function prepareFor(
  entry: ProcessEntry,
  item: Pick<MapItem, 'verdict' | 'outcome' | 'dataReason'>,
  d: DeepAnswers,
  a: BriefAnswers,
): string[] {
  const p = explainCopy.prepare
  const out: string[] = []
  if (item.verdict?.form === 'stopEtalon') out.push(p.etalon(entry.hints.etalon))
  if (item.verdict?.form === 'stopData') out.push(p[item.dataReason ?? 'data'])
  if (d.etalon === 'few') out.push(p.moreEtalons)
  if (item.outcome?.showApproval) out.push(p.approver)
  if (a.apiTokens !== 'yes' && entry.facts.cabinetApi && item.outcome?.color !== 'skip') out.push(p.apiToken)
  return out.slice(0, MAX_PHRASES)
}
```

- [ ] **Step 7: Запустить тесты**

Run: `npx vitest run lib/brief/priority.test.ts lib/brief/explain.test.ts`
Expected: PASS, 7 + 6 tests.

- [ ] **Step 8: Commit**

```bash
git add lib/brief/stage.ts lib/brief/priority.ts lib/brief/priority.test.ts lib/brief/explain.ts lib/brief/explain.test.ts
git commit -m "feat(brief): стадия магазина, часы и приоритет, объяснения пунктов карты"
```

---

### Task 7: Подписи, ступень, флаги и «что уточнить»

**Files:**
- Create: `lib/brief/labels.ts`
- Create: `lib/brief/offer-step.ts`
- Create: `lib/brief/flags.ts`
- Test: `lib/brief/labels.test.ts`
- Test: `lib/brief/offer-step.test.ts`

Флаги и «уточнить» проверяются на эталонных магазинах в задаче 8.

- [ ] **Step 1: Написать падающий тест `lib/brief/labels.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { shopQuestions } from '@/app/data/brief/questions'
import { answerText, categoryText, marketplacesText, processLabel } from './labels'
import { emptyAnswers } from './schema'

describe('подписи', () => {
  it('своё: название селлера или «Своё»', () => {
    expect(processLabel('custom', { ...emptyAnswers(), customLabel: ' Упаковка ' })).toBe('Упаковка')
    expect(processLabel('custom', emptyAnswers())).toBe('Своё')
    expect(processLabel('reviews', emptyAnswers())).toBe('Ответы на отзывы')
  })

  it('площадки через плюс, «другое» с уточнением', () => {
    expect(marketplacesText({ ...emptyAnswers(), marketplaces: ['wb', 'other'], marketplacesOther: 'Мегамаркет' })).toBe(
      'Wildberries + Другое: Мегамаркет',
    )
    expect(marketplacesText(emptyAnswers())).toBe('')
  })

  it('категория или «не указана»', () => {
    expect(categoryText({ ...emptyAnswers(), category: 'home' })).toBe('Дом и сад')
    expect(categoryText(emptyAnswers())).toBe('не указана')
  })

  it('ответ на вопрос: подписи через запятую, пусто → undefined', () => {
    const roles = shopQuestions.find((q) => q.id === 'roles')!
    expect(answerText(roles, { ...emptyAnswers(), roles: ['manager', 'ads'] })).toBe('Менеджер, Реклама')
    expect(answerText(roles, emptyAnswers())).toBeUndefined()
  })
})
```

- [ ] **Step 2: Написать падающий тест `lib/brief/offer-step.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import type { MapItem } from './map-types'
import { offerStepOf } from './offer-step'
import { emptyAnswers } from './schema'

const stopData = { verdict: { form: 'stopData', flags: [] } } as unknown as MapItem
const ready = { verdict: { form: 'f3', flags: [] } } as unknown as MapItem

describe('offerStepOf', () => {
  it('застрявший пилот важнее всего', () => {
    expect(offerStepOf({ ...emptyAnswers(), aiNow: 'triedFailed' }, [stopData, stopData], 'reviews')).toBe('pilot')
  })

  it('два процесса без данных или учёт в голове: аудит', () => {
    expect(offerStepOf(emptyAnswers(), [stopData, stopData], undefined)).toBe('audit')
    expect(offerStepOf({ ...emptyAnswers(), ledger: ['head'] }, [ready], 'stocks')).toBe('audit')
  })

  it('есть с чего начать и есть кому внедрять: первый процесс', () => {
    expect(offerStepOf({ ...emptyAnswers(), implementer: 'employee' }, [ready, stopData], 'stocks')).toBe('firstProcess')
    expect(offerStepOf({ ...emptyAnswers(), implementer: 'nobody' }, [ready], 'stocks')).toBe('review')
  })

  it('иначе разбор', () => {
    expect(offerStepOf(emptyAnswers(), [ready], undefined)).toBe('review')
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падают**

Run: `npx vitest run lib/brief/labels.test.ts lib/brief/offer-step.test.ts`
Expected: FAIL, не найдены `./labels` и `./offer-step`.

- [ ] **Step 4: Создать `lib/brief/labels.ts`**

```ts
import { processCatalog } from '@/app/data/brief/processes'
import { optionLabel, shopQuestions, type QuestionDef } from '@/app/data/brief/questions'
import type { ProcessId } from './ids'
import type { BriefAnswers } from './schema'

// Человеческие подписи ответов: для карты, сообщения в Telegram и файла.

export function processLabel(id: ProcessId, a: BriefAnswers): string {
  if (id === 'custom') return a.customLabel?.trim() || processCatalog.custom.label
  return processCatalog[id].label
}

export function answerValues(q: QuestionDef, a: BriefAnswers): string[] {
  const raw = a[q.id] as unknown
  if (typeof raw === 'string') return raw ? [raw] : []
  return Array.isArray(raw) ? (raw as string[]) : []
}

export function answerText(q: QuestionDef, a: BriefAnswers, separator = ', '): string | undefined {
  const values = answerValues(q, a)
  if (values.length === 0) return undefined
  return values
    .map((v) => {
      const label = optionLabel(q, v) ?? v
      if (q.other && v === q.other.trigger) {
        const extra = (a[q.other.field] as string | undefined)?.trim()
        return extra ? `${label}: ${extra}` : label
      }
      return label
    })
    .join(separator)
}

const question = (id: QuestionDef['id']) => shopQuestions.find((q) => q.id === id)!

export function marketplacesText(a: BriefAnswers): string {
  return answerText(question('marketplaces'), a, ' + ') ?? ''
}

export function categoryText(a: BriefAnswers): string {
  return answerText(question('category'), a) ?? 'не указана'
}
```

- [ ] **Step 5: Создать `lib/brief/offer-step.ts`**

```ts
import type { ProcessId } from './ids'
import type { MapItem, OfferStep } from './map-types'
import type { BriefAnswers } from './schema'
import { ledgerHeadOnly } from './to-quiz-input'

// Какую ступень предложить (спека, 7.6). Первое сработавшее правило. Цены здесь нет:
// цену называет человек.

export function offerStepOf(a: BriefAnswers, items: readonly MapItem[], startId: ProcessId | undefined): OfferStep {
  if (a.aiNow === 'triedFailed') return 'pilot'
  const withoutData = items.filter((i) => i.verdict?.form === 'stopData').length
  if (withoutData >= 2 || ledgerHeadOnly(a)) return 'audit'
  if (startId && a.implementer !== 'nobody') return 'firstProcess'
  return 'review'
}
```

- [ ] **Step 6: Создать `lib/brief/flags.ts`**

```ts
import { clarifyCopy, flagCopy } from '@/app/data/brief/copy'
import { deepQuestions, goalsQuestions, nowQuestions, optionLabel, shopQuestions } from '@/app/data/brief/questions'
import { answerValues, categoryText } from './labels'
import type { MapItem } from './map-types'
import type { BriefAnswers } from './schema'

// Флаги и «что уточнить на созвоне» (спека, 7.7 и 7.8). Только для файла нам.
// Название и категории нанимателя в код сайта не попадают: флаг категории ставится всегда.

export function flagsFor(a: BriefAnswers, items: readonly MapItem[]): string[] {
  const out = [flagCopy.category(categoryText(a))]
  const personal = items.filter((i) => i.input?.personalData).map((i) => i.label)
  if (personal.length > 0) out.push(flagCopy.personalData(personal.join(', ')))
  if (a.ruOnly === 'required') out.push(flagCopy.ruOnly)
  if (a.implementer === 'nobody') out.push(flagCopy.noImplementer)
  if (a.access === 'no') out.push(flagCopy.noAccess)
  if (a.aiNow === 'triedFailed') out.push(flagCopy.stuckPilot(a.aiTried?.trim() ?? ''))
  const budget = goalsQuestions.find((q) => q.id === 'budget')!
  if (a.budget) out.push(flagCopy.budget(optionLabel(budget, a.budget) ?? a.budget))
  return out
}

export function clarifyFor(a: BriefAnswers, items: readonly MapItem[]): string[] {
  const out: string[] = []
  for (const q of [...shopQuestions, ...nowQuestions, ...goalsQuestions]) {
    if (q.showIf && !q.showIf(a)) continue
    if (answerValues(q, a).includes('unknown')) out.push(clarifyCopy.general(q.title))
  }
  for (const item of items) {
    if (item.status !== 'ready') continue
    const d = a.deepAnswers[item.processId] ?? {}
    for (const q of deepQuestions) {
      if (q.showIf && !q.showIf(d)) continue
      if (d[q.id] === 'unknown') out.push(clarifyCopy.deep(q.title, item.label))
    }
    if (d.who === 'nobody') out.push(clarifyCopy.needed(item.label))
  }
  return out
}
```

- [ ] **Step 7: Запустить тесты**

Run: `npx vitest run lib/brief/labels.test.ts lib/brief/offer-step.test.ts`
Expected: PASS, 4 + 4 tests.

- [ ] **Step 8: Commit**

```bash
git add lib/brief/labels.ts lib/brief/labels.test.ts lib/brief/offer-step.ts lib/brief/offer-step.test.ts lib/brief/flags.ts
git commit -m "feat(brief): подписи ответов, ступень предложения, флаги и вопросы на созвон"
```

---

### Task 8: Сборка карты и эталонные магазины

**Files:**
- Create: `lib/brief/fixtures.ts`
- Create: `lib/brief/build-map.ts`
- Test: `lib/brief/build-map.test.ts`

- [ ] **Step 1: Создать `lib/brief/fixtures.ts`**

```ts
import { emptyAnswers, type BriefAnswers } from './schema'

// Три эталонных магазина (спека, раздел 13). Ожидания к ним - в build-map.test.ts.

/** Магазин из макета: отзывы первыми, остатки программой, сверка ждёт данных. */
export function demoShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['wb', 'ozon'],
    fulfillment: ['fbo', 'fbs'],
    category: 'apparel',
    sku: '300to1000',
    ordersPerDay: '10to100',
    revenue: '5to20m',
    teamSize: '2to5',
    roles: ['manager', 'content'],
    ledger: ['sheets', 'moysklad'],
    costKnown: 'approx',
    tools: ['mpstats'],
    apiTokens: 'yes',
    aiNow: 'chatSelf',
    docs: 'partial',
    picked: [
      { id: 'reviews', hours: '5to10' },
      { id: 'stocks', hours: '1to3' },
      { id: 'ads', hours: '1to3' },
      { id: 'payouts', hours: '3to5' },
      { id: 'supply', hours: '1to3' },
    ],
    deepChoice: ['reviews', 'stocks', 'payouts'],
    deepAnswers: {
      reviews: { frequency: 'daily', who: 'me', etalon: 'many', rule: 'readInput', risk: 'buyersSee', data: 'cabinet', handover: 'give' },
      stocks: { frequency: 'daily', who: 'employee', etalon: 'few', rule: 'sheet', risk: 'money', data: 'sheet' },
      payouts: { frequency: 'weekly', who: 'me', etalon: 'many', rule: 'sheet', risk: 'money', data: 'head' },
    },
    goals: ['myTime', 'realProfit'],
    implementer: 'employee',
    implementerHours: '2to5',
    access: 'readOnly',
    ruOnly: 'preferred',
    budget: '150to400',
    notes: 'К ноябрю хочу разгрузить отзывы',
    name: 'Анна',
    contact: '@anna_shop',
    consent: true,
  }
}

/** «Всё в голове»: денежные процессы упираются в данные, ступень - аудит. */
export function headShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['wb'],
    fulfillment: ['fbo'],
    category: 'home',
    teamSize: 'solo',
    roles: ['onlyMe'],
    ledger: ['head'],
    costKnown: 'no',
    tools: ['none'],
    apiTokens: 'unknown',
    aiNow: 'none',
    docs: 'head',
    picked: [
      { id: 'unit', hours: '3to5' },
      { id: 'payouts', hours: '1to3' },
      { id: 'reviews', hours: '1to3' },
    ],
    deepAnswers: {
      unit: { frequency: 'weekly', who: 'me', etalon: 'few', rule: 'sheet', risk: 'money', data: 'sheet' },
      payouts: { frequency: 'weekly', who: 'me', etalon: 'many', rule: 'sheet', risk: 'money', data: 'cabinet' },
      reviews: { frequency: 'daily', who: 'me', etalon: 'no', rule: 'readInput', risk: 'buyersSee', data: 'cabinet' },
    },
    implementer: 'self',
    name: 'Олег',
    contact: '+7 900 000-00-00',
    consent: true,
  }
}

/** Один владелец, редкие задачи: почти всё «не трогать», итог меньше часа. */
export function soloRareShop(): BriefAnswers {
  return {
    ...emptyAnswers(),
    marketplaces: ['ozon'],
    teamSize: 'solo',
    roles: ['onlyMe'],
    ledger: ['sheets'],
    costKnown: 'exact',
    tools: ['none'],
    apiTokens: 'no',
    aiNow: 'chatSelf',
    picked: [
      { id: 'competitors', hours: 'lt1' },
      { id: 'digest', hours: 'lt1' },
    ],
    deepAnswers: {
      competitors: { frequency: 'rare', who: 'me', etalon: 'many', rule: 'readInput', risk: 'nothing', data: 'cabinet' },
      digest: { frequency: 'weekly', who: 'me', etalon: 'no', rule: 'readInput', risk: 'nothing', data: 'cabinet' },
    },
    name: 'Ира',
    contact: '@ira',
    consent: true,
  }
}
```

- [ ] **Step 2: Написать падающий тест `lib/brief/build-map.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { clarifyCopy, explainCopy, flagCopy, outcomeCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { buildMap, usesReadyTool } from './build-map'
import { demoShop, headShop, soloRareShop } from './fixtures'
import { formatHours } from './priority'
import { emptyAnswers, type BriefAnswers } from './schema'

describe('демо-магазин', () => {
  const map = buildMap(demoShop())

  it('порядок по приоритету и «начните с»', () => {
    expect(map.items.map((i) => i.processId)).toEqual(['reviews', 'stocks', 'payouts'])
    expect(map.startId).toBe('reviews')
    expect(map.startFallback).toBeUndefined()
  })

  it('отзывы: ИИ готовит, утверждаете вы', () => {
    const r = map.items[0]
    expect(r.verdict?.form).toBe('f4')
    expect(r.chain.map((s) => s.color)).toEqual(['auto', 'auto', 'ai', 'human', 'auto'])
    expect(r.returnedHours).toBeCloseTo(4.5)
    expect(r.why).toEqual([explainCopy.why.mostHours, explainCopy.why.hasEtalon, explainCopy.why.approval])
    expect(r.prepare).toEqual([explainCopy.prepare.approver])
    expect(r.branches).toHaveLength(1)
    expect(r.readyMade).toEqual({ kind: 'cabinet', text: processCatalog.reviews.readyMade!.text, alreadyUsing: false })
  })

  it('остатки: программа, без шага утверждения', () => {
    const s = map.items[1]
    expect(s.verdict?.form).toBe('f3')
    expect(s.chain.map((x) => x.color)).toEqual(['auto', 'auto', 'auto'])
    expect(s.returnedHours).toBeCloseTo(1.8)
    expect(s.prepare).toEqual([explainCopy.prepare.moreEtalons])
    expect(s.readyMade?.alreadyUsing).toBe(true)
    expect(s.why).toEqual([])
  })

  it('сверка: сначала данные', () => {
    const p = map.items[2]
    expect([p.verdict?.form, p.dataReason, p.returnedHours]).toEqual(['stopData', 'data', 0])
    expect(p.prepare).toEqual([explainCopy.prepare.data])
  })

  it('итог, не разобранные, ступень, стадия, флаги', () => {
    expect(map.totalReturnedHours).toBeCloseTo(6.3)
    expect(map.notDeep.map((n) => [n.processId, n.hours])).toEqual([
      ['ads', 2],
      ['supply', 2],
    ])
    expect(map.offer).toBe('firstProcess')
    expect(map.stage.key).toBe('stage1')
    expect(map.flags).toEqual([flagCopy.category('Одежда и обувь'), flagCopy.budget('150–400 тыс ₽')])
    expect(map.clarify).toEqual([])
  })
})

describe('«всё в голове»', () => {
  const map = buildMap(headShop())

  it('денежные процессы ждут данных, отзывы ждут образца', () => {
    expect(map.items.map((i) => [i.processId, i.verdict?.form])).toEqual([
      ['unit', 'stopData'],
      ['payouts', 'stopData'],
      ['reviews', 'stopEtalon'],
    ])
    expect(map.items[0].dataReason).toBe('cost')
  })

  it('старта нет, начинать с порядка; ступень аудит', () => {
    expect(map.startId).toBeUndefined()
    expect(map.startFallback).toEqual({ processId: 'unit', text: explainCopy.prepare.cost })
    expect(map.offer).toBe('audit')
    expect(map.stage.key).toBe('stage0')
    expect(map.totalReturnedHours).toBe(0)
    expect(map.clarify).toEqual([clarifyCopy.general('Выпускали ключи доступа к кабинету?')])
  })
})

describe('один владелец, редкие задачи', () => {
  const map = buildMap(soloRareShop())

  it('конкуренты остаются вам, сводка ждёт образца', () => {
    expect(map.items.map((i) => [i.processId, i.outcome?.color])).toEqual([
      ['competitors', 'human'],
      ['digest', 'skip'],
    ])
    expect(map.startId).toBeUndefined()
    expect(map.startFallback).toEqual({
      processId: 'digest',
      text: explainCopy.prepare.etalon(processCatalog.digest.hints.etalon),
    })
  })

  it('итог меньше часа, ступень разбор', () => {
    expect(map.totalReturnedHours).toBeCloseTo(0.1)
    expect(formatHours(map.totalReturnedHours)).toBe('<1')
    expect(map.offer).toBe('review')
  })
})

describe('частичные ответы и особые случаи', () => {
  it('пустой бриф: пустая карта без падения', () => {
    const map = buildMap(emptyAnswers())
    expect([map.items, map.notDeep, map.startId, map.totalReturnedHours]).toEqual([[], [], undefined, 0])
    expect(map.flags).toEqual([flagCopy.category('не указана')])
  })

  it('процесс отмечен, подробностей нет: пункт ждёт', () => {
    const map = buildMap({ ...emptyAnswers(), picked: [{ id: 'reviews', hours: '1to3' }] })
    const r = map.items[0]
    expect(r.status).toBe('pending')
    expect(r.chain.find((s) => s.label === 'Черновик ответа')).toEqual({
      label: 'Черновик ответа',
      color: 'skip',
      caption: outcomeCopy.captions.pending,
    })
    expect(r.chain.some((s) => s.label === 'Утвердить')).toBe(false)
    expect([map.startId, map.startFallback, map.totalReturnedHours]).toEqual([undefined, undefined, 0])
  })

  it('агент на ранней стадии теряет половину приоритета', () => {
    const answers = (aiNow: BriefAnswers['aiNow']): BriefAnswers => ({
      ...emptyAnswers(),
      aiNow,
      picked: [{ id: 'digest', hours: '5to10' }],
      deepAnswers: {
        digest: { frequency: 'daily', who: 'me', etalon: 'many', rule: 'experience', check: 'glance', risk: 'nothing', data: 'cabinet' },
      },
    })
    const early = buildMap(answers('chatSelf')).items[0]
    const later = buildMap(answers('automations')).items[0]
    expect(early.verdict?.form).toBe('f5')
    expect(early.returnedHours).toBeCloseTo(6)
    expect(early.priority).toBeCloseTo(3)
    expect(later.priority).toBeCloseTo(6)
  })

  it('своё: название селлера и пометка', () => {
    const map = buildMap({ ...emptyAnswers(), customLabel: 'Упаковка', picked: [{ id: 'custom', hours: '1to3' }] })
    expect([map.items[0].label, map.items[0].entryNote]).toEqual(['Упаковка', processCatalog.custom.mapNote])
  })

  it('usesReadyTool по ответам про сервисы и учёт', () => {
    const a = { ...emptyAnswers(), tools: ['mayak' as const], ledger: ['1c' as const] }
    expect([usesReadyTool(a, 'analytics'), usesReadyTool(a, 'ledgerSystem'), usesReadyTool(a, 'bidder'), usesReadyTool(a, undefined)]).toEqual([
      true,
      true,
      false,
      false,
    ])
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падает**

Run: `npx vitest run lib/brief/build-map.test.ts`
Expected: FAIL, не найден `./build-map`.

- [ ] **Step 4: Создать `lib/brief/build-map.ts`**

```ts
import { HOURS_VALUE } from '@/app/data/brief/coefficients'
import { outcomeCopy } from '@/app/data/brief/copy'
import { processCatalog, type ProcessEntry } from '@/app/data/brief/processes'
import { decideVerdict } from '@/lib/standard/verdict'
import { prepareFor, whyFirst } from './explain'
import { clarifyFor, flagsFor } from './flags'
import type { HoursBand, ReadyToolKey } from './ids'
import { processLabel } from './labels'
import type { BriefMap, DynamicOutcome, MapBranch, MapItem, MapStep, ReadyMadeView, StageInfo } from './map-types'
import { offerStepOf } from './offer-step'
import { fitness, pickStart, returnedHours, sortByPriority } from './priority'
import type { BriefAnswers } from './schema'
import { stageOf } from './stage'
import { deepList, isDeepComplete } from './state'
import { dynamicOutcome } from './step-color'
import { toQuizInput } from './to-quiz-input'

// Сборка карты из ответов. Одна функция для живого черновика (частичные ответы),
// итоговой карты в браузере и пересчёта на сервере: карте из браузера сервер не доверяет.

const PENDING: DynamicOutcome = {
  color: 'skip',
  caption: outcomeCopy.captions.pending,
  notes: [],
  shareKey: 'skip',
  showApproval: false,
}

export function usesReadyTool(a: BriefAnswers, key: ReadyToolKey | undefined): boolean {
  switch (key) {
    case 'reviewsCabinet':
      return a.tools.includes('reviewsCabinet') || a.tools.includes('reviewsService')
    case 'bidder':
      return a.tools.includes('bidder')
    case 'repricer':
      return a.tools.includes('repricer')
    case 'analytics':
      return a.tools.some((t) => t === 'mpstats' || t === 'mayak' || t === 'analyticsOther')
    case 'ledgerSystem':
      return a.ledger.some((l) => l === 'moysklad' || l === '1c' || l === 'other')
    default:
      return false
  }
}

function chainOf(entry: ProcessEntry, outcome: DynamicOutcome): MapStep[] {
  return entry.chain.flatMap((s): MapStep[] => {
    if (s.kind === 'fixed') return [{ label: s.label, color: s.color }]
    if (s.kind === 'dynamic') return [{ label: s.label, color: outcome.color, caption: outcome.caption }]
    return outcome.showApproval ? [{ label: s.label, color: 'human', caption: outcomeCopy.approvalCaption }] : []
  })
}

function branchesOf(entry: ProcessEntry): MapBranch[] {
  return (entry.branches ?? []).map((b) => ({ when: b.when, step: { label: b.step.label, color: b.step.color } }))
}

function readyMadeOf(entry: ProcessEntry, a: BriefAnswers): ReadyMadeView | undefined {
  if (!entry.readyMade) return undefined
  const { kind, text, toolsKey } = entry.readyMade
  return { kind, text, alreadyUsing: usesReadyTool(a, toolsKey) }
}

function buildItem(entry: ProcessEntry, band: HoursBand, a: BriefAnswers, stage: StageInfo): MapItem {
  const hours = HOURS_VALUE[band]
  const common = {
    processId: entry.id,
    label: processLabel(entry.id, a),
    hoursBand: band,
    hours,
    branches: branchesOf(entry),
    why: [],
    entryNote: entry.mapNote,
    readyMade: readyMadeOf(entry, a),
    cases: entry.cases,
    library: entry.library ?? [],
  }
  const d = a.deepAnswers[entry.id]
  if (!d || !isDeepComplete(d)) {
    return { ...common, status: 'pending', returnedHours: 0, priority: 0, chain: chainOf(entry, PENDING), prepare: [] }
  }
  const { input, dataReason } = toQuizInput(entry, d, band, a)
  const verdict = decideVerdict(input)
  const outcome = dynamicOutcome(verdict, d.handover)
  const returned = returnedHours(hours, outcome)
  return {
    ...common,
    status: 'ready',
    input,
    verdict,
    dataReason,
    outcome,
    returnedHours: returned,
    priority: returned * fitness(outcome, verdict, stage),
    chain: chainOf(entry, outcome),
    prepare: prepareFor(entry, { verdict, outcome, dataReason }, d, a),
  }
}

export function buildMap(a: BriefAnswers): BriefMap {
  const stage = stageOf(a.aiNow)
  const deep = deepList(a)
  const bandOf = new Map(a.picked.map((p) => [p.id, p.hours]))
  const sorted = sortByPriority(deep.map((id) => buildItem(processCatalog[id], bandOf.get(id) ?? '1to3', a, stage)))
  const startId = pickStart(sorted)
  const items = sorted.map((i) =>
    i.processId === startId ? { ...i, why: whyFirst(i, sorted, a.deepAnswers[i.processId] ?? {}) } : i,
  )
  const blocked = startId
    ? undefined
    : items.find((i) => i.verdict?.form === 'stopEtalon' || i.verdict?.form === 'stopData')

  return {
    stage,
    items,
    startId,
    startFallback: blocked?.prepare[0] ? { processId: blocked.processId, text: blocked.prepare[0] } : undefined,
    totalReturnedHours: items.reduce((sum, i) => sum + i.returnedHours, 0),
    notDeep: a.picked
      .filter((p) => !deep.includes(p.id))
      .map((p) => ({ processId: p.id, label: processLabel(p.id, a), hours: HOURS_VALUE[p.hours] })),
    offer: offerStepOf(a, items, startId),
    flags: flagsFor(a, items),
    clarify: clarifyFor(a, items),
  }
}
```

- [ ] **Step 5: Запустить тест**

Run: `npx vitest run lib/brief/build-map.test.ts`
Expected: PASS, 14 tests.

- [ ] **Step 6: Прогнать все тесты брифа и типы**

Run: `npx vitest run lib/brief app/data/brief && npm run typecheck`
Expected: все тесты брифа PASS, typecheck без ошибок.

- [ ] **Step 7: Commit**

```bash
git add lib/brief/fixtures.ts lib/brief/build-map.ts lib/brief/build-map.test.ts
git commit -m "feat(brief): сборка карты автоматизаций и три эталонных магазина"
```

---

### Task 9: Сообщение и файл для Telegram

**Files:**
- Create: `lib/brief/render-telegram.ts`
- Create: `lib/brief/render-markdown.ts`
- Test: `lib/brief/render.test.ts`

- [ ] **Step 1: Написать падающий тест `lib/brief/render.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { buildMap } from './build-map'
import { demoShop, headShop } from './fixtures'
import { briefFilename, renderMarkdown } from './render-markdown'
import { renderTelegramSummary, SUMMARY_MAX } from './render-telegram'
import { emptyAnswers } from './schema'

const now = new Date('2026-09-18T09:05:00Z')

describe('renderTelegramSummary', () => {
  it('демо-магазин: кто, магазин, с чего начать, ступень, категория, метка', () => {
    const text = renderTelegramSummary(demoShop(), buildMap(demoShop()), 'anna')
    expect(text.split('\n')).toEqual([
      '<b>Бриф: Анна · @anna_shop</b>',
      'Wildberries + Ozon · 300–1000 артикулов · 10–100 заказов в день',
      'Начать с: Ответы на отзывы (≈ 5 ч/нед)',
      'Ступень: первый процесс до production',
      '⚠ категория: Одежда и обувь, проверить по правилу 1.6',
      'метка: anna',
    ])
  })

  it('без старта: начать с порядка', () => {
    const text = renderTelegramSummary(headShop(), buildMap(headShop()))
    expect(text).toContain('Начать с порядка: Посчитайте себестоимость каждого товара.')
    expect(text).not.toContain('метка:')
  })

  it('экранирует HTML и укладывается в подпись Telegram', () => {
    const a = {
      ...emptyAnswers(),
      name: 'A<b>&'.repeat(16),
      contact: 'x'.repeat(120),
      marketplaces: ['other' as const],
      marketplacesOther: '&'.repeat(60),
      category: 'other' as const,
      categoryOther: 'я'.repeat(60),
    }
    const text = renderTelegramSummary(a, buildMap(a), 'a'.repeat(32))
    expect(text).toContain('A&lt;b&gt;&amp;')
    expect(text.length).toBeLessThanOrEqual(SUMMARY_MAX)
  })
})

describe('renderMarkdown', () => {
  const answers = demoShop()
  const md = renderMarkdown({ answers, map: buildMap(answers), k: 'anna', startedAtMs: now.getTime() - 17 * 60_000, now })

  it('имя файла по московскому времени', () => {
    expect(briefFilename('anna', now)).toBe('brief-anna-2026-09-18-1205.md')
    expect(briefFilename(undefined, now)).toBe('brief-nolabel-2026-09-18-1205.md')
  })

  it('шапка и разделы на месте', () => {
    expect(md).toContain('- Заполнение: 17 мин')
    expect(md).toContain('- Дата: 18.09.2026 12:05 МСК')
    for (const h of ['## 1. Флаги', '## 2. Магазин и стадия', '## 3. Разобранные процессы', '## 4. Уточнить на созвоне', '## 5. Отмечены, но не разобраны', '## 6. Цели и рамки', '## 7. Ступень', '## 8. Ответы (JSON для /task-verdict)']) {
      expect(md).toContain(h)
    }
    expect(md).toContain('### Ответы на отзывы (начать с этого)')
    expect(md).toContain('- Вердикт: f4; автономия: сбор A5 · анализ A5 · решение A1 · действие A2; флаги: irreversible, rope')
    expect(md).toContain('- Реклама и ставки: 2 ч/нед')
  })

  it('блок JSON разбирается обратно в те же ответы', () => {
    const json = md.match(/```json\n([\s\S]*?)\n```/)?.[1]
    expect(JSON.parse(json ?? 'null')).toEqual(answers)
  })

  it('незаполненный процесс помечен', () => {
    const a = { ...emptyAnswers(), picked: [{ id: 'reviews' as const, hours: '1to3' as const }] }
    expect(renderMarkdown({ answers: a, map: buildMap(a), startedAtMs: now.getTime(), now })).toContain('- Подробности не заполнены')
  })

  it('снимок файла демо-магазина', () => {
    expect(md).toMatchSnapshot()
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run lib/brief/render.test.ts`
Expected: FAIL, не найдены `./render-markdown` и `./render-telegram`.

- [ ] **Step 3: Создать `lib/brief/render-telegram.ts`**

```ts
import { offerCopy } from '@/app/data/brief/copy'
import { optionLabel, shopQuestions } from '@/app/data/brief/questions'
import { escapeHtml } from '@/lib/landing/telegram'
import { categoryText, marketplacesText } from './labels'
import type { BriefMap } from './map-types'
import { formatHours } from './priority'
import type { BriefAnswers } from './schema'

// Короткое сообщение о брифе: подпись к документу в Telegram. Подпись ограничена
// 1024 символами, берём с запасом. Имя и контакт режем до экранирования, чтобы
// первая строка с <b> никогда не оказалась обрезанной посередине тега.

export const SUMMARY_MAX = 1000
const NAME_MAX = 60
const CONTACT_MAX = 80

const q = (id: 'sku' | 'ordersPerDay') => shopQuestions.find((x) => x.id === id)!

// Срез по длине может оставить половину сущности «&am»: битая сущность роняет
// разбор HTML на стороне Telegram.
function trimDanglingEntity(s: string): string {
  const amp = s.lastIndexOf('&')
  if (amp === -1) return s
  return s.slice(amp).includes(';') ? s : s.slice(0, amp)
}

export function renderTelegramSummary(a: BriefAnswers, map: BriefMap, k?: string): string {
  const start = map.items.find((i) => i.processId === map.startId)
  const startLine = start
    ? `Начать с: ${start.label} (≈ ${formatHours(start.returnedHours)} ч/нед)`
    : map.startFallback
      ? `Начать с порядка: ${map.startFallback.text}`
      : 'Начать с: обсудить на созвоне'
  const shop = [
    marketplacesText(a) || 'площадки не указаны',
    a.sku && a.sku !== 'unknown' ? `${optionLabel(q('sku'), a.sku)} артикулов` : undefined,
    a.ordersPerDay && a.ordersPerDay !== 'unknown'
      ? `${optionLabel(q('ordersPerDay'), a.ordersPerDay)} заказов в день`
      : undefined,
  ]
    .filter(Boolean)
    .join(' · ')

  const head = `<b>Бриф: ${escapeHtml((a.name ?? '').slice(0, NAME_MAX))} · ${escapeHtml((a.contact ?? '').slice(0, CONTACT_MAX))}</b>`
  const rest = [
    shop,
    startLine,
    `Ступень: ${offerCopy[map.offer]}`,
    `⚠ категория: ${categoryText(a)}, проверить по правилу 1.6`,
    ...(k ? [`метка: ${k}`] : []),
  ].map(escapeHtml)

  const text = [head, ...rest].join('\n')
  return text.length <= SUMMARY_MAX ? text : trimDanglingEntity(text.slice(0, SUMMARY_MAX))
}
```

- [ ] **Step 4: Создать `lib/brief/render-markdown.ts`**

```ts
import { colorShort, deliverCopy, offerCopy } from '@/app/data/brief/copy'
import { deepQuestions, goalsQuestions, nowQuestions, optionLabel, shopQuestions, type QuestionDef } from '@/app/data/brief/questions'
import { casePath } from '@/app/data/cases'
import { answerText } from './labels'
import type { BriefMap, MapItem } from './map-types'
import { formatHours } from './priority'
import type { BriefAnswers } from './schema'

// Полный файл брифа для нас (спека, 9.3): флаги, ответы, вердикты по шагам, что уточнить,
// ступень и исходные ответы JSON-блоком для /task-verdict.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'

function moscow(d: Date) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '00'
  return { y: get('year'), m: get('month'), d: get('day'), hh: get('hour'), mm: get('minute') }
}

export function briefFilename(k: string | undefined, now: Date): string {
  const t = moscow(now)
  return `brief-${k ?? 'nolabel'}-${t.y}-${t.m}-${t.d}-${t.hh}${t.mm}.md`
}

const bullets = (xs: readonly string[]) => (xs.length > 0 ? xs.map((x) => `- ${x}`) : ['- нет'])

function general(qs: readonly QuestionDef[], a: BriefAnswers): string[] {
  return qs.filter((q) => !q.showIf || q.showIf(a)).map((q) => `- ${q.title} ${answerText(q, a) ?? 'нет ответа'}`)
}

function itemLines(item: MapItem, a: BriefAnswers, isStart: boolean): string[] {
  const out = [`### ${item.label}${isStart ? ` (${deliverCopy.start})` : ''}`, '']
  out.push(
    `- Часы: ${formatHours(item.hours)} ч/нед; вернуть ≈ ${item.returnedHours.toFixed(1)} ч/нед; приоритет ${item.priority.toFixed(2)} (часы × доля вердикта × пригодность)`,
  )
  if (item.status === 'pending' || !item.verdict || !item.input) {
    out.push(`- ${deliverCopy.noDeep}`)
    return out
  }
  const d = a.deepAnswers[item.processId] ?? {}
  for (const q of deepQuestions) {
    if (q.showIf && !q.showIf(d)) continue
    out.push(`- ${q.title} ${optionLabel(q, d[q.id]) ?? 'нет ответа'}`)
  }
  out.push(`- Вход вердикта: \`${JSON.stringify(item.input)}\``)
  const au = item.verdict.autonomy
  out.push(
    `- Вердикт: ${item.verdict.form}` +
      (au ? `; автономия: сбор ${au.collect} · анализ ${au.analyze} · решение ${au.decide} · действие ${au.act}` : '') +
      (item.verdict.flags.length > 0 ? `; флаги: ${item.verdict.flags.join(', ')}` : ''),
  )
  out.push(`- Цепочка: ${item.chain.map((s) => `${s.label} [${colorShort[s.color]}]`).join(' → ')}`)
  for (const b of item.branches) out.push(`- Ветка: ${b.when} → ${b.step.label} [${colorShort[b.step.color]}]`)
  for (const note of [...(item.outcome?.notes ?? []), ...(item.entryNote ? [item.entryNote] : [])]) {
    out.push(`- Пометка: ${note}`)
  }
  for (const p of item.prepare) out.push(`- Подготовить: ${p}`)
  if (item.readyMade) {
    out.push(`- Готовое: ${item.readyMade.text}${item.readyMade.alreadyUsing ? ' (уже пользуются похожим)' : ''}`)
  }
  for (const l of item.library) out.push(`- Библиотека: [${l.label}](${l.href})`)
  for (const c of item.cases) out.push(`- Кейс: ${BASE_URL}${casePath('ru', c)}`)
  return out
}

export type MarkdownInput = { answers: BriefAnswers; map: BriefMap; k?: string; startedAtMs: number; now: Date }

export function renderMarkdown({ answers: a, map, k, startedAtMs, now }: MarkdownInput): string {
  const t = moscow(now)
  const minutes = Math.max(1, Math.round((now.getTime() - startedAtMs) / 60_000))
  return [
    `# Бриф: ${a.name ?? ''}`,
    '',
    `- Контакт: ${a.contact ?? ''}`,
    `- Дата: ${t.d}.${t.m}.${t.y} ${t.hh}:${t.mm} МСК`,
    `- Заполнение: ${minutes} мин`,
    `- Метка: ${k ?? 'нет'}`,
    '',
    '## 1. Флаги',
    '',
    ...bullets(map.flags),
    '',
    '## 2. Магазин и стадия',
    '',
    `- Стадия: ${map.stage.forUs}`,
    ...general(shopQuestions, a),
    ...general(nowQuestions, a),
    '',
    '## 3. Разобранные процессы',
    '',
    ...(map.items.length > 0
      ? map.items.flatMap((i) => [...itemLines(i, a, i.processId === map.startId), ''])
      : ['- нет', '']),
    ...(map.startFallback ? [`Старта нет, начать с порядка: ${map.startFallback.text}`, ''] : []),
    '## 4. Уточнить на созвоне',
    '',
    ...bullets(map.clarify),
    '',
    '## 5. Отмечены, но не разобраны',
    '',
    ...bullets(map.notDeep.map((n) => `${n.label}: ${formatHours(n.hours)} ч/нед`)),
    '',
    '## 6. Цели и рамки',
    '',
    ...general(goalsQuestions, a),
    `- Что ещё важно знать: ${a.notes?.trim() || 'нет'}`,
    '',
    '## 7. Ступень',
    '',
    `- ${offerCopy[map.offer]}`,
    `- Итог по разобранным процессам: ≈ ${formatHours(map.totalReturnedHours)} ч/нед`,
    '',
    '## 8. Ответы (JSON для /task-verdict)',
    '',
    '```json',
    JSON.stringify(a, null, 2),
    '```',
    '',
  ].join('\n')
}
```

- [ ] **Step 5: Запустить тест**

Run: `npx vitest run lib/brief/render.test.ts`
Expected: PASS, 8 tests; создан файл снимка `lib/brief/__snapshots__/render.test.ts.snap`. Открыть снимок и глазами проверить, что файл читается: разделы по порядку, цепочки со стрелками, нет `undefined`.

- [ ] **Step 6: Commit**

```bash
git add lib/brief/render-telegram.ts lib/brief/render-markdown.ts lib/brief/render.test.ts lib/brief/__snapshots__/render.test.ts.snap
git commit -m "feat(brief): сообщение и markdown-файл брифа для Telegram"
```

---

### Task 10: Сохранение в браузере и отправка из браузера

**Files:**
- Create: `lib/brief/storage.ts`
- Create: `lib/brief/client.ts`
- Test: `lib/brief/storage.test.ts`
- Test: `lib/brief/client.test.ts`

- [ ] **Step 1: Написать падающий тест `lib/brief/storage.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { demoShop } from './fixtures'
import { initialState, type BriefState } from './state'
import { clearState, loadState, saveState, STORAGE_KEY } from './storage'

const memory = () => {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}
const broken = {
  getItem: () => {
    throw new Error('denied')
  },
  setItem: () => {
    throw new Error('quota')
  },
  removeItem: () => {
    throw new Error('denied')
  },
}
const state = (): BriefState => ({ ...initialState(1000), step: 'time', answers: demoShop() })

describe('storage', () => {
  it('сохраняет и читает состояние', () => {
    const store = memory()
    expect(saveState(store, state())).toBe(true)
    expect(loadState(store)).toEqual({ status: 'ok', state: state() })
  })

  it('пусто, недоступно, повреждено', () => {
    expect(loadState(memory())).toEqual({ status: 'empty' })
    expect(loadState(undefined)).toEqual({ status: 'unavailable' })
    expect(loadState(broken)).toEqual({ status: 'unavailable' })
    const store = memory()
    store.data.set(STORAGE_KEY, '{"version":0}')
    expect(loadState(store)).toEqual({ status: 'outdated' })
    store.data.set(STORAGE_KEY, 'not json')
    expect(loadState(store)).toEqual({ status: 'outdated' })
  })

  it('перезагрузка посреди отправки превращается в «не отправилось»', () => {
    const store = memory()
    saveState(store, { ...state(), step: 'map', send: 'sending' })
    const r = loadState(store)
    expect(r.status === 'ok' && r.state.send).toBe('failed')
  })

  it('ошибки хранилища не бросаются наружу', () => {
    expect(saveState(broken, state())).toBe(false)
    expect(saveState(undefined, state())).toBe(false)
    expect(() => clearState(broken)).not.toThrow()
    const store = memory()
    saveState(store, state())
    clearState(store)
    expect(loadState(store)).toEqual({ status: 'empty' })
  })
})
```

- [ ] **Step 2: Написать падающий тест `lib/brief/client.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest'
import { postBrief } from './client'
import { demoShop } from './fixtures'

const body = { answers: demoShop(), startedAtMs: 1, website: '' }
const reply = (status: number, json: unknown) => vi.fn(async () => new Response(JSON.stringify(json), { status }))

describe('postBrief', () => {
  it('200 и ok: отправлено; тело уходит JSON-ом на /api/brief', async () => {
    const f = reply(200, { ok: true })
    expect(await postBrief(body, f)).toBe('sent')
    expect(f).toHaveBeenCalledWith('/api/brief', expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }))
  })

  it('429: лимит; 502, 400 и сеть: не отправилось', async () => {
    expect(await postBrief(body, reply(429, { ok: false }))).toBe('rateLimited')
    expect(await postBrief(body, reply(502, { ok: false }))).toBe('failed')
    expect(await postBrief(body, reply(400, { ok: false }))).toBe('failed')
    expect(await postBrief(body, vi.fn(async () => Promise.reject(new Error('offline'))))).toBe('failed')
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падают**

Run: `npx vitest run lib/brief/storage.test.ts lib/brief/client.test.ts`
Expected: FAIL, не найдены `./storage` и `./client`.

- [ ] **Step 4: Создать `lib/brief/storage.ts`**

```ts
import { z } from 'zod'
import { briefAnswersSchema } from './schema'
import { SEND_STATUSES, STEP_KEYS, type BriefState } from './state'

// Черновик брифа в localStorage. Хранилище может быть недоступно (приватный режим,
// запрет сайта, превышение квоты): любая ошибка превращается в статус, а не в падение.
// Версия в ключе: изменилась схема - старый черновик считается устаревшим.

export const STORAGE_KEY = 'webkoth-brief-v1'

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const storedSchema = z.object({
  version: z.literal(1),
  step: z.enum(STEP_KEYS),
  deepIndex: z.number().int().min(0),
  startedAtMs: z.number().int().positive(),
  answers: briefAnswersSchema,
  send: z.enum(SEND_STATUSES),
})

export type LoadResult =
  | { status: 'empty' }
  | { status: 'ok'; state: BriefState }
  | { status: 'outdated' }
  | { status: 'unavailable' }

export function browserStorage(): Store | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadState(store: Store | undefined): LoadResult {
  if (!store) return { status: 'unavailable' }
  let raw: string | null
  try {
    raw = store.getItem(STORAGE_KEY)
  } catch {
    return { status: 'unavailable' }
  }
  if (raw === null) return { status: 'empty' }
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { status: 'outdated' }
  }
  const parsed = storedSchema.safeParse(json)
  if (!parsed.success) return { status: 'outdated' }
  // Перезагрузка посреди отправки: чем она кончилась, неизвестно, даём отправить ещё раз.
  const state = parsed.data
  return { status: 'ok', state: state.send === 'sending' ? { ...state, send: 'failed' } : state }
}

export function saveState(store: Store | undefined, state: BriefState): boolean {
  if (!store) return false
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState(store: Store | undefined): void {
  try {
    store?.removeItem(STORAGE_KEY)
  } catch {
    // хранилище недоступно: чистить нечего
  }
}
```

- [ ] **Step 5: Создать `lib/brief/client.ts`**

```ts
import type { BriefSubmit } from './schema'
import type { SendStatus } from './state'

// Отправка брифа из браузера. Ответ сервера сводится к статусу экрана карты.

export type PostResult = Extract<SendStatus, 'sent' | 'failed' | 'rateLimited'>

export async function postBrief(body: BriefSubmit, fetchImpl: typeof fetch = fetch): Promise<PostResult> {
  try {
    const res = await fetchImpl('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 429) return 'rateLimited'
    const json = (await res.json().catch(() => null)) as { ok?: boolean } | null
    return res.ok && json?.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
```

- [ ] **Step 6: Запустить тесты**

Run: `npx vitest run lib/brief/storage.test.ts lib/brief/client.test.ts`
Expected: PASS, 4 + 2 tests.

- [ ] **Step 7: Commit**

```bash
git add lib/brief/storage.ts lib/brief/storage.test.ts lib/brief/client.ts lib/brief/client.test.ts
git commit -m "feat(brief): черновик в localStorage и отправка брифа из браузера"
```

---

### Task 11: Документ в Telegram и доставка с запасным путём

**Files:**
- Modify: `lib/landing/telegram.ts` (переписать целиком, поведение `sendTelegramMessage` не меняется)
- Create: `lib/brief/deliver.ts`
- Test: `lib/landing/telegram.test.ts`
- Test: `lib/brief/deliver.test.ts`

- [ ] **Step 1: Написать падающий тест `lib/landing/telegram.test.ts`**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendTelegramDocument, sendTelegramMessage } from './telegram'

function setup() {
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'TOKEN')
  vi.stubEnv('TELEGRAM_CHAT_ID', 'CHAT')
  vi.stubEnv('TELEGRAM_API_BASE_URL', 'https://proxy.example/')
  const fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('telegram', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('без настроек не отправляет', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    expect(await sendTelegramDocument('a.md', 'x', 'c')).toEqual({ ok: false, error: 'Telegram env not configured' })
  })

  it('sendMessage по-прежнему шлёт JSON', async () => {
    const fetchMock = setup()
    expect(await sendTelegramMessage('<b>hi</b>')).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://proxy.example/botTOKEN/sendMessage')
    expect(JSON.parse(init.body as string)).toEqual({
      chat_id: 'CHAT',
      text: '<b>hi</b>',
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
  })

  it('sendDocument шлёт multipart с файлом и подписью', async () => {
    const fetchMock = setup()
    expect(await sendTelegramDocument('brief.md', '# Бриф', '<b>Бриф</b>')).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://proxy.example/botTOKEN/sendDocument')
    const form = init.body as FormData
    expect(form.get('chat_id')).toBe('CHAT')
    expect(form.get('caption')).toBe('<b>Бриф</b>')
    expect(form.get('parse_mode')).toBe('HTML')
    const file = form.get('document') as File
    expect(file.name).toBe('brief.md')
    expect(await file.text()).toBe('# Бриф')
  })

  it('ошибка Telegram после повтора возвращается строкой', async () => {
    const fetchMock = setup()
    fetchMock.mockImplementation(async () => new Response('Bad Request', { status: 400 }))
    const r = await sendTelegramDocument('brief.md', 'x', 'c')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('Telegram 400')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **Step 2: Написать падающий тест `lib/brief/deliver.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest'
import { deliverCopy } from '@/app/data/brief/copy'
import { chunkEscaped, deliverBrief, TELEGRAM_CHUNK } from './deliver'

const ok = async () => ({ ok: true })
const fail = async () => ({ ok: false, error: 'boom' })
const payload = { summary: '<b>Бриф</b>', filename: 'brief.md', markdown: '# Бриф\n<тест> & ok' }

describe('deliverBrief', () => {
  it('документ прошёл: больше ничего не шлём', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(ok), sendMessage })).toEqual({ ok: true, via: 'document' })
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('документ не прошёл: сводка с пометкой и текст частями', async () => {
    const sendMessage = vi.fn(ok)
    expect(await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage })).toEqual({ ok: true, via: 'chunks' })
    expect(sendMessage.mock.calls[0][0]).toBe(`<b>Бриф</b>\n\n<i>${deliverCopy.documentFailed}</i>`)
    expect(sendMessage.mock.calls[1][0]).toBe('<pre># Бриф\n&lt;тест&gt; &amp; ok\n</pre>')
  })

  it('не прошло ничего: ошибка с причинами', async () => {
    const r = await deliverBrief(payload, { sendDocument: vi.fn(fail), sendMessage: vi.fn(fail) })
    expect(r.ok).toBe(false)
    expect(r.error).toContain('document: boom')
  })
})

describe('chunkEscaped', () => {
  it('каждая часть не длиннее лимита, склейка равна экранированному тексту', () => {
    const raw = Array.from({ length: 400 }, (_, i) => `строка ${i} & <b>`).join('\n') + '\n' + '&'.repeat(5000)
    const parts = chunkEscaped(raw)
    expect(parts.length).toBeGreaterThan(1)
    for (const p of parts) expect(p.length).toBeLessThanOrEqual(TELEGRAM_CHUNK)
    const joined = parts.join('')
    expect(joined.replace(/\n$/, '')).toBe(raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    for (const p of parts) expect(p).not.toMatch(/&[a-z]{0,3}$/)
  })
})
```

- [ ] **Step 3: Запустить и убедиться, что падают**

Run: `npx vitest run lib/landing/telegram.test.ts lib/brief/deliver.test.ts`
Expected: FAIL: `sendTelegramDocument is not a function` и не найден `./deliver`.

- [ ] **Step 4: Переписать `lib/landing/telegram.ts`**

```ts
const MAX_ATTEMPTS = 2;
const ATTEMPT_DELAY_MS = 600;
const FETCH_TIMEOUT_MS = 6000;
// Документ тяжелее сообщения и идёт через прокси: даём загрузке больше времени.
const DOCUMENT_TIMEOUT_MS = 15000;

type TelegramResult = { ok: boolean; error?: string };
type TelegramEnv = { baseUrl: string; token: string; chatId: string };

function describeError(e: unknown): string {
  if (!(e instanceof Error)) return "unknown";
  const cause = (e as { cause?: { message?: string; code?: string } }).cause;
  const parts = [e.message];
  if (cause?.code) parts.push(`code: ${cause.code}`);
  if (cause?.message && cause.message !== e.message) parts.push(`cause: ${cause.message}`);
  return parts.join(" | ");
}

function telegramEnv(): TelegramEnv | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  // Defaults to Telegram's official host. Override with TELEGRAM_API_BASE_URL
  // when the deployment region can't reach api.telegram.org directly
  // (e.g. RU hosting → Cloudflare Worker proxy).
  const baseUrl = (process.env.TELEGRAM_API_BASE_URL ?? "https://api.telegram.org").replace(/\/$/, "");
  return { baseUrl, token, chatId };
}

async function callTelegram(
  env: TelegramEnv,
  method: string,
  body: BodyInit,
  headers: Record<string, string> | undefined,
  timeoutMs: number,
) {
  const res = await fetch(`${env.baseUrl}/bot${env.token}/${method}`, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram ${res.status}: ${text.slice(0, 200)}`);
  }
}

async function withRetries(env: TelegramEnv, attempt: () => Promise<void>): Promise<TelegramResult> {
  const errors: string[] = [];
  for (let n = 1; n <= MAX_ATTEMPTS; n += 1) {
    try {
      await attempt();
      return { ok: true };
    } catch (e) {
      const desc = describeError(e);
      errors.push(`#${n}: ${desc}`);
      console.warn(`[telegram] attempt ${n} via ${env.baseUrl} failed: ${desc}`);
      if (n < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, ATTEMPT_DELAY_MS));
      }
    }
  }
  return { ok: false, error: errors.join(" ; ") };
}

export async function sendTelegramMessage(text: string): Promise<TelegramResult> {
  const env = telegramEnv();
  if (!env) {
    return { ok: false, error: "Telegram env not configured" };
  }
  const payload = JSON.stringify({
    chat_id: env.chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  return withRetries(env, () =>
    callTelegram(env, "sendMessage", payload, { "Content-Type": "application/json" }, FETCH_TIMEOUT_MS),
  );
}

/** Файл с подписью (HTML, до 1024 символов). Заголовок multipart ставит сам fetch. */
export async function sendTelegramDocument(
  filename: string,
  content: string,
  caption: string,
): Promise<TelegramResult> {
  const env = telegramEnv();
  if (!env) {
    return { ok: false, error: "Telegram env not configured" };
  }
  // FormData собирается на каждую попытку: тело запроса одноразовое.
  return withRetries(env, () => {
    const form = new FormData();
    form.append("chat_id", env.chatId);
    form.append("caption", caption);
    form.append("parse_mode", "HTML");
    form.append("document", new Blob([content], { type: "text/markdown;charset=utf-8" }), filename);
    return callTelegram(env, "sendDocument", form, undefined, DOCUMENT_TIMEOUT_MS);
  });
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

- [ ] **Step 5: Создать `lib/brief/deliver.ts`**

```ts
import { deliverCopy } from '@/app/data/brief/copy'
import { escapeHtml } from '@/lib/landing/telegram'

// Доставка брифа (спека, 9.4): документ с подписью; если прокси не пропустил multipart,
// та же сводка сообщением и файл текстом по частям. Лимит сообщения Telegram 4096,
// берём с запасом под теги <pre>.

export const TELEGRAM_CHUNK = 3900

type SendResult = { ok: boolean; error?: string }
export type BriefTransport = {
  sendDocument: (filename: string, content: string, caption: string) => Promise<SendResult>
  sendMessage: (text: string) => Promise<SendResult>
}
export type BriefDelivery = { ok: boolean; via?: 'document' | 'chunks'; error?: string }

/** Экранированный текст частями не длиннее limit; сущность «&amp;» не рвётся. */
export function chunkEscaped(raw: string, limit = TELEGRAM_CHUNK): string[] {
  const parts: string[] = []
  let current = ''
  for (const line of raw.split('\n')) {
    let piece = escapeHtml(line) + '\n'
    while (piece.length > limit) {
      if (current) {
        parts.push(current)
        current = ''
      }
      let cut = limit
      const amp = piece.lastIndexOf('&', cut - 1)
      if (amp > cut - 5) cut = amp
      parts.push(piece.slice(0, cut))
      piece = piece.slice(cut)
    }
    if (current.length + piece.length > limit) {
      parts.push(current)
      current = ''
    }
    current += piece
  }
  if (current) parts.push(current)
  return parts
}

export async function deliverBrief(
  p: { summary: string; filename: string; markdown: string },
  t: BriefTransport,
): Promise<BriefDelivery> {
  const doc = await t.sendDocument(p.filename, p.markdown, p.summary)
  if (doc.ok) return { ok: true, via: 'document' }

  const head = await t.sendMessage(`${p.summary}\n\n<i>${escapeHtml(deliverCopy.documentFailed)}</i>`)
  if (!head.ok) return { ok: false, error: `document: ${doc.error}; message: ${head.error}` }
  for (const part of chunkEscaped(p.markdown)) {
    const r = await t.sendMessage(`<pre>${part}</pre>`)
    if (!r.ok) return { ok: false, error: `document: ${doc.error}; chunk: ${r.error}` }
  }
  return { ok: true, via: 'chunks' }
}
```

- [ ] **Step 6: Запустить тесты**

Run: `npx vitest run lib/landing/telegram.test.ts lib/brief/deliver.test.ts`
Expected: PASS, 4 + 4 tests (тест повтора ждёт около 600 мс).

- [ ] **Step 7: Прогнать тесты заявок, которые используют telegram.ts**

Run: `npx vitest run lib/evolution`
Expected: PASS, как до изменений.

- [ ] **Step 8: Commit**

```bash
git add lib/landing/telegram.ts lib/landing/telegram.test.ts lib/brief/deliver.ts lib/brief/deliver.test.ts
git commit -m "feat(brief): отправка документа в Telegram и запасной путь текстом частями"
```

---

### Task 12: API-маршрут приёма брифа

**Files:**
- Create: `app/api/brief/route.ts`
- Test: `app/api/brief/route.test.ts`

- [ ] **Step 1: Написать падающий тест `app/api/brief/route.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

type Result = { ok: boolean; error?: string }

vi.mock('@/lib/landing/telegram', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/landing/telegram')>()
  return {
    ...actual,
    sendTelegramDocument: vi.fn(async (): Promise<Result> => ({ ok: true })),
    sendTelegramMessage: vi.fn(async (): Promise<Result> => ({ ok: true })),
  }
})

import { NextRequest } from 'next/server'
import { demoShop } from '@/lib/brief/fixtures'
import { sendTelegramDocument, sendTelegramMessage } from '@/lib/landing/telegram'
import { POST } from './route'

let ip = 0
const request = (raw: string) =>
  new NextRequest('http://localhost/api/brief', {
    method: 'POST',
    body: raw,
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${++ip}` },
  })
const valid = () => ({ answers: demoShop(), k: 'anna', startedAtMs: Date.now() - 10 * 60_000 })
const send = (body: unknown) => POST(request(JSON.stringify(body)))

describe('POST /api/brief', () => {
  beforeEach(() => {
    vi.mocked(sendTelegramDocument).mockReset().mockResolvedValue({ ok: true })
    vi.mocked(sendTelegramMessage).mockReset().mockResolvedValue({ ok: true })
  })

  it('принимает бриф, сам строит карту и шлёт документ', async () => {
    const res = await send(valid())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const [filename, content, caption] = vi.mocked(sendTelegramDocument).mock.calls[0]
    expect(filename).toMatch(/^brief-anna-\d{4}-\d{2}-\d{2}-\d{4}\.md$/)
    expect(content).toContain('### Ответы на отзывы (начать с этого)')
    expect(caption).toContain('Начать с: Ответы на отзывы')
  })

  it('ловушка для ботов и слишком быстрое заполнение: тихий 200 без отправки', async () => {
    expect((await send({ ...valid(), website: 'http://spam' })).status).toBe(200)
    expect((await send({ ...valid(), startedAtMs: Date.now() - 5_000 })).status).toBe(200)
    expect(sendTelegramDocument).not.toHaveBeenCalled()
  })

  it('без согласия и битый JSON: 400', async () => {
    const noConsent = await send({ ...valid(), answers: { ...demoShop(), consent: false } })
    expect(noConsent.status).toBe(400)
    expect((await POST(request('{oops'))).status).toBe(400)
  })

  it('слишком большое тело: 413', async () => {
    expect((await POST(request('x'.repeat(70_000)))).status).toBe(413)
  })

  it('Telegram не принял ни документ, ни сообщение: 502', async () => {
    vi.mocked(sendTelegramDocument).mockResolvedValue({ ok: false, error: 'proxy' })
    vi.mocked(sendTelegramMessage).mockResolvedValue({ ok: false, error: 'down' })
    const res = await send(valid())
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ ok: false, error: 'delivery' })
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run app/api/brief/route.test.ts`
Expected: FAIL, не найден `./route`.

- [ ] **Step 3: Создать `app/api/brief/route.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { buildMap } from '@/lib/brief/build-map'
import { deliverBrief } from '@/lib/brief/deliver'
import { briefFilename, renderMarkdown } from '@/lib/brief/render-markdown'
import { renderTelegramSummary } from '@/lib/brief/render-telegram'
import { briefSubmitSchema } from '@/lib/brief/schema'
import { sendTelegramDocument, sendTelegramMessage } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

// Приём брифа. Порядок защиты как у заявок (app/api/evolution/lead/route.ts):
// лимит → размер → JSON → zod → ловушка → время заполнения. Карту сервер строит сам:
// карте из браузера не доверяем. На сервере ничего не храним.

// Бриф заполняется минутами; быстрее минуты - бот.
const MIN_FILL_MS = 60_000
const MAX_BODY_CHARS = 64_000

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'

  const rl = rateLimitTake(`brief:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) } },
    )
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_CHARS) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = briefSubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const { answers, k, startedAtMs, website } = parsed.data

  // Ловушка и слишком быстрое заполнение: тихая двухсотка, бот не должен понять, что попался.
  if (website) return NextResponse.json({ ok: true }, { status: 200 })
  const now = Date.now()
  if (now - startedAtMs < MIN_FILL_MS) return NextResponse.json({ ok: true }, { status: 200 })

  const map = buildMap(answers)
  const nowDate = new Date(now)
  const result = await deliverBrief(
    {
      summary: renderTelegramSummary(answers, map, k),
      filename: briefFilename(k, nowDate),
      markdown: renderMarkdown({ answers, map, k, startedAtMs, now: nowDate }),
    },
    { sendDocument: sendTelegramDocument, sendMessage: sendTelegramMessage },
  )

  if (!result.ok) {
    console.warn(`[brief] delivery failed: ${result.error}`)
    return NextResponse.json({ ok: false, error: 'delivery' }, { status: 502 })
  }
  if (result.via === 'chunks') console.warn('[brief] document rejected, delivered as text chunks')
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

- [ ] **Step 4: Запустить тест**

Run: `npx vitest run app/api/brief/route.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/brief/route.ts app/api/brief/route.test.ts
git commit -m "feat(brief): маршрут приёма брифа с пересчётом карты и доставкой в Telegram"
```

---

### Task 13: Цели Метрики и цвета карты

**Files:**
- Modify: `lib/analytics/ym.ts:5`
- Modify: `app/globals.css` (блок `@theme inline`, `:root`, `.dark`, конец файла)

- [ ] **Step 1: Расширить `YmGoal` в `lib/analytics/ym.ts`**

Заменить строку

```ts
export type YmGoal = 'quiz_start' | 'quiz_result' | 'lead_sent'
```

на

```ts
export type YmGoal =
  | 'quiz_start'
  | 'quiz_result'
  | 'lead_sent'
  // Бриф: где бросают заполнение (спека брифа, раздел 12)
  | 'brief_start'
  | 'brief_step_1'
  | 'brief_step_2'
  | 'brief_step_3'
  | 'brief_step_4'
  | 'brief_step_5'
  | 'brief_submit'
  | 'brief_pdf'
```

- [ ] **Step 2: Токены цветов в `app/globals.css`**

В блоке `@theme inline` после строки `    --color-background: var(--background);` добавить:

```css
    --color-brief-auto: var(--brief-auto);
    --color-brief-human: var(--brief-human);
    --color-brief-skip: var(--brief-skip);
```

В блоке `:root` заменить последнюю строку `    --sidebar-ring: oklch(0.70 0.045 267);` на:

```css
    --sidebar-ring: oklch(0.70 0.045 267);
    /* Цвета шагов карты брифа: «сам» зелёный, «человек» фиолетово-синий, «не трогать» серый.
       «ИИ готовит» берёт --primary. */
    --brief-auto: oklch(0.55 0.12 160);
    --brief-human: oklch(0.48 0.14 285);
    --brief-skip: oklch(0.65 0.02 267);
```

В блоке `.dark` заменить последнюю строку `    --sidebar-ring: oklch(0.72 0.03 267);` на:

```css
    --sidebar-ring: oklch(0.72 0.03 267);
    --brief-auto: oklch(0.76 0.13 160);
    --brief-human: oklch(0.74 0.1 285);
    --brief-skip: oklch(0.58 0.02 267);
```

В самый конец файла добавить:

```css
/* Печать карты брифа в PDF: без фонового узора. Остальное прячется классами print:hidden. */
@media print {
  body::before {
    display: none;
  }
}
```

- [ ] **Step 3: Проверить тесты Метрики и типы**

Run: `npx vitest run lib/analytics && npm run typecheck`
Expected: PASS, typecheck без ошибок.

- [ ] **Step 4: Commit**

```bash
git add lib/analytics/ym.ts app/globals.css
git commit -m "feat(brief): цели Метрики брифа и цвета шагов карты"
```

---

### Task 14: Базовые компоненты брифа

Компоненты без тестов (в проекте нет тестов компонентов); проверка типами, линтером и глазами в задаче 20.

**Files:**
- Create: `components/brief/colors.ts`
- Create: `components/brief/choice-chips.tsx`
- Create: `components/brief/term-notes.tsx`
- Create: `components/brief/question-block.tsx`
- Create: `components/brief/legend.tsx`
- Create: `components/brief/process-chain.tsx`
- Create: `components/brief/map-item.tsx`

- [ ] **Step 1: Создать `components/brief/colors.ts`**

```ts
import type { StepColor } from '@/lib/brief/map-types'

// Классы цветов шага карты. Токены brief-* заданы в app/globals.css; «ИИ готовит» = primary.

export const STEP_CLS: Record<StepColor, string> = {
  auto: 'border-brief-auto/40 bg-brief-auto/10 text-brief-auto',
  ai: 'border-primary/40 bg-primary/10 text-primary',
  human: 'border-brief-human/40 bg-brief-human/10 text-brief-human',
  skip: 'border-border bg-muted text-muted-foreground',
}

export const DOT_CLS: Record<StepColor, string> = {
  auto: 'bg-brief-auto',
  ai: 'bg-primary',
  human: 'bg-brief-human',
  skip: 'bg-brief-skip',
}

export const COLOR_ORDER: readonly StepColor[] = ['auto', 'ai', 'human', 'skip']
```

- [ ] **Step 2: Создать `components/brief/choice-chips.tsx`**

```tsx
'use client'

import type { Option } from '@/app/data/brief/questions'
import { cn } from '@/lib/utils'

// Варианты ответа кнопками. Один выбор: повторное нажатие снимает. Несколько: exclusive
// («не знаю», «ничем из этого») снимает остальные, max ограничивает число.

type Props = {
  options: readonly Option[]
  value: string | readonly string[] | undefined
  onChange: (value: string | string[] | undefined) => void
  multi?: boolean
  max?: number
  exclusive?: readonly string[]
  invalid?: boolean
}

export function ChoiceChips({ options, value, onChange, multi, max, exclusive, invalid }: Props) {
  const selected: readonly string[] = typeof value === 'string' ? [value] : (value ?? [])

  const toggle = (v: string) => {
    if (!multi) return onChange(value === v ? undefined : v)
    if (selected.includes(v)) return onChange(selected.filter((x) => x !== v))
    if (exclusive?.includes(v)) return onChange([v])
    const rest = selected.filter((x) => !exclusive?.includes(x))
    if (max && rest.length >= max) return
    onChange([...rest, v])
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o.value)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
              on ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card/70 hover:border-primary/60',
              invalid && !on && 'border-destructive/50',
            )}
          >
            {o.label}
            {o.hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Создать `components/brief/term-notes.tsx`**

```tsx
'use client'

import { useId, useState } from 'react'
import { glossary, type TermId } from '@/app/data/brief/glossary'

// Сноски к терминам: раскрываются по нажатию прямо под вопросом. Без подсказок
// по наведению: на телефоне наведения нет.

export function TermNotes({ terms }: { terms: readonly TermId[] }) {
  const [open, setOpen] = useState<TermId | null>(null)
  const id = useId()
  const term = open ? glossary[open] : null

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {terms.map((t) => (
          <button
            key={t}
            type="button"
            aria-expanded={open === t}
            aria-controls={`${id}-note`}
            onClick={() => setOpen(open === t ? null : t)}
            className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 transition hover:text-primary"
          >
            <span aria-hidden className="inline-flex size-4 items-center justify-center rounded-full border border-border text-[10px]">
              ?
            </span>
            {glossary[t].title}
          </button>
        ))}
      </div>
      {term ? (
        <p id={`${id}-note`} className="mt-2 rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed">
          {term.text}
          {term.href ? (
            <>
              {' '}
              <a href={term.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                Подробнее
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Создать `components/brief/question-block.tsx`**

```tsx
'use client'

import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import type { QuestionDef } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

export function QuestionBlock({
  q,
  answers,
  dispatch,
  invalid,
}: {
  q: QuestionDef
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: boolean
}) {
  if (q.showIf && !q.showIf(answers)) return null
  const value = answers[q.id] as unknown as string | readonly string[] | undefined
  const selected = typeof value === 'string' ? [value] : (value ?? [])
  const other = q.other
  const otherValue = other ? ((answers[other.field] as unknown as string | undefined) ?? '') : ''

  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-medium">{q.title}</legend>
      {q.hint ? <p className="mt-1 text-xs text-muted-foreground">{q.hint}</p> : null}
      {q.terms ? <TermNotes terms={q.terms} /> : null}
      <ChoiceChips
        options={q.options}
        value={value}
        multi={q.multi}
        max={q.max}
        exclusive={q.exclusive}
        invalid={invalid}
        onChange={(v) => dispatch({ type: 'setField', field: q.id, value: v })}
      />
      {other && selected.includes(other.trigger) ? (
        <Input
          className="mt-2"
          maxLength={other.max}
          placeholder={other.placeholder}
          value={otherValue}
          onChange={(e) => dispatch({ type: 'setField', field: other.field, value: e.target.value })}
        />
      ) : null}
      {invalid ? <p className="mt-1.5 text-xs text-destructive">{briefCopy.errors.required}</p> : null}
    </fieldset>
  )
}
```

- [ ] **Step 5: Создать `components/brief/legend.tsx`**

```tsx
import { briefCopy, colorCopy } from '@/app/data/brief/copy'
import { cn } from '@/lib/utils'
import { COLOR_ORDER, DOT_CLS } from './colors'
import { TermNotes } from './term-notes'

export function Legend() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{briefCopy.map.legend}</p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {COLOR_ORDER.map((c) => (
          <li key={c} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={cn('size-2.5 rounded-sm', DOT_CLS[c])} />
            {colorCopy[c]}
          </li>
        ))}
      </ul>
      <TermNotes terms={['program', 'aiPrepares', 'agent']} />
    </div>
  )
}
```

- [ ] **Step 6: Создать `components/brief/process-chain.tsx`**

```tsx
import { ArrowRight } from 'lucide-react'
import { colorShort } from '@/app/data/brief/copy'
import type { MapBranch, MapStep } from '@/lib/brief/map-types'
import { cn } from '@/lib/utils'
import { STEP_CLS } from './colors'

// Цепочка шагов процесса в цветах. У каждого шага есть текст: подпись вердикта
// или короткое «кто делает» - цвет не единственный сигнал.

function Step({ step, compact }: { step: MapStep; compact?: boolean }) {
  return (
    <span className={cn('inline-block rounded-lg border px-2 py-1 text-xs leading-snug', STEP_CLS[step.color])}>
      {step.label}
      {compact ? (
        <span className="sr-only">: {step.caption ?? colorShort[step.color]}</span>
      ) : (
        <span className="block text-[11px] opacity-80">{step.caption ?? colorShort[step.color]}</span>
      )}
    </span>
  )
}

export function ProcessChain({
  chain,
  branches,
  compact,
}: {
  chain: readonly MapStep[]
  branches: readonly MapBranch[]
  compact?: boolean
}) {
  return (
    <div>
      <ol className="mt-2 flex flex-wrap items-center gap-1.5">
        {chain.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 ? <ArrowRight aria-hidden className="size-3 text-muted-foreground" /> : null}
            <Step step={s} compact={compact} />
          </li>
        ))}
      </ol>
      {branches.map((b) => (
        <p key={b.when} className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {b.when}:
          <Step step={b.step} compact={compact} />
        </p>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Создать `components/brief/map-item.tsx`**

```tsx
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { briefCopy, readyMadeCopy } from '@/app/data/brief/copy'
import type { CaseSlug } from '@/app/data/cases'
import type { MapItem, ReadyMadeView } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import { cn } from '@/lib/utils'
import { ProcessChain } from './process-chain'

// Пункт карты: процесс, цепочка шагов, пометки, «почему первым», «готовое»,
// «что подготовить» и ссылки. compact - для живого черновика: без пояснений и ссылок.

export type CaseLinks = Partial<Record<CaseSlug, { title: string; href: string }>>

function hoursTag(item: MapItem): string {
  if (item.status === 'pending') return briefCopy.map.pending
  if (item.returnedHours > 0) return `≈ ${formatHours(item.returnedHours)} ч/нед`
  return item.outcome?.caption ?? ''
}

function readyMadeText(r: ReadyMadeView): string {
  const base = r.kind === 'cabinet' ? readyMadeCopy.cabinet(r.text) : readyMadeCopy.service(r.text)
  return r.alreadyUsing ? `${base} ${readyMadeCopy.using}` : base
}

function Lines({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-1 text-sm leading-relaxed">
        {items.map((x) => (
          <li key={x} className="border-l-2 border-primary/50 pl-2.5">
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MapItemView({
  item,
  index,
  highlight,
  compact,
  caseLinks,
}: {
  item: MapItem
  index?: number
  highlight?: boolean
  compact?: boolean
  caseLinks?: CaseLinks
}) {
  const notes = [...(item.outcome?.notes ?? []), ...(item.entryNote ? [item.entryNote] : [])]
  const cases = item.cases.flatMap((slug) => (caseLinks?.[slug] ? [{ slug, ...caseLinks[slug] }] : []))

  return (
    <article
      className={cn(
        'break-inside-avoid rounded-2xl border',
        compact ? 'p-3' : 'p-4 md:p-5',
        highlight ? 'border-primary bg-primary/5' : 'border-border bg-card/70',
      )}
    >
      {highlight && !compact ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{briefCopy.map.startHere}</p>
      ) : null}
      <h3 className={cn('flex flex-wrap items-baseline gap-2 font-semibold', compact ? 'text-sm' : 'mt-1 text-base')}>
        {index !== undefined ? `${index}. ` : null}
        {item.label}
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] font-normal text-muted-foreground">
          {hoursTag(item)}
        </span>
      </h3>
      <ProcessChain chain={item.chain} branches={item.branches} compact={compact} />

      {!compact ? (
        <>
          {notes.map((n) => (
            <p key={n} className="mt-2 text-xs text-muted-foreground">
              {n}
            </p>
          ))}
          {item.why.length > 0 ? <Lines title={briefCopy.map.why} items={item.why} /> : null}
          {item.readyMade ? <p className="mt-3 text-sm">{readyMadeText(item.readyMade)}</p> : null}
          {item.prepare.length > 0 ? <Lines title={briefCopy.map.prepare} items={item.prepare} /> : null}
          {cases.length > 0 || item.library.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs print:hidden">
              {cases.map((c) => (
                <Link key={c.slug} href={c.href} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary">
                  {briefCopy.map.similar}: {c.title}
                  <ArrowUpRight aria-hidden className="size-3" />
                </Link>
              ))}
              {item.library.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary"
                >
                  {briefCopy.map.library}: {l.label}
                  <ArrowUpRight aria-hidden className="size-3" />
                </a>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  )
}
```

- [ ] **Step 8: Проверить типы и линтер**

Run: `npm run typecheck && npx eslint components/brief`
Expected: без ошибок.

- [ ] **Step 9: Commit**

```bash
git add components/brief/colors.ts components/brief/choice-chips.tsx components/brief/term-notes.tsx components/brief/question-block.tsx components/brief/legend.tsx components/brief/process-chain.tsx components/brief/map-item.tsx
git commit -m "feat(brief): базовые компоненты: варианты, сноски, легенда, цепочка шагов, пункт карты"
```

---

### Task 15: Экраны шагов

**Files:**
- Create: `components/brief/step-intro.tsx`
- Create: `components/brief/step-questions.tsx`
- Create: `components/brief/process-picker.tsx`
- Create: `components/brief/step-deep.tsx`
- Create: `components/brief/step-goals.tsx`

- [ ] **Step 1: Создать `components/brief/step-intro.tsx`**

```tsx
import { briefCopy } from '@/app/data/brief/copy'
import { Button } from '@/components/ui/button'
import { Legend } from './legend'

export function StepIntro({
  canResume,
  outdated,
  unavailable,
  onStart,
  onResume,
}: {
  canResume: boolean
  outdated: boolean
  unavailable: boolean
  onStart: () => void
  onResume: () => void
}) {
  const c = briefCopy.intro
  return (
    <section className="py-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{c.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{c.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c.lead}</p>
      <ul className="mt-6 space-y-2">
        {c.points.map((p) => (
          <li key={p} className="border-l-2 border-primary/60 pl-3 text-sm leading-relaxed">
            {p}
          </li>
        ))}
      </ul>
      {outdated ? <p className="mt-4 text-sm text-muted-foreground">{c.outdated}</p> : null}
      {unavailable ? <p className="mt-4 text-sm text-muted-foreground">{c.unavailable}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {canResume ? (
          <>
            <Button size="lg" onClick={onResume}>
              {c.resume}
            </Button>
            <Button size="lg" variant="outline" onClick={onStart}>
              {c.restart}
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onStart}>
            {c.start}
          </Button>
        )}
      </div>
      <div className="mt-10">
        <Legend />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать `components/brief/step-questions.tsx`**

```tsx
import type { Dispatch } from 'react'
import type { QuestionDef } from '@/app/data/brief/questions'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { QuestionBlock } from './question-block'

// Шаги 1 и 2: список вопросов с вариантами.

export function StepQuestions({
  title,
  questions,
  answers,
  dispatch,
  invalid,
}: {
  title: string
  questions: readonly QuestionDef[]
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  return (
    <section className="space-y-7">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {questions.map((q) => (
        <QuestionBlock key={q.id} q={q} answers={answers} dispatch={dispatch} invalid={invalid.includes(q.id)} />
      ))}
    </section>
  )
}
```

- [ ] **Step 3: Создать `components/brief/process-picker.tsx`**

```tsx
'use client'

import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { GROUP_ORDER, processGroups, processesByGroup } from '@/app/data/brief/processes'
import { hoursOptions } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import type { HoursBand } from '@/lib/brief/ids'
import type { BriefAnswers } from '@/lib/brief/schema'
import { MAX_DEEP, type BriefAction } from '@/lib/brief/state'
import { cn } from '@/lib/utils'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

// Шаг 3: отметить процессы, указать часы, при >3 выбрать до трёх для подробного разбора.

export function ProcessPicker({
  answers,
  dispatch,
  invalid,
}: {
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  const hoursOf = new Map(answers.picked.map((p) => [p.id, p.hours]))
  const needChoice = answers.picked.length > MAX_DEEP
  const c = briefCopy.time

  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{briefCopy.stepTitles.time}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{c.lead}</p>
      </div>

      {needChoice ? (
        <p className={cn('rounded-xl border p-3 text-sm', invalid.includes('deepChoice') ? 'border-destructive/60' : 'border-primary/40 bg-primary/5')}>
          {c.deepBanner(answers.picked.length)}
        </p>
      ) : null}

      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{processGroups[group]}</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {processesByGroup(group).map((p) => {
              const hours = hoursOf.get(p.id)
              const on = hours !== undefined
              const chosen = answers.deepChoice.includes(p.id)
              return (
                <div key={p.id} className={cn('min-w-0 rounded-xl border p-3 transition', on ? 'border-primary bg-primary/5' : 'border-border bg-card/70')}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => dispatch({ type: 'toggleProcess', id: p.id })}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.example}</span>
                  </button>
                  {p.terms ? <TermNotes terms={p.terms} /> : null}
                  {on ? (
                    <div className="mt-3">
                      {p.id === 'custom' ? (
                        <>
                          <Input
                            maxLength={80}
                            placeholder={c.customPlaceholder}
                            value={answers.customLabel ?? ''}
                            aria-invalid={invalid.includes('customLabel')}
                            onChange={(e) => dispatch({ type: 'setField', field: 'customLabel', value: e.target.value })}
                          />
                          {invalid.includes('customLabel') ? (
                            <p className="mt-1 text-xs text-destructive">{briefCopy.errors.customLabel}</p>
                          ) : null}
                        </>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">{c.hoursLabel}</p>
                      <ChoiceChips
                        options={hoursOptions}
                        value={hours}
                        onChange={(v) => {
                          if (typeof v === 'string') dispatch({ type: 'setHours', id: p.id, hours: v as HoursBand })
                        }}
                      />
                      {needChoice ? (
                        <label className="mt-3 flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            className="size-4 accent-[var(--primary)]"
                            checked={chosen}
                            disabled={!chosen && answers.deepChoice.length >= MAX_DEEP}
                            onChange={() => dispatch({ type: 'toggleDeepChoice', id: p.id })}
                          />
                          {c.deepToggle}
                        </label>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {invalid.includes('picked') ? <p className="text-sm text-destructive">{briefCopy.errors.picked}</p> : null}
      {invalid.includes('deepChoice') ? <p className="text-sm text-destructive">{briefCopy.errors.deepChoice}</p> : null}
    </section>
  )
}
```

- [ ] **Step 4: Создать `components/brief/step-deep.tsx`**

```tsx
'use client'

import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { deepQuestions } from '@/app/data/brief/questions'
import type { ProcessId } from '@/lib/brief/ids'
import { processLabel } from '@/lib/brief/labels'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

// Шаг 4: один экран на процесс. Подсказки под вопросами - на языке этого процесса.

export function StepDeep({
  id,
  index,
  total,
  answers,
  dispatch,
  invalid,
}: {
  id: ProcessId
  index: number
  total: number
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  const entry = processCatalog[id]
  const d = answers.deepAnswers[id] ?? {}

  return (
    <section className="space-y-7">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {briefCopy.deep.eyebrow(index + 1, total)}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{processLabel(id, answers)}</h2>
      </div>
      {deepQuestions.map((q) => {
        if (q.showIf && !q.showIf(d)) return null
        const bad = invalid.includes(q.id)
        return (
          <fieldset key={q.id} className="min-w-0">
            <legend className="text-sm font-medium">{q.title}</legend>
            {entry.hints[q.id] ? <p className="mt-1 text-xs text-muted-foreground">{entry.hints[q.id]}</p> : null}
            {q.terms ? <TermNotes terms={q.terms} /> : null}
            <ChoiceChips
              options={q.options}
              value={d[q.id]}
              invalid={bad}
              onChange={(v) => dispatch({ type: 'setDeep', id, field: q.id, value: typeof v === 'string' ? v : undefined })}
            />
            {bad ? <p className="mt-1.5 text-xs text-destructive">{briefCopy.errors.required}</p> : null}
          </fieldset>
        )
      })}
    </section>
  )
}
```

- [ ] **Step 5: Создать `components/brief/step-goals.tsx`**

```tsx
'use client'

import Link from 'next/link'
import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { goalsQuestions } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { QuestionBlock } from './question-block'

// Шаг 5: цели, рамки, свободный текст, контакты и согласие. Ловушка для ботов
// спрятана так же, как в форме заявки (components/evolution/lead-form.tsx).

export function StepGoals({
  answers,
  dispatch,
  invalid,
  onHoneypot,
}: {
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
  onHoneypot: (value: string) => void
}) {
  const c = briefCopy.goals
  const e = briefCopy.errors

  return (
    <section className="space-y-7">
      <h2 className="text-2xl font-semibold tracking-tight">{briefCopy.stepTitles.goals}</h2>
      {goalsQuestions.map((q) => (
        <QuestionBlock key={q.id} q={q} answers={answers} dispatch={dispatch} invalid={invalid.includes(q.id)} />
      ))}

      <div>
        <label htmlFor="brief-notes" className="text-sm font-medium">
          {c.notesTitle}
        </label>
        <Textarea
          id="brief-notes"
          className="mt-2"
          rows={4}
          maxLength={1000}
          placeholder={c.notesPlaceholder}
          value={answers.notes ?? ''}
          onChange={(ev) => dispatch({ type: 'setField', field: 'notes', value: ev.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="brief-name" className="text-sm font-medium">
            {c.nameTitle}
          </label>
          <Input
            id="brief-name"
            className="mt-2"
            maxLength={80}
            autoComplete="name"
            aria-invalid={invalid.includes('name')}
            value={answers.name ?? ''}
            onChange={(ev) => dispatch({ type: 'setField', field: 'name', value: ev.target.value })}
          />
          {invalid.includes('name') ? <p className="mt-1 text-xs text-destructive">{e.name}</p> : null}
        </div>
        <div className="min-w-0">
          <label htmlFor="brief-contact" className="text-sm font-medium">
            {c.contactTitle}
          </label>
          <Input
            id="brief-contact"
            className="mt-2"
            maxLength={120}
            aria-invalid={invalid.includes('contact')}
            value={answers.contact ?? ''}
            onChange={(ev) => dispatch({ type: 'setField', field: 'contact', value: ev.target.value })}
          />
          {invalid.includes('contact') ? <p className="mt-1 text-xs text-destructive">{e.contact}</p> : null}
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-[var(--primary)]"
            checked={answers.consent}
            onChange={(ev) => dispatch({ type: 'setConsent', value: ev.target.checked })}
          />
          <span>
            {c.consentBefore}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-primary">
              {c.consentLink}
            </Link>
          </span>
        </label>
        {invalid.includes('consent') ? <p className="mt-1 text-xs text-destructive">{e.consent}</p> : null}
      </div>

      {/* honeypot: скрыт от людей, виден ботам */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        onChange={(ev) => onHoneypot(ev.target.value)}
      />
    </section>
  )
}
```

- [ ] **Step 6: Проверить типы и линтер**

Run: `npm run typecheck && npx eslint components/brief`
Expected: без ошибок.

- [ ] **Step 7: Commit**

```bash
git add components/brief/step-intro.tsx components/brief/step-questions.tsx components/brief/process-picker.tsx components/brief/step-deep.tsx components/brief/step-goals.tsx
git commit -m "feat(brief): экраны шагов брифа"
```

---

### Task 16: Живой черновик и итоговая карта

**Files:**
- Create: `components/brief/live-map.tsx`
- Create: `components/brief/brief-map.tsx`

- [ ] **Step 1: Создать `components/brief/live-map.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { BriefMap } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import { MapItemView } from './map-item'

// Черновик карты рядом с вопросами: справа на широком экране, плашкой внизу на телефоне.

function LiveMapBody({ map }: { map: BriefMap }) {
  const count = map.items.length + map.notDeep.length
  if (count === 0) return <p className="text-sm text-muted-foreground">{briefCopy.live.empty}</p>
  return (
    <div className="space-y-2">
      {map.totalReturnedHours > 0 ? (
        <p className="text-sm">
          ≈ {formatHours(map.totalReturnedHours)} ч · {briefCopy.map.kpiHours}
        </p>
      ) : null}
      {map.items.map((i) => (
        <MapItemView key={i.processId} item={i} compact highlight={i.processId === map.startId} />
      ))}
      {map.notDeep.length > 0 ? (
        <p className="pt-1 text-xs text-muted-foreground">
          {briefCopy.map.notDeep}: {map.notDeep.map((n) => n.label).join(', ')}
        </p>
      ) : null}
    </div>
  )
}

export function LiveMap({ map }: { map: BriefMap }) {
  const [open, setOpen] = useState(false)
  const count = map.items.length + map.notDeep.length

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start print:hidden" aria-label={briefCopy.live.title}>
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{briefCopy.live.title}</p>
          <LiveMapBody map={map} />
        </div>
      </aside>

      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden print:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="w-full rounded-xl border border-border bg-card/95 px-4 py-3 text-left text-sm shadow-lg backdrop-blur">
            {briefCopy.live.bar(count)} ↑
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto p-4">
            <SheetTitle>{briefCopy.live.title}</SheetTitle>
            <LiveMapBody map={map} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Создать `components/brief/brief-map.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { Button } from '@/components/ui/button'
import { ymGoal } from '@/lib/analytics/ym'
import { marketplacesText } from '@/lib/brief/labels'
import type { BriefMap } from '@/lib/brief/map-types'
import { formatHours } from '@/lib/brief/priority'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { SendStatus } from '@/lib/brief/state'
import { contacts } from '@/lib/landing/contacts'
import { Legend } from './legend'
import { MapItemView, type CaseLinks } from './map-item'
import { TermNotes } from './term-notes'

// Итоговая карта: итог, «начните с этого», процессы по приоритету, статус отправки.
// «Скачать PDF» - системная печать браузера: всё лишнее спрятано классами print:hidden.

function Kpi({ value, label, children }: { value: string; label: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function SendLine({ send, onRetry }: { send: SendStatus; onRetry: () => void }) {
  const s = briefCopy.send
  if (send === 'idle') return null
  if (send === 'sending') return <p className="text-sm text-muted-foreground">{s.sending}</p>
  if (send === 'sent') return <p className="rounded-xl border border-brief-auto/40 bg-brief-auto/10 p-3 text-sm">{s.sent}</p>
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/50 p-3 text-sm print:hidden">
      <span>{send === 'rateLimited' ? s.rateLimited : s.failed}</span>
      <Button size="sm" onClick={onRetry}>
        {s.retry}
      </Button>
      <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
        {s.writeTelegram}
      </a>
    </div>
  )
}

export function BriefMapView({
  map,
  answers,
  send,
  onRetry,
  onReset,
  caseLinks,
}: {
  map: BriefMap
  answers: BriefAnswers
  send: SendStatus
  onRetry: () => void
  onReset: () => void
  caseLinks: CaseLinks
}) {
  const m = briefCopy.map
  const start = map.items.find((i) => i.processId === map.startId)
  const rest = map.items.filter((i) => i.processId !== map.startId)
  const fallbackItem = map.startFallback ? map.items.find((i) => i.processId === map.startFallback?.processId) : undefined
  const total = map.totalReturnedHours < 1 ? m.lessThanHour : `≈ ${formatHours(map.totalReturnedHours)} ч`

  return (
    <section className="space-y-5 py-4">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{m.eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{m.title(marketplacesText(answers))}</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Kpi value={total} label={m.kpiHours} />
          <Kpi value={String(map.items.length)} label={m.kpiProcesses} />
          <Kpi value={map.stage.label} label={m.kpiStage}>
            <TermNotes terms={['stage']} />
          </Kpi>
        </div>
        {map.items.length > 0 && map.totalReturnedHours < 1 ? (
          <p className="mt-3 text-sm text-muted-foreground">{m.lessThanHourNote}</p>
        ) : null}
        <div className="mt-5">
          <Legend />
        </div>
      </header>

      <SendLine send={send} onRetry={onRetry} />

      {start ? <MapItemView item={start} index={1} highlight caseLinks={caseLinks} /> : null}
      {!start && map.startFallback ? (
        <div className="rounded-2xl border border-primary bg-primary/5 p-4 md:p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{m.startFallback}</p>
          <p className="mt-2 text-sm">
            {fallbackItem ? `${fallbackItem.label}: ` : ''}
            {map.startFallback.text}
          </p>
        </div>
      ) : null}

      {rest.map((item, i) => (
        <MapItemView key={item.processId} item={item} index={i + (start ? 2 : 1)} caseLinks={caseLinks} />
      ))}

      {map.notDeep.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {m.notDeep}: {map.notDeep.map((n) => `${n.label} (${formatHours(n.hours)} ч/нед)`).join(', ')} · {m.notDeepTail}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2 print:hidden">
        <Button
          size="lg"
          onClick={() => {
            ymGoal('brief_pdf')
            window.print()
          }}
        >
          {m.pdf}
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
          {m.reset}
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Проверить типы и линтер**

Run: `npm run typecheck && npx eslint components/brief`
Expected: без ошибок. Если `SheetTrigger` не принимает `className` в этой версии Base UI, передать кнопку через проп `render`: `<SheetTrigger render={<button type="button" className="..." />}>`.

- [ ] **Step 4: Commit**

```bash
git add components/brief/live-map.tsx components/brief/brief-map.tsx
git commit -m "feat(brief): живой черновик карты и итоговая карта"
```

---

### Task 17: Страница брифа

**Files:**
- Create: `components/brief/brief-page.tsx`
- Create: `app/brief/page.tsx`

- [ ] **Step 1: Создать `components/brief/brief-page.tsx`**

```tsx
'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { nowQuestions, shopQuestions } from '@/app/data/brief/questions'
import { Button } from '@/components/ui/button'
import { ymGoal } from '@/lib/analytics/ym'
import { buildMap } from '@/lib/brief/build-map'
import { postBrief } from '@/lib/brief/client'
import { briefReducer, deepList, initialState, invalidFields, stepNumber, type BriefState, type StepKey } from '@/lib/brief/state'
import { browserStorage, clearState, loadState, saveState } from '@/lib/brief/storage'
import { BriefMapView } from './brief-map'
import { LiveMap } from './live-map'
import type { CaseLinks } from './map-item'
import { ProcessPicker } from './process-picker'
import { StepDeep } from './step-deep'
import { StepGoals } from './step-goals'
import { StepIntro } from './step-intro'
import { StepQuestions } from './step-questions'

// Оболочка брифа: состояние, сохранение в браузере, шаги, отправка. Логика шагов и карты
// живёт в lib/brief и покрыта тестами; здесь только последовательность экранов.

type Boot = 'pending' | 'empty' | 'resume' | 'outdated' | 'unavailable'

const STEP_GOALS = ['brief_step_1', 'brief_step_2', 'brief_step_3', 'brief_step_4'] as const

function Progress({ step, saved }: { step: StepKey; saved: boolean }) {
  const n = stepNumber(step)
  return (
    <div className="mb-8 print:hidden">
      <div className="h-1 rounded-full bg-muted">
        <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${(n / 6) * 100}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{briefCopy.progress(n, briefCopy.stepTitles[step])}</span>
        <span>{saved ? briefCopy.saved : briefCopy.notSaved}</span>
      </div>
    </div>
  )
}

export function BriefPage({ k, caseLinks }: { k?: string; caseLinks: CaseLinks }) {
  const [state, dispatch] = useReducer(briefReducer, 0, initialState)
  const [boot, setBoot] = useState<Boot>('pending')
  const [resume, setResume] = useState<BriefState | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const [saved, setSaved] = useState(true)
  const honeypot = useRef('')

  useEffect(() => {
    const r = loadState(browserStorage())
    if (r.status === 'ok') {
      setResume(r.state)
      setBoot('resume')
      return
    }
    if (r.status === 'outdated') clearState(browserStorage())
    setBoot(r.status)
  }, [])

  useEffect(() => {
    if (state.startedAtMs === 0) return
    setSaved(saveState(browserStorage(), state))
  }, [state])

  const map = useMemo(() => buildMap(state.answers), [state.answers])
  const invalid = invalidFields(state)
  const deep = deepList(state.answers)
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const start = () => {
    clearState(browserStorage())
    dispatch({ type: 'start', now: Date.now() })
    ymGoal('brief_start')
    scrollTop()
  }

  const continueSaved = () => {
    if (resume) dispatch({ type: 'restore', state: resume })
    scrollTop()
  }

  const next = () => {
    if (invalid.length > 0) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    const leavesStep = state.step !== 'deep' || state.deepIndex >= deep.length - 1
    const n = stepNumber(state.step)
    if (leavesStep && n >= 1 && n <= 4) ymGoal(STEP_GOALS[n - 1])
    dispatch({ type: 'next' })
    scrollTop()
  }

  const back = () => {
    setShowErrors(false)
    dispatch({ type: 'back' })
    scrollTop()
  }

  const send = async () => {
    dispatch({ type: 'send', status: 'sending' })
    const result = await postBrief({
      answers: state.answers,
      k,
      startedAtMs: state.startedAtMs,
      website: honeypot.current,
    })
    dispatch({ type: 'send', status: result })
    if (result === 'sent') ymGoal('brief_submit')
  }

  const submit = async () => {
    if (invalid.length > 0) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    ymGoal('brief_step_5')
    dispatch({ type: 'goto', step: 'map' })
    scrollTop()
    await send()
  }

  const reset = () => {
    clearState(browserStorage())
    setResume(null)
    setBoot('empty')
    dispatch({ type: 'reset' })
    scrollTop()
  }

  if (boot === 'pending') return <div className="min-h-[60vh]" aria-busy />

  if (state.step === 'intro') {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <StepIntro
          canResume={boot === 'resume' && resume !== null}
          outdated={boot === 'outdated'}
          unavailable={boot === 'unavailable'}
          onStart={start}
          onResume={continueSaved}
        />
      </div>
    )
  }

  if (state.step === 'map') {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <BriefMapView map={map} answers={state.answers} send={state.send} onRetry={send} onReset={reset} caseLinks={caseLinks} />
      </div>
    )
  }

  const errors = showErrors ? invalid : []
  const deepId = deep[state.deepIndex]
  const body =
    state.step === 'shop' ? (
      <StepQuestions title={briefCopy.stepTitles.shop} questions={shopQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'now' ? (
      <StepQuestions title={briefCopy.stepTitles.now} questions={nowQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'time' ? (
      <ProcessPicker answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'deep' && deepId ? (
      <StepDeep id={deepId} index={state.deepIndex} total={deep.length} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : (
      <StepGoals
        answers={state.answers}
        dispatch={dispatch}
        invalid={errors}
        onHoneypot={(v) => {
          honeypot.current = v
        }}
      />
    )

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 md:px-8 lg:pb-16">
      <Progress step={state.step} saved={saved} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {body}
          <nav className="mt-10 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={back}>
              {briefCopy.nav.back}
            </Button>
            {state.step === 'goals' ? (
              <Button size="lg" onClick={submit}>
                {briefCopy.nav.submit}
              </Button>
            ) : (
              <Button size="lg" onClick={next}>
                {briefCopy.nav.next}
              </Button>
            )}
          </nav>
        </div>
        <LiveMap map={map} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Создать `app/brief/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { briefCopy } from '@/app/data/brief/copy'
import { CASE_SLUGS, casePath, casesCopy } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import { BriefPage } from '@/components/brief/brief-page'
import type { CaseLinks } from '@/components/brief/map-item'
import { Footer } from '@/components/evolution/footer'
import { HtmlLang } from '@/components/evolution/html-lang'
import { LABEL_RE } from '@/lib/brief/ids'

// Бриф селлера: /brief?k=<метка>. Закрыт от поисковиков, ссылок с сайта нет:
// открываем после двух-трёх заполненных брифов (спека, раздел 4).

export const metadata: Metadata = {
  title: briefCopy.meta.title,
  description: briefCopy.meta.description,
  robots: { index: false, follow: false },
}

// Названия и адреса кейсов считаются на сервере: реестр кейсов большой, в клиент он не нужен.
const caseLinks: CaseLinks = Object.fromEntries(
  CASE_SLUGS.map((slug) => [slug, { title: casesCopy.ru[slug].title, href: casePath('ru', slug) }]),
)

export default async function BriefRoute({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k } = await searchParams
  const data = evolutionData.ru

  return (
    <>
      <HtmlLang lang="ru" />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8 print:hidden">
          <Link href="/" className="font-mono text-sm font-semibold transition hover:text-primary">
            {data.brand}
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {briefCopy.meta.headerLabel}
          </span>
        </header>
        <BriefPage k={typeof k === 'string' && LABEL_RE.test(k) ? k : undefined} caseLinks={caseLinks} />
        <div className="print:hidden">
          <Footer data={data} />
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 3: Проверить типы, линтер и сборку**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: без ошибок; в выводе сборки есть маршруты `/brief` и `/api/brief`. Убедиться, что `/brief` не попал в `app/sitemap.ts` и `app/llms.txt` (их не трогали).

- [ ] **Step 4: Commit**

```bash
git add components/brief/brief-page.tsx app/brief/page.tsx
git commit -m "feat(brief): страница /brief с шагами, живой картой и отправкой"
```

---

### Task 18: Политика конфиденциальности

**Files:**
- Modify: `app/data/privacy.ts`

- [ ] **Step 1: Дописать данные брифа в раздел 2**

В `app/data/privacy.ts` найти строку, заканчивающуюся на `без каких-либо данных о вас сверх указанных в форме.',` и добавить сразу после неё новую строку массива:

```ts
        'Через бриф на странице webkoth.com/brief: имя и контакт для связи, а также ответы о магазине: площадки, категория товаров, объём и оборот диапазонами, как устроены учёт и процессы, цели и рамки внедрения, свободный текст. До нажатия кнопки «Показать карту» ответы хранятся только в вашем браузере (localStorage) и никуда не отправляются.',
```

- [ ] **Step 2: Дописать цель в раздел 3**

Найти строку `'Чтобы подготовиться к разговору: понять задачу по тексту заявки и ответам квиза.',` и добавить после неё:

```ts
        'Чтобы по ответам брифа собрать предварительную карту автоматизаций и подготовиться к разговору о ней.',
```

- [ ] **Step 3: Обновить дату редакции**

Заменить `updated: 'Редакция от 3 сентября 2026 года',` на дату коммита в том же формате, например `updated: 'Редакция от 20 сентября 2026 года',`.

- [ ] **Step 4: Проверить**

Run: `npx vitest run && npm run typecheck`
Expected: все тесты проекта PASS (в чистом worktree), typecheck без ошибок.

- [ ] **Step 5: Commit**

```bash
git add app/data/privacy.ts
git commit -m "docs(privacy): данные брифа и цель их обработки"
```

---

### Task 19: Уточнения в спеке и полный прогон

**Files:**
- Modify: `docs/superpowers/specs/2026-09-17-brif-karta-avtomatizaciy-design.md`

- [ ] **Step 1: Внести в спеку уточнения из начала плана**

Добавить в спеку перед разделом «15. Что взято из внешних фреймворков» раздел:

```markdown
## 14а. Уточнения при планировании (2026-09-17)

1. В вопросе `tools` нет МойСклад и 1С: они уже есть в `ledger`; «учётная система» берётся из `ledger`.
2. У процесса есть факт `cabinetApi`: фраза «выпустите ключ доступа» только для процессов через кабинет.
3. Причина `stopData`: `data`, `cost` или `ledger`, у каждой своя фраза «что подготовить».
4. «Начните с этого» выбирается только среди процессов с цветом dynamic-шага `auto` или `ai`.
5. В «что подготовить» сначала блокирующее (образец, данные), потом остальное.
6. Шаги 1 и 2 рисует `step-questions.tsx`; добавлены `question-block`, `legend`, `map-item`, `colors`, `lib/brief/client`, `labels`, `deliver`, `map-types`, `ids`, `app/data/brief/copy.ts`.
7. Статус отправки `rateLimited` отдельно; ответ 400 показывается как «не отправилось».
8. Стадия `unknown`, если на вопрос про ИИ не ответили.
9. Отмеченные процессы хранятся упорядоченным массивом `picked`.
10. У процесса может быть `mapNote` (для «Своё»).
11. Названия и адреса кейсов считаются на сервере и передаются в клиент готовыми.
12. Шапка страницы простая (бренд и «Бриф»), подвал из `components/evolution/footer.tsx`.
```

- [ ] **Step 2: Полный прогон**

Run: `npx vitest run && npm run typecheck && npm run lint && npm run build`
Expected: всё зелёное.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-09-17-brif-karta-avtomatizaciy-design.md
git commit -m "docs(brief): уточнения спеки, принятые при планировании"
```

---

### Task 20: Проверка глазами и выкатка

Выкатка на прод идёт пушем в `main` (`.github/workflows/deploy.yml`). **Пуш и слияние ветки — только после явного подтверждения собственника.**

- [ ] **Step 1: Пройти бриф в dev**

Run: `npm run dev` и открыть `http://localhost:3000/brief?k=test`.

Проверить:
- вводный экран, «Начать»; прогресс «Шаг 1 из 6»;
- «Дальше» без площадки подсвечивает вопрос;
- шаг 3: отметить 4 процесса, появляется «выберите до трёх», чекбоксы блокируются после трёх; «Своё» требует название;
- справа черновик карты: выбранные процессы серые «ждёт подробностей», после подробного шага пункт получает цвет;
- «Не знаю» в вопросе про правило показывает вопрос про проверку;
- перезагрузка страницы: вводный экран предлагает «Продолжить»;
- шаг 5 без согласия не отправляется; с согласием открывается карта. Без переменных Telegram в dev статус «Не отправилось» с кнопкой повтора — это ожидаемо;
- «Скачать PDF»: в предпросмотре печати только карта, без шапки, подвала и кнопок;
- тёмная тема: цвета шагов различимы;
- ширина 375 px (DevTools): нет горизонтальной прокрутки, черновик карты открывается плашкой снизу.

- [ ] **Step 2: Проверить, что прокси Telegram пропускает файл**

На прод-сервере, в окружении с переменными приложения (`TELEGRAM_API_BASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`):

```bash
printf '# проверка брифа\n' > /tmp/brief-check.md
curl -sS -X POST "$TELEGRAM_API_BASE_URL/bot$TELEGRAM_BOT_TOKEN/sendDocument" \
  -F chat_id="$TELEGRAM_CHAT_ID" -F caption="проверка брифа" -F document=@/tmp/brief-check.md
```

Expected: `{"ok":true,...}` и файл в чате. Если прокси отвечает ошибкой, бриф всё равно доставится текстом частями (задача 11); записать это в журнал выкатки.

- [ ] **Step 3: Спросить собственника о слиянии и пуше**

Показать список коммитов ветки (`git log --oneline main..feat/brief`) и результат проверок. После «да»: слить в `main` и запушить; дождаться деплоя; пройти бриф на `https://webkoth.com/brief?k=test` до сообщения в Telegram.

- [ ] **Step 4: Отдать ссылку клиенту**

Ссылка вида `https://webkoth.com/brief?k=<метка клиента>`. Строку адресата занести в `business-os/execution/contacts.jsonl` по правилам `contact-loop`.

