# Spec: /dev-presentation — developer self-presentation landing (test task)

**Date:** 2026-05-24
**Status:** approved (brainstorming → implementation)
**Repo:** webkoth (new route + new components, no impact on existing landing/CV)
**Companion repo touched:** `../hubmarket-ai` (2 new agents + 1 new route file)

---

## 1. Context

Тестовое задание от работодателя: «лендинг-презентация себя как разработчика»
с контактной формой (имя/телефон/email/комментарий), email-доставкой и
AI-интеграцией.

Решение реализуется как новая страница `/dev-presentation` в существующем
репозитории `webkoth` (личный сайт). Стек выбран по требованию ТЗ —
текущий стек проекта: Next.js 16 + React 19 + TypeScript + Tailwind v4.

Контент компилируется из существующих источников:
- `app/data/cv.ts` (ru-секция): about, pitch, metrics, chipGroups,
  portfolio, productionAI, contacts
- `components/landing/copy-i18n.ts`: точечно, для тон-сетки

Существующая лид-форма (`components/landing/lead-form.tsx`) и её API-роут
(`app/api/lead/route.ts`) **не модифицируются** — у них production-нагрузка
и собственная схема под маркетинг-pitch. Тестовая страница получает
изолированную форму и роут.

AI-обвязка использует уже работающий **собственный** микросервис
`hubmarket-ai` (Hono + Vercel AI SDK, cascade Claude → Gemini → Groq, Bearer
auth). В нём заводим 2 новых агента и 2 эндпоинта. Прямые вызовы LLM SDK
из `webkoth` не нужны.

---

## 2. Goals / Non-goals

### Goals

- Удовлетворить **все** обязательные требования ТЗ: frontend → API →
  email-доставка (owner + user copy) → обработка ошибок → состояния
  loading/success/error
- Показать AI-интеграцию как «плюс» в двух формах: **(a)** видимая в UI
  кнопка «Polish ✨», **(b)** серверный TL;DR + intent classification
  через structured output
- Сохранить визуальную консистентность с существующим сайтом
  (`PageBackground`, типографика, eyebrow-паттерн из CV, shadcn-примитивы)
- Сделать код легко читаемым ревьюверу: новая страница в новых файлах,
  никаких флагов/параметризации старого кода

### Non-goals

- i18n EN-версии страницы (RU only — работодатель русскоязычный)
- Юнит/E2E-тесты (нет требования в ТЗ; backlog на следующую итерацию)
- Sentry/PostHog/structured logging (backlog)
- Persistence лидов в БД
- Captcha (honeypot + min-fill-time + IP rate-limit достаточно)
- Streaming AI-ответа
- Verification email юзеру (double opt-in)
- Изменения в `app/[lang]/*`, `components/landing/*`, `components/cv/*`,
  `app/api/lead/route.ts`

---

## 3. Architecture

```
┌─────────────────────────────────┐         ┌──────────────────────────┐
│ webkoth (Next.js)               │         │ hubmarket-ai (Hono)      │
│                                 │         │ existing prod service    │
│ /dev-presentation               │         │                          │
│  └─ LeadFormTest (RHF + Zod)    │         │ agents/registry.ts       │
│        │                        │         │  + lead-polish (text)    │
│        │ click "Polish ✨"       │         │  + lead-summary (json)   │
│        ▼                        │  HTTP   │                          │
│ /api/ai/polish ────────────────►│  Bearer ► /api/leads/polish        │
│        │                        │         │                          │
│        │ submit form            │         │                          │
│        ▼                        │         │                          │
│ /api/dev-presentation/lead      │         │                          │
│   1. Zod + honeypot + rate-lim  │         │                          │
│   2. callSummary (4s timeout) ──┼─Bearer──► /api/leads/summary       │
│   3. Promise.allSettled:        │         │                          │
│      ├─ Resend → owner email    │         │                          │
│      ├─ Resend → user copy      │         │                          │
│      └─ Telegram → owner (bkp)  │         │                          │
│   4. Return success/partial/err │         │                          │
└─────────────────────────────────┘         └──────────────────────────┘
```

### Контракты

`POST /api/dev-presentation/lead`
- Request: `{name, phone, email, message, website?, filledAtMs}`
- Response 200: `{ok: true, aiSummary?: {tldr, intent, urgency, suggested_reply} | null, partial?: true, missing?: string[]}`
- Response 4xx/5xx: `{ok: false, error: 'validation'|'rate_limit'|'delivery'|'internal', issues?: object}`

