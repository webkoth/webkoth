# Landing Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite webkoth client-facing landing page (`/[lang]`) to implement audience-segmented offering (founder / SMB / agency), update Hero positioning, restructure pricing to 3 segmented cards, redesign roadmap as zigzag-timeline, and add a new Tech Stack section.

**Architecture:** All copy lives in `components/landing/copy-i18n.ts` (Russian + English mirrors). Section components in `components/landing/*.tsx` (no shared state, each section reads from `copy` const). Page composition in `app/[lang]/page.tsx`. New blocks (Tech Stack) added as new components; existing blocks edited in-place. The Roadmap component is fully replaced with a new zigzag-timeline implementation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, framer-motion, shadcn/ui, base-ui, lucide-react, mermaid.

**Verification model:** No test framework in repo. Each task ends with `npm run typecheck` → `npm run lint` → visual verification at `localhost:3000/ru` (and `/en` for copy changes). Commit after each task.

---

## Pre-flight

- [ ] **Step 0.1: Ensure dev server can start**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000, opening `/ru` shows current landing without errors. Leave running in a separate terminal for visual verification throughout.

- [ ] **Step 0.2: Confirm current branch**

Run: `git status && git branch --show-current`
Expected: clean working tree on a working branch (e.g. `main` or feature branch). If branch is `main`, optionally create `git checkout -b feat/landing-rewrite` before starting.

---

### Task 1: Update Hero copy (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (RU hero block, EN hero block)

- [ ] **Step 1.1: Replace RU hero block**

Find in `components/landing/copy-i18n.ts` (around lines 6-18, inside `ru:`):

```ts
    hero: {
      h1: "Внедряю ИИ в продукты",
      sub: "От идеи до production. Один человек, полный цикл.",
      specs: ["RAG", "LLM-агенты", "MCP", "multi-provider cascade"],
      ctaPrimary: "Заказать аудит за 80 000 ₽",
      ctaSecondary: "Обсудить проект",
      metrics: [
        { value: 9, suffix: "+", label: "лет fullstack" },
        { value: 2.5, suffix: "", label: "года production AI" },
        { value: 3, suffix: "", label: "MCP-сервера на npm" },
        { value: 5, suffix: "+", label: "продуктов в проде" },
      ],
    },
```

Replace with:

```ts
    hero: {
      h1: "Production AI в вашем продукте — за дни, не за кварталы.",
      sub: "AI-агенты, RAG, MCP на готовом стеке. Стартапу — MVP за неделю. SMB — production-каскад. Агентству — MCP-разработка whitelabel. Прямой контакт с разработчиком.",
      specs: ["RAG", "LLM-агенты", "MCP", "multi-provider cascade"],
      ctaPrimary: "Заказать аудит",
      ctaSecondary: "Обсудить проект",
      metrics: [
        { value: 9, suffix: "+", label: "лет fullstack" },
        { value: 2.5, suffix: "", label: "года production AI" },
        { value: 3, suffix: "", label: "MCP-сервера на npm" },
        { value: 5, suffix: "+", label: "продуктов в проде" },
      ],
    },
```

Note: removed the "за 80 000 ₽" suffix from `ctaPrimary` — price now lives only in pricing block.

- [ ] **Step 1.2: Replace EN hero block**

Find in same file (around lines 165-177, inside `en:`):

```ts
    hero: {
      h1: "I ship AI into products",
      sub: "From idea to production. One person, end-to-end.",
      specs: ["RAG", "LLM agents", "MCP", "multi-provider cascade"],
      ctaPrimary: "Get an audit · $1,000",
      ctaSecondary: "Discuss a project",
      metrics: [
        { value: 9, suffix: "+", label: "yrs fullstack" },
        { value: 2.5, suffix: "", label: "yrs production AI" },
        { value: 3, suffix: "", label: "npm MCP servers" },
        { value: 5, suffix: "+", label: "products live" },
      ],
    },
```

Replace with:

```ts
    hero: {
      h1: "Production AI in your product — in days, not quarters.",
      sub: "AI agents, RAG, MCP on a ready stack. Founders — MVP in a week. SMB — production cascade. Agencies — whitelabel MCP development. Direct contact with the developer.",
      specs: ["RAG", "LLM agents", "MCP", "multi-provider cascade"],
      ctaPrimary: "Get an audit",
      ctaSecondary: "Discuss a project",
      metrics: [
        { value: 9, suffix: "+", label: "yrs fullstack" },
        { value: 2.5, suffix: "", label: "yrs production AI" },
        { value: 3, suffix: "", label: "npm MCP servers" },
        { value: 5, suffix: "+", label: "products live" },
      ],
    },
```

- [ ] **Step 1.3: Verify Hero component reads new copy without prop changes**

Open `components/landing/hero.tsx` and confirm it uses `copy[lang].hero.h1`, `.sub`, `.ctaPrimary`, `.ctaSecondary` — no schema change. If `hero.tsx` has any hardcoded "80 000 ₽" string in the CTA fallback, remove it.

- [ ] **Step 1.4: Typecheck + Lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 1.5: Visual verification**

In browser at `http://localhost:3000/ru`:
- H1 reads: «Production AI в вашем продукте — за дни, не за кварталы.»
- Sub reads the 3-line segmented promise ending with «Прямой контакт с разработчиком.»
- Primary CTA reads «Заказать аудит» (no price suffix)
- Metrics row unchanged (9+ / 2.5 / 3 / 5+)

In browser at `http://localhost:3000/en`:
- H1 reads: «Production AI in your product — in days, not quarters.»
- Sub reads the EN segmented promise.
- Primary CTA reads «Get an audit».

- [ ] **Step 1.6: Commit**

```bash
git add components/landing/copy-i18n.ts
git commit -m "feat(landing): rewrite hero copy with segmented promise (B/A/E)"
```

---

### Task 2: Restructure pricing.packages to 3 segmented cards (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (RU pricing block, EN pricing block)
- Modify: `components/landing/process-pricing.tsx` (if it consumes specific keys; verify after copy change)

- [ ] **Step 2.1: Replace RU pricing block**

Find in `components/landing/copy-i18n.ts` (around lines 40-62, inside `ru:`):

```ts
    pricing: {
      title: "Как мы работаем",
      packages: {
        audit: {
          name: "Аудит",
          pill: "Старт за 1 день",
          items: ["Созвон 1-2 ч", "Roadmap внедрения", "Оценка MVP", "Рекомендация стека"],
          cta: "Заказать",
        },
        mvp: {
          name: "MVP",
          pill: "Самое популярное",
          items: ["Архитектура + стек", "Реализация одного сценария", "Передача в прод", "Документация"],
          cta: "Обсудить",
        },
        support: {
          name: "Поддержка",
          pill: "5+ продуктов на support",
          items: ["Развитие функций", "Эксплуатация", "Эволюция моделей", "SLA по согласованию"],
          cta: "Обсудить",
        },
      },
    },
```

Replace with:

```ts
    pricing: {
      title: "Пакеты",
      subtitle: "Под аудиторию. Audit (1 день, 80 000 ₽) — обязательный шаг для Production AI Integration, опционален для AI-MVP Sprint.",
      packages: {
        sprint: {
          name: "AI-MVP Sprint",
          audience: "Фаундеру",
          pill: "150 000 ₽ · 7 дней",
          items: [
            "1 AI-сценарий в проде из 3 шаблонов",
            "RAG-чат-бот / агент с tool calling / AI-фича в существующее приложение",
            "Готовый стек: Next.js + Hono + Vercel AI SDK + Claude/Gemini fallback",
            "Handover: код, доки, доступы",
          ],
          excludes: ["Дизайн UI с нуля", "Поддержка после релиза", "Fine-tuning моделей", "Оплата токенов LLM"],
          cta: "Обсудить Sprint",
        },
        integration: {
          name: "Production AI Integration",
          audience: "SMB / mid-market",
          pill: "от 600 000 ₽ · 2-4 недели · +1 мес free support",
          items: [
            "Адаптация к вашему стеку (PHP/Laravel, Python/FastAPI, Node, Go)",
            "Multi-provider fallback (без вендор-лока)",
            "Observability: Sentry / pino / структурированные логи",
            "Аудит-лог промптов и ответов",
            "Handover-документ + 1 месяц minimal support бесплатно",
          ],
          excludes: ["Дообучение моделей", "Дизайн UI с нуля", "Оплата токенов LLM", "Перевод продукта на новый стек"],
          cta: "Заказать аудит",
        },
        subcontract: {
          name: "Subcontract / Whitelabel",
          audience: "Агентству",
          pill: "от 120 000 ₽ · 2-3 недели · ad-hoc 3 500 ₽/час",
          items: [
            "1 MCP-сервер под клиентский API — от 120 000 ₽ за 2 недели",
            "RAG / агент / AI-фича — от 150 000 ₽ за 2-3 недели",
            "Ad-hoc консалтинг по AI / MCP — от 3 500 ₽/час",
            "Whitelabel default + опционально 'AI engineer on team'",
            "NDA до начала. Коммуникация через вас.",
          ],
          excludes: ["Прямая работа с конечным клиентом без согласования", "Минимум на проект — 20 часов"],
          cta: "Обсудить сабконтракт",
        },
      },
    },
```

