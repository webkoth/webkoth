# CV Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/[lang]/minasarkisyan` (CV page) for the employer audience: two-layer structure (compact above-the-fold pitch with Hire-CTA + chip set, followed by 8 deep sections), removed skill-bars, JD-fit keyword density for ATS/Google SEO, with new Production AI and Open Source sections that surface employer-relevant evidence currently buried in portfolio descriptions.

**Architecture:** Data lives in `app/data/cv.ts` (RU + EN mirrored). New fields added to `CVData` type for `productionAI`, `openSource`, `content`, `hireCta`. `skills` field restructured from flat `{name, level}` array into categorized `{category, items: {name, maturity: "production"|"touch"}[]}` shape. Page composition in `app/[lang]/minasarkisyan/page.tsx` fully rewritten with vertical-flow layout (no more 2-column sidebar). New section components in `components/cv/` are added; existing components updated to consume new shape.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, framer-motion, JSON-LD via `components/json-ld-person.tsx`.

**Verification model:** No test framework in repo. Each task ends with `npm run typecheck` → `npm run lint` → visual verification at `localhost:3000/ru/minasarkisyan` and `/en/minasarkisyan`. Commit after each task.

---

## Pre-flight

- [ ] **Step 0.1: Ensure dev server can start**

Run: `npm run dev`
Expected: opens `http://localhost:3000/ru/minasarkisyan` showing current CV without errors. Leave running.

- [ ] **Step 0.2: Confirm Plan 1 (landing-rewrite) has merged or this work is on a separate branch**

CV work is **independent** of landing work — they don't share files except `copy-i18n.ts` (landing only) vs `cv.ts` (CV only). But best practice: do this on a separate branch to keep PR diffs clean.

Run: `git status && git branch --show-current`
Optional: `git checkout -b feat/cv-redesign`

---

### Task 1: Update CVData type signature in app/data/cv.ts

**Files:**
- Modify: `app/data/cv.ts:1-37`

- [ ] **Step 1.1: Replace CVData type**

Find at top of `app/data/cv.ts` (lines 2-37):

```ts
export type CVData = {
  name: string;
  role: string;
  location: string;
  contacts: {
    email: string;
    telegram: string;
    github: string;
    linkedin?: string;
  };
  about: string;
  skills: { name: string; level: number }[];
  experience: {
    period: string;
    role: string;
    company: string;
    type: string;
    description: string[];
  }[];
  education: {
    degree: string;
    university: string;
    faculty: string;
  };
  portfolio: {
    title: string;
    stack: string[];
    team: string;
    functionality: string;
    technologies: string[];
  }[];
  video?: {
    title: string;
    url: string;
  };
};
```

Replace with:

```ts
export type SkillMaturity = "production" | "touch";

export type SkillItem = {
  name: string;
  maturity: SkillMaturity;
};

export type SkillCategory = {
  category: string;
  items: SkillItem[];
};

export type ChipGroup = {
  groupLabel: string;
  chips: string[];
};

export type ProductionAIAchievement = {
  title: string;
  body: string;
  evidence?: string;
};

export type OpenSourcePackage = {
  name: string;
  description: string;
  npmPkg?: string;
  ghOwner: string;
  ghRepo: string;
  highlights: string[];
};

export type ContentLink = {
  platform: "youtube" | "github" | "npm" | "telegram" | "blog";
  label: string;
  url: string;
  caption?: string;
};

export type HireCta = {
  headline: string;
  body: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  emailLabel: string;
};

export type CVData = {
  name: string;
  role: string;
  roleSub: string;
  location: string;
  contacts: {
    email: string;
    telegram: string;
    github: string;
    linkedin?: string;
  };
  about: string;
  pitch: string;
  chipGroups: ChipGroup[];
  metrics: { value: number; suffix: string; label: string }[];
  skills: SkillCategory[];
  productionAI: ProductionAIAchievement[];
  openSource: OpenSourcePackage[];
  experience: {
    period: string;
    role: string;
    company: string;
    type: string;
    aiMarker?: string;
    description: string[];
  }[];
  education: {
    degree: string;
    university: string;
    faculty: string;
  };
  portfolio: {
    title: string;
    stack: string[];
    team: string;
    functionality: string;
    technologies: string[];
    aiTag?: "AI" | "AI-adjacent" | null;
  }[];
  content: ContentLink[];
  hireCta: HireCta;
  video?: {
    title: string;
    url: string;
  };
};
```

- [ ] **Step 1.2: Typecheck (expect errors)**

Run: `npm run typecheck`
Expected: many errors — TS will complain about missing fields (`pitch`, `chipGroups`, `metrics`, `productionAI`, `openSource`, `content`, `hireCta`, `roleSub`) in both `cvData.ru` and `cvData.en`. These are intentional; Task 2-7 fill them in.

- [ ] **Step 1.3: Commit (interim — type-only change)**

```bash
git add app/data/cv.ts
git commit -m "feat(cv): extend CVData type for new sections (production AI, open source, content, hire CTA)"
```

---

### Task 2: Populate `pitch`, `roleSub`, `metrics`, `chipGroups`, `hireCta` (RU + EN)

**Files:**
- Modify: `app/data/cv.ts` — RU block (around lines 40-50) and EN block (around lines 286-296)

- [ ] **Step 2.1: Add new top-level fields to RU cvData**

Find in `app/data/cv.ts` the RU block start (around line 40):

```ts
  en: {
    name: "Minas Sarkisyan",
    role: "Senior Fullstack Engineer",
    location: "Krasnodar, Russia · Remote / Hybrid · open to relocation",
    contacts: { ... },
    about: "Senior Fullstack Engineer with 9 years of production experience in PHP/Laravel...",
```

Add new fields between `role:` and `location:` (and after `about:` for `pitch`, `chipGroups`, `metrics`, `hireCta`).

For RU block, insert these fields (note the `roleSub` goes right after `role`):