`POST /api/ai/polish`
- Request: `{text: string}` (30..4000 chars)
- Response 200: `{polished: string, provider: 'claude'|'gemini'|'groq'}`
- Response 4xx/5xx: `{error: 'invalid'|'rate_limit'|'ai_unavailable'|'ai_misconfigured'}`

### Принципы

- Bearer-токен `AI_SERVICE_TOKEN` живёт только в env Next.js, не уходит в браузер.
- Email-доставка (owner + user copy) — главный критерий успеха по ТЗ;
  AI-summary — best-effort. Если AI таймаутит, форма всё равно считается
  успешной, потому что письма ушли.
- Telegram оставляем как дополнительный сигнал владельцу (бесплатно, уже
  работает). В README честно: основной канал — email per ТЗ, Telegram бонус.
- Никаких новых deps в `webkoth` — Resend через `fetch` (REST API, без SDK).

---

## 4. Page content & structure

### Маппинг ТЗ → секции

| ТЗ требует              | Секция страницы | Источник контента                                     |
| ----------------------- | --------------- | ----------------------------------------------------- |
| Стек, опыт, направления | Hero + AboutStack | `cv.ts.ru` (name, role, pitch, metrics, about, chipGroups) |
| Подход + AI в работе    | HowIWork (новая) | Новый текст ~150 слов, на основе `productionAI[]` |
| Кейсы / что делал лично | Cases           | Топ-3 из `cv.ts.ru.portfolio` + 1 из `openSource` (timeweb-mcp-server) |
| Контакты                | Contacts + LeadFormTest | `cv.ts.ru.contacts`, `hireCta`                |

### Скелет страницы (RU only, вне `[lang]`)

```
app/dev-presentation/
  page.tsx       ← server component, метаданные, композиция секций
  layout.tsx     ← минимальный, <html lang="ru">, Toaster (если не глобален)

Секции сверху вниз:
  01 Header     минимальный: «webkoth» + ссылка обратно на /
  02 Hero       имя, роль, 1-предложение pitch, 4 метрики, кнопка «Связаться»
  03 AboutStack about-абзац + 5 chip-групп
  04 HowIWork   3 принципа подхода + 3 AI-привычки
  05 Cases      4 карточки: HubMarket / HubMarket stocksync / timeweb-mcp / AI-OCR Сколково
  06 Contacts   ссылки + LeadFormTest
  07 Footer     копирайт + ссылка на webkoth.com и github
```

### Data-стратегия

Новый `app/data/dev-presentation.ts` — собственный минимальный data-файл,
скомпилированный из нужных кусков `cv.ts`. **Не** импортируем `cvData`
напрямую, потому что:
- хочется видеть весь контент страницы в одном файле
- если `cv.ts` рефакторится, тестовая страница не падает
- ревьюверу проще навигироваться

Структура (≈80 строк):
```ts
export const devPresentationData = {
  hero: { name, role, pitch, metrics: [4] },
  about: { paragraph, chipGroups: [5] },
  howIWork: {
    approach: [3 принципа],  // НОВЫЙ контент
    aiHabits: [3 примера],   // НОВЫЙ контент
  },
  cases: [4 карточки: { title, what, stack, link? }],
  contacts: { email, telegram, github, calendar },
}
```

### Контент «Как я работаю» (новый, draft на этапе имплементации)

Подход (3 пункта):
- От бизнес-задачи к коду: брейншторм → краткий спек → итерация
- Маленькие PR, ранний smoke в реале, прод-first мышление
- Документирую решения (ADR/README) — следующему мне или коллеге

AI в работе (3 пункта):
- Claude Code + Cursor ежедневно: brainstorm, code-gen, ревью своих изменений
- Свой AI-микросервис hubmarket-ai (cascade Claude → Gemini → Groq) —
  любой клиент подключается за 30 минут добавлением агента
- 7 MCP-серверов на npm для агентной автоматизации

Тексты финализируются в имплементации; в спеке зафиксирована рамка
(3 + 3 буллетов, конкретно, без воды).

### Визуальный язык — что переиспользуем