- [ ] **Step 2.2: Replace EN pricing block**

Find (around lines 199-205, inside `en:`):

```ts
    pricing: {
      title: "How we work",
      packages: {
        audit: { name: "Audit", pill: "Start in 1 day", items: ["1-2h call", "Implementation roadmap", "MVP estimate", "Stack recommendation"], cta: "Order" },
        mvp: { name: "MVP", pill: "Most popular", items: ["Architecture + stack", "Single-scenario delivery", "Handover to prod", "Documentation"], cta: "Discuss" },
        support: { name: "Support", pill: "5+ products on support", items: ["Feature development", "Operations", "Model evolution", "SLA on agreement"], cta: "Discuss" },
      },
    },
```

Replace with:

```ts
    pricing: {
      title: "Packages",
      subtitle: "By audience. Audit (1 day, $1,000) — required for Production AI Integration, optional for AI-MVP Sprint.",
      packages: {
        sprint: {
          name: "AI-MVP Sprint",
          audience: "For founders",
          pill: "$1,500 · 7 days",
          items: [
            "1 AI scenario in prod from 3 templates",
            "RAG chatbot / tool-calling agent / AI feature in existing app",
            "Ready stack: Next.js + Hono + Vercel AI SDK + Claude/Gemini fallback",
            "Handover: code, docs, access",
          ],
          excludes: ["Custom UI design", "Post-release support", "Model fine-tuning", "LLM token costs"],
          cta: "Discuss Sprint",
        },
        integration: {
          name: "Production AI Integration",
          audience: "For SMB / mid-market",
          pill: "from $6,000 · 2-4 weeks · +1 mo free support",
          items: [
            "Adaptation to your stack (PHP/Laravel, Python/FastAPI, Node, Go)",
            "Multi-provider fallback (no vendor lock-in)",
            "Observability: Sentry / pino / structured logs",
            "Prompt + response audit log",
            "Handover doc + 1 month free minimal support",
          ],
          excludes: ["Model fine-tuning", "Custom UI design", "LLM token costs", "Migration to new stack"],
          cta: "Order an audit",
        },
        subcontract: {
          name: "Subcontract / Whitelabel",
          audience: "For agencies",
          pill: "from $1,200 · 2-3 weeks · ad-hoc $35/h",
          items: [
            "1 MCP server for client API — from $1,200 in 2 weeks",
            "RAG / agent / AI feature — from $1,500 in 2-3 weeks",
            "Ad-hoc consulting on AI / MCP — from $35/h",
            "Whitelabel default + optional 'AI engineer on team'",
            "NDA before start. Communication through you.",
          ],
          excludes: ["Direct work with end-client without approval", "Minimum 20h per project"],
          cta: "Discuss subcontract",
        },
      },
    },
```

- [ ] **Step 2.3: Update process-pricing.tsx to consume new keys**

Open `components/landing/process-pricing.tsx`. Identify the rendering of `packages.audit/mvp/support` and replace iteration with `packages.sprint/integration/subcontract`.

Replace any references:
- `packages.audit` → `packages.sprint`
- `packages.mvp` → `packages.integration`
- `packages.support` → `packages.subcontract`

Add rendering for new optional fields: `audience` (small caption above name) and `excludes` (if present, render as «Не входит:» list below `items`).

- [ ] **Step 2.4: Typecheck + Lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors. If TS errors complain about missing `audience`/`excludes` keys on `pricing.packages` shape, ensure the consumer reads optionally (`pkg.audience ?? null`).

- [ ] **Step 2.5: Visual verification**

At `localhost:3000/ru`, scroll to pricing section:
- 3 cards visible (not 4): «AI-MVP Sprint», «Production AI Integration», «Subcontract / Whitelabel»
- Each card has an audience caption («Фаундеру» / «SMB / mid-market» / «Агентству»)
- Pill chips show new prices: «150 000 ₽ · 7 дней» / «от 600 000 ₽ · 2-4 недели...» / «от 120 000 ₽ · 2-3 недели...»
- Items + excludes render correctly per card

At `localhost:3000/en`: same with EN copy.

- [ ] **Step 2.6: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/process-pricing.tsx
git commit -m "feat(landing): restructure pricing to 3 audience-segmented cards (B/A/E)"
```

---

### Task 3: Update roadmap content (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (roadmap block in both langs)

- [ ] **Step 3.1: Replace RU roadmap block**

Find in `components/landing/copy-i18n.ts` (around lines 30-39):

```ts
    roadmap: {
      title: "Как происходит работа",
      sub: "Прозрачный процесс — без сюрпризов и аккаунт-менеджеров.",
      steps: [
        { num: "01", title: "Discovery", time: "Бесплатно · 15 мин", body: "Короткий созвон: что у вас за задача, какие данные, ожидания по срокам и метрикам. Если не совпадаем — сразу скажу." },
        { num: "02", title: "Аудит", time: "1 день · 80 000 ₽", body: "Глубокий разбор задачи, выбор стека и моделей, roadmap и оценка MVP. На выходе — документ и конкретный следующий шаг." },
        { num: "03", title: "MVP", time: "1 неделя · от 600 000 ₽", body: "Архитектура → реализация одного AI-сценария → передача в прод с документацией. Один контракт, без накладных." },
        { num: "04", title: "Поддержка", time: "От 200k ₽/мес · опционально", body: "Развитие функций, эксплуатация, эволюция промптов и моделей. SLA по согласованию." },
      ],
    },
```

Replace with:

```ts
    roadmap: {
      eyebrow: "КАК МЫ РАБОТАЕМ",
      title: "От идеи до прода — за 4 шага",
      sub: "Прозрачный процесс — без сюрпризов и аккаунт-менеджеров.",
      steps: [
        {
          num: "01",
          title: "Discovery",
          body: "Короткий созвон: что у вас за задача, какие данные, ожидания по срокам и метрикам. Если не совпадаем — сразу скажу.",
          pill: "БЕСПЛАТНО · 15 МИНУТ",
        },
        {
          num: "02",
          title: "Аудит",
          body: "Глубокий разбор задачи, выбор стека и моделей, roadmap и оценка MVP. На выходе — документ и конкретный следующий шаг.",
          pill: "1 ДЕНЬ · 80 000 ₽ · ОБЯЗАТЕЛЕН ДЛЯ A · ОПЦИОНАЛЕН ДЛЯ B",
        },
        {
          num: "03",
          title: "MVP",
          body: "Два формата под аудиторию: AI-MVP Sprint для фаундера (1 сценарий из 3 шаблонов); Production AI Integration для SMB (интеграция в ваш стек, multi-provider cascade, observability).",
          pill: "SPRINT 7 ДНЕЙ · INTEGRATION 2-4 НЕДЕЛИ",
        },
        {
          num: "04",
          title: "Передача + страховка",
          body: "Handover-документ, исходники, доступы. Первый месяц minimal support — бесплатно: бакфиксы, мониторинг, мелкие доработки. Дальше — по договорённости.",
          pill: "+ 1 МЕСЯЦ FREE MINIMAL SUPPORT",
        },
      ],
    },
```

- [ ] **Step 3.2: Replace EN roadmap block**

Find (around lines 189-198):

```ts
    roadmap: {
      title: "How the work happens",
      sub: "A transparent process — no surprises, no account managers.",
      steps: [
        { num: "01", title: "Discovery", time: "Free · 15 min", body: "Short call: your task, your data, expectations on timing and metrics. If we don't fit — I'll say so on the spot." },
        { num: "02", title: "Audit", time: "1 day · $1,000", body: "Deep dive into the task, stack and model selection, roadmap, MVP estimate. Output: a document and a concrete next step." },
        { num: "03", title: "MVP", time: "1 week · from $7,500", body: "Architecture → implementation of one AI scenario → handover to prod with documentation. One contract, zero overhead." },
        { num: "04", title: "Support", time: "From $2,500/mo · optional", body: "Feature development, operations, prompt and model evolution. SLA on agreement." },
      ],
    },
