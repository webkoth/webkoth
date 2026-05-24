# Dev-Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate `/dev-presentation` page (RU only) in the `webkoth` repo with a minimal contact form (name/phone/email/message), email delivery (owner + user copy via Resend), Telegram backup, and two AI features (Polish button + lead-summary) routed through the existing `hubmarket-ai` microservice.

**Architecture:** Next.js 16 App Router page at `/dev-presentation`, new `LeadFormTest` (RHF + Zod), two new API routes (`/api/dev-presentation/lead` and `/api/ai/polish`), Resend via REST (no SDK), AI via Bearer-authenticated HTTP to `../hubmarket-ai` which already implements cascade Claude → Gemini → Groq. Two new agents (`lead-polish`, `lead-summary`) get added to `hubmarket-ai`.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · react-hook-form + Zod · sonner · lucide-react · Resend REST · existing Hono microservice (Vercel AI SDK).

**Spec:** `docs/superpowers/specs/2026-05-24-dev-presentation-design.md` (read first for full architecture, contracts, decisions).

**Repo layout:**
- This plan modifies TWO repos: `webkoth` (this one) and `../hubmarket-ai` (sibling). Tasks are clearly labelled.
- This repo has no test framework (vitest is not installed). "Smoke verification" means typecheck + lint + manual curl/browser checks. No TDD per spec section 2 non-goals.

**Commit style** (mirror existing commits):
- `feat(dev-presentation): <what>` for webkoth feature work
- `feat(leads): <what>` for hubmarket-ai work
- Always create new commits, never amend (per global rules)

---

## Phase A — `hubmarket-ai` backend (sibling repo)

All paths in this phase are relative to `/Users/minas/projects/hubmarket-ai/`.

### Task A1: Add lead-polish prompt

**Files:**
- Create: `/Users/minas/projects/hubmarket-ai/src/agents/prompts/lead-polish.ts`

- [ ] **Step 1: Create the prompt file**

```ts
export const systemPrompt = `Ты — литредактор холодных сообщений в контактной форме разработчика.

ЗАДАЧА: переписать сообщение пользователя яснее и вежливее, СОХРАНИВ:
  — язык оригинала (RU/EN/смешанный — отвечай на том же)
  — намерение и факты (не добавляй того, чего не было в исходнике)
  — примерный объём (±30%)
  — структуру (если был абзац — оставь абзацем; если буллеты — буллеты)

ТОН: дружелюбный, профессиональный, без канцеляризмов и излишней формальности.

ЗАПРЕЩЕНО:
  — добавлять приветствие, подпись, мета-комментарии
  — добавлять факты, контакты, имена, цифры, которых не было в оригинале
  — менять смысл или интонацию запроса
  — выдумывать срочность, бюджет, дедлайны

Верни ТОЛЬКО текст переписанного сообщения. Без markdown-обёрток, без объяснений.`
```

- [ ] **Step 2: Smoke — file is valid TS**

Run from `hubmarket-ai`:
```bash
npx tsc --noEmit src/agents/prompts/lead-polish.ts
```
Expected: no output (success).

- [ ] **Step 3: Commit**

```bash
cd /Users/minas/projects/hubmarket-ai
git add src/agents/prompts/lead-polish.ts
git commit -m "feat(leads): add lead-polish agent prompt"
```

---

### Task A2: Add lead-summary prompt

**Files:**
- Create: `/Users/minas/projects/hubmarket-ai/src/agents/prompts/lead-summary.ts`

- [ ] **Step 1: Create the prompt file**

```ts
export const systemPrompt = `Ты — assistant-классификатор входящих лидов разработчика-фрилансера.

На вход — имя и сообщение пользователя из контактной формы.

ВЕРНИ СТРОГО JSON следующей формы:
{
  "tldr": "1-2 предложения по делу: что нужно человеку",
  "intent": "hire" | "project" | "question" | "spam",
  "urgency": "high" | "normal" | "low",
  "suggested_reply": "1-2 предложения вежливого ответа на русском"
}

ЭВРИСТИКИ intent:
  hire     — фуллтайм, контракт, ставка/зарплата, "ищем разработчика в команду"
  project  — конкретная задача, MVP, "нужно сделать сайт/бот/интеграцию"
  question — консультация, "посоветуйте", "как лучше", "что выбрать"
  spam     — нерелевант, маркетинг, шум, продают что-то

ЭВРИСТИКИ urgency:
  high   — "срочно", "вчера", "горим", дедлайн ближе 7 дней
  normal — обычный запрос, без явных временных маркеров
  low    — "когда будет время", "не горит", "на будущее"

suggested_reply: вежливый, без обещаний по срокам/цене, общая формулировка типа
"Спасибо за интерес, изучу детали и отвечу в течение суток".

ВАЖНО: только валидный JSON, без markdown, без \`\`\`json обёрток, без преамбулы.`
```

- [ ] **Step 2: Smoke — file is valid TS**

```bash
cd /Users/minas/projects/hubmarket-ai
npx tsc --noEmit src/agents/prompts/lead-summary.ts
```
Expected: no output (success).

- [ ] **Step 3: Commit**

```bash
git add src/agents/prompts/lead-summary.ts
git commit -m "feat(leads): add lead-summary agent prompt"
```

---

### Task A3: Register both agents in registry

**Files:**
- Modify: `/Users/minas/projects/hubmarket-ai/src/agents/registry.ts`

- [ ] **Step 1: Add imports**

At the top of `src/agents/registry.ts`, after the existing imports (around line 17, before `export const agents`), add:

```ts
import { systemPrompt as leadPolish } from './prompts/lead-polish.js'
import { systemPrompt as leadSummary } from './prompts/lead-summary.js'
```

- [ ] **Step 2: Add registry entries**

Inside the `agents: Record<string, AgentConfig>` object, after the last existing entry (`audit-360`), add two new entries:

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

- [ ] **Step 3: Typecheck**

```bash
cd /Users/minas/projects/hubmarket-ai
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/agents/registry.ts
git commit -m "feat(leads): register lead-polish and lead-summary agents"
```

---

### Task A4: Create `/api/leads` route + mount

**Files:**
- Create: `/Users/minas/projects/hubmarket-ai/src/routes/leads.ts`
- Modify: `/Users/minas/projects/hubmarket-ai/src/index.ts`

- [ ] **Step 1: Create the route file**

`src/routes/leads.ts`:
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
  return handleAgentRequest(c, agent, (input) => {
    const name = String(input.name ?? 'неизвестный')
    const message = String(input.message ?? '')
    return `Имя: ${name}\nСообщение:\n${message}`
  })
})

export default leads
```

- [ ] **Step 2: Mount in index.ts**

In `/Users/minas/projects/hubmarket-ai/src/index.ts`:

a) Add import after the existing route imports (around line 11, after `import health from './routes/health.js'`):
```ts
import leads from './routes/leads.js'
```

b) Mount the route — add a line right after `app.route('/api/news', news)` (around line 25):
```ts
app.route('/api/leads', leads)
```

c) Add two log lines in the startup `console.log` block, after the existing `'  POST /api/news/analyze'` entry:
```ts
  console.log('  POST /api/leads/polish')
  console.log('  POST /api/leads/summary')
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/minas/projects/hubmarket-ai
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/leads.ts src/index.ts
git commit -m "feat(leads): mount /api/leads/{polish,summary} routes"
```

---

### Task A5: Local smoke — both endpoints work

**Prerequisites:** `.env` in `hubmarket-ai` already has `AI_SERVICE_TOKEN` + at least one of `ANTHROPIC_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` / `GROQ_API_KEY`.