- `<PageBackground />` из `components/landing/page-background.tsx`
- Eyebrow-паттерн `01 · Профиль` из CV — переносим в локальный
  `components/dev-presentation/section-label.tsx` (не импорт, копия)
- Карточки кейсов — визуальный язык из `components/cv/portfolio.tsx`
- Сетка `mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16`
- shadcn `Button` / `Input` / `Textarea`, lucide-react иконки, sonner-тосты

### Что НЕ переиспользуем

- `components/landing/lead-form.tsx` (маркетинг pitch, audience/package/budget)
- `components/cv/header.tsx` (избыточно про CV-снапшот)
- bilingual `copy-i18n.ts` (RU only)

---

## 5. LeadFormTest — детали

### Поля и валидация (Zod)

```ts
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z.string().trim().min(7, 'Похоже на неполный номер').max(32)
    .regex(/^[+\d\s\-()]+$/, 'Только цифры, пробелы, +-()'),
  email: z.email('Невалидный email').max(200),
  message: z.string().trim().min(10, 'Минимум 10 символов').max(4000),
  website: z.string().max(0).optional(),  // honeypot
  filledAtMs: z.number().int().positive(),
})
```

Телефон — мягкая валидация (regex по разрешённым символам, минимум 7).
Жёсткий E.164 избыточен для теста.

### Состояния

```
idle         поля редактируются, обе кнопки активны
polishing    кнопка Polish в loading, message readonly, submit disabled
submitting   submit в loading, все поля disabled, polish disabled
success      success-блок: галка + "Письмо отправлено на {email}",
             опц. AI-summary (collapsible), CTA Telegram/Calendar
error        toast + inline alert с кнопкой "Попробовать снова"
partial      success-UI + желтый info-бейдж (emails ушли, не критика)
rate_limited toast "слишком частые отправки", форма остаётся idle
```

Реализация: один `useState<{kind, error?}>`-объект; редьюсер не нужен.

### Polish-кнопка UX

Внутри textarea-обвязки, под полем message, right-aligned, ghost variant:
```
┌─────────────────────────────────────┐
│ message textarea                    │
└─────────────────────────────────────┘
                  [✨ Сформулировать чище]   ← disabled if message.length < 30
```

Поток:
1. Click → state `polishing`, спиннер
2. POST `/api/ai/polish` body `{text: message}`
3. Success: `form.setValue('message', polished, {shouldValidate: true})`,
   тост `"Готово, провайдер: claude"` (показ провайдера — сигнал, что
   cascade живой)
4. Error: тост `"AI временно недоступен, отправляйте как есть"`, форма
   продолжает работать
5. Polish не блокирует submit — кнопка `Отправить` всегда активна, если
   валидация прошла

### Submit pipeline (юзер)

```
click "Отправить"
  ▼
state: submitting
  ▼
POST /api/dev-presentation/lead
  ├─ 200 ok=true                → state: success
  ├─ 200 ok=true, partial=true  → state: partial
  ├─ 429 rate_limit             → toast, state: idle
  ├─ 400 validation             → form.setError() по полям, state: idle
  ├─ 502 delivery               → state: error, retry-кнопка
  └─ network/timeout            → state: error, retry-кнопка
```

### Success-UI

```
✅ Письмо отправлено на name@example.com
   Проверьте папку «Промоакции» / Спам.

   [опц., если aiSummary != null]
   ┌─ ▼ Как ваш запрос понял AI (опц.) ──┐
   │ TL;DR: …                            │
   │ Intent: project · Urgency: normal   │
   └─────────────────────────────────────┘

   Или напишите сразу:
   [Telegram @abnorsky]  [15-мин звонок]
```

AI-summary показываем collapsed-by-default — деликатно, чтобы юзер не
удивился классификации. Если `aiSummary === null`, блок просто не
рендерится.

### Accessibility / mobile

- `<label htmlFor>` на каждом поле (не aria-labelledby)
- `aria-invalid` + `aria-describedby={errorId}` на ошибках
- Mobile: 1 колонка; md: 2 колонки (`name|phone`, `email` и `message` full-width)
- Submit-кнопка `aria-busy={state === 'submitting'}`
- Тосты sonner с `richColors` + `closeButton`

### Антиспам

- `<input name="website" hidden tabIndex={-1}>` — honeypot
- `filledAtMs = Date.now()` в `useEffect` mount; сервер требует
  `Date.now() - filledAtMs >= 1500`