```

Replace with:

```ts
    roadmap: {
      eyebrow: "HOW WE WORK",
      title: "From idea to prod in 4 steps",
      sub: "A transparent process — no surprises, no account managers.",
      steps: [
        {
          num: "01",
          title: "Discovery",
          body: "Short call: your task, your data, expectations on timing and metrics. If we don't fit — I'll say so on the spot.",
          pill: "FREE · 15 MINUTES",
        },
        {
          num: "02",
          title: "Audit",
          body: "Deep dive into the task, stack and model selection, roadmap, MVP estimate. Output: a document and a concrete next step.",
          pill: "1 DAY · $1,000 · REQUIRED FOR A · OPTIONAL FOR B",
        },
        {
          num: "03",
          title: "MVP",
          body: "Two formats by audience: AI-MVP Sprint for founders (1 scenario from 3 templates); Production AI Integration for SMB (integration into your stack, multi-provider cascade, observability).",
          pill: "SPRINT 7 DAYS · INTEGRATION 2-4 WEEKS",
        },
        {
          num: "04",
          title: "Handover + safety net",
          body: "Handover doc, source code, access. First month of minimal support — free: bugfixes, monitoring, small refinements. After — by agreement.",
          pill: "+ 1 MONTH FREE MINIMAL SUPPORT",
        },
      ],
    },
```

- [ ] **Step 3.3: Verify schema compatibility**

Note: schema changed (`time` → `pill`; added `eyebrow`). The Roadmap component will be fully replaced in Task 14 (zigzag-timeline). For now, ensure existing component does not crash. If existing code reads `step.time`, temporarily render `step.pill` in its place.

Open `components/landing/process-pricing.tsx`. Find any reference to `roadmap.steps[i].time` and replace with `roadmap.steps[i].pill`. Find `roadmap.title` — confirm it still reads.

- [ ] **Step 3.4: Typecheck + Lint + Visual smoke**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

Visual: `localhost:3000/ru` — scroll to roadmap. 4 steps render without crash. Pills show new uppercase texts. (Full zigzag redesign comes in Task 14; for now the visual may still be the old layout.)

- [ ] **Step 3.5: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/process-pricing.tsx
git commit -m "feat(landing): rewrite roadmap content for new 4-step process"
```

---

### Task 4: Rewrite TaskGrid items as outcome-vignettes (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (tasks block in both langs)
- Modify: `components/landing/task-grid.tsx` (rendering of `sub` to support multi-line)

- [ ] **Step 4.1: Replace RU tasks block**

Find in `components/landing/copy-i18n.ts` (around lines 19-29):

```ts
    tasks: {
      title: "Какие задачи я закрываю",
      items: [
        { icon: "search", title: "RAG", sub: "Поиск по вашим документам и базе знаний", anchor: "#case-hubmarket" },
        { icon: "bot", title: "LLM-агенты", sub: "Tool use, оркестрация, workflow с автоматическими действиями", anchor: "#case-mcp" },
        { icon: "plug", title: "MCP", sub: "Подключаю ваш API/сервис к Claude и другим агентам", anchor: "#case-mcp" },
        { icon: "scale", title: "Multi-provider cascade", sub: "Claude → Gemini → Groq с фолбэком, без вендор-лока", anchor: "#case-hubmarket" },
        { icon: "doc", title: "Документ-пайплайны", sub: "OCR → LLM → структурированные данные", anchor: "#case-skolkovo" },
        { icon: "sparkles", title: "AI-фичи в существующий продукт", sub: "Без переписывания, аккуратная интеграция", anchor: "#case-landing" },
      ],
    },
```

Replace with:

```ts
    tasks: {
      title: "Какие задачи я закрываю",
      items: [
        {
          icon: "search",
          title: "RAG",
          trigger: "Саппорт спрашивает «как обработать случай X»",
          action: "AI находит ответ в 500-страничном регламенте, цитирует пункт",
          outcome: "30 секунд вместо 15 минут",
          anchor: "#case-hubmarket",
        },
        {
          icon: "bot",
          title: "LLM-агенты",
          trigger: "Клиент пишет «где мой возврат?»",
          action: "Агент дёргает CRM и платёжку, отвечает по статусу",
          outcome: "Закрыт без человека, эскалация только в спорных кейсах",
          anchor: "#case-mcp",
        },
        {
          icon: "plug",
          title: "MCP",
          trigger: "Разработчик хочет деплоить из Claude Code",
          action: "MCP-сервер открывает доступ к вашему CI/CD",
          outcome: "«Задеплой v1.2.3 на staging» — готово, без терминала",
          anchor: "#case-mcp",
        },
        {
          icon: "scale",
          title: "Multi-provider cascade",
          trigger: "Anthropic упал в 14:32",
          action: "Автоматический фолбэк на Gemini",
          outcome: "0 downtime LLM с момента запуска HubMarket",
          anchor: "#case-hubmarket",
        },
        {
          icon: "doc",
          title: "Документ-пайплайны",
          trigger: "Студент загрузил PDF-документ",
          action: "OCR извлёк текст, LLM разобрал поля",
          outcome: "Запись в БД, привязка к программе — без ручного ввода (в проде в Сколково)",
          anchor: "#case-skolkovo",
        },
        {
          icon: "sparkles",
          title: "AI-фичи в существующий продукт",
          trigger: "У вас Vue 3 + Laravel",
          action: "Встроенный AI-виджет хука к существующему API",
          outcome: "Релиз в пятницу, ни строчки переписанного фронта",
          anchor: "#case-landing",
        },
      ],
    },
```

- [ ] **Step 4.2: Replace EN tasks block**

Find (around lines 178-188) and replace with mirror EN copy:

```ts
    tasks: {
      title: "What I solve",
      items: [
        {
          icon: "search",
          title: "RAG",
          trigger: "Support asks «how do we handle case X»",
          action: "AI finds the answer in a 500-page playbook, cites the section",
          outcome: "30 seconds instead of 15 minutes",
          anchor: "#case-hubmarket",
        },
        {
          icon: "bot",
          title: "LLM agents",
          trigger: "Customer asks «where is my refund?»",
          action: "Agent calls CRM and payment API, answers with status",
          outcome: "Closed without a human, escalation only on disputes",
          anchor: "#case-mcp",
        },
        {
          icon: "plug",
          title: "MCP",
          trigger: "Your dev wants to deploy from Claude Code",
          action: "MCP server exposes your CI/CD",
          outcome: "«Deploy v1.2.3 to staging» — done, no terminal",
          anchor: "#case-mcp",
        },
        {
          icon: "scale",
          title: "Multi-provider cascade",
          trigger: "Anthropic went down at 14:32",
          action: "Automatic fallback to Gemini",
          outcome: "0 LLM downtime since HubMarket launch",
          anchor: "#case-hubmarket",
        },
        {
          icon: "doc",
          title: "Document pipelines",
          trigger: "Student uploads a PDF document",
          action: "OCR extracts text, LLM parses fields",
          outcome: "DB record + program linkage — no manual entry (in prod at Skolkovo)",
          anchor: "#case-skolkovo",
        },
        {
          icon: "sparkles",
          title: "AI features in existing product",
          trigger: "You have Vue 3 + Laravel",
          action: "AI widget hooks into your existing API",
          outcome: "Release Friday, zero frontend rewrites",
          anchor: "#case-landing",
        },
      ],
    },
```

- [ ] **Step 4.3: Update task-grid.tsx to render new fields**

Open `components/landing/task-grid.tsx`. Find the iteration over `tasks.items` (likely something like `tasks.items.map(item => ...)`) and replace the rendering of `item.sub` with three lines for `item.trigger`, `item.action`, `item.outcome`.

Suggested new render structure for each card body:

```tsx
<div className="space-y-1 text-sm text-muted-foreground">
  <div className="leading-snug">{item.trigger}</div>
  <div className="leading-snug">→ {item.action}</div>
  <div className="leading-snug font-medium text-foreground">→ {item.outcome}</div>
</div>
```

The `outcome` line is visually emphasized (font-medium, text-foreground) — this is the number/result chaseai-style.

- [ ] **Step 4.4: Typecheck + Lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors. If TS complains that `item.sub` is missing, you have leftover code reading the old field. Remove all `.sub` references in `task-grid.tsx`.

- [ ] **Step 4.5: Visual verification**

`localhost:3000/ru` → scroll to «Какие задачи я закрываю»:
- 6 cards. Each has icon + title + 3 lines (trigger → action → outcome).
- Outcome line is visually emphasized (bolder / darker).
- Anchors still work (clicking a card scrolls to the referenced case).

`localhost:3000/en`: mirror.