```ts
    roleSub: "Production AI с 2023: MCP, multi-provider cascade, RAG, агенты",
    pitch: "9 лет в проде fullstack, 2.5 года плотно с LLM. 3 опубликованных MCP-сервера на npm. Сейчас — Сколково (5+ продуктов в поддержке) + HubMarket (AI-SaaS, founder + sole dev).",
    metrics: [
      { value: 9, suffix: "+", label: "лет fullstack" },
      { value: 2.5, suffix: "", label: "года production AI" },
      { value: 3, suffix: "", label: "MCP-сервера на npm" },
      { value: 5, suffix: "+", label: "продуктов в проде" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["Python 3.10+", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono", "PHP 8 / Laravel"],
      },
      {
        groupLabel: "AI / LLM",
        chips: ["Anthropic Claude", "OpenAI", "Google Gemini", "Yandex GPT", "Groq", "MCP (3 серверов на npm)", "Multi-provider cascade", "RAG", "structured output", "tool calling", "pgvector", "Vercel AI SDK"],
      },
      {
        groupLabel: "Frontend",
        chips: ["React 19 / Next.js 16", "Vue 3", "Tailwind", "shadcn/ui"],
      },
      {
        groupLabel: "Data & Infra",
        chips: ["PostgreSQL", "MySQL", "ClickHouse", "MongoDB", "Redis", "Docker", "Nginx", "Linux", "CI/CD"],
      },
      {
        groupLabel: "Observability & Tooling",
        chips: ["Sentry", "pino", "PostHog", "Claude Code (daily)", "Cursor (daily)"],
      },
    ],
    hireCta: {
      headline: "Готов обсудить вакансию или контракт",
      body: "Удалённо / гибрид ",
      primaryLabel: "Telegram: @abnorsky",
      primaryUrl: "https://t.me/abnorsky",
      secondaryLabel: "15-мин звонок (Calendar)",
      secondaryUrl: "https://calendar.app.google/your-link-here",
      emailLabel: "webkoth@gmail.com",
    },
```

Note on `secondaryUrl`: if the existing landing has a Google Calendar URL in `lib/landing/contacts.ts`, reuse it. Otherwise leave the placeholder for Минас to fill in.

- [ ] **Step 2.2: Add new top-level fields to EN cvData**

Mirror for EN block:

```ts
    roleSub: "Production AI since 2023: MCP, multi-provider cascade, RAG, agents",
    pitch: "9 years fullstack in production, 2.5 years deep with LLMs. 3 published MCP servers on npm. Currently: Skolkovo School (5+ products on support) + HubMarket (AI-SaaS, founder + sole dev).",
    metrics: [
      { value: 9, suffix: "+", label: "yrs fullstack" },
      { value: 2.5, suffix: "", label: "yrs production AI" },
      { value: 3, suffix: "", label: "npm MCP servers" },
      { value: 5, suffix: "+", label: "products live" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["Python 3.10+", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono", "PHP 8 / Laravel"],
      },
      {
        groupLabel: "AI / LLM",
        chips: ["Anthropic Claude", "OpenAI", "Google Gemini", "Yandex GPT", "Groq", "MCP (3 servers on npm)", "Multi-provider cascade", "RAG", "structured output", "tool calling", "pgvector", "Vercel AI SDK"],
      },
      {
        groupLabel: "Frontend",
        chips: ["React 19 / Next.js 16", "Vue 3", "Tailwind", "shadcn/ui"],
      },
      {
        groupLabel: "Data & Infra",
        chips: ["PostgreSQL", "MySQL", "ClickHouse", "MongoDB", "Redis", "Docker", "Nginx", "Linux", "CI/CD"],
      },
      {
        groupLabel: "Observability & Tooling",
        chips: ["Sentry", "pino", "PostHog", "Claude Code (daily)", "Cursor (daily)"],
      },
    ],
    hireCta: {
      headline: "Open to roles and contract work",
      body: "Reply within 24h. Remote / hybrid / open to relocation.",
      primaryLabel: "Telegram: @abnorsky",
      primaryUrl: "https://t.me/abnorsky",
      secondaryLabel: "15-min call (Calendar)",
      secondaryUrl: "https://calendar.app.google/your-link-here",
      emailLabel: "webkoth@gmail.com",
    },
```

- [ ] **Step 2.3: Typecheck**

Run: `npm run typecheck`
Expected: still errors about missing `productionAI`, `openSource`, `content`, restructured `skills`. Tasks 3-7 close these.

- [ ] **Step 2.4: Commit**

```bash
git add app/data/cv.ts
git commit -m "feat(cv): add pitch, chipGroups, metrics, hireCta data (RU+EN)"
```

---

### Task 3: Populate `productionAI` data (RU + EN)

**Files:**
- Modify: `app/data/cv.ts`

- [ ] **Step 3.1: Add productionAI array to RU cvData**

Insert AFTER `chipGroups` and BEFORE `skills`:

```ts
    productionAI: [
      {
        title: "Multi-provider LLM cascade в HubMarket",
        body: "Архитектура с фолбэком Claude → Gemini → Groq: 0 downtime LLM за 8 месяцев в проде. Автоматический cost-log и quality drift отслеживание.",
        evidence: "Featured case на лендинге webkoth.com",
      },
      {
        title: "RAG-системы и vector search",
        body: "pgvector в HubMarket (production), Yandex GPT pipeline в Сколково. Эмбеддинги, chunking, retrieval-tuning под domain-данные.",
        evidence: "HubMarket + AI-сервис распознавания документов в Сколково",
      },
      {
        title: "MCP-серверы для агентной автоматизации",
        body: "3 опубликованных MCP-сервера на npm. Полная поддержка Timeweb Cloud API (серверы, БД, K8s, S3, DNS). Используется AI-агентами из Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth — 3 пакета",
      },
      {
        title: "Document-пайплайны (OCR → LLM → structured)",
        body: "Production AI-сервис распознавания документов в Сколково: PDF → Yandex OCR → Yandex GPT (structured output) → DB write с привязкой к образовательным программам.",
        evidence: "Сколково · async queues, admin panel",
      },
      {
        title: "Dual-provider AI-landing builder",
        body: "Production AI-конструктор в Сколково: GPT-4o-mini для текста + NanoBanano для изображений. 21 готовый блок, мульти-страничные лендинги, HTML-экспорт.",
        evidence: "Сколково · Vue 3 + PHP",
      },
      {
        title: "Tool-calling агенты с MTProto-доступом",
        body: "Telegram-бот HubMarket на grammy + Pyrogram (MTProto) — агент с tool calling над marketplace-данными.",
        evidence: "HubMarket production",
      },
    ],
```

- [ ] **Step 3.2: Add productionAI array to EN cvData**