- Server-side rate-limit per IP: 1 submit / 30s, 5 polish / 60s

---

## 6. API routes — детали

### `POST /api/dev-presentation/lead`

Pipeline:
```
1. read x-forwarded-for → IP
2. rateLimitTake(`devlead:${ip}`, 1 per 30s)  → 429 'rate_limit'
3. parse + zod                                 → 400 'validation' {issues}
4. honeypot website ≠ '' → silent 200 ok
5. Date.now() - filledAtMs < 1500 → silent 200 ok
6. AI summary с таймаутом 4s:
     const summaryPromise = callSummary({name, message}).catch(() => null)
     const aiSummary = await Promise.race([
       summaryPromise,
       new Promise(r => setTimeout(() => r(null), 4000)),
     ])
7. Promise.allSettled:
     - sendOwnerEmail({name, phone, email, message, ip, aiSummary})
     - sendUserCopy({name, email, message})
     - sendTelegramMessage(text)   ← бонус, тихий fail
8. Свертка:
     ownerOk + userOk → 200 {ok:true, aiSummary}
     ownerOk + !userOk → 200 {ok:true, partial:true, missing:['user_copy'], aiSummary}
     !ownerOk → 502 {ok:false, error:'delivery'}
```

**Решающий принцип:** owner-email = пас/фейл по ТЗ. user-copy fail =
partial. Юзер всё равно видит success — владелец получит контакты
и ответит вручную.

Все ответы:
```
200 {ok:true, aiSummary: {tldr, intent, urgency, suggested_reply} | null}
200 {ok:true, partial:true, missing:['user_copy'], aiSummary}
400 {ok:false, error:'validation', issues: <zod flatten>}
429 {ok:false, error:'rate_limit'} + Retry-After
502 {ok:false, error:'delivery'}
500 {ok:false, error:'internal'}
```

### `POST /api/ai/polish` (proxy)

```
1. rateLimitTake(`polish:${ip}`, 5 per 60s)  → 429
2. parse zod {text: 30..4000}                 → 400
3. fetch ${AI_SERVICE_URL}/api/leads/polish
     headers: Authorization: Bearer ${AI_SERVICE_TOKEN}
     body: {input: {text}}
     AbortSignal.timeout(10000)
4. Mapping:
     hubmarket-ai 200 → 200 {polished: result, provider}
     401/403          → 502 {error:'ai_misconfigured'} + console.error
     5xx/timeout/net  → 502 {error:'ai_unavailable'}
     400              → 400 {error:'invalid'}
```

Безопасность: Bearer-токен берётся из `process.env` в server-route, в
браузер не уходит. CORS на `hubmarket-ai` не трогается.

---

## 7. Resend integration

`lib/dev-presentation/resend.ts` — без SDK, через `fetch`:

```ts
async function resendSend(payload: {
  from: string; to: string[]; subject: string; html: string; text: string;
  reply_to?: string;
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{id: string}>
}

export async function sendOwnerEmail(d: LeadData & {aiSummary: AiSummary | null}) {
  return resendSend({
    from: process.env.RESEND_FROM!,
    to: [process.env.OWNER_EMAIL!],
    reply_to: d.email,
    subject: `[dev-presentation] ${d.aiSummary?.intent ?? 'lead'}: ${d.name}`,
    html: buildOwnerHtml(d),
    text: buildOwnerText(d),
  })
}

export async function sendUserCopy(d: {name; email; message}) {
  return resendSend({
    from: process.env.RESEND_FROM!,
    to: [d.email],
    reply_to: process.env.OWNER_EMAIL!,
    subject: 'Ваше сообщение получено — Минас Саркисян',
    html: buildUserHtml(d),
    text: buildUserText(d),
  })
}
```

**FROM-стратегия:** `RESEND_FROM` через env. Прод — верифицированный
домен (`hello@webkoth.com`, DKIM/SPF в Cloudflare). Локалка fallback —
`onboarding@resend.dev`. В README обе инструкции.

### Шаблоны

**Owner HTML** — структурированно, с AI-блоком если есть:
```
[dev-presentation] hire: Иван Иванов
─────────────────────────────────────
🤖 AI: интент HIRE · срочность NORMAL
   TL;DR: Ищет fullstack-разработчика на проект с AI-фичами,
   готов начать через 2 недели.
   Suggested reply: Спасибо за интерес, отвечу до конца дня...

👤 Имя:     Иван Иванов
📞 Телефон: +7 999 123 45 67
✉️ Email:   ivan@example.com
🌐 IP:      203.0.113.42

💬 Сообщение:
   Здравствуйте, ищем разработчика для...
```