- [ ] **Step 4.6: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/task-grid.tsx
git commit -m "feat(landing): rewrite TaskGrid items as trigger→action→outcome vignettes"
```

---

### Task 5: Update featured HubMarket — add 4th metric (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (featured block in both langs)

- [ ] **Step 5.1: Add 4th metric to RU featured**

Find in `components/landing/copy-i18n.ts` (around lines 63-72):

```ts
    featured: {
      title: "Кейс: HubMarket",
      sub: "AI-SaaS для селлеров маркетплейсов · Founder + sole developer · production",
      metrics: [
        "3 marketplaces (WB, Ozon, Yandex Market)",
        "0 LLM downtime через cascade",
        "End-to-end один человек",
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "ЮKassa", "Cloudflare Workers"],
    },
```

Add 4th metric:

```ts
    featured: {
      title: "Кейс: HubMarket",
      sub: "AI-SaaS для селлеров маркетплейсов · Founder + sole developer · production",
      metrics: [
        "3 marketplaces (WB, Ozon, Yandex Market)",
        "0 LLM downtime через cascade",
        "End-to-end один человек",
        "Цикл «запрос фичи → прод»: 3-4 дня",
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "ЮKassa", "Cloudflare Workers"],
    },
```

- [ ] **Step 5.2: Add 4th metric to EN featured**

Find (around lines 207-212):

```ts
    featured: {
      title: "Case: HubMarket",
      sub: "AI-SaaS for marketplace sellers · Founder + sole developer · production",
      metrics: ["3 marketplaces (WB, Ozon, Yandex Market)", "0 LLM downtime via cascade", "End-to-end, one person"],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "YooKassa", "Cloudflare Workers"],
    },
```

Replace with:

```ts
    featured: {
      title: "Case: HubMarket",
      sub: "AI-SaaS for marketplace sellers · Founder + sole developer · production",
      metrics: [
        "3 marketplaces (WB, Ozon, Yandex Market)",
        "0 LLM downtime via cascade",
        "End-to-end, one person",
        "Feature request → prod cycle: 3-4 days",
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "YooKassa", "Cloudflare Workers"],
    },
```

- [ ] **Step 5.3: Verify featured-case.tsx renders all metrics**

Open `components/landing/featured-case.tsx`. Confirm it maps `featured.metrics.map(...)` — if it hardcodes 3 metric slots, expand to 4.

- [ ] **Step 5.4: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru` and `/en`: featured HubMarket card shows 4 metric chips.

- [ ] **Step 5.5: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/featured-case.tsx
git commit -m "feat(landing): add 4th metric to HubMarket featured (3-4 day request→prod cycle)"
```

---

### Task 6: Add new case "case-hubmarket-stocksync" + audience tags to all 7 cases (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (cases.items in both langs + type signature)
- Modify: `components/landing/case-card.tsx` (render audience tag)
- Modify: `components/landing/case-grid.tsx` (no changes likely, verify)

- [ ] **Step 6.1: Update cases type signature in RU block to include `audienceTag`**

In `components/landing/copy-i18n.ts`, find the `as ReadonlyArray<{...}>` cast on `cases.items` (RU, around lines 83-89):

```ts
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
```

Replace with:

```ts
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        audienceTag: "founder" | "smb" | "agency";
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
```

- [ ] **Step 6.2: Add audienceTag to all RU cases + insert new stocksync case**

Replace the entire `cases.items` array contents in RU (the items inside `items: [...]` around lines 76-82):

```ts
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"] },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"] },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" } },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"] },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"] },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"] },
```

Replace with (note: new stocksync case + audienceTag on all):

```ts
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], audienceTag: "smb" },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], audienceTag: "founder" },
        { id: "case-hubmarket-stocksync", title: "Маркетплейс-синхронизация остатков", sub: "HubMarket · запрос фаундера → прод за 3 дня", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], audienceTag: "founder" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, audienceTag: "agency" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"], audienceTag: "smb" },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"], audienceTag: "smb" },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], audienceTag: "smb" },
```

- [ ] **Step 6.3: Mirror updates in EN cases block**

In the EN block (around lines 216-222), apply the same type signature change and the same audienceTag values to each case + insert new stocksync case.

Replace items contents:

```ts
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], audienceTag: "smb" },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], audienceTag: "founder" },
        { id: "case-hubmarket-stocksync", title: "Marketplace stock sync", sub: "HubMarket · founder request → prod in 3 days", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], audienceTag: "founder" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, audienceTag: "agency" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"], audienceTag: "smb" },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"], audienceTag: "smb" },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], audienceTag: "smb" },
```

Apply same type signature update to EN cast.

- [ ] **Step 6.4: Add audience-tag label map for i18n**

In RU block, find `cases:` block and add a `tagLabels` sibling field:

```ts
    cases: {
      title: "Ещё кейсы",
      moreLink: "Полное портфолио и опыт → /minasarkisyan",
      tagLabels: {
        founder: "Для фаундера",
        smb: "Для SMB",
        agency: "Для агентств",
      },
      items: [
        ...
      ],
    },
```

In EN block, the same:

```ts
    cases: {
      title: "More cases",
      moreLink: "Full portfolio & background → /minasarkisyan",
      tagLabels: {
        founder: "For founders",
        smb: "For SMB",
        agency: "For agencies",
      },
      items: [
        ...
      ],
    },
```

- [ ] **Step 6.5: Render audience tag chip in case-card.tsx**

Open `components/landing/case-card.tsx`. Locate the card body. Add a chip in the top-right corner reading the tag label.

Add to the imports if needed:

```tsx
import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";
```

Find the props interface — add `audienceTag` field. Add `lang` prop (or read from a context if already provided).

Inside the card JSX, add at top-right:

```tsx
{audienceTag ? (
  <span className="absolute right-3 top-3 rounded-full bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
    {copy[lang].cases.tagLabels[audienceTag]}
  </span>
) : null}
```

The container card must have `relative` position (`className="relative ..."`).

- [ ] **Step 6.6: Pass audienceTag from case-grid.tsx into case-card.tsx**

Open `components/landing/case-grid.tsx`. Find the `case-card` usage and add `audienceTag={c.audienceTag}` and `lang={lang}` (if not already passed).

- [ ] **Step 6.7: Typecheck + Lint + Visual**

Run: `npm run typecheck && npm run lint`
Expected: no errors. If TS errors complain about `audienceTag` missing on a case item, ensure all 7 items in both RU and EN have it.

Visual `/ru` and `/en`:
- CaseGrid shows 7 cards (was 6, added stocksync).
- Each card has a small chip in top-right with label «Для фаундера» / «Для SMB» / «Для агентств» (or EN equivalents).
- New `case-hubmarket-stocksync` card visible with founder tag.

- [ ] **Step 6.8: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/case-card.tsx components/landing/case-grid.tsx
git commit -m "feat(landing): add audience tags to all cases + new HubMarket stocksync case"
```

---

### Task 7: FAQ — add 4 new questions (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (faq.items in both langs)

- [ ] **Step 7.1: Replace RU faq.items array**

Find in `components/landing/copy-i18n.ts` (around lines 128-137):

```ts
      items: [
        { q: "Как вы успеваете MVP за неделю?", a: "Готовая методология, повторяющиеся паттерны..." },
        { q: "Чем вы отличаетесь от агентства/студии?", a: "Один контакт, нулевые накладные расходы..." },
        ...8 items total...
      ],
```

Insert 4 new items at specified positions. Final RU `items` array:

```ts
      items: [
        { q: "Как вы успеваете MVP за неделю?", a: "Готовая методология, повторяющиеся паттерны (RAG / агент / multi-provider cascade), готовый Next.js + Hono бойлерплейт, AI-tooling (Claude Code) в ежедневной работе. Если задача не укладывается — на аудите честно говорю и предлагаю реалистичный срок." },
        { q: "А если моя AI-задача не вписывается в 3 шаблона AI-MVP Sprint?", a: "Тогда это не Sprint. На бесплатной 15-минутной Discovery скажу прямо: либо реально вписывается с правками — берём Sprint, либо нет — обсуждаем Production AI Integration (2-4 недели). Не натягиваю несовместимое ради чек-листа." },
        { q: "Чем вы отличаетесь от агентства/студии?", a: "Прямой контакт с разработчиком, нулевые накладные расходы, без передачи. Видите код — это мой код. Цены не включают аккаунт-менеджера." },
        { q: "Whitelabel — как это работает на практике?", a: "По умолчанию: код передаётся вам, конечный клиент со мной не контактирует, я не упоминаю проект публично. Опционально по согласованию: указание «AI engineer on team» в публичной части — меняет рамки публичности, но не структуру сделки." },
        { q: "Какие модели используете и почему?", a: "Claude — основной для генерации/агентов. Gemini и Groq — фолбэк и cost-optimization. Yandex GPT — для проектов с требованиями к локализации. Выбор обосновываю на аудите." },
        { q: "Можно ли подключить свою инфру / on-premise?", a: "Да. Self-hosted LLM (Llama/Mistral через Ollama/vLLM), pgvector вместо managed vector DB, развёртывание на ваших серверах. На аудите фиксируем требования." },
        { q: "NDA и безопасность данных?", a: "NDA подписываю до начала аудита. Для чувствительных данных — multi-provider только через self-hosted/EU-инстансы, аудит-лог промптов и ответов." },
        { q: "Кто владеет кодом после релиза?", a: "Всегда вы. Передаю исходники, документацию, доступы. У меня остаётся только право упомянуть проект как кейс — с вашего письменного согласия. NDA подписываю до начала работы." },
        { q: "Сколько параллельных проектов?", a: "Максимум 2 активных. Поддержку не считаю активной, если она не требует постоянной разработки." },
        { q: "Английский?", a: "Intermediate. Письменно — без проблем (включая техдоки). Голосовые встречи на английском — могу, но эффективнее на русском." },
        { q: "Что если задача исследовательская, а не «внедрить готовое»?", a: "Беру, если граница MVP определима. Чистый R&D без целевой метрики — не моё." },
        { q: "Что будет после первого бесплатного месяца minimal support?", a: "Обсуждается индивидуально по факту: либо продолжаю поддержку на согласованных условиях, либо вы забираете её in-house или другому подрядчику. В handover-документе — всё, что нужно для самостоятельной эксплуатации." },
      ],
```