```ts
    productionAI: [
      {
        title: "Multi-provider LLM cascade in HubMarket",
        body: "Architecture with fallback Claude → Gemini → Groq: 0 LLM downtime over 8 months in prod. Automatic cost-log and quality-drift tracking.",
        evidence: "Featured case on webkoth.com",
      },
      {
        title: "RAG systems and vector search",
        body: "pgvector in HubMarket (production), Yandex GPT pipeline in Skolkovo. Embeddings, chunking, retrieval tuning for domain data.",
        evidence: "HubMarket + AI document recognition service in Skolkovo",
      },
      {
        title: "MCP servers for agentic automation",
        body: "3 MCP servers published on npm. Full coverage of Timeweb Cloud API (servers, DBs, K8s, S3, DNS). Used by AI agents from Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth — 3 packages",
      },
      {
        title: "Document pipelines (OCR → LLM → structured)",
        body: "Production AI document recognition service in Skolkovo: PDF → Yandex OCR → Yandex GPT (structured output) → DB write with educational program linkage.",
        evidence: "Skolkovo · async queues, admin panel",
      },
      {
        title: "Dual-provider AI landing builder",
        body: "Production AI builder in Skolkovo: GPT-4o-mini for text + NanoBanano for images. 21 ready blocks, multi-page landings, HTML export.",
        evidence: "Skolkovo · Vue 3 + PHP",
      },
      {
        title: "Tool-calling agents with MTProto access",
        body: "HubMarket Telegram bot on grammy + Pyrogram (MTProto) — tool-calling agent over marketplace data.",
        evidence: "HubMarket production",
      },
    ],
```

- [ ] **Step 3.3: Typecheck + Commit**

Run: `npm run typecheck`
Errors remaining for `openSource`, `skills` restructure, `content`. These come next.

```bash
git add app/data/cv.ts
git commit -m "feat(cv): add productionAI achievements (RU+EN)"
```

---

### Task 4: Populate `openSource` data (RU + EN)

**Files:**
- Modify: `app/data/cv.ts`

- [ ] **Step 4.1: Add openSource array to RU cvData**

Insert AFTER `productionAI` and BEFORE `skills`. Note: package names assume real npm publications under user `webkoth`. If user has only `timeweb-mcp-server` published right now, list only that one and add others as Pet-projects ship.

```ts
    openSource: [
      {
        name: "timeweb-mcp-server",
        description: "Полная поддержка Timeweb Cloud API через MCP-протокол. Серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами из Claude Desktop / Claude Code / Cursor для автоматизации деплоев.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: ["Node.js + TypeScript", "MCP SDK", "Full Timeweb API coverage", "Production-ready"],
      },
      // Note: Plan-executor — add additional npm packages here as Минас publishes them.
      // Currently only timeweb-mcp-server is verified. The pitch claims «3 MCP servers on npm» —
      // this should be reconciled with reality before publishing CV updates.
      // If only 1 server exists publicly, update pitch and metrics accordingly OR ship pet-projects
      // first (see 2026-05-20-pet-projects.md, Task: 4th MCP server) and add them here on publication.
    ],
```

- [ ] **Step 4.2: Add openSource array to EN cvData**

```ts
    openSource: [
      {
        name: "timeweb-mcp-server",
        description: "Full Timeweb Cloud API coverage via MCP protocol. Cloud servers, databases (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, domains. Used by AI agents from Claude Desktop / Claude Code / Cursor for deployment automation.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: ["Node.js + TypeScript", "MCP SDK", "Full Timeweb API coverage", "Production-ready"],
      },
    ],
```

- [ ] **Step 4.3: Typecheck + Commit**

```bash
git add app/data/cv.ts
git commit -m "feat(cv): add openSource packages (RU+EN)"
```

---

### Task 5: Restructure `skills` to categorized SkillCategory[] (RU + EN)

**Files:**
- Modify: `app/data/cv.ts`

- [ ] **Step 5.1: Replace RU skills array**

Find current RU `skills:` array (around lines 297-309):

```ts
    skills: [
      { name: "AI / LLM Integration", level: 90 },
      { name: "Vercel AI SDK / RAG / MCP", level: 85 },
      { name: "Claude Code / Cursor", level: 95 },
      ...12 items total...
    ],
```

Replace with categorized structure:

```ts
    skills: [
      {
        category: "AI / LLM",
        items: [
          { name: "Anthropic Claude", maturity: "production" },
          { name: "OpenAI", maturity: "production" },
          { name: "Google Gemini", maturity: "production" },
          { name: "Yandex GPT", maturity: "production" },
          { name: "Groq", maturity: "production" },
          { name: "MCP (3 серверов на npm)", maturity: "production" },
          { name: "RAG / pgvector", maturity: "production" },
          { name: "Multi-provider cascade", maturity: "production" },
          { name: "structured output / tool calling", maturity: "production" },
          { name: "Vercel AI SDK", maturity: "production" },
          { name: "self-hosted (Ollama / vLLM)", maturity: "touch" },
        ],
      },
      {
        category: "Backend",
        items: [
          { name: "Python 3.10+ / FastAPI / asyncio", maturity: "production" },
          { name: "PHP 8 / Laravel / Symfony", maturity: "production" },
          { name: "TypeScript / Node.js / Hono", maturity: "production" },
          { name: "Go", maturity: "touch" },
        ],
      },
      {
        category: "Frontend",
        items: [
          { name: "React 19 / Next.js 16", maturity: "production" },
          { name: "Vue 3 / Inertia.js", maturity: "production" },
          { name: "Tailwind 4 / shadcn/ui / Radix", maturity: "production" },
        ],
      },
      {
        category: "Базы данных",
        items: [
          { name: "PostgreSQL", maturity: "production" },
          { name: "MySQL", maturity: "production" },
          { name: "ClickHouse", maturity: "production" },
          { name: "MongoDB", maturity: "production" },
          { name: "Redis", maturity: "production" },
          { name: "pgvector", maturity: "production" },
        ],
      },
      {
        category: "Архитектура",
        items: [
          { name: "REST API / Event-driven", maturity: "production" },
          { name: "OOP / SOLID / DDD", maturity: "production" },
          { name: "Microservices", maturity: "production" },
        ],
      },
      {
        category: "DevOps / Tooling",
        items: [
          { name: "Docker", maturity: "production" },
          { name: "Nginx / Linux", maturity: "production" },
          { name: "CI/CD (GitLab / GitHub Actions)", maturity: "production" },
          { name: "Sentry / pino / PostHog", maturity: "production" },
          { name: "Claude Code / Cursor (ежедневно)", maturity: "production" },
          { name: "Kubernetes", maturity: "touch" },
        ],
      },
    ],
```

- [ ] **Step 5.2: Replace EN skills array**