**User HTML** — короткий и тёплый:
```
Здравствуйте, Иван!

Спасибо за сообщение. Я получил ваш запрос и отвечу в течение 24ч
(обычно быстрее — в рабочие часы за пару часов).

Срочно? Telegram: https://t.me/abnorsky

Ваше сообщение:
> Здравствуйте, ищем разработчика для...

— Минас Саркисян · webkoth.com
```

Оба письма генерируются как HTML + text (multipart) для лучшей
deliverability.

---

## 8. AI client

`lib/dev-presentation/ai-client.ts`:

```ts
const URL = process.env.AI_SERVICE_URL!
const TOKEN = process.env.AI_SERVICE_TOKEN!

async function aiCall<T>(path: string, body: object, timeoutMs: number): Promise<T> {
  const res = await fetch(`${URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`ai ${res.status}`)
  return res.json() as Promise<T>
}

export async function callPolish(text: string) {
  return aiCall<{success: true; result: string; provider: string}>(
    '/api/leads/polish', { input: { text } }, 10_000,
  )
}

export async function callSummary(d: {name: string; message: string}) {
  return aiCall<{
    success: true
    result: {tldr: string; intent: string; urgency: string; suggested_reply: string}
    provider: string
  }>('/api/leads/summary', { input: d }, 4_000)
}
```

Никаких retry на стороне `webkoth` — каскад уже внутри `hubmarket-ai`.

---

## 9. Hubmarket-ai changes

### Новые промпты

`src/agents/prompts/lead-polish.ts`:
```
Ты — литредактор холодных сообщений в контактной форме разработчика.
Задача: переписать сообщение пользователя яснее и вежливее, СОХРАНИВ:
  — язык оригинала (RU/EN/смешанный — отвечай на нём же)
  — намерение и факты (не добавляй того, чего не было)
  — примерный объём (±30%)
  — структуру (если был абзац — оставь абзацем; если буллеты — буллеты)
Тон: дружелюбный, профессиональный, без канцеляризмов.
Не добавляй приветствие, подпись или мета-комментарии. Верни только текст.
```

`src/agents/prompts/lead-summary.ts` (JSON-агент):
```
Ты — assistant-классификатор входящих лидов разработчика-фрилансера.
На вход — имя и сообщение пользователя.
Верни строго JSON:
{
  "tldr": "1-2 предложения по делу, что нужно человеку",
  "intent": "hire" | "project" | "question" | "spam",
  "urgency": "high" | "normal" | "low",
  "suggested_reply": "1-2 предложения вежливого ответа на русском"
}
Эвристики intent:
  hire — фуллтайм, контракт, ставка/зарплата, "ищем разработчика"
  project — конкретная задача, MVP, "нужно сделать..."
  question — консультация, "посоветуйте", "как лучше"
  spam — нерелевант, маркетинг, шум
Эвристики urgency:
  high — "срочно", "вчера", дедлайн ближе 7 дней
  normal — обычный запрос
  low — "когда будет время", "не горит"
```

### Запись в `src/agents/registry.ts`

```ts
'lead-polish': {
  systemPrompt: leadPolish,
  defaultCascade: ['claude', 'gemini', 'groq'] as ProviderName[],
  defaultTemperature: 0.5,
  defaultMaxTokens: 1024,
  responseFormat: 'text',
},
'lead-summary': {
  systemPrompt: leadSummary,
  defaultCascade: ['claude', 'gemini', 'groq'] as ProviderName[],
  defaultTemperature: 0.3,
  defaultMaxTokens: 512,
  responseFormat: 'json',
},
```

### Новый роут `src/routes/leads.ts`

```ts
import { Hono } from 'hono'
import { getAgent } from '../agents/registry.js'
import { handleAgentRequest } from './agent-handler.js'

const leads = new Hono()

leads.post('/polish', async (c) => {
  const agent = getAgent('lead-polish')!
  return handleAgentRequest(c, agent, (input) => String(input.text ?? ''))
})