- [ ] **Step 1: Start dev server in background**

```bash
cd /Users/minas/projects/hubmarket-ai
npm run dev
```
Expected output includes:
```
POST /api/leads/polish
POST /api/leads/summary
AI Service running at http://localhost:3100
```

- [ ] **Step 2: Smoke polish endpoint**

In a new terminal:
```bash
export AI_TOKEN=$(grep AI_SERVICE_TOKEN /Users/minas/projects/hubmarket-ai/.env | cut -d= -f2 | tr -d '"')

curl -sS -X POST http://localhost:3100/api/leads/polish \
  -H "Authorization: Bearer $AI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"привет надо сайт срочно вчера надо чтобы заработало"}}' \
  | jq
```
Expected: `{"success": true, "result": "...polished text in Russian...", "provider": "claude" | "gemini" | "groq", "usage": {...}}`.

- [ ] **Step 3: Smoke summary endpoint**

```bash
curl -sS -X POST http://localhost:3100/api/leads/summary \
  -H "Authorization: Bearer $AI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"name":"Иван","message":"Срочно нужен senior fullstack, контракт на 6 месяцев, AI-фичи, бюджет до 12k usd/мес"}}' \
  | jq
```
Expected: `{"success": true, "result": {"tldr": "...", "intent": "hire", "urgency": "high", "suggested_reply": "..."}, "provider": "...", "usage": {...}}`.

- [ ] **Step 4: Stop dev server**

Ctrl-C the `npm run dev` process.

- [ ] **Step 5: No commit** (smoke only, no files changed)

---

## Phase B — `webkoth` shared library (`lib/dev-presentation/`)

All paths in this phase are relative to `/Users/minas/projects/webkoth/`.

### Task B1: Zod schemas

**Files:**
- Create: `lib/dev-presentation/schemas.ts`

- [ ] **Step 1: Create the schemas file**

```ts
import { z } from 'zod'

// Server-side schema for /api/dev-presentation/lead
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Похоже на неполный номер')
    .max(32)
    .regex(/^[+\d\s\-()]+$/, 'Только цифры, пробелы, +-()'),
  email: z.email('Невалидный email').max(200),
  message: z.string().trim().min(10, 'Минимум 10 символов').max(4000),
  // anti-spam
  website: z.string().max(0).optional(), // honeypot
  filledAtMs: z.number().int().positive(),
})

export type LeadInput = z.infer<typeof leadSchema>

// Server-side schema for /api/ai/polish
export const polishSchema = z.object({
  text: z.string().trim().min(30, 'Минимум 30 символов').max(4000),
})

export type PolishInput = z.infer<typeof polishSchema>

// AI summary structure (what hubmarket-ai returns)
export type AiSummary = {
  tldr: string
  intent: 'hire' | 'project' | 'question' | 'spam'
  urgency: 'high' | 'normal' | 'low'
  suggested_reply: string
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/minas/projects/webkoth
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/dev-presentation/schemas.ts
git commit -m "feat(dev-presentation): add Zod schemas for lead + polish"
```

---

### Task B2: AI client

**Files:**
- Create: `lib/dev-presentation/ai-client.ts`

- [ ] **Step 1: Create the AI client**

```ts
import type { AiSummary } from './schemas'

const URL = process.env.AI_SERVICE_URL
const TOKEN = process.env.AI_SERVICE_TOKEN

async function aiCall<T>(
  path: string,
  body: object,
  timeoutMs: number,
): Promise<T> {
  if (!URL || !TOKEN) {
    throw new Error('AI service env not configured')
  }
  const res = await fetch(`${URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`ai ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

export type PolishResult = {
  success: true
  result: string
  provider: 'claude' | 'gemini' | 'groq'
  usage: { promptTokens: number; completionTokens: number }
}

export async function callPolish(text: string): Promise<PolishResult> {
  return aiCall<PolishResult>(
    '/api/leads/polish',
    { input: { text } },
    10_000,
  )
}

export type SummaryResult = {
  success: true
  result: AiSummary
  provider: 'claude' | 'gemini' | 'groq'
  usage: { promptTokens: number; completionTokens: number }
}

export async function callSummary(d: {
  name: string
  message: string
}): Promise<SummaryResult> {
  return aiCall<SummaryResult>(
    '/api/leads/summary',
    { input: d },
    4_000,
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/dev-presentation/ai-client.ts
git commit -m "feat(dev-presentation): add AI client (callPolish, callSummary)"
```

---

### Task B3: Email templates

**Files:**
- Create: `lib/dev-presentation/email-templates.ts`

- [ ] **Step 1: Create the templates module**

```ts
import type { AiSummary } from './schemas'

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export type OwnerEmailData = {
  name: string
  phone: string
  email: string
  message: string
  ip: string
  aiSummary: AiSummary | null
}

export function buildOwnerSubject(d: OwnerEmailData): string {
  const intent = d.aiSummary?.intent ?? 'lead'
  return `[dev-presentation] ${intent}: ${d.name}`
}

export function buildOwnerText(d: OwnerEmailData): string {
  const lines: string[] = []
  if (d.aiSummary) {
    lines.push(
      `🤖 AI: интент ${d.aiSummary.intent.toUpperCase()} · срочность ${d.aiSummary.urgency.toUpperCase()}`,
      `   TL;DR: ${d.aiSummary.tldr}`,
      `   Suggested reply: ${d.aiSummary.suggested_reply}`,
      '',
    )
  }
  lines.push(
    `👤 Имя:     ${d.name}`,
    `📞 Телефон: ${d.phone}`,
    `✉️ Email:   ${d.email}`,
    `🌐 IP:      ${d.ip}`,
    '',
    `💬 Сообщение:`,
    d.message,
  )
  return lines.join('\n')
}

export function buildOwnerHtml(d: OwnerEmailData): string {
  const aiBlock = d.aiSummary
    ? `<div style="background:#f0f7ff;border-left:3px solid #3b82f6;padding:12px 16px;margin:0 0 16px;border-radius:6px;font-size:14px;line-height:1.5">
        <div style="font-weight:600;margin-bottom:6px">🤖 AI: интент ${escapeHtml(d.aiSummary.intent.toUpperCase())} · срочность ${escapeHtml(d.aiSummary.urgency.toUpperCase())}</div>
        <div><strong>TL;DR:</strong> ${escapeHtml(d.aiSummary.tldr)}</div>
        <div style="margin-top:6px"><strong>Suggested reply:</strong> ${escapeHtml(d.aiSummary.suggested_reply)}</div>
      </div>`
    : ''

  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:18px">[dev-presentation] новый лид</h2>
  ${aiBlock}
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:90px">👤 Имя</td><td style="padding:6px 0"><strong>${escapeHtml(d.name)}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">📞 Телефон</td><td style="padding:6px 0">${escapeHtml(d.phone)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">✉️ Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(d.email)}" style="color:#3b82f6">${escapeHtml(d.email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">🌐 IP</td><td style="padding:6px 0;font-family:monospace;font-size:13px">${escapeHtml(d.ip)}</td></tr>
  </table>
  <div style="margin-top:20px">
    <div style="color:#666;font-size:13px;margin-bottom:8px">💬 Сообщение:</div>
    <div style="background:#f8f8f8;padding:14px 16px;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(d.message)}</div>
  </div>
</body></html>`
}

export type UserEmailData = {
  name: string
  email: string
  message: string
}

export function buildUserSubject(): string {
  return 'Ваше сообщение получено — Минас Саркисян'
}