Apply mirror (around lines 51-64 in original) with EN labels:

```ts
    skills: [
      {
        category: "AI / LLM",
        items: [
          { name: "Anthropic Claude", maturity: "production" },
          { name: "OpenAI", maturity: "production" },
          { name: "Google Gemini", maturity: "production" },
          { name: "Yandex GPT", maturity: "production" },
          { name: "Groq", maturity: "production" },
          { name: "MCP (3 servers on npm)", maturity: "production" },
          { name: "RAG / pgvector", maturity: "production" },
          { name: "Multi-provider cascade", maturity: "production" },
          { name: "structured output / tool calling", maturity: "production" },
          { name: "Vercel AI SDK", maturity: "production" },
          { name: "self-hosted (Ollama / vLLM)", maturity: "touch" },
        ],
      },
      {
        category: "Backend",
        items: [
          { name: "Python 3.10+ / FastAPI / asyncio", maturity: "production" },
          { name: "PHP 8 / Laravel / Symfony", maturity: "production" },
          { name: "TypeScript / Node.js / Hono", maturity: "production" },
          { name: "Go", maturity: "touch" },
        ],
      },
      {
        category: "Frontend",
        items: [
          { name: "React 19 / Next.js 16", maturity: "production" },
          { name: "Vue 3 / Inertia.js", maturity: "production" },
          { name: "Tailwind 4 / shadcn/ui / Radix", maturity: "production" },
        ],
      },
      {
        category: "Databases",
        items: [
          { name: "PostgreSQL", maturity: "production" },
          { name: "MySQL", maturity: "production" },
          { name: "ClickHouse", maturity: "production" },
          { name: "MongoDB", maturity: "production" },
          { name: "Redis", maturity: "production" },
          { name: "pgvector", maturity: "production" },
        ],
      },
      {
        category: "Architecture",
        items: [
          { name: "REST API / Event-driven", maturity: "production" },
          { name: "OOP / SOLID / DDD", maturity: "production" },
          { name: "Microservices", maturity: "production" },
        ],
      },
      {
        category: "DevOps / Tooling",
        items: [
          { name: "Docker", maturity: "production" },
          { name: "Nginx / Linux", maturity: "production" },
          { name: "CI/CD (GitLab / GitHub Actions)", maturity: "production" },
          { name: "Sentry / pino / PostHog", maturity: "production" },
          { name: "Claude Code / Cursor (daily)", maturity: "production" },
          { name: "Kubernetes", maturity: "touch" },
        ],
      },
    ],
```

- [ ] **Step 5.3: Typecheck + Commit**

Run: `npm run typecheck`
Errors remaining only for `content`, `experience.aiMarker`, `portfolio.aiTag` (optional fields can be left undefined initially).

```bash
git add app/data/cv.ts
git commit -m "feat(cv): restructure skills to categorized + production/touch markers (removed 0-100 bars)"
```

---

### Task 6: Add AI tags to portfolio items + AI markers to experience (RU + EN)

**Files:**
- Modify: `app/data/cv.ts`

- [ ] **Step 6.1: Add `aiTag` to portfolio items (RU)**

Find each portfolio item in the RU portfolio array (around lines 382-525). Add `aiTag` field to each:

| Portfolio item title (key fragment) | aiTag |
|---|---|
| `HubMarket — AI-SaaS` | `"AI"` |
| `AI-сервис распознавания документов` | `"AI"` |
| `AI-конструктор лендингов` | `"AI"` |
| `timeweb-mcp-server` | `"AI"` |
| `High-load backend программы лояльности` | `null` |
| `ERP для нефтегазовой компании` | `null` |
| `Lenderkit.com` | `null` |
| `E-commerce аналитика на 1+ ТБ` | `"AI-adjacent"` |
| `Микросервисная криптобиржа` | `null` |

For each item, add `aiTag: "AI"` (or appropriate value, or `aiTag: null` for non-AI) as a new field next to `technologies`. Example:

```ts
{
  title: "HubMarket — AI-SaaS для селлеров маркетплейсов",
  stack: [...],
  team: "Founder + единственный разработчик",
  functionality: "...",
  technologies: [...],
  aiTag: "AI",
},
```

- [ ] **Step 6.2: Add `aiTag` to portfolio items (EN)**

Apply the same mapping to EN portfolio array (around lines 136-279):

| Portfolio item title (key fragment) | aiTag |
|---|---|
| `HubMarket — AI-SaaS for marketplace sellers` | `"AI"` |
| `AI document recognition service` | `"AI"` |
| `AI landing builder` | `"AI"` |
| `timeweb-mcp-server` | `"AI"` |
| `High-load loyalty backend` | `null` |
| `ERP system for an oil & gas company` | `null` |
| `Lenderkit.com — fintech platform` | `null` |
| `E-commerce analytics on 1+ TB` | `"AI-adjacent"` |
| `Microservices crypto exchange` | `null` |

- [ ] **Step 6.3: Add `aiMarker` to experience (RU + EN)**

For each experience entry where AI work is significant, add an `aiMarker` field. The marker is a short tag string that the experience component will render visibly above the description.

RU updates:

```ts
// Skolkovo (2024-11 — present)
aiMarker: "AI / LLM в проде (5+ продуктов: OCR, AI-builder, RAG)"

// MPSTATS (2024-03 — 2024-11)
aiMarker: "Data-intensive (1+ ТБ) — фундамент для embeddings / RAG"

// Itpelag (2022-06 — 2024-02)
// no aiMarker

// Justcoded (2020-05 — 2022-05)
// no aiMarker

// SpdLoad (2017-10 — 2020-04)
// no aiMarker
```

EN updates: equivalent strings.

```ts
// Skolkovo
aiMarker: "AI / LLM in production (5+ products: OCR, AI-builder, RAG)"

// MPSTATS
aiMarker: "Data-intensive (1+ TB) — foundation for embeddings / RAG"
```

- [ ] **Step 6.4: Typecheck + Commit**

```bash
git add app/data/cv.ts
git commit -m "feat(cv): add AI tags to portfolio + AI markers to experience"
```

---

### Task 7: Populate `content` (RU + EN)

**Files:**
- Modify: `app/data/cv.ts`

- [ ] **Step 7.1: Add content array to RU cvData**

Insert before `hireCta` (or wherever fits in your final ordering):