- [ ] **Step 7.2: Replace EN faq.items array**

Find in EN block (around lines 268-277) and apply mirror updates:

```ts
      items: [
        { q: "How do you ship MVP in a week?", a: "Established methodology, repeating patterns (RAG / agent / multi-provider cascade), Next.js + Hono boilerplate, AI-tooling (Claude Code) in daily work. If a task doesn't fit — I say so honestly at the audit and propose a realistic timeline." },
        { q: "What if my AI task doesn't fit one of the 3 Sprint templates?", a: "Then it's not a Sprint. On the free 15-min Discovery I'll say directly: either it fits with tweaks — we take Sprint, or it doesn't — we discuss Production AI Integration (2-4 weeks). I don't force incompatible scope to tick a box." },
        { q: "How are you different from an agency?", a: "Direct contact with the developer, zero overhead, no handoffs. The code you see is my code. Pricing doesn't include an account manager." },
        { q: "Whitelabel — how does it work in practice?", a: "By default: code is delivered to you, end client doesn't contact me, I don't mention the project publicly. Optionally by agreement: «AI engineer on team» mention publicly — changes publicity boundary, not the deal structure." },
        { q: "Which models do you use and why?", a: "Claude is primary for generation/agents. Gemini and Groq — fallback and cost optimization. Yandex GPT — for locale-bound projects. I justify the choice at the audit." },
        { q: "Can you use my infra / on-premise?", a: "Yes. Self-hosted LLM (Llama/Mistral via Ollama/vLLM), pgvector instead of managed vector DB, deployment on your servers. Locked in at the audit." },
        { q: "NDA and data security?", a: "NDA signed before audit. For sensitive data — multi-provider only via self-hosted/EU instances, prompt+response audit log." },
        { q: "Who owns the code after release?", a: "You — always. I hand over the source, docs, and access. I retain only the right to mention the project as a case — with your written consent. NDA before start." },
        { q: "How many parallel projects?", a: "Max 2 active. Support is not 'active' unless it requires ongoing development." },
        { q: "English level?", a: "Intermediate. Written — fine (incl. tech docs). Voice meetings in English — workable, but Russian is more efficient." },
        { q: "Research tasks vs implementation?", a: "I take it if the MVP boundary is definable. Pure R&D without a target metric — not for me." },
        { q: "What happens after the first free month of minimal support?", a: "Discussed individually by the time it ends: either I continue support on agreed terms, or you take it in-house or to another contractor. The handover doc contains everything needed for independent operation." },
      ],
```

- [ ] **Step 7.3: Verify faq.tsx renders the longer list**

Open `components/landing/faq.tsx`. Confirm it iterates `faq.items.map(...)` (no hardcoded length).

- [ ] **Step 7.4: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual `/ru` and `/en`: FAQ section shows 12 items in the listed order.

- [ ] **Step 7.5: Commit**

```bash
git add components/landing/copy-i18n.ts
git commit -m "feat(landing): add 4 FAQ items (sprint-templates / ownership / whitelabel / post-free-month)"
```

---

### Task 8: "Один" cleanup in WhyMe (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (why block in both langs)

- [ ] **Step 8.1: Update RU why block first item**

Find in `components/landing/copy-i18n.ts` (around lines 91-94):

```ts
      items: [
        { title: "Один контракт от идеи до прода", body: "Нет передачи между фронт/бэк/AI/DevOps — это я весь. В HubMarket это уже доказано: Founder + sole dev.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
```

Replace just the first item with:

```ts
      items: [
        { title: "От идеи до прода — без передач", body: "Работает один и тот же человек на всех слоях — фронт, бэк, AI, DevOps. В HubMarket это уже доказано: Founder + sole dev, цикл «запрос → прод» 3-4 дня.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
```

- [ ] **Step 8.2: Update EN why block first item**

Find in EN (around lines 232-235):

```ts
      items: [
        { title: "One contract from idea to prod", body: "No handoffs between front/back/AI/DevOps — that's all me. Proven on HubMarket: Founder + sole dev.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
```

Replace:

```ts
      items: [
        { title: "From idea to prod — no handoffs", body: "The same person works across all layers — front, back, AI, DevOps. Proven on HubMarket: Founder + sole dev, request → prod cycle 3-4 days.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
```