export function buildUserText(d: UserEmailData): string {
  return [
    `Здравствуйте, ${d.name}!`,
    '',
    'Спасибо за сообщение. Я получил ваш запрос и отвечу в течение 24ч',
    '(обычно быстрее — в рабочие часы за пару часов).',
    '',
    'Срочно? Telegram: https://t.me/abnorsky',
    '',
    'Ваше сообщение:',
    d.message
      .split('\n')
      .map((l) => `> ${l}`)
      .join('\n'),
    '',
    '— Минас Саркисян · webkoth.com',
  ].join('\n')
}

export function buildUserHtml(d: UserEmailData): string {
  return `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;line-height:1.6">
  <p style="margin:0 0 16px">Здравствуйте, <strong>${escapeHtml(d.name)}</strong>!</p>
  <p style="margin:0 0 16px">Спасибо за сообщение. Я получил ваш запрос и отвечу <strong>в течение 24ч</strong> (обычно быстрее — в рабочие часы за пару часов).</p>
  <p style="margin:0 0 24px">Срочно? Telegram: <a href="https://t.me/abnorsky" style="color:#3b82f6">@abnorsky</a></p>
  <div style="border-left:3px solid #e5e5e5;padding:8px 0 8px 16px;color:#666;font-size:14px">
    <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;color:#999">Ваше сообщение</div>
    <div style="white-space:pre-wrap">${escapeHtml(d.message)}</div>
  </div>
  <p style="margin:24px 0 0;color:#999;font-size:13px">— Минас Саркисян · <a href="https://webkoth.com" style="color:#3b82f6">webkoth.com</a></p>
</body></html>`
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add lib/dev-presentation/email-templates.ts
git commit -m "feat(dev-presentation): add email templates (owner + user copy)"
```

---

### Task B4: Resend client

**Files:**
- Create: `lib/dev-presentation/resend.ts`

- [ ] **Step 1: Create the Resend client**

```ts
import {
  buildOwnerHtml,
  buildOwnerSubject,
  buildOwnerText,
  buildUserHtml,
  buildUserSubject,
  buildUserText,
  type OwnerEmailData,
  type UserEmailData,
} from './email-templates'

type ResendPayload = {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
}

async function resendSend(payload: ResendPayload): Promise<{ id: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not configured')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`resend ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json() as Promise<{ id: string }>
}

export async function sendOwnerEmail(d: OwnerEmailData): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM
  const to = process.env.OWNER_EMAIL
  if (!from || !to) throw new Error('RESEND_FROM or OWNER_EMAIL not configured')
  return resendSend({
    from,
    to: [to],
    reply_to: d.email,
    subject: buildOwnerSubject(d),
    html: buildOwnerHtml(d),
    text: buildOwnerText(d),
  })
}

export async function sendUserCopy(d: UserEmailData): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM
  const ownerEmail = process.env.OWNER_EMAIL
  if (!from || !ownerEmail) throw new Error('RESEND_FROM or OWNER_EMAIL not configured')
  return resendSend({
    from,
    to: [d.email],
    reply_to: ownerEmail,
    subject: buildUserSubject(),
    html: buildUserHtml(d),
    text: buildUserText(d),
  })
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add lib/dev-presentation/resend.ts
git commit -m "feat(dev-presentation): add Resend client (owner + user copy)"
```

---

## Phase C — `webkoth` API routes

### Task C1: `/api/ai/polish` proxy route

**Files:**
- Create: `app/api/ai/polish/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { callPolish } from '@/lib/dev-presentation/ai-client'
import { polishSchema } from '@/lib/dev-presentation/schemas'
import { rateLimitTake } from '@/lib/landing/rate-limit'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const rl = rateLimitTake(`polish:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limit' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)),
        },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const parsed = polishSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  try {
    const result = await callPolish(parsed.data.text)
    return NextResponse.json({
      polished: result.result,
      provider: result.provider,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    if (msg.includes('401') || msg.includes('403')) {
      console.error('[ai/polish] misconfigured:', msg)
      return NextResponse.json({ error: 'ai_misconfigured' }, { status: 502 })
    }
    console.warn('[ai/polish] unavailable:', msg)
    return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 })
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/polish/route.ts
git commit -m "feat(dev-presentation): add /api/ai/polish proxy route"
```

---

### Task C2: `/api/dev-presentation/lead` main route

**Files:**
- Create: `app/api/dev-presentation/lead/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { leadSchema, type AiSummary } from '@/lib/dev-presentation/schemas'
import { callSummary } from '@/lib/dev-presentation/ai-client'
import { sendOwnerEmail, sendUserCopy } from '@/lib/dev-presentation/resend'
import { sendTelegramMessage, escapeHtml } from '@/lib/landing/telegram'
import { rateLimitTake } from '@/lib/landing/rate-limit'

const MIN_FILL_MS = 1500
const SUMMARY_TIMEOUT_MS = 4000

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // 1. Rate limit
  const rl = rateLimitTake(`devlead:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)),
        },
      },
    )
  }

  // 2. Parse JSON
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'validation' },
      { status: 400 },
    )
  }

  // 3. Zod
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // 4. Honeypot — silent 200
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true, aiSummary: null }, { status: 200 })
  }

  // 5. Min fill time — silent 200
  if (Date.now() - parsed.data.filledAtMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, aiSummary: null }, { status: 200 })
  }

  const { name, phone, email, message } = parsed.data

  // 6. AI summary — race against 4s timeout
  const summaryPromise = callSummary({ name, message })
    .then((r) => r.result)
    .catch((err) => {
      console.warn('[devlead] summary failed:', err instanceof Error ? err.message : err)
      return null
    })
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), SUMMARY_TIMEOUT_MS),
  )
  const aiSummary: AiSummary | null = await Promise.race([
    summaryPromise,
    timeoutPromise,
  ])

  // 7. Fan out: owner email, user copy, telegram backup
  const telegramText = buildTelegramText({ name, phone, email, message, ip, aiSummary })

  const [ownerRes, userRes, telegramRes] = await Promise.allSettled([
    sendOwnerEmail({ name, phone, email, message, ip, aiSummary }),
    sendUserCopy({ name, email, message }),
    sendTelegramMessage(telegramText),
  ])

  const ownerOk = ownerRes.status === 'fulfilled'
  const userOk = userRes.status === 'fulfilled'

  if (!ownerOk) {
    console.error(
      '[devlead] owner email failed:',
      ownerRes.status === 'rejected' ? ownerRes.reason : '',
    )
    return NextResponse.json(
      { ok: false, error: 'delivery' },
      { status: 502 },
    )
  }

  if (!userOk) {
    console.warn(
      '[devlead] user copy failed:',
      userRes.status === 'rejected' ? userRes.reason : '',
    )
    return NextResponse.json(
      {
        ok: true,
        partial: true,
        missing: ['user_copy'],
        aiSummary,
      },
      { status: 200 },
    )
  }

  if (telegramRes.status === 'rejected' || (telegramRes.status === 'fulfilled' && !telegramRes.value.ok)) {
    // Telegram is backup-only — log but don't fail
    console.warn('[devlead] telegram backup failed (non-fatal)')
  }

  return NextResponse.json({ ok: true, aiSummary }, { status: 200 })
}