```ts
    content: [
      {
        platform: "youtube",
        label: "YouTube",
        url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
        caption: "Технические заметки и разборы",
      },
      {
        platform: "github",
        label: "GitHub @webkoth",
        url: "https://github.com/webkoth",
        caption: "Pet-проекты и open-source",
      },
      {
        platform: "npm",
        label: "npm @webkoth",
        url: "https://www.npmjs.com/~webkoth",
        caption: "3 MCP-сервера в публикации",
      },
      {
        platform: "telegram",
        label: "Telegram @abnorsky",
        url: "https://t.me/abnorsky",
        caption: "Личные контакты",
      },
    ],
```

- [ ] **Step 7.2: Add content array to EN cvData**

```ts
    content: [
      {
        platform: "youtube",
        label: "YouTube",
        url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
        caption: "Tech notes and walkthroughs",
      },
      {
        platform: "github",
        label: "GitHub @webkoth",
        url: "https://github.com/webkoth",
        caption: "Pet-projects and open-source",
      },
      {
        platform: "npm",
        label: "npm @webkoth",
        url: "https://www.npmjs.com/~webkoth",
        caption: "3 MCP servers published",
      },
      {
        platform: "telegram",
        label: "Telegram @abnorsky",
        url: "https://t.me/abnorsky",
        caption: "Direct contact",
      },
    ],
```

- [ ] **Step 7.3: Typecheck**

Run: `npm run typecheck`
Expected: no errors now — `cvData` shape complete for both langs.

- [ ] **Step 7.4: Commit**

```bash
git add app/data/cv.ts
git commit -m "feat(cv): add content links (YouTube/GitHub/npm/Telegram)"
```

---

### Task 8: SEO update — layout.tsx + JSON-LD

**Files:**
- Modify: `app/[lang]/minasarkisyan/layout.tsx`
- Modify: `components/json-ld-person.tsx`

- [ ] **Step 8.1: Update layout.tsx metadata for JD-fit keywords**

Open `app/[lang]/minasarkisyan/layout.tsx`. Replace `title.default` and `description`:

Find (around lines 16-22):

```ts
    title: {
      default: lang === "en"
        ? "Minas Sarkisyan - Fullstack Engineer | CV"
        : "Минас Саркисян - Fullstack Engineer | Резюме",
      template: "%s | Minas Sarkisyan"
    },
    description: data.about,
```

Replace with:

```ts
    title: {
      default: lang === "en"
        ? "Minas Sarkisyan — Senior Fullstack & AI Engineer | Python, MCP, RAG, LLM"
        : "Минас Саркисян — Senior Fullstack & AI Engineer | Python, MCP, RAG, LLM",
      template: "%s | Minas Sarkisyan"
    },
    description: lang === "en"
      ? "Senior Fullstack / AI Engineer. 9 years in production. Python, FastAPI, TypeScript, React, PHP. 2.5 years deep with LLMs: MCP (3 npm servers), multi-provider cascade, RAG, agents. Currently: Skolkovo School (5+ products) + HubMarket (AI-SaaS founder). Open to roles and contract work."
      : "Senior Fullstack / AI-инженер. 9 лет в проде. Python, FastAPI, TypeScript, React, PHP. 2.5 года плотно с LLM: MCP (3 npm-сервера), multi-provider cascade, RAG, агенты. Сейчас: Сколково (5+ продуктов) + HubMarket (AI-SaaS founder). Открыт к вакансиям и контрактной работе.",
```

Update keywords (add `keywords` field if absent — Next.js metadata supports it):

```ts
    keywords: [
      "Senior Fullstack Engineer",
      "AI Engineer",
      "Python",
      "FastAPI",
      "asyncio",
      "TypeScript",
      "Node.js",
      "React",
      "Next.js",
      "PHP",
      "Laravel",
      "LLM",
      "Anthropic Claude",
      "OpenAI",
      "MCP",
      "Model Context Protocol",
      "RAG",
      "pgvector",
      "vector database",
      "Multi-provider cascade",
      "tool calling",
      "structured output",
      "Docker",
      "PostgreSQL",
      "production AI",
      "open to relocation",
      "remote",
      lang === "en" ? "Krasnodar" : "Краснодар",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
```

- [ ] **Step 8.2: Update json-ld-person.tsx for richer Person schema**

Open `components/json-ld-person.tsx`. Find the JSON-LD object. Ensure it includes `knowsAbout` (skills) and `worksFor` (current employer). Update `knowsAbout` to include the JD-fit terms.

Sketch additions/changes (preserve existing fields):

```tsx
const personJson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: data.name,
  jobTitle: data.role,
  description: data.about,
  url: `https://webkoth.com/${lang}/minasarkisyan`,
  sameAs: [
    `https://github.com/${data.contacts.github.replace("github.com/", "")}`,
    `https://t.me/${data.contacts.telegram.replace("@", "")}`,
    "https://www.npmjs.com/~webkoth",
  ],
  email: data.contacts.email,
  knowsAbout: [
    "Production AI Engineering",
    "Large Language Models",
    "Model Context Protocol (MCP)",
    "Retrieval-Augmented Generation (RAG)",
    "LLM agents and tool calling",
    "Multi-provider LLM cascade",
    "Anthropic Claude API",
    "OpenAI API",
    "Google Gemini API",
    "Yandex GPT",
    "Python",
    "FastAPI",
    "asyncio",
    "TypeScript",
    "Node.js",
    "Hono",
    "React",
    "Next.js",
    "Vue 3",
    "PHP",
    "Laravel",
    "Symfony",
    "PostgreSQL",
    "MySQL",
    "ClickHouse",
    "MongoDB",
    "Redis",
    "pgvector",
    "Docker",
    "Linux",
    "Vercel AI SDK",
    "Sentry",
    "Claude Code",
    "Cursor",
  ],
  worksFor: {
    "@type": "Organization",
    name: lang === "en" ? "Skolkovo School of Management" : "Школа управления Сколково",
  },
};
```

If the existing component already has these fields, just augment `knowsAbout`. Do not remove existing valid fields.

- [ ] **Step 8.3: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `localhost:3000/ru/minasarkisyan`: view-source on the page, search for the JSON-LD `<script type="application/ld+json">` — confirm new `knowsAbout` keys are present.

Also: open browser devtools → Network → Doc → Response → check `<meta name="description">` content matches new copy. Same for `<title>`.

- [ ] **Step 8.4: Commit**

```bash
git add app/[lang]/minasarkisyan/layout.tsx components/json-ld-person.tsx
git commit -m "feat(cv): update SEO (title, description, keywords, JSON-LD knowsAbout) for JD-fit"
```

---

### Task 9: Create components/cv/chips.tsx (chip group rendering)

**Files:**
- Create: `components/cv/chips.tsx`

- [ ] **Step 9.1: Create chips component**

```tsx
"use client";