- [ ] **Step 8.3: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru` and `/en`: WhyMe section first card no longer says «Один контракт» — now «От идеи до прода — без передач». Body mentions the 3-4 day cycle as new proof point.

- [ ] **Step 8.4: Commit**

```bash
git add components/landing/copy-i18n.ts
git commit -m "feat(landing): remove «Один» repetition from WhyMe, add HubMarket cycle metric"
```

---

### Task 9: Update Lead-form — package options + budget options + new audience selector (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (form block in both langs)
- Modify: `components/landing/lead-form.tsx` (component logic for new field + progress)

- [ ] **Step 9.1: Update RU form copy**

Find in `components/landing/copy-i18n.ts` (around lines 105-125):

```ts
    form: {
      title: "Заявка на предварительный просчёт",
      fields: {
        name: "Имя",
        contact: "Контакт (Telegram или email)",
        package: "Какой пакет",
        packageOptions: { audit: "Аудит", mvp: "MVP", support: "Поддержка", unsure: "Не уверен" },
        message: "О задаче",
        budget: "Бюджет (необязательно)",
        budgetOptions: { unknown: "Не определён", under500: "до 500k ₽", to2m: "500k–2M ₽", over2m: "2M+ ₽", usd: "USD-эквивалент" },
      },
      submit: "Отправить заявку",
      hint: "Ответ в течение часа",
      success: { title: "Спасибо, заявка получена", body: "Я уже вижу её в Telegram. Свяжусь в течение суток." },
      error: { title: "Не удалось отправить", body: "Напишите напрямую в Telegram: @abnorsky" },
      altChannels: {
        intro: "Или быстрее — забронируйте 15-мин Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
```

Replace with:

```ts
    form: {
      title: "Заявка на предварительный просчёт",
      altChannelsTop: "Если короче — забронируйте 15-мин Discovery:",
      fields: {
        audience: "Вы…",
        audienceOptions: {
          founder: "Фаундер / стартап",
          smb: "Tech lead / CTO в SMB",
          agency: "Агентство / студия",
          other: "Другое",
        },
        name: "Имя",
        contact: "Контакт (Telegram или email)",
        package: "Какой пакет интересует?",
        packageOptions: {
          sprint: "AI-MVP Sprint (7 дней)",
          integration: "Production AI Integration (2-4 недели)",
          subcontract: "Subcontract / Whitelabel",
          auditOnly: "Только Аудит (1 день)",
          unsure: "Не уверен — обсудим",
        },
        message: "О задаче",
        budget: "Бюджет (необязательно)",
        budgetOptions: {
          under200: "До 200k ₽",
          to600: "200k – 600k ₽",
          to12m: "600k – 1.2M ₽",
          over12m: "1.2M+ ₽",
          usd: "В USD-эквиваленте",
          unknown: "Не определён",
        },
      },
      progressLabel: "Заполнено",
      submit: "Отправить заявку",
      hint: "Ответ в течение часа",
      success: { title: "Спасибо, заявка получена", body: "Я уже вижу её в Telegram. Свяжусь в течение суток." },
      error: { title: "Не удалось отправить", body: "Напишите напрямую в Telegram: @abnorsky" },
      altChannels: {
        intro: "Или быстрее — забронируйте 15-мин Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
```

- [ ] **Step 9.2: Update EN form copy**

Find in EN (around lines 245-264):

```ts
    form: {
      title: "Project inquiry",
      fields: {
        name: "Name",
        contact: "Contact (Telegram or email)",
        package: "Which package",
        packageOptions: { audit: "Audit", mvp: "MVP", support: "Support", unsure: "Not sure" },
        message: "About the task",
        budget: "Budget (optional)",
        budgetOptions: { unknown: "Not defined", under500: "under $5k", to2m: "$5k–$25k", over2m: "$25k+", usd: "RUB-equivalent" },
      },
      submit: "Send inquiry",
      hint: "Reply within 24h, usually hours.",
      success: { title: "Thank you, got it", body: "I see it in Telegram already. Will reply within 24h." },
      error: { title: "Failed to send", body: "Drop a message on Telegram: @abnorsky" },
      altChannels: {
        intro: "Or faster — book a 15-min Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
```

Replace with mirror EN structure (same shape as RU):

```ts
    form: {
      title: "Project inquiry",
      altChannelsTop: "If shorter — book a 15-min Discovery:",
      fields: {
        audience: "You are…",
        audienceOptions: {
          founder: "Founder / startup",
          smb: "Tech lead / CTO at SMB",
          agency: "Agency / studio",
          other: "Other",
        },
        name: "Name",
        contact: "Contact (Telegram or email)",
        package: "Which package?",
        packageOptions: {
          sprint: "AI-MVP Sprint (7 days)",
          integration: "Production AI Integration (2-4 weeks)",
          subcontract: "Subcontract / Whitelabel",
          auditOnly: "Audit only (1 day)",
          unsure: "Not sure — let's discuss",
        },
        message: "About the task",
        budget: "Budget (optional)",
        budgetOptions: {
          under200: "Under $2k",
          to600: "$2k – $6k",
          to12m: "$6k – $12k",
          over12m: "$12k+",
          usd: "RUB-equivalent",
          unknown: "Not defined",
        },
      },
      progressLabel: "Completed",
      submit: "Send inquiry",
      hint: "Reply within 24h, usually hours.",
      success: { title: "Thank you, got it", body: "I see it in Telegram already. Will reply within 24h." },
      error: { title: "Failed to send", body: "Drop a message on Telegram: @abnorsky" },
      altChannels: {
        intro: "Or faster — book a 15-min Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
```

- [ ] **Step 9.3: Update lead-form.tsx — add audience field**

Open `components/landing/lead-form.tsx`. Add `audience` to the Zod schema (find the existing `z.object({...})` schema):

```ts
const schema = z.object({
  audience: z.enum(["founder", "smb", "agency", "other"]),
  name: z.string().min(2),
  contact: z.string().min(3),
  package: z.enum(["sprint", "integration", "subcontract", "auditOnly", "unsure"]),
  message: z.string().min(10),
  budget: z.enum(["under200", "to600", "to12m", "over12m", "usd", "unknown"]).optional(),
});
```

Adjust the existing default values, field rendering, and submission payload accordingly. The form must render a select for `audience` as the FIRST field after title.

- [ ] **Step 9.4: Update lead-form.tsx — render altChannels at TOP**

In the JSX, immediately after the form title and before the first field, add:

```tsx
<div className="mb-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
  {copy[lang].form.altChannelsTop}{" "}
  <a href={CALENDAR_URL} target="_blank" rel="noopener" className="underline">
    {copy[lang].form.altChannels.calendar}
  </a>{" "}
  ·{" "}
  <a href={TELEGRAM_URL} target="_blank" rel="noopener" className="underline">
    {copy[lang].form.altChannels.telegram}
  </a>
</div>
```

`CALENDAR_URL` and `TELEGRAM_URL` constants should already exist in the file or in `lib/landing/contacts.ts`. If not, import from `lib/landing/contacts.ts`.

Keep the existing altChannels section below the form (in success state).

- [ ] **Step 9.5: Update lead-form.tsx — add progress indicator**

At the top of the form (above the first field, just under the title bar), add:

```tsx
<div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
  <span>{copy[lang].form.progressLabel}</span>
  <span>{filledCount} / 6</span>
</div>
<div className="mb-4 h-1 w-full rounded-full bg-muted">
  <div
    className="h-1 rounded-full bg-primary transition-all"
    style={{ width: `${(filledCount / 6) * 100}%` }}
  />
</div>
```

Compute `filledCount` from the watched form values:

```ts
import { useWatch } from "react-hook-form";

const watched = useWatch({ control: form.control });
const filledCount = [
  watched.audience,
  watched.name,
  watched.contact,
  watched.package,
  watched.message,
  watched.budget,
].filter((v) => v && String(v).length > 0).length;
```

- [ ] **Step 9.6: Update API submission payload**

Find the submit handler in `lead-form.tsx`. Include `audience` in the payload sent to `/api/lead`. Also update `app/api/lead/route.ts` if it validates input — add `audience` to the schema there.

Open `app/api/lead/route.ts`, find the request schema (likely Zod), add:

```ts
audience: z.enum(["founder", "smb", "agency", "other"]).optional(),
```

And in `lib/landing/telegram.ts` (or wherever the Telegram message is composed), include audience in the formatted message:

```ts
const audienceLabel = {
  founder: "Founder",
  smb: "SMB CTO",
  agency: "Agency",
  other: "Other",
}[payload.audience ?? "other"];

const message = `New lead [${audienceLabel}]\n...`;
```

- [ ] **Step 9.7: Typecheck + Lint + Visual**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

Visual `/ru`:
- altChannels block visible at TOP of form
- Audience field is FIRST
- Progress indicator shows 0/6 initially, increments as fields fill
- Package and budget dropdowns show new options
- Form submits successfully

Submit a test lead with audience="founder" → check that Telegram bot receives the message with audience tag.

- [ ] **Step 9.8: Commit**

```bash
git add components/landing/copy-i18n.ts components/landing/lead-form.tsx app/api/lead/route.ts lib/landing/telegram.ts
git commit -m "feat(landing): rework lead-form fields, add audience selector + progress indicator"
```

---

### Task 10: hero-code-mockup — outcome comments

**Files:**
- Modify: `components/landing/hero-code-mockup.tsx`

- [ ] **Step 10.1: Read current mockup content**

Open `components/landing/hero-code-mockup.tsx` and identify the code string/JSX that renders the mockup code. There is likely a `const code = \`...\`;` or inline `<pre>` block.

- [ ] **Step 10.2: Replace mockup code with outcome-annotated cascade snippet**

Replace the code shown in the mockup with the following TypeScript snippet (substitute the existing code definition):

```ts
const code = `// HubMarket production cascade
// latency p99: ~180ms · cost: ~$0.0003/req
// 0 LLM downtime since launch (8 months in prod)

import { createCascade } from "@webkoth/llm-cascade";

const ai = createCascade([
  claudeProvider({ model: "claude-sonnet-4-6" }),  // primary
  geminiProvider({ model: "gemini-2.5-pro" }),     // fallback 1
  groqProvider({ model: "llama-3.3-70b" }),        // fallback 2 (cheapest)
]);

const result = await ai.generate({
  prompt: "Summarize seller report",
  // automatic fallback on provider error
  // automatic cost log per request
});`;
```

Note: numbers (`180ms`, `$0.0003`, `8 months`) are placeholders to be replaced by Минас with actual HubMarket measurements. The plan executor should leave them as-is; Минас will substitute via a follow-up commit if needed.

- [ ] **Step 10.3: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru`: Hero shows code mockup with the new cascade snippet and outcome comments at the top.

- [ ] **Step 10.4: Commit**

```bash
git add components/landing/hero-code-mockup.tsx
git commit -m "feat(landing): add outcome comments to hero code mockup"
```

---

### Task 11: Create i18n for Tech Stack block (RU + EN)

**Files:**
- Modify: `components/landing/copy-i18n.ts` (add `techStack` field to both langs)

- [ ] **Step 11.1: Add RU techStack block**

Insert AFTER the `why:` block and BEFORE the `form:` block in RU:

```ts
    techStack: {
      eyebrow: "СТЕК",
      title: "Работаю в вашем стеке",
      sub: "Без «давайте перепишем на новое». Адаптируюсь к вашему бэкенду, фронту, AI-провайдеру и инфре.",
      categories: [
        {
          name: "Бэкенд",
          items: ["PHP / Laravel", "Node.js / Hono", "Python / FastAPI", "Go (touch)"],
        },
        {
          name: "Фронтенд",
          items: ["React / Next.js", "Vue 3 / Inertia", "TypeScript", "Tailwind", "shadcn/ui"],
        },
        {
          name: "AI-провайдеры",
          items: ["Anthropic Claude", "OpenAI", "Google Gemini", "Groq", "Yandex GPT", "self-hosted (Ollama / vLLM)"],
        },
        {
          name: "AI-стек",
          items: ["Vercel AI SDK", "MCP", "pgvector", "structured output", "tool calling", "RAG"],
        },
        {
          name: "Базы и кэш",
          items: ["PostgreSQL", "MySQL", "ClickHouse", "Redis", "MongoDB"],
        },
        {
          name: "Инфра и эксплуатация",
          items: ["Docker", "Nginx", "Cloudflare", "Vercel", "Linux", "Sentry", "pg-boss / Horizon"],
        },
      ],
    },
```

- [ ] **Step 11.2: Add EN techStack block**

Insert mirror in EN:

```ts
    techStack: {
      eyebrow: "STACK",
      title: "I work in your stack",
      sub: "No «let's rewrite to the new shiny thing». I adapt to your backend, frontend, AI provider, and infra.",
      categories: [
        {
          name: "Backend",
          items: ["PHP / Laravel", "Node.js / Hono", "Python / FastAPI", "Go (touch)"],
        },
        {
          name: "Frontend",
          items: ["React / Next.js", "Vue 3 / Inertia", "TypeScript", "Tailwind", "shadcn/ui"],
        },
        {
          name: "AI providers",
          items: ["Anthropic Claude", "OpenAI", "Google Gemini", "Groq", "Yandex GPT", "self-hosted (Ollama / vLLM)"],
        },
        {
          name: "AI stack",
          items: ["Vercel AI SDK", "MCP", "pgvector", "structured output", "tool calling", "RAG"],
        },
        {
          name: "Databases & cache",
          items: ["PostgreSQL", "MySQL", "ClickHouse", "Redis", "MongoDB"],
        },
        {
          name: "Infra & ops",
          items: ["Docker", "Nginx", "Cloudflare", "Vercel", "Linux", "Sentry", "pg-boss / Horizon"],
        },
      ],
    },
```

- [ ] **Step 11.3: Typecheck**

Run: `npm run typecheck`
Expected: no errors. (TechStack component does not exist yet — Task 12 creates it.)

- [ ] **Step 11.4: Commit**

```bash
git add components/landing/copy-i18n.ts
git commit -m "feat(landing): add Tech Stack i18n (RU+EN)"
```

---

### Task 12: Create TechStack component

**Files:**
- Create: `components/landing/tech-stack.tsx`

- [ ] **Step 12.1: Create the component file**

Create `components/landing/tech-stack.tsx`:

```tsx
"use client";

import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";

type Props = { lang: Lang };

export function TechStack({ lang }: Props) {
  const t = copy[lang].techStack;

  return (
    <section id="tech-stack" className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="mb-10 text-center">
        <div className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          {t.eyebrow}
        </div>
        <h2 className="text-3xl font-bold md:text-4xl">{t.title}</h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">{t.sub}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {t.categories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {cat.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-muted/60 px-2.5 py-1 text-xs text-foreground"
                >
                  {item}
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

- [ ] **Step 12.2: Typecheck**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 12.3: Commit**

```bash
git add components/landing/tech-stack.tsx
git commit -m "feat(landing): add TechStack section component"
```

---

### Task 13: Replace process-pricing roadmap with zigzag-timeline + new RoadmapTimeline component

**Files:**
- Create: `components/landing/roadmap-timeline.tsx`
- Modify: `app/[lang]/page.tsx` (later in Task 16)
- Modify: `components/landing/process-pricing.tsx` (split: keep only pricing.packages cards; remove roadmap rendering)

- [ ] **Step 13.1: Split process-pricing.tsx into two components**

Open `components/landing/process-pricing.tsx`. If it currently renders BOTH roadmap (`roadmap.steps`) AND pricing.packages, split:

(a) Keep `process-pricing.tsx` as just the pricing.packages section (3 cards).
(b) Move the roadmap rendering to a NEW component `roadmap-timeline.tsx` (next step).

Make `process-pricing.tsx` render only the pricing block. Update the section heading to `copy[lang].pricing.title` and add `copy[lang].pricing.subtitle` below.

- [ ] **Step 13.2: Create roadmap-timeline.tsx (zigzag timeline)**

Create `components/landing/roadmap-timeline.tsx`:

```tsx
"use client";

import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";

type Props = { lang: Lang };

export function RoadmapTimeline({ lang }: Props) {
  const t = copy[lang].roadmap;

  return (
    <section
      id="roadmap"
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-24"
    >
      {/* Optional grid background overlay — subtle */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,180,120,0.06),transparent_60%)]" />

      <div className="mb-12 text-center md:mb-16">
        <div className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          {t.eyebrow}
        </div>
        <h2 className="text-3xl font-bold md:text-5xl">{t.title}</h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">{t.sub}</p>
      </div>

      <div className="relative">
        {/* Center vertical line — visible only on md+ */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block" />

        <div className="flex flex-col gap-10 md:gap-16">
          {t.steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.num}
                className="relative flex w-full items-start md:gap-8"
              >
                {/* Card on left */}
                <div
                  className={`md:w-1/2 ${isLeft ? "md:pr-12" : "hidden md:block"}`}
                >
                  {isLeft && <StepCard step={step} />}
                </div>

                {/* Center node */}
                <div className="absolute left-1/2 top-3 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:block" />

                {/* Card on right */}
                <div
                  className={`md:w-1/2 ${!isLeft ? "md:pl-12" : "hidden md:block"}`}
                >
                  {!isLeft && <StepCard step={step} />}
                </div>

                {/* Mobile: always render single column */}
                <div className="md:hidden">
                  <StepCard step={step} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
}: {
  step: { num: string; title: string; body: string; pill: string };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-2 font-mono text-xs text-primary">{step.num}</div>
      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {step.body}
      </p>
      <div className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
        {step.pill}
      </div>
    </div>
  );
}
```

- [ ] **Step 13.3: Typecheck + Lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 13.4: Visual smoke**

At `/ru`: scroll to the new Roadmap section (it won't be wired into `page.tsx` yet — Task 16 does that). It should still compile.

- [ ] **Step 13.5: Commit**

```bash
git add components/landing/roadmap-timeline.tsx components/landing/process-pricing.tsx
git commit -m "feat(landing): add RoadmapTimeline (zigzag), split pricing from process-pricing"
```

---

### Task 14: Add animated counter to metrics-bar

**Files:**
- Modify: `components/landing/metrics-bar.tsx`

- [ ] **Step 14.1: Add useInView + count-up logic**

Open `components/landing/metrics-bar.tsx`. Currently it renders static values (`metric.value` + `metric.suffix`). Add framer-motion's `useInView` and a count-up animation.

Replace the metric value rendering with an animated counter. Sketch:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 900; // ms
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const isFloat = !Number.isInteger(value);
  const text = isFloat ? display.toFixed(1) : Math.round(display).toString();

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

type Props = { lang: Lang };
export function MetricsBar({ lang }: Props) {
  const metrics = copy[lang].hero.metrics;
  return (
    <div className="flex flex-wrap gap-6 md:gap-10">
      {metrics.map((m) => (
        <div key={m.label} className="text-left">
          <div className="text-3xl font-bold md:text-4xl">
            <AnimatedNumber value={m.value} suffix={m.suffix} />
          </div>
          <div className="text-xs text-muted-foreground md:text-sm">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
```

If the existing component is structured differently (different prop interface, different layout container), preserve its outer markup and ONLY swap the static value rendering with `<AnimatedNumber value={m.value} suffix={m.suffix} />`.

- [ ] **Step 14.2: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru` and `/en`: scroll to Hero. Metric numbers tick from 0 to final value once when scrolled into view. They should not re-trigger on subsequent scrolls (`{once: true}` ensures this).

- [ ] **Step 14.3: Commit**

```bash
git add components/landing/metrics-bar.tsx
git commit -m "feat(landing): animated counter on metrics-bar (count-up on viewport entry)"
```

---

### Task 15: Add hover-pulse on TaskGrid outcome line

**Files:**
- Modify: `components/landing/task-grid.tsx`

- [ ] **Step 15.1: Add hover state + outcome pulse**

In `task-grid.tsx`, wrap each card in `<motion.div>` (or use Tailwind hover utilities) so that on hover:
- Card lifts slightly (`translateY(-2px)`)
- Outcome line gets a brief pulse (scale + brightness)

If using Tailwind only:

Replace the per-card container className to include hover lift:

```tsx
<div className="group relative cursor-pointer rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-1">
  ...
  <div className="leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
    → {item.outcome}
  </div>
</div>
```

For a more visible pulse, add a small CSS animation class. In the file, after imports, define:

```tsx
const pulseClass = "group-hover:animate-[pulse_0.6s_ease-in-out]";
```

And add `pulseClass` to the outcome div className. Tailwind's `animate-pulse` keyframe (built-in) is `opacity` based — that's fine here.

- [ ] **Step 15.2: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru`: hover on TaskGrid cards — card lifts up, outcome line subtly pulses/changes color.

- [ ] **Step 15.3: Commit**

```bash
git add components/landing/task-grid.tsx
git commit -m "feat(landing): hover-lift + outcome pulse on TaskGrid cards"
```

---

### Task 16: Add mermaid diagram to TechStack section

**Files:**
- Modify: `components/landing/tech-stack.tsx`

- [ ] **Step 16.1: Add mermaid diagram below categories**

In `components/landing/tech-stack.tsx`, AFTER the categories grid, add a small block with a multi-provider cascade architecture diagram (uses existing `components/landing/mermaid-diagram.tsx` component).

Add to imports:

```tsx
import { MermaidDiagram } from "./mermaid-diagram";
```

And after the `<div className="grid gap-6 ...">` block, add:

```tsx
<div className="mt-12 rounded-2xl border border-border bg-card p-6">
  <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
    {lang === "ru" ? "Пример архитектуры: multi-provider cascade" : "Example architecture: multi-provider cascade"}
  </div>
  <MermaidDiagram
    chart={`flowchart LR
  C[Client] --> R[Router]
  R -->|primary| A[Claude]
  R -->|fallback 1| G[Gemini]
  R -->|fallback 2| K[Groq]
  A --> S[Structured Output]
  G --> S
  K --> S
  S --> O[Audit Log]
  S --> U[User]`}
  />
</div>
```

If `mermaid-diagram.tsx` has a different prop API (e.g. `code` instead of `chart`), use that.

- [ ] **Step 16.2: Typecheck + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `/ru`: scroll to TechStack — below the 6 category cards, a mermaid diagram renders showing the cascade. Check it displays cleanly in light and dark themes.

- [ ] **Step 16.3: Commit**

```bash
git add components/landing/tech-stack.tsx
git commit -m "feat(landing): add cascade architecture mermaid diagram to TechStack"
```

---

### Task 17: Integrate new sections into app/[lang]/page.tsx

**Files:**
- Modify: `app/[lang]/page.tsx`

- [ ] **Step 17.1: Update page.tsx to include new sections in correct order**

Open `app/[lang]/page.tsx`. Current order:

```tsx
<Hero lang={lang} />
<SectionReveal><TaskGrid lang={lang} /></SectionReveal>
<SectionReveal><FeaturedCase lang={lang} /></SectionReveal>
<SectionReveal><CaseGrid lang={lang} /></SectionReveal>
<SectionReveal><ClientVoices lang={lang} /></SectionReveal>
<SectionReveal><WhyMe lang={lang} /></SectionReveal>
<SectionReveal><ProcessPricing lang={lang} /></SectionReveal>
<SectionReveal><Faq lang={lang} /></SectionReveal>
<SectionReveal><LeadForm lang={lang} /></SectionReveal>
<Footer lang={lang} />
<StickyCta lang={lang} />
```

Replace with new order (insert RoadmapTimeline between WhyMe and TechStack; insert TechStack between WhyMe and ProcessPricing; replace ProcessPricing's old roadmap responsibility):

```tsx
import { TechStack } from "@/components/landing/tech-stack";
import { RoadmapTimeline } from "@/components/landing/roadmap-timeline";

...

<Hero lang={lang} />
<SectionReveal><TaskGrid lang={lang} /></SectionReveal>
<SectionReveal><FeaturedCase lang={lang} /></SectionReveal>
<SectionReveal><CaseGrid lang={lang} /></SectionReveal>
<SectionReveal><ClientVoices lang={lang} /></SectionReveal>
<SectionReveal><WhyMe lang={lang} /></SectionReveal>
<SectionReveal><TechStack lang={lang} /></SectionReveal>
<SectionReveal><RoadmapTimeline lang={lang} /></SectionReveal>
<SectionReveal><ProcessPricing lang={lang} /></SectionReveal>
<SectionReveal><Faq lang={lang} /></SectionReveal>
<SectionReveal><LeadForm lang={lang} /></SectionReveal>
<Footer lang={lang} />
<StickyCta lang={lang} />
```

Verify ProcessPricing renders only the 3-card pricing block (not roadmap anymore).

- [ ] **Step 17.2: Typecheck + Lint + Full Visual Smoke**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

At `localhost:3000/ru` (full-page scroll, no jumps):
1. Hero — new H1, sub, animated counter on metrics
2. TaskGrid — 6 vignettes with trigger/action/outcome, hover pulse works
3. FeaturedCase — HubMarket with 4 metrics
4. CaseGrid — 7 cards with audience tags
5. ClientVoices — unchanged
6. WhyMe — first item now «От идеи до прода — без передач»
7. **TechStack — NEW** — 6 category cards + cascade mermaid below
8. **RoadmapTimeline — NEW** — zigzag with 4 steps + pills
9. ProcessPricing — 3 audience-segmented cards
10. FAQ — 12 items including 4 new
11. LeadForm — audience selector first, altChannels at top, progress 0/6
12. Footer + StickyCta — unchanged

At `localhost:3000/en`: mirror.

- [ ] **Step 17.3: Commit**

```bash
git add app/[lang]/page.tsx
git commit -m "feat(landing): integrate TechStack + RoadmapTimeline into page; reorder sections"
```

---

### Task 18: Final review pass

- [ ] **Step 18.1: Re-read full RU landing scroll**

At `localhost:3000/ru`: scroll the entire page top to bottom. Look for:
- Any leftover «Один» / «один контакт» / «80 000 ₽» / «От 200k ₽/мес» — these strings should be gone or contextually correct
- Any layout breakage (overflow, misalignment)
- Any console errors in the browser devtools
- Mobile viewport: open devtools, set viewport to 375px wide, scroll the whole page — check that nothing breaks, especially RoadmapTimeline (should render as single column on mobile)

- [ ] **Step 18.2: Re-read full EN landing scroll**

Same at `localhost:3000/en`. Same checks.

- [ ] **Step 18.3: Run build to catch SSR-only issues**

Run: `npm run build`
Expected: builds without errors. Any issues with `"use client"` directives, hydration mismatches, or static import problems should surface here.

- [ ] **Step 18.4: Update changelog or README if project requires**

Check `README.md` for an «Updates» or «Changelog» section. If exists, add an entry:

```md
## 2026-05-20 — Landing rewrite

- Hero positioning updated (Production AI in product — in days, not quarters)
- Pricing restructured to 3 audience-segmented packages (founder / SMB / agency)
- TaskGrid items rewritten as outcome vignettes
- New Tech Stack section (categorized stack listing + cascade architecture diagram)
- Roadmap redesigned as zigzag timeline (4 steps)
- FAQ +4 new items (Sprint templates / code ownership / whitelabel / post-free-month)
- Lead-form: new audience selector, progress indicator, altChannels moved to top
- Animated counter on hero metrics; hover-pulse on TaskGrid cards
- Removed «Один» repetition from copy
```

- [ ] **Step 18.5: Final commit**

```bash
git add README.md
git commit -m "docs: changelog entry for landing rewrite"
```

---

## Out of Scope (deferred to other plans)

- CV-page redesign (`/[lang]/minasarkisyan`) — see `2026-05-20-cv-redesign.md`
- Pet-projects (HubMarket stocksync packaging as case writeup, 4th MCP server, eval pipeline, etc.) — see `2026-05-20-pet-projects.md`
- Replacement of `process-pricing.tsx` filename: this file now only renders pricing.packages; renaming to `pricing-packages.tsx` is a nice-to-have, not done here to avoid extra import churn
- Adding `case-card.tsx` filter UX (filter by audience tag) — explicitly out of scope per grilling decision
- Mermaid theme override (light/dark) — using default; if visual mismatch in dark mode, address in a follow-up

## Self-Review Notes

- All 13 locked landing decisions from the grilling session are covered: Hero, pricing (3 cards), TaskGrid rewrite, TechStack new block, Roadmap zigzag, audience tags (7 cases incl. new stocksync), FAQ +4, lead-form updates, «Один» cleanup, hero-code outcome comments, interactivity (counter/hover/mermaid), featured 4th metric, new stocksync case.
- File paths are exact and refer to existing files unless explicitly marked as «Create».
- Each task ends with typecheck + lint + visual verify + commit — no test framework dependency.
- No placeholder text in code blocks; every snippet is concrete.
- Mobile responsiveness called out for RoadmapTimeline (only place where complex multi-column layout exists).
- Numbers in hero-code-mockup are flagged as placeholder for Минас to substitute with real HubMarket measurements.