leads.post('/summary', async (c) => {
  const agent = getAgent('lead-summary')!
  return handleAgentRequest(c, agent, (input) =>
    `Имя: ${input.name}\nСообщение:\n${input.message}`)
})

export default leads
```

### Mount в `src/index.ts`

`app.route('/api/leads', leads)` + одна строчка в startup `console.log`.

### Deploy

PM2 на `sellerai-dashboard`. После `git pull` → `npm install` (deps не
меняются) → `pm2 reload hubmarket-ai`. Zero downtime.

### Smoke verification (handcoded)

```bash
curl -X POST $AI_SERVICE_URL/api/leads/polish \
  -H "Authorization: Bearer $AI_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"привет, мне надо сделать сайт срочно надо вчера"}}'

curl -X POST $AI_SERVICE_URL/api/leads/summary \
  -H "Authorization: Bearer $AI_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"name":"Иван","message":"Срочно нужен фуллстек, контракт 6 мес"}}'
```

---

## 10. Env contract

Новые переменные (добавить в `.env.example` и `.env.local`):

```env
# Resend (email delivery)
RESEND_API_KEY=
RESEND_FROM="Минас Саркисян <hello@webkoth.com>"
OWNER_EMAIL=webkoth@gmail.com

# AI microservice (hubmarket-ai)
AI_SERVICE_URL=http://localhost:3100
AI_SERVICE_TOKEN=
```

Существующие `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` / `NEXT_PUBLIC_BASE_URL`
не трогаем.

Все 5 переменных читаются только в server-routes (`process.env`). Никаких
`NEXT_PUBLIC_*` — токены не должны попадать в браузер.

---

## 11. README structure

В `README.md` добавляется новый раздел сверху (перед существующим
«webkoth · AI Integration»):

```markdown
# Webkoth — Dev-presentation (test task)

> Лендинг-презентация разработчика для тестового задания.
> **Live:** https://webkoth.com/dev-presentation
> **Source:** этот же репозиторий, ветка main, путь: app/dev-presentation/

## Что это
Минилендинг "о себе как разработчике" + контактная форма с email-доставкой
и двумя AI-фичами через собственный AI-микросервис hubmarket-ai.

## Стек
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4
· shadcn/ui · react-hook-form + Zod · Resend (email) · собственный
AI-микросервис hubmarket-ai (Hono + AI SDK, cascade Claude→Gemini→Groq)

## Как запустить локально
1. `git clone … && cd webkoth && npm install`
2. Скопировать `.env.example` → `.env.local`, заполнить:
   - RESEND_API_KEY, RESEND_FROM, OWNER_EMAIL
   - AI_SERVICE_URL, AI_SERVICE_TOKEN
   - TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (опц.)
3. `npm run dev` → открыть http://localhost:3000/dev-presentation
4. (опц.) для AI: либо поднять hubmarket-ai локально, либо указать прод-URL.
   Если AI недоступен — форма продолжит работать, email-доставка не зависит
   от AI.

## Как реализована форма
- Frontend: RHF + Zod, 4 поля (имя, телефон, email, сообщение)
- Состояния: idle / polishing / submitting / success / partial / error
- Защита: honeypot + min-fill-time + per-IP rate-limit
- API: POST /api/dev-presentation/lead → Promise.allSettled на 3 канала:
    Resend(owner) · Resend(user copy) · Telegram(backup)
- Критерий успеха: owner-email доставлен. user-copy fail → partial.

## Какие AI-инструменты использовались
- Claude Code (Anthropic) — основной агент разработки в IDE
- Cursor — для быстрых правок
- Архитектура: hubmarket-ai (собственный prod-микросервис, Hono + AI SDK)
  с каскадом Claude Sonnet → Gemini → Groq. Для теста добавлены 2 агента:
    - lead-polish: переписывает сообщение пользователя яснее (text)
    - lead-summary: классифицирует intent + urgency + TL;DR (structured JSON)

## Что делалось с помощью ИИ
- Дизайн архитектуры и спека: брейншторм через Claude
- Большая часть кода форм/роутов: Claude Code, точечные правки руками
- Email-шаблоны: сгенерированы Claude по гайдлайнам
- Промпты агентов lead-polish/lead-summary: написаны вручную

## Что пришлось исправлять вручную
(заполнится по факту в финале)