import type { ChipGroup } from "@/app/data/cv";

type Props = { groups: ChipGroup[] };

export function Chips({ groups }: Props) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.groupLabel} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {g.groupLabel}:
          </span>
          {g.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 9.2: Typecheck + Commit**

```bash
git add components/cv/chips.tsx
git commit -m "feat(cv): add Chips component for chip-group rendering"
```

---

### Task 10: Create components/cv/hire-cta.tsx

**Files:**
- Create: `components/cv/hire-cta.tsx`

- [ ] **Step 10.1: Create hire-cta component**

```tsx
"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData };

export function HireCta({ data }: Props) {
  const { hireCta } = data;
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
      <div className="mb-2 text-lg font-semibold md:text-xl">
        {hireCta.headline}
      </div>
      <p className="mb-5 text-sm text-muted-foreground md:text-base">
        {hireCta.body}
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={hireCta.primaryUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {hireCta.primaryLabel}
        </a>
        <a
          href={hireCta.secondaryUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {hireCta.secondaryLabel}
        </a>
        <a
          href={`mailto:${hireCta.emailLabel}`}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground underline hover:text-foreground"
        >
          {hireCta.emailLabel}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 10.2: Typecheck + Commit**

```bash
git add components/cv/hire-cta.tsx
git commit -m "feat(cv): add HireCta component"
```

---

### Task 11: Create components/cv/production-ai.tsx

**Files:**
- Create: `components/cv/production-ai.tsx`

- [ ] **Step 11.1: Create production-ai component**

```tsx
"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData; lang: "en" | "ru" };

export function ProductionAI({ data, lang }: Props) {
  const title = lang === "en" ? "Production AI / LLM" : "Production AI / LLM";
  const sub =
    lang === "en"
      ? "Concrete achievements with measured outcomes."
      : "Конкретные достижения с измеримыми результатами.";

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.productionAI.map((a) => (
          <div
            key={a.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="mb-2 text-base font-semibold">{a.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {a.body}
            </p>
            {a.evidence ? (
              <div className="mt-3 text-xs text-primary">→ {a.evidence}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 11.2: Typecheck + Commit**

```bash
git add components/cv/production-ai.tsx
git commit -m "feat(cv): add ProductionAI section component"
```

---

### Task 12: Create components/cv/open-source.tsx

**Files:**
- Create: `components/cv/open-source.tsx`

- [ ] **Step 12.1: Create open-source component**

```tsx
"use client";

import type { CVData } from "@/app/data/cv";
import { LiveNpmBadge } from "@/components/landing/live-npm-badge";
import { LiveGhStars } from "@/components/landing/live-gh-stars";

type Props = { data: CVData; lang: "en" | "ru" };

export function OpenSource({ data, lang }: Props) {
  const title = lang === "en" ? "Open Source / MCP" : "Open Source / MCP";
  const sub =
    lang === "en"
      ? "Published npm packages. Public proof — clickable, verifiable."
      : "Опубликованные npm-пакеты. Публичное доказательство — кликабельно, проверяемо.";

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <div className="space-y-4">
        {data.openSource.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold font-mono">{p.name}</h3>
              {p.npmPkg ? (
                <LiveNpmBadge pkg={p.npmPkg} />
              ) : null}
              <LiveGhStars owner={p.ghOwner} repo={p.ghRepo} />
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {p.description}
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-muted/60 px-2.5 py-1 text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {p.npmPkg ? (
                <a
                  href={`https://www.npmjs.com/package/${p.npmPkg}`}
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  npm
                </a>
              ) : null}
              <a
                href={`https://github.com/${p.ghOwner}/${p.ghRepo}`}
                target="_blank"
                rel="noopener"
                className="text-primary underline"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

Note: if `LiveNpmBadge` or `LiveGhStars` have a different prop API, adjust. Inspect those files in `components/landing/` and follow the actual interfaces.

- [ ] **Step 12.2: Typecheck + Commit**

```bash
git add components/cv/open-source.tsx
git commit -m "feat(cv): add OpenSource section component"
```

---

### Task 13: Create components/cv/content-grid.tsx

**Files:**
- Create: `components/cv/content-grid.tsx`

- [ ] **Step 13.1: Create content-grid component**

```tsx
"use client";

import type { CVData } from "@/app/data/cv";
import { Youtube, Github, Send, Package, FileText } from "lucide-react";

type Props = { data: CVData; lang: "en" | "ru" };

const IconMap = {
  youtube: Youtube,
  github: Github,
  npm: Package,
  telegram: Send,
  blog: FileText,
};

export function ContentGrid({ data, lang }: Props) {
  const title = lang === "en" ? "Content & Channels" : "Контент и каналы";

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {data.content.map((c) => {
          const Icon = IconMap[c.platform];
          return (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener"
              className="rounded-xl border border-border bg-card p-4 transition hover:border-primary"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{c.label}</span>
              </div>
              {c.caption ? (
                <p className="text-xs text-muted-foreground">{c.caption}</p>
              ) : null}
            </a>
          );
        })}
      </div>
    </section>
  );
}
```

Note: `lucide-react` icons used. If a specific icon name is missing in the installed version, substitute with a similar one (`Globe`, `Link`, etc.).

- [ ] **Step 13.2: Typecheck + Commit**

```bash
git add components/cv/content-grid.tsx
git commit -m "feat(cv): add ContentGrid component (YouTube/GitHub/npm/Telegram links)"
```

---

### Task 14: Update components/cv/skills.tsx — remove progress bars, render categories

**Files:**
- Modify: `components/cv/skills.tsx`

- [ ] **Step 14.1: Rewrite skills component**

Replace the entire content of `components/cv/skills.tsx` with:

```tsx
"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData; lang: "en" | "ru" };

export function Skills({ data, lang }: Props) {
  const title = lang === "en" ? "Skills" : "Навыки";
  const productionLabel = lang === "en" ? "production" : "production";
  const touchLabel = lang === "en" ? "touch" : "touch";

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      <div className="space-y-5">
        {data.skills.map((cat) => (
          <div key={cat.category}>
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.category}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    item.maturity === "production"
                      ? "border-primary/30 bg-primary/5 text-foreground"
                      : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                  title={
                    item.maturity === "production" ? productionLabel : touchLabel
                  }
                >
                  {item.name}
                  {item.maturity === "touch" ? (
                    <span className="ml-1 text-[10px] uppercase">·{touchLabel}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 14.2: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Expected: no errors. Visual at `/ru/minasarkisyan`: Skills section now categorized; chips visually distinguish production (primary tint) vs touch (muted + «·touch» suffix). No progress bars.

- [ ] **Step 14.3: Commit**

```bash
git add components/cv/skills.tsx
git commit -m "feat(cv): rewrite Skills as categorized chips with maturity markers (no progress bars)"
```

---

### Task 15: Update components/cv/portfolio.tsx — render AI tags

**Files:**
- Modify: `components/cv/portfolio.tsx`

- [ ] **Step 15.1: Add AI tag chip to each portfolio card**

Open `components/cv/portfolio.tsx`. Find the card rendering for each portfolio item. Add a small chip in the top-right (or near the title) showing the AI tag if present.

In the card JSX, near the title:

```tsx
<div className="mb-2 flex items-start justify-between gap-3">
  <h3 className="text-lg font-semibold">{item.title}</h3>
  {item.aiTag ? (
    <span
      className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
        item.aiTag === "AI"
          ? "bg-primary/15 text-primary"
          : "bg-muted/60 text-muted-foreground"
      }`}
    >
      {item.aiTag}
    </span>
  ) : null}
</div>
```

Adjust to match the existing card structure (the container element, the title element). The intent: every portfolio card now visibly says «AI» or «AI-adjacent» if applicable; if `aiTag` is null/undefined, render nothing.

- [ ] **Step 15.2: Typecheck + Visual**

Visual at `/ru/minasarkisyan`: Portfolio cards — 4 cards show «AI» chip, 1 shows «AI-adjacent», 4 show nothing.

- [ ] **Step 15.3: Commit**

```bash
git add components/cv/portfolio.tsx
git commit -m "feat(cv): render AI / AI-adjacent tags on portfolio cards"
```

---

### Task 16: Update components/cv/experience.tsx — render aiMarker

**Files:**
- Modify: `components/cv/experience.tsx`

- [ ] **Step 16.1: Render aiMarker on each experience entry**

In `components/cv/experience.tsx`, find the iteration over `data.experience`. For each entry, render `entry.aiMarker` (if present) as a visible chip above the description list.

Add inside the per-entry block, between `<h3>` (role/company) and the description `<ul>`:

```tsx
{entry.aiMarker ? (
  <div className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
    {entry.aiMarker}
  </div>
) : null}
```

- [ ] **Step 16.2: Typecheck + Visual**

Visual: Skolkovo and MPSTATS entries now show a small primary-coloured AI marker chip above their description bullets. Other entries (Itpelag, Justcoded, SpdLoad) — no chip.

- [ ] **Step 16.3: Commit**

```bash
git add components/cv/experience.tsx
git commit -m "feat(cv): render aiMarker chip on relevant experience entries"
```

---

### Task 17: Update components/cv/header.tsx — first-screen pitch + metrics

**Files:**
- Modify: `components/cv/header.tsx`

- [ ] **Step 17.1: Rewrite Header to include role, sub, location, pitch, metrics**

Open `components/cv/header.tsx`. Replace its content with:

```tsx
"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData };

export function Header({ data }: Props) {
  return (
    <header className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{data.name}</h1>
        <p className="mt-2 text-lg font-semibold text-foreground md:text-xl">
          {data.role}
        </p>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {data.roleSub}
        </p>
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          {data.location}
        </p>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {data.pitch}
      </p>
      <div className="flex flex-wrap gap-5 md:gap-7">
        {data.metrics.map((m) => (
          <div key={m.label}>
            <div className="text-2xl font-bold md:text-3xl">
              {m.value}
              {m.suffix}
            </div>
            <div className="text-xs text-muted-foreground md:text-sm">{m.label}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
```

- [ ] **Step 17.2: Typecheck + Visual**

Visual: top of CV page — name, role + roleSub, location, pitch paragraph, 4 metrics inline. (Old Header had less; this is the new compact above-the-fold pitch.)

- [ ] **Step 17.3: Commit**

```bash
git add components/cv/header.tsx
git commit -m "feat(cv): expand Header into first-screen pitch with role, location, metrics"
```

---

### Task 18: Rewrite app/[lang]/minasarkisyan/page.tsx with new structure

**Files:**
- Modify: `app/[lang]/minasarkisyan/page.tsx`

- [ ] **Step 18.1: Replace page content with new vertical-flow layout**

Replace entire content of `app/[lang]/minasarkisyan/page.tsx` with:

```tsx
"use client";

import { cvData } from "@/app/data/cv";
import { Header } from "@/components/cv/header";
import { Chips } from "@/components/cv/chips";
import { HireCta } from "@/components/cv/hire-cta";
import { ProductionAI } from "@/components/cv/production-ai";
import { OpenSource } from "@/components/cv/open-source";
import { Skills } from "@/components/cv/skills";
import { Experience } from "@/components/cv/experience";
import { Portfolio } from "@/components/cv/portfolio";
import { Education } from "@/components/cv/education";
import { ContentGrid } from "@/components/cv/content-grid";
import { About } from "@/components/cv/about";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { LLMDocsButton } from "@/components/llm-docs-button";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function MinasarkisyanPage() {
  const params = useParams();
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <main className="min-h-screen bg-background">
      {/* Top Controls */}
      <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 px-4 pt-6 md:px-8">
        <LLMDocsButton data={data} lang={lang} />
        <LanguageToggle currentLang={lang} />
        <ModeToggle />
      </div>

      {/* FIRST SCREEN (above the fold) */}
      <section className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-8 md:py-14">
        <Header data={data} />
        <Chips groups={data.chipGroups} />
        <HireCta data={data} />
      </section>

      {/* DEEP SECTIONS */}
      <div className="mx-auto max-w-4xl space-y-14 px-4 pb-16 md:space-y-20 md:px-8 md:pb-24">
        {/* 1. Production AI */}
        <ProductionAI data={data} lang={lang} />

        {/* 2. Open Source */}
        <OpenSource data={data} lang={lang} />

        {/* 3. Full Tech Stack */}
        <Skills data={data} lang={lang} />

        {/* 4. Experience */}
        <Experience data={data} lang={lang} />

        {/* 5. Portfolio */}
        <Portfolio data={data} lang={lang} />

        {/* 6. Education */}
        <Education data={data} lang={lang} />

        {/* 7. Content */}
        <ContentGrid data={data} lang={lang} />

        {/* 8. Final Hire CTA */}
        <HireCta data={data} />
      </div>

      <footer className="mx-auto max-w-4xl border-t border-border px-4 py-8 text-center text-sm text-muted-foreground md:px-8">
        <p>&copy; {new Date().getFullYear()} {data.name}</p>
        <p className="mt-1 text-xs">
          {lang === "en" ? "English: Intermediate" : "Английский: Средний"}
        </p>
      </footer>
    </main>
  );
}
```

Note: the old 2-column sidebar layout is gone. The page is now a single vertical column with max-width `max-w-4xl`. About and VideoBlock components are dropped from the public page (the pitch in Header replaces About; VideoBlock content is in ContentGrid). If you want About preserved, re-add it as a small section between Portfolio and Education.

- [ ] **Step 18.2: Verify all referenced components exist**

Confirm imports resolve:
- `Header` (modified Task 17)
- `Chips` (created Task 9)
- `HireCta` (created Task 10)
- `ProductionAI` (created Task 11)
- `OpenSource` (created Task 12)
- `Skills` (modified Task 14)
- `Experience` (modified Task 16)
- `Portfolio` (modified Task 15)
- `Education` (unchanged)
- `ContentGrid` (created Task 13)

- [ ] **Step 18.3: Typecheck + Lint + Full Visual**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

Visual at `localhost:3000/ru/minasarkisyan`:
1. Top: language + theme toggles
2. First screen: Name, role, roleSub, location, pitch paragraph, 4 metrics, chip groups (5 categories), Hire CTA box with 3 buttons (Telegram / Calendar / Email)
3. Production AI — 6 achievements in 2-col grid
4. Open Source — 1+ MCP card with badges and links
5. Skills — categorized chip groups with production/touch distinction
6. Experience — timeline with AI markers on Skolkovo and MPSTATS
7. Portfolio — 9 cards with AI/AI-adjacent tags where applicable
8. Education — unchanged
9. Content — 4 link cards in grid
10. Final Hire CTA — repeated
11. Footer

`localhost:3000/en/minasarkisyan`: mirror with EN copy.

- [ ] **Step 18.4: Commit**

```bash
git add app/[lang]/minasarkisyan/page.tsx
git commit -m "feat(cv): rewrite CV page with two-layer structure and 8 deep sections"
```

---

### Task 19: Final review + production build check

- [ ] **Step 19.1: Mobile responsiveness check**

In browser devtools, set viewport to 375px wide. Navigate to `/ru/minasarkisyan` and scroll top to bottom. Check:
- First-screen pitch wraps cleanly, metrics row reflows
- Chips don't overflow horizontally
- HireCta buttons stack vertically on narrow screen
- Production AI cards stack to 1 column
- Open Source card readable
- Skills chip groups readable
- Experience entries don't break

Fix any clipping or overflow with `flex-wrap` / responsive padding adjustments.

- [ ] **Step 19.2: SEO surface verification**

In browser view-source at `/ru/minasarkisyan`:
- `<title>` reads new title
- `<meta name="description">` reads new description
- JSON-LD `<script type="application/ld+json">` contains expanded `knowsAbout`
- All chips and AI keywords appear in rendered HTML (so Google crawler indexes them)

Run: `curl -s http://localhost:3000/ru/minasarkisyan | grep -i "MCP\|RAG\|FastAPI\|Python"`
Expected: multiple matches confirming JD-fit terms are in the page body.

- [ ] **Step 19.3: Production build**

Run: `npm run build`
Expected: builds successfully. Any SSR/hydration issues with new components surface here.

- [ ] **Step 19.4: Reconciliation flag for npm metric**

The `pitch` and `metrics` claim «3 MCP-сервера на npm». Current `openSource` array contains only 1 entry (`timeweb-mcp-server`).

This is a **publication-blocking inconsistency**.

Resolve before merging:
- Option A: Reduce claim from «3» to «1» in `pitch` and `metrics` until pet-projects (Plan 3) ship more MCP servers.
- Option B: Verify with Минас if 2 more MCP servers exist publicly under any handle (`npmjs.com/~webkoth`, `npmjs.com/~abnorsky`, etc.) and add them to `openSource`.
- Option C: Defer CV publication until pet-projects Task «4th MCP server» (Plan 3) ships at least 2 more MCP packages.

Recommendation: **Option A or C**. Don't publish with unverified claims (anti-заглушка principle — see Plan 3, Task 0.1).

- [ ] **Step 19.5: Update changelog**

If `README.md` has a changelog, add:

```md
## 2026-05-20 — CV redesign (/[lang]/minasarkisyan)

- Two-layer structure: above-the-fold pitch + 8 deep sections
- New sections: Production AI, Open Source / MCP, Content & Channels, Hire CTA (x2)
- Skills restructured: categorized chips with production/touch maturity (removed 0-100 bars)
- AI tags on portfolio cards; AI markers on relevant experience entries
- SEO updates: title, meta description, keywords, expanded JSON-LD knowsAbout
- Layout: single-column vertical flow (no more sidebar)
```

- [ ] **Step 19.6: Final commit**

```bash
git add README.md
git commit -m "docs: changelog entry for CV redesign"
```

---

## Out of Scope

- **«3 MCP servers on npm» reconciliation** — flagged in Task 19.4, requires either content adjustment or Pet-projects Plan 3 completion. Do not auto-resolve in this plan.
- **Video block on CV** — old `VideoBlock` component is dropped; YouTube link now lives in `ContentGrid`. If a richer video embed is desired, do it as a separate task.
- **About section** — old `About` component is dropped because `pitch` (in Header) covers the same surface. If you want a longer narrative About below Portfolio, re-add manually.
- **A/B testing of two-layer vs single-flow** — not in scope; the two-layer structure was locked in grilling session.
- **Per-language hostname (e.g. cv.webkoth.com)** — keep current `/ru/` and `/en/` URL structure.

## Self-Review Notes

- All locked CV decisions covered: Подход В (two-layer), no progress bars, SEO public, first-screen with chips + CTA, 8 deep sections, new components (production-ai, open-source, content-grid, hire-cta).
- `CVData` type extended cleanly; all existing fields preserved or evolved.
- Mobile responsiveness called out explicitly in Task 19.1.
- One known inconsistency flagged for resolution before publication (npm MCP count).
- Each task isolates one concern → one commit. Total ~19 tasks, ~19 commits.