function buildTelegramText(d: {
  name: string
  phone: string
  email: string
  message: string
  ip: string
  aiSummary: AiSummary | null
}): string {
  const aiLine = d.aiSummary
    ? `<b>🤖 AI:</b> ${escapeHtml(d.aiSummary.intent)} · ${escapeHtml(d.aiSummary.urgency)}\n<i>${escapeHtml(d.aiSummary.tldr)}</i>\n\n`
    : ''
  return (
    `<b>📨 [dev-presentation] New lead</b>\n\n` +
    aiLine +
    `<b>Имя:</b> ${escapeHtml(d.name)}\n` +
    `<b>Телефон:</b> ${escapeHtml(d.phone)}\n` +
    `<b>Email:</b> ${escapeHtml(d.email)}\n` +
    `<b>IP:</b> ${escapeHtml(d.ip)}\n\n` +
    `<b>Сообщение:</b>\n${escapeHtml(d.message)}`
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add app/api/dev-presentation/lead/route.ts
git commit -m "feat(dev-presentation): add /api/dev-presentation/lead route"
```

---

## Phase D — `webkoth` data + components

### Task D1: Data file

**Files:**
- Create: `app/data/dev-presentation.ts`

- [ ] **Step 1: Create the data file**

```ts
// Self-contained content for /dev-presentation page (RU only).
// Compiled from app/data/cv.ts + new "how I work" copy.
// Intentionally not importing cvData to keep this page decoupled.

export type Metric = { value: number; suffix: string; label: string }
export type ChipGroup = { groupLabel: string; chips: string[] }
export type CaseItem = {
  title: string
  what: string
  stack: string[]
  link?: { label: string; url: string }
  aiTag?: 'AI' | 'AI-adjacent' | null
}

export type DevPresentationData = {
  hero: {
    name: string
    role: string
    pitch: string
    metrics: Metric[]
  }
  about: {
    paragraph: string
    chipGroups: ChipGroup[]
  }
  howIWork: {
    approach: { title: string; body: string }[]
    aiHabits: { title: string; body: string }[]
  }
  cases: CaseItem[]
  contacts: {
    email: string
    telegram: string
    telegramUrl: string
    github: string
    githubUrl: string
    calendarUrl: string
  }
}

export const devPresentationData: DevPresentationData = {
  hero: {
    name: 'Минас Саркисян',
    role: 'Senior Fullstack | AI Engineer',
    pitch:
      '10+ лет fullstack-разработки. 2+ года плотно с LLM в проде. Закрываю задачи всех уровней — от фичи до архитектуры.',
    metrics: [
      { value: 10, suffix: '+', label: 'лет fullstack' },
      { value: 2, suffix: '+', label: 'года production AI' },
      { value: 7, suffix: '', label: 'MCP-серверов на npm' },
      { value: 5, suffix: '+', label: 'продуктов в проде' },
    ],
  },
  about: {
    paragraph:
      '10+ лет fullstack-разработки в продакшене. 2+ года плотно с LLM: каскады (Claude + Gemini + Groq), RAG, AI-агенты, 7 MCP-серверов на npm. Сейчас строю HubMarket — AI-SaaS для селлеров маркетплейсов.',
    chipGroups: [
      {
        groupLabel: 'Backend',
        chips: ['PHP / Laravel', 'Python / FastAPI', 'Node.js / Hono', 'TypeScript'],
      },
      {
        groupLabel: 'AI / LLM',
        chips: [
          'Anthropic Claude',
          'OpenAI',
          'Google Gemini',
          'Groq',
          'MCP (7 серверов)',
          'Multi-provider cascade',
          'RAG / pgvector',
          'tool calling',
        ],
      },
      {
        groupLabel: 'Frontend',
        chips: ['React 19 / Next.js 16', 'Vue 3', 'Tailwind', 'shadcn/ui'],
      },
      {
        groupLabel: 'Data & Infra',
        chips: ['PostgreSQL', 'ClickHouse', 'MongoDB', 'Redis', 'Docker', 'Linux', 'CI/CD'],
      },
      {
        groupLabel: 'Tooling',
        chips: ['Claude Code (ежедневно)', 'Cursor (ежедневно)', 'Sentry', 'pino', 'PostHog'],
      },
    ],
  },
  howIWork: {
    approach: [
      {
        title: 'От бизнес-задачи к коду',
        body: 'Сначала брейншторм и краткий спек, потом итерация. Не пишу код пока не понимаю «зачем».',
      },
      {
        title: 'Маленькие PR, прод-first',
        body: 'Лучше 5 PR по 200 строк чем 1 на 1000. Ранний smoke в проде ловит то, что unit-тесты не ловят.',
      },
      {
        title: 'Документирую решения',
        body: 'ADR / README / inline-комментарии где важно «почему». Следующему мне будет легче.',
      },
    ],
    aiHabits: [
      {
        title: 'Claude Code + Cursor каждый день',
        body: 'Брейншторм, генерация кода, ревью своих изменений. Не «AI пишет за меня», а «AI ускоряет цикл».',
      },
      {
        title: 'Свой AI-микросервис',
        body: 'hubmarket-ai на Hono + AI SDK с каскадом Claude → Gemini → Groq. Любой проект подключается за 30 минут (как эта форма).',
      },
      {
        title: '7 MCP-серверов на npm',
        body: 'Открытый инструмент для агентной автоматизации: timeweb-mcp-server и др. Реальная агентная инфра в production.',
      },
    ],
  },
  cases: [
    {
      title: 'HubMarket — AI-SaaS для селлеров маркетплейсов',
      what:
        'Founder + единственный разработчик. Аналитика и автоматизация для WB / Ozon / Yandex Market. Bronze-Silver data lake, мульти-провайдерный LLM-каскад, Playwright-парсер, Telegram-бот, ЮKassa-подписки, Chrome MV3 расширение. 0 downtime LLM за 8 месяцев.',
      stack: ['Next.js 16', 'Vercel AI SDK', 'Hono', 'Python / FastAPI', 'PostgreSQL', 'pg-boss'],
      aiTag: 'AI',
    },
    {
      title: 'HubMarket stocksync (B-Sprint case)',
      what:
        'Founder-driven спринт: запрос фаундера → архитектура → реализация → передача в прод за 3 дня. Синхронизация остатков по 3 маркетплейсам для клиента HubMarket.',
      stack: ['Next.js', 'Hono', 'Playwright', 'pg-boss', 'PostgreSQL'],
      link: { label: 'Полный writeup', url: 'https://webkoth.com/ru/cases/hubmarket-stocksync' },
      aiTag: null,
    },
    {
      title: 'timeweb-mcp-server (open source)',
      what:
        'Полная поддержка Timeweb Cloud API через MCP-протокол. Серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами из Claude Code / Cursor для автоматизации деплоев.',
      stack: ['Node.js', 'TypeScript', 'MCP SDK'],
      link: { label: 'npm + GitHub', url: 'https://www.npmjs.com/package/timeweb-mcp-server' },
      aiTag: 'AI-adjacent',
    },
    {
      title: 'AI-сервис распознавания документов (EdTech-заказчик)',
      what:
        'PDF проходит через Yandex OCR → Yandex GPT (structured output) → запись в БД с привязкой к образовательным программам. Заменил ручной ввод end-to-end. Async-очереди, admin-panel.',
      stack: ['PHP / Laravel', 'Yandex OCR', 'Yandex GPT', 'PostgreSQL'],
      aiTag: 'AI',
    },
  ],
  contacts: {
    email: 'webkoth@gmail.com',
    telegram: '@abnorsky',
    telegramUrl: 'https://t.me/abnorsky',
    github: 'github.com/webkoth',
    githubUrl: 'https://github.com/webkoth',
    calendarUrl: 'https://calendar.app.google/jY324Q2AHe1apJo79',
  },
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add app/data/dev-presentation.ts
git commit -m "feat(dev-presentation): add data file (RU content)"
```

---

### Task D2: SectionLabel component

**Files:**
- Create: `components/dev-presentation/section-label.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { LucideIcon } from 'lucide-react'

export function SectionLabel({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-primary">
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      <span>{children}</span>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/section-label.tsx
git commit -m "feat(dev-presentation): add SectionLabel component"
```

---

### Task D3: Hero component

**Files:**
- Create: `components/dev-presentation/hero.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Hero({ data }: { data: DevPresentationData['hero'] }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-10 pb-12 md:px-8 md:pt-14 md:pb-16">
      <SectionLabel icon={User}>01 · Профиль</SectionLabel>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        {data.name}
      </h1>
      <p className="mb-2 text-lg font-medium text-primary md:text-xl">
        {data.role}
      </p>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {data.pitch}
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {data.metrics.map((m) => (
          <div key={m.label} className="border-l-2 border-primary/40 pl-3">
            <div className="text-2xl font-bold tabular-nums md:text-3xl">
              {m.value}
              <span className="text-primary">{m.suffix}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground md:text-sm">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <Button asChild size="lg">
        <a href="#contacts">Связаться</a>
      </Button>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/hero.tsx
git commit -m "feat(dev-presentation): add Hero component"
```

---

### Task D4: AboutStack component

**Files:**
- Create: `components/dev-presentation/about-stack.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function AboutStack({
  data,
}: {
  data: DevPresentationData['about']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={Wrench}>02 · О себе и стек</SectionLabel>
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
        {data.paragraph}
      </p>

      <div className="space-y-5">
        {data.chipGroups.map((group) => (
          <div key={group.groupLabel}>
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {group.groupLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.chips.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/about-stack.tsx
git commit -m "feat(dev-presentation): add AboutStack component"
```

---

### Task D5: HowIWork component

**Files:**
- Create: `components/dev-presentation/how-i-work.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Workflow, Sparkles } from 'lucide-react'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <h3 className="mb-2 text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

export function HowIWork({
  data,
}: {
  data: DevPresentationData['howIWork']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={Workflow}>03 · Как я работаю</SectionLabel>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
          Подход к задачам
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.approach.map((b) => (
            <Bullet key={b.title} title={b.title} body={b.body} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
          <Sparkles className="size-5 text-primary" aria-hidden />
          AI в работе
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.aiHabits.map((b) => (
            <Bullet key={b.title} title={b.title} body={b.body} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/how-i-work.tsx
git commit -m "feat(dev-presentation): add HowIWork component"
```

---

### Task D6: Cases component

**Files:**
- Create: `components/dev-presentation/cases.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { FolderOpen, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Cases({
  data,
}: {
  data: DevPresentationData['cases']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={FolderOpen}>04 · Кейсы</SectionLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((c) => (
          <div
            key={c.title}
            className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-foreground">{c.title}</h3>
              {c.aiTag ? (
                <span
                  className={
                    c.aiTag === 'AI'
                      ? 'flex-shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary'
                      : 'flex-shrink-0 rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground'
                  }
                >
                  {c.aiTag}
                </span>
              ) : null}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {c.what}
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {c.stack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {c.link ? (
              <a
                href={c.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {c.link.label}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/cases.tsx
git commit -m "feat(dev-presentation): add Cases component"
```

---

### Task D7: Contacts component

**Files:**
- Create: `components/dev-presentation/contacts.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Send, Mail, CalendarClock, Github } from 'lucide-react'
import { SectionLabel } from './section-label'
import { LeadFormTest } from './lead-form-test'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Contacts({
  data,
}: {
  data: DevPresentationData['contacts']
}) {
  return (
    <section
      id="contacts"
      className="mx-auto max-w-5xl scroll-mt-8 border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Send}>05 · Контакты</SectionLabel>

      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <a
          href={`mailto:${data.email}`}
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Mail className="size-4 text-primary" strokeWidth={1.75} />
          <span>{data.email}</span>
        </a>
        <a
          href={data.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Send className="size-4 text-primary" strokeWidth={1.75} />
          <span>Telegram: {data.telegram}</span>
        </a>
        <a
          href={data.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Github className="size-4 text-primary" strokeWidth={1.75} />
          <span>{data.github}</span>
        </a>
        <a
          href={data.calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <CalendarClock className="size-4 text-primary" strokeWidth={1.75} />
          <span>15-мин звонок (Google Calendar)</span>
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-8">
        <LeadFormTest />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/contacts.tsx
git commit -m "feat(dev-presentation): add Contacts component"
```

---

### Task D8: LeadFormTest component (the big one)

**Files:**
- Create: `components/dev-presentation/lead-form-test.tsx`

- [ ] **Step 1: Create the form component**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle, ChevronDown, CalendarClock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { leadSchema, type LeadInput, type AiSummary } from '@/lib/dev-presentation/schemas'

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'polishing' }
  | { kind: 'submitting' }
  | { kind: 'success'; aiSummary: AiSummary | null }
  | { kind: 'partial'; aiSummary: AiSummary | null; missing: string[] }
  | { kind: 'error' }

export function LeadFormTest() {
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })
  const [summaryOpen, setSummaryOpen] = useState(false)

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      website: '',
      filledAtMs: 0,
    },
  })

  // Set filledAtMs on mount (client-only)
  useEffect(() => {
    form.setValue('filledAtMs', Date.now())
  }, [form])

  const messageValue = form.watch('message') ?? ''
  const polishDisabled =
    state.kind !== 'idle' || messageValue.trim().length < 30

  const onPolish = async () => {
    setState({ kind: 'polishing' })
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageValue }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        const errCode = data?.error ?? 'unknown'
        if (errCode === 'rate_limit') {
          toast.error('Слишком частые запросы', { description: 'Попробуйте через минуту' })
        } else {
          toast.error('AI временно недоступен', { description: 'Отправляйте сообщение как есть' })
        }
        setState({ kind: 'idle' })
        return
      }
      const data = (await res.json()) as { polished: string; provider: string }
      form.setValue('message', data.polished, { shouldValidate: true })
      toast.success('Готово', { description: `Провайдер: ${data.provider}` })
      setState({ kind: 'idle' })
    } catch {
      toast.error('AI временно недоступен', { description: 'Отправляйте сообщение как есть' })
      setState({ kind: 'idle' })
    }
  }

  const onSubmit = async (values: LeadInput) => {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/api/dev-presentation/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => null)

      if (res.status === 429) {
        toast.error('Слишком частые отправки', { description: 'Попробуйте через минуту' })
        setState({ kind: 'idle' })
        return
      }

      if (res.status === 400) {
        const issues = data?.issues?.fieldErrors as Record<string, string[]> | undefined
        if (issues) {
          for (const [field, msgs] of Object.entries(issues)) {
            if (msgs?.[0]) {
              form.setError(field as keyof LeadInput, { message: msgs[0] })
            }
          }
        }
        toast.error('Проверьте поля формы')
        setState({ kind: 'idle' })
        return
      }

      if (!res.ok || !data?.ok) {
        setState({ kind: 'error' })
        toast.error('Не удалось доставить сообщение', {
          description: 'Попробуйте ещё раз или напишите в Telegram',
        })
        return
      }

      // Success or partial
      const aiSummary = (data.aiSummary ?? null) as AiSummary | null
      if (data.partial) {
        setState({ kind: 'partial', aiSummary, missing: data.missing ?? [] })
      } else {
        setState({ kind: 'success', aiSummary })
      }
      toast.success('Сообщение отправлено', {
        description: `На ${values.email} ушла копия`,
      })
    } catch {
      setState({ kind: 'error' })
      toast.error('Не удалось отправить', {
        description: 'Проверьте интернет и попробуйте ещё раз',
      })
    }
  }

  // Success / partial view
  if (state.kind === 'success' || state.kind === 'partial') {
    const email = form.getValues('email')
    const aiSummary = state.aiSummary
    return (
      <div className="py-2 text-center">
        <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">
          Письмо отправлено
        </h3>
        <p className="mb-2 text-muted-foreground">
          На <span className="font-medium text-foreground">{email}</span> ушла копия.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Проверьте папку «Промоакции» / Спам, иногда туда улетает.
        </p>

        {state.kind === 'partial' ? (
          <div className="mx-auto mb-6 max-w-md rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-left text-xs text-amber-700 dark:text-amber-400">
            <strong>Важно:</strong> копию на ваш адрес не доставили
            ({state.missing.join(', ')}). Письмо владельцу ушло — он ответит вручную.
          </div>
        ) : null}

        {aiSummary ? (
          <div className="mx-auto mb-6 max-w-md">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition hover:text-primary"
            >
              <ChevronDown
                className={`size-3.5 transition-transform ${summaryOpen ? 'rotate-0' : '-rotate-90'}`}
              />
              Как ваш запрос понял AI (опц.)
            </button>
            {summaryOpen ? (
              <div className="mt-3 rounded-lg border border-border bg-card p-4 text-left text-sm">
                <p className="mb-2">{aiSummary.tldr}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Intent: <span className="text-primary">{aiSummary.intent}</span>{' '}
                  · Urgency: <span className="text-primary">{aiSummary.urgency}</span>
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="https://t.me/abnorsky" target="_blank" rel="noopener noreferrer">
              <Send className="size-3.5" />
              Telegram @abnorsky
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://calendar.app.google/jY324Q2AHe1apJo79"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarClock className="size-3.5" />
              15-мин звонок
            </a>
          </Button>
        </div>
      </div>
    )
  }

  // Idle / polishing / submitting / error
  const isSubmitting = state.kind === 'submitting'
  const isPolishing = state.kind === 'polishing'
  const fieldsDisabled = isSubmitting

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
          Напишите мне
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Имя, контакт, пара слов о задаче — отвечу в течение 24ч.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* honeypot */}
        <input
          type="text"
          {...form.register('website')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="dp-name" className="mb-1.5 block text-sm">
              Имя
            </label>
            <Input
              id="dp-name"
              {...form.register('name')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.name}
              aria-describedby={form.formState.errors.name ? 'dp-name-err' : undefined}
            />
            {form.formState.errors.name ? (
              <p id="dp-name-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="dp-phone" className="mb-1.5 block text-sm">
              Телефон
            </label>
            <Input
              id="dp-phone"
              type="tel"
              placeholder="+7 999 123 45 67"
              {...form.register('phone')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.phone}
              aria-describedby={form.formState.errors.phone ? 'dp-phone-err' : undefined}
            />
            {form.formState.errors.phone ? (
              <p id="dp-phone-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dp-email" className="mb-1.5 block text-sm">
              Email
            </label>
            <Input
              id="dp-email"
              type="email"
              placeholder="you@example.com"
              {...form.register('email')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? 'dp-email-err' : undefined}
            />
            {form.formState.errors.email ? (
              <p id="dp-email-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dp-message" className="mb-1.5 block text-sm">
              Сообщение
            </label>
            <Textarea
              id="dp-message"
              rows={5}
              placeholder="Кратко опишите задачу: что нужно, в какие сроки, какой бюджет..."
              {...form.register('message')}
              disabled={fieldsDisabled || isPolishing}
              aria-invalid={!!form.formState.errors.message}
              aria-describedby={form.formState.errors.message ? 'dp-message-err' : undefined}
            />
            {form.formState.errors.message ? (
              <p id="dp-message-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.message.message}
              </p>
            ) : null}
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {messageValue.length} / 4000
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onPolish}
                disabled={polishDisabled}
                title={
                  messageValue.trim().length < 30
                    ? 'Минимум 30 символов'
                    : 'AI перепишет яснее и вежливее'
                }
              >
                {isPolishing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                {isPolishing ? 'Полирую…' : 'Сформулировать чище'}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || isPolishing}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Отправляю…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Отправить
            </>
          )}
        </Button>

        {state.kind === 'error' ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Не удалось доставить сообщение</p>
              <p className="mt-1 text-xs">
                Попробуйте ещё раз или напишите напрямую в{' '}
                <a
                  href="https://t.me/abnorsky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Telegram
                </a>
                .
              </p>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/dev-presentation/lead-form-test.tsx
git commit -m "feat(dev-presentation): add LeadFormTest with polish + states"
```

---

## Phase E — `webkoth` page

### Task E1: Layout + page

**Files:**
- Create: `app/dev-presentation/layout.tsx`
- Create: `app/dev-presentation/page.tsx`

- [ ] **Step 1: Create layout**

`app/dev-presentation/layout.tsx`:
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Минас Саркисян — fullstack & AI engineer · webkoth',
  description:
    '10+ лет fullstack, 2+ года плотно с LLM. Свяжитесь — отвечу в течение 24ч.',
  robots: { index: false, follow: false }, // test task page — don't index
}

export default function DevPresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

Note: `<Toaster />` is already mounted globally in `app/layout.tsx` — no need to add it here.

- [ ] **Step 2: Create page**

`app/dev-presentation/page.tsx`:
```tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageBackground } from '@/components/landing/page-background'
import { Hero } from '@/components/dev-presentation/hero'
import { AboutStack } from '@/components/dev-presentation/about-stack'
import { HowIWork } from '@/components/dev-presentation/how-i-work'
import { Cases } from '@/components/dev-presentation/cases'
import { Contacts } from '@/components/dev-presentation/contacts'
import { devPresentationData as data } from '@/app/data/dev-presentation'

export default function DevPresentationPage() {
  return (
    <>
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        {/* Minimal header */}
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              dev-presentation · test task
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              webkoth.com
            </Link>
          </div>
        </header>

        <Hero data={data.hero} />
        <AboutStack data={data.about} />
        <HowIWork data={data.howIWork} />
        <Cases data={data.cases} />
        <Contacts data={data.contacts} />

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {data.hero.name}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="text-foreground/80 transition hover:text-primary">
                webkoth.com
              </Link>
              <a
                href={data.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
```

- [ ] **Step 3: Typecheck + lint + build**

```bash
npm run typecheck && npm run lint && npm run build
```
Expected: clean build, route `/dev-presentation` listed in output.

- [ ] **Step 4: Commit**

```bash
git add app/dev-presentation/layout.tsx app/dev-presentation/page.tsx
git commit -m "feat(dev-presentation): add page layout and composition"
```

---

## Phase F — env + README

### Task F1: Env vars

**Files:**
- Modify: `.env.example`
- Modify: `.env.local` (do not commit this file — already gitignored)

- [ ] **Step 1: Append to `.env.example`**

After the existing `TELEGRAM_CHAT_ID=` line, append:

```env

# ── /dev-presentation (test task) ────────────────────────────────
# Resend (email delivery)
# Create API key at https://resend.com/api-keys
# Verify domain webkoth.com in https://resend.com/domains (DKIM/SPF DNS in Cloudflare)
# or use onboarding@resend.dev as FROM for sandbox testing (100/day, marked as test).
RESEND_API_KEY=
RESEND_FROM="Минас Саркисян <hello@webkoth.com>"
OWNER_EMAIL=webkoth@gmail.com

# AI microservice (hubmarket-ai) — Hono server with cascade Claude→Gemini→Groq
# Local dev: http://localhost:3100  ·  Prod: http://<sellerai-dashboard-ip>:3100
AI_SERVICE_URL=http://localhost:3100
AI_SERVICE_TOKEN=
```

- [ ] **Step 2: Update local `.env.local`**

Add the same five vars to `/Users/minas/projects/webkoth/.env.local` with **real** values:
- `RESEND_API_KEY` from https://resend.com/api-keys
- `RESEND_FROM` — either `"Webkoth Test <onboarding@resend.dev>"` (sandbox) or `"Минас Саркисян <hello@webkoth.com>"` (after domain verification)
- `OWNER_EMAIL=webkoth@gmail.com`
- `AI_SERVICE_URL` and `AI_SERVICE_TOKEN` — from `/Users/minas/projects/hubmarket-ai/.env` (same values used by HubMarket)

- [ ] **Step 3: Commit (only .env.example)**

```bash
git add .env.example
git commit -m "feat(dev-presentation): add env vars for Resend + AI service"
```

---

### Task F2: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Prepend new section to README**

At the very top of `README.md` (before the existing `# webkoth · AI Integration` header), insert this block, then a `---` divider:

```markdown
# Webkoth — Dev-presentation (test task)

> Лендинг-презентация разработчика для тестового задания.
> **Live:** https://webkoth.com/dev-presentation
> **Source:** этот же репозиторий, путь `app/dev-presentation/`

## Что это
Минилендинг "о себе как разработчике" + контактная форма с email-доставкой
(owner + копия пользователю) и двумя AI-фичами через собственный
AI-микросервис hubmarket-ai.

## Стек
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4
· shadcn/ui · react-hook-form + Zod · sonner · Resend (REST, без SDK) ·
собственный AI-микросервис hubmarket-ai (Hono + AI SDK, cascade
Claude → Gemini → Groq, Bearer auth)

## Как запустить локально
1. `git clone … && cd webkoth && npm install`
2. Скопировать `.env.example` → `.env.local`, заполнить:
   - `RESEND_API_KEY`, `RESEND_FROM`, `OWNER_EMAIL` — из https://resend.com
     (для теста подойдёт `onboarding@resend.dev` без верификации домена)
   - `AI_SERVICE_URL`, `AI_SERVICE_TOKEN` — адрес и токен hubmarket-ai
     (локально: `http://localhost:3100`, см. `../hubmarket-ai`)
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (опц., backup-канал владельцу)
3. `npm run dev` → http://localhost:3000/dev-presentation
4. AI-микросервис: если запущен `cd ../hubmarket-ai && npm run dev`,
   обе AI-фичи работают. Если выключен — форма продолжает работать,
   email-доставка не зависит от AI.

## Как реализована форма
- **Frontend:** RHF + Zod, 4 поля (имя, телефон, email, сообщение).
  Состояния: `idle / polishing / submitting / success / partial / error`.
- **Защита от спама:** honeypot-поле + min-fill-time (1.5s) + per-IP
  rate-limit (1 submit / 12 мин через token-bucket).
- **API:** `POST /api/dev-presentation/lead` →
  `Promise.allSettled` на 3 канала: Resend(owner) · Resend(user copy) · Telegram(backup).
- **Критерий успеха:** owner-email доставлен. Если упала только user-copy —
  ответ `{ok:true, partial:true}`, юзер видит warning. Если owner упал —
  502 `delivery`, пользователь видит retry-кнопку.
- **AI-summary** вкладывается в письмо владельцу (intent + urgency +
  TL;DR + suggested_reply). Опционально показывается юзеру в success-UI
  как collapsible-блок «Как ваш запрос понял AI».

## Какие AI-инструменты использовались
- **Claude Code** (Anthropic) — основной агент разработки в IDE
  (дизайн, генерация кода, ревью)
- **Cursor** — точечные правки
- **Архитектура AI-обвязки:** `hubmarket-ai` — собственный production
  микросервис (Hono + Vercel AI SDK), к которому подключён HubMarket и
  теперь /dev-presentation. Каскад **Claude Sonnet → Gemini → Groq**
  с автоматическим fallback при недоступности любого провайдера.
- Для тестового задания добавлены 2 агента:
  - `lead-polish` — переписывает сообщение пользователя яснее (text)
  - `lead-summary` — классифицирует intent + urgency + TL;DR (JSON / structured output)

## Что делалось с помощью ИИ
- Дизайн архитектуры и спека: брейншторм через Claude (8 итераций)
- Большая часть кода форм / роутов: сгенерировано Claude Code,
  точечно поправлено руками
- Email-шаблоны (HTML + text): сгенерированы Claude по гайдлайнам
- Промпты для агентов `lead-polish` и `lead-summary`:
  составлены руками с использованием Claude для grammar-check

## Что пришлось исправлять вручную
- (заполнится по факту в финале — честный список того, что AI сгенерировал
  криво и пришлось переписать)

## Что бы добавил при следующей итерации
- Юнит-тесты (vitest) на маппинг ошибок и шаблоны писем
- Sentry на оба роута + structured logging (pino)
- Verification email юзеру (double opt-in) для защиты от ложных адресов
- Persistence лидов в БД (сейчас только email + telegram, исторический
  лог не ведётся)

---

```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add /dev-presentation section at top of README"
```

---

## Phase G — local smoke + deploy

### Task G1: Local E2E smoke

**Prerequisites:**
- `hubmarket-ai` running locally on port 3100 (`cd ../hubmarket-ai && npm run dev`)
- `webkoth/.env.local` populated with all 5 new env vars + valid Resend API key
- For sandbox testing: use `RESEND_FROM="Test <onboarding@resend.dev>"` and use a real email you control as `OWNER_EMAIL`

- [ ] **Step 1: Start webkoth dev server**

```bash
cd /Users/minas/projects/webkoth
npm run dev
```
Open http://localhost:3000/dev-presentation in browser.

- [ ] **Step 2: Visual sanity check**

Verify in the browser:
- Hero shows name, role, pitch, 4 metrics
- About + Stack section with 5 chip groups visible
- HowIWork shows 3 approach + 3 AI cards
- Cases section shows 4 cards (2 with AI tag)
- Contacts shows email/telegram/github/calendar links + form
- Footer with copyright
- Theme toggle works (if accessed via main site nav — N/A on this isolated page)
- Responsive: shrink viewport to 375px, no horizontal scroll, form stacks correctly

- [ ] **Step 3: Smoke polish button**

- Type in message field: `привет надо сайт срочно бюджет 100k вчера надо` (must be ≥30 chars)
- Click `[✨ Сформулировать чище]`
- Expected: spinner appears, then message is replaced with polished version, toast `"Готово · Провайдер: claude"` (or gemini/groq if Claude fell back)

- [ ] **Step 4: Smoke validation errors**

- Fill name = `a` (too short), submit
- Expected: client-side Zod error appears `"Минимум 2 символа"`, request never sent

- [ ] **Step 5: Smoke happy path**

- Fill: name = `Test User`, phone = `+79991234567`, email = your real email, message = polished version from step 3
- Click `Отправить`
- Expected:
  - Spinner on submit button
  - Within 5s: success view appears with green checkmark, your email shown
  - Collapsible "Как ваш запрос понял AI" present (click to expand → see tldr/intent/urgency)
  - Toast: `"Сообщение отправлено · На <email> ушла копия"`
- Check your email inbox (both owner and user copy)
- Check Telegram chat — should have backup notification

- [ ] **Step 6: Smoke rate-limit**

- Submit again with same form (refresh the page, fill again)
- Expected after a few submits: toast `"Слишком частые отправки"`, form stays editable

- [ ] **Step 7: Smoke AI-down scenario**

- Stop `hubmarket-ai` (Ctrl-C in its terminal)
- Submit a fresh form
- Expected: form still succeeds, success view shows NO AI-summary block, owner-email arrives WITHOUT 🤖 block, server logs `[devlead] summary failed: ai 500` or timeout

- [ ] **Step 8: Stop dev servers, no commit**

---

### Task G2: Deploy hubmarket-ai

**Files:** none changed; deploy existing committed code.

- [ ] **Step 1: Push hubmarket-ai changes**

```bash
cd /Users/minas/projects/hubmarket-ai
git push origin main
```

- [ ] **Step 2: SSH to sellerai-dashboard and pull**

The deploy server hosts `hubmarket-ai` under PM2. From your machine:
```bash
ssh root@<sellerai-dashboard-ip> "cd /opt/hubmarket-ai && git pull && pm2 reload hubmarket-ai"
```
(If the deployment path differs, replace `/opt/hubmarket-ai` accordingly.)

Expected output: `git pull` shows new files; `pm2 reload` shows graceful restart with 0 downtime.

- [ ] **Step 3: Smoke prod hubmarket-ai endpoints**

```bash
export AI_TOKEN=<the token>  # same as AI_SERVICE_TOKEN in .env.local
export AI_URL=http://<sellerai-dashboard-ip>:3100

curl -sS -X POST "$AI_URL/api/leads/polish" \
  -H "Authorization: Bearer $AI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"тест прод эндпоинта polish после деплоя нужна проверка работы"}}' \
  | jq

curl -sS -X POST "$AI_URL/api/leads/summary" \
  -H "Authorization: Bearer $AI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"name":"Tester","message":"Тест классификации лида в продакшен среде"}}' \
  | jq
```
Expected: both return `success: true` with non-empty `result`.

- [ ] **Step 4: No commit** (no local file changes)

---

### Task G3: Deploy webkoth

**Files:** none changed; deploy existing committed code via existing pipeline.

- [ ] **Step 1: Push webkoth changes**

```bash
cd /Users/minas/projects/webkoth
git push origin main
```

- [ ] **Step 2: Add prod env vars**

On the production webkoth server (or in deploy pipeline secrets — wherever existing `TELEGRAM_BOT_TOKEN` lives), add:
- `RESEND_API_KEY`
- `RESEND_FROM`
- `OWNER_EMAIL`
- `AI_SERVICE_URL` (prod URL, e.g. `http://<sellerai-dashboard-ip>:3100`)
- `AI_SERVICE_TOKEN` (same as in hubmarket-ai)

Check `.deploy.yml` or the deploy pipeline docs in this repo to confirm the exact secret-injection method.

- [ ] **Step 3: Trigger deploy**

Whatever mechanism `.deploy.yml` uses (GitHub Actions push trigger is most likely). Wait for build/deploy to complete.

- [ ] **Step 4: Prod smoke**

Open https://webkoth.com/dev-presentation in browser. Repeat steps 2-5 of Task G1 against the production URL. Use a real test email you control.

Expected:
- Page loads, all sections render
- Polish button works, returns polished text
- Form submits successfully, owner-email arrives, user copy arrives
- AI-summary block appears in success view
- Telegram backup arrives in webkoth's monitoring chat

- [ ] **Step 5: Final commit — update README "Что пришлось исправлять вручную"**

After completing all the above, edit `README.md` and replace the `(заполнится по факту в финале …)` line in the "Что пришлось исправлять вручную" section with a real honest list of things that needed manual correction during implementation (typos, type errors, layout bugs, etc.).

Commit:
```bash
git add README.md
git commit -m "docs: finalize 'manual fixes' section in dev-presentation README"
git push origin main
```

---

## Acceptance criteria — full checklist for the test task

Map each requirement from the test task back to a verifiable behavior:

| Test requirement                                              | Verified by                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Информация о себе (стек, опыт, направления)                   | Hero + AboutStack sections render data.hero + data.about                 |
| Как вы работаете (подход, AI в работе)                        | HowIWork section, 3+3 cards                                              |
| Кейсы / опыт (реальные/учебные, что делали лично)             | Cases section, 4 cards (2 with AI tags, links to writeups)               |
| Контакты                                                      | Contacts section, 4 channel links                                        |
| Форма: имя, телефон, email, комментарий                       | LeadFormTest, exactly these 4 fields (+ honeypot)                        |
| Письмо владельцу                                              | Resend sendOwnerEmail to OWNER_EMAIL, verified in Task G1.5              |
| Копия пользователю                                            | Resend sendUserCopy to user.email, verified in Task G1.5                 |
| Обработка ошибок                                              | 6 error states mapped, retry button, validation messages, toasts         |
| Loading/success/error состояния                               | submitState machine, all 6 states distinct UI                            |
| JS/TS, HTML, SCSS/CSS                                         | TypeScript everywhere, Tailwind v4 (CSS-in-JS via utility classes)       |
| Адаптивность                                                  | Responsive grid (1 col mobile, 2 col md+), verified in Task G1.2         |
| Аккуратная структура проекта                                  | Phases A-F decompose into 21 focused commits, each with single purpose   |
| Валидная вёрстка                                              | Semantic HTML (`<main>`, `<section>`, `<header>`, `<footer>`, labels)    |
| API часть (минимальный backend)                               | 2 Next.js routes + 2 routes in hubmarket-ai = 4 API endpoints            |
| AI-интеграция (плюс)                                          | Polish button + lead-summary = 2 user-visible AI features                |
| AI integration — генерация текста / AI helper / AI summary    | Polish = generation+helper; lead-summary = AI summary                    |
| AI integration — tool calling сценарий                        | lead-summary returns structured JSON (intent/urgency/tldr/suggested_reply) — это и есть tool-calling сценарий через structured output |
| GitHub репозиторий                                            | webkoth (this repo) + hubmarket-ai (sibling repo, links from README)     |
| Ссылка на деплой                                              | https://webkoth.com/dev-presentation в README                            |
| README с 6 разделами                                          | Task F2 — все 6 разделов плюс «что бы добавил»                           |
| Полный цикл frontend → API → обработка ошибок → результат     | Task G1 verifies E2E manually                                            |

---

## Plan summary

- **Total tasks:** 24 (5 in hubmarket-ai, 16 in webkoth code, 1 env, 1 README, 1 local smoke, 2 prod deploy)
- **Total commits:** ~21 (smoke + deploy tasks have no commits)
- **Estimated execution time:** 4-6 hours for an engineer who has the spec open and accounts for Resend/AI/Telegram already configured
- **External prerequisites (not in plan):**
  - Resend account + API key (and ideally verified webkoth.com domain — otherwise use sandbox FROM)
  - `hubmarket-ai` already deployed and `AI_SERVICE_TOKEN` known
  - SSH access to sellerai-dashboard for hubmarket-ai redeploy
- **Risks during execution:**
  - If Resend rejects `RESEND_FROM` due to unverified domain → switch to `onboarding@resend.dev` per spec
  - If `hubmarket-ai` cascade has all three providers down → AI-features degrade gracefully; email flow still works
  - Spec uses font icons + emoji in email subjects — verify Gmail/Outlook render them correctly during Task G1