## Что бы добавил при следующей итерации
- Sentry, structured logging
- Юнит-тесты на маппинг ошибок и шаблоны
- Verification email юзеру (double opt-in)
```

---

## 12. File delta

### webkoth — новые файлы (16)

```
app/dev-presentation/layout.tsx
app/dev-presentation/page.tsx
app/api/dev-presentation/lead/route.ts
app/api/ai/polish/route.ts
app/data/dev-presentation.ts
components/dev-presentation/section-label.tsx
components/dev-presentation/hero.tsx
components/dev-presentation/about-stack.tsx
components/dev-presentation/how-i-work.tsx
components/dev-presentation/cases.tsx
components/dev-presentation/contacts.tsx
components/dev-presentation/lead-form-test.tsx
lib/dev-presentation/schemas.ts
lib/dev-presentation/resend.ts
lib/dev-presentation/email-templates.ts
lib/dev-presentation/ai-client.ts
```

### webkoth — изменённые файлы

```
.env.example                  + RESEND_*, AI_SERVICE_*, OWNER_EMAIL
README.md                     новый раздел сверху "Dev-presentation (test task)"
app/layout.tsx                проверить, есть ли глобальный sonner Toaster;
                              если нет — добавить в /dev-presentation/layout.tsx
```

### hubmarket-ai — новые файлы (3)

```
src/agents/prompts/lead-polish.ts
src/agents/prompts/lead-summary.ts
src/routes/leads.ts
```

### hubmarket-ai — изменённые файлы (2)

```
src/agents/registry.ts        +2 записи (lead-polish, lead-summary)
src/index.ts                  +mount /api/leads + console.log
```

---

## 13. Deployment checklist

1. **Resend**: завести API key + (опц.) добавить домен webkoth.com
   с DKIM/SPF записями в Cloudflare → верификация
2. **hubmarket-ai**: на `sellerai-dashboard` —
   `cd /opt/hubmarket-ai && git pull && pm2 reload hubmarket-ai`
3. **webkoth (прод env)**: добавить RESEND/AI/OWNER переменные через
   secrets manager → redeploy через существующий pipeline (`.deploy.yml`)
4. **Smoke E2E**: открыть https://webkoth.com/dev-presentation →
   заполнить форму с тестовым email → проверить оба ящика (owner + user)
   + Telegram + Resend dashboard на delivered

---

## 14. Risks & open questions

| Риск                                                       | Mitigation                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| webkoth.com на Resend не верифицирован                     | Fallback на `onboarding@resend.dev` (sandbox, 100/day, метит как тест). В README инструкция |
| hubmarket-ai на prod уйдёт в down во время deploy          | PM2 reload (zero-downtime). Если упадёт — email всё равно уйдёт, AI-summary будет null      |
| AI-summary > 4s в среднем                                  | Уже учтено: timeout 4s, fire-and-forget, success без summary                                |
| Resend письма в spam (особенно user copy)                  | reply_to правильный, верифицированный домен с DKIM, simple HTML — стандартные practices     |
| Юзер не получит копию из-за typo в своём email             | Acceptable failure mode → mark as partial, владелец получит контакты и пересвяжется         |
| ANTHROPIC/GEMINI/GROQ keys в hubmarket-ai истекли          | Каскад: если первый провайдер падает, идём дальше. Если все 3 — `ai_unavailable`            |

**Закрытые вопросы (зафиксированы):**
- Route: `/dev-presentation` (не `/test-task`, не `/hire`)
- Language: RU only
- AI provider: cascade через hubmarket-ai, Claude priority
- Email: Resend (не Nodemailer SMTP)
- Form: новый минимальный (не реюз существующего lead-form)
- Repo: внутри webkoth (не отдельный)

---

## 15. Implementation order (для writing-plans)

Спек оставляет порядок имплементации открытым — это сформулирует
следующий шаг (writing-plans). Минимальная подсказка:

1. hubmarket-ai: 2 промпта + registry + route + локальный smoke
2. webkoth lib/: schemas → ai-client → resend → email-templates
3. webkoth api/: ai/polish (зависит от ai-client) → dev-presentation/lead
4. webkoth components/: section-label → hero / about-stack / how-i-work /
   cases / contacts → lead-form-test
5. webkoth app/: data/dev-presentation.ts → page.tsx → layout.tsx
6. .env.example + README sections
7. E2E проверка локально
8. Deploy: hubmarket-ai → webkoth → smoke на проде
