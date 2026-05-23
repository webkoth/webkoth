# Pet-Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a sequence of pet-projects that close JD-fit gaps identified during the grilling session (LangChain, vector DB naming, evals, observability, fine-tuning, self-hosted LLM, etc.) and produce additional landing-page proof points (founder-segment B-Sprint case, agency-segment additional MCP server). Each pet-project becomes a public artifact (GitHub repo + npm publication where applicable + README writeup). After each one ships, the CV and/or landing is updated to reference it — but **only after**, per the anti-заглушка principle.

**Architecture:** Unlike Plans 1 and 2, this plan produces artifacts **outside** the `webkoth` repo: separate GitHub repositories per pet-project. The `webkoth` repo is updated only as a follow-up to each pet-project's publication (changing `cv.ts` / `copy-i18n.ts` / case-grid items to reference the new artifact). This separation enforces anti-заглушка: the public artifact must exist before the claim does.

**Tech Stack (per project, varies):** Node.js + TypeScript + MCP SDK for MCP servers · Python + LangChain/LangGraph for LangChain port · Python + Transformers + PEFT + AutoGPTQ for fine-tuning · Python + vLLM for self-hosted · Prometheus/Grafana for observability · pgvector/Chroma/Weaviate for vector-DB swap demos.

**Verification model:** Each pet-project's GitHub repo has its own README with «Quickstart» and «Verify» sections. After publication, the verification of webkoth-side updates uses the same loop as Plans 1/2 (`npm run typecheck && npm run lint && visual at localhost:3000`).

---

## Task 0: Lock the anti-заглушка principle
 
This is **not skippable**. Read and internalize before any task that touches `webkoth/` files.

- [ ] **Step 0.1: Read and acknowledge anti-заглушка principle**

The rule:

> A chip, tag, badge, or portfolio item referencing a pet-project on `webkoth.com` or `/[lang]/minasarkisyan` **MUST NOT** be merged into the `webkoth` repo until:
> 1. The pet-project has a **public GitHub repo** (not private, not draft) with at least a README;
> 2. If the project is an npm package, it is **published to npm** under a verifiable handle;
> 3. The README contains at minimum: description, quickstart, what was built, cross-link to `webkoth.com`.
>
> If you find yourself wanting to update `cv.ts` or `copy-i18n.ts` to mention a pet-project that does not yet meet the above three conditions, **STOP**. Either ship the pet-project first, or do not update.

- [ ] **Step 0.2: Verify current state of public artifacts**

Run:

```bash
gh search repos "user:webkoth" --json name,visibility,description --limit 50
```

Expected output: list of public repos under @webkoth. Note which MCP-server repos exist publicly (e.g. `timeweb-mcp-server`).

Run:

```bash
curl -s "https://registry.npmjs.org/-/v1/search?text=maintainer:webkoth&size=50" | jq '.objects[].package.name'
```

Expected: list of npm packages maintained by `webkoth`.

**Snapshot the result.** This is the "current evidence baseline" against which CV and landing claims must be reconcileable. If today only 1 MCP server is public but `cv.ts` claims «3 MCP servers on npm», fix `cv.ts` (lower the claim) BEFORE running this plan further — see Plan 2 Task 19.4 for the reconciliation flag.

---

## Phase 0: Publication of webkoth updates with current evidence

This phase is the **prerequisite for starting Phase 1**. It assumes Plans 1 and 2 are largely done.

- [ ] **Step P0.1: Confirm Plan 1 and Plan 2 are merged or staged**

Run: `git log --oneline -30 main`
Expected: see commits from `feat(landing): ...` and `feat(cv): ...` prefixes.

If they aren't done, **return to Plans 1 and 2** before this Plan 3 makes sense. Pet-projects without an updated CV/landing to update have no destination.

- [ ] **Step P0.2: Reconcile any over-claims**

For each claim on landing or CV that depends on a future pet-project:
- «3 MCP servers on npm» (cv.ts metrics, openSource) — reconcile per Plan 2 Step 19.4
- «MVP за неделю — стартапам» (Hero.sub) — backed by HubMarket stocksync case (which is documentation work, not new build — Task 1 here)
- «MCP-разработка — агентствам» (Hero.sub) — backed by existing timeweb-mcp-server; strengthened by Task 2 here
- «cost-per-request / quality-drift» (Pricing.support copy) — backed by Task 3 here

If a claim cannot be backed by the current evidence + Task 1 documentation, **adjust the claim** in copy.ts / cv.ts before Phase 1 starts.

- [ ] **Step P0.3: Publish webkoth update with current baseline**

Once Plans 1+2 are merged and claims are reconciled with reality, deploy:

```bash
# Project uses Timeweb Cloud + PM2 + nginx per .deploy.yml and ecosystem.config.cjs
git push origin main
# CI/CD (per .github/workflows/) handles deployment, or run manual deploy.
```

Verify at `https://webkoth.com/ru` and `https://webkoth.com/ru/minasarkisyan` that updates are live.

---

## Phase 1: Tier 1 pet-projects (target: ~2 weeks)

### Task 1: HubMarket stocksync — case writeup

**Goal:** Convert an existing HubMarket feature (marketplace stock synchronization, delivered to a founder-friend in ~3 days) into a documented case suitable for the landing CaseGrid + CV portfolio. This is **documentation work**, not new build.

**Total effort:** 1-2 days
**Output:** README/case-study writeup in HubMarket repo OR a separate `webkoth-cases` repo, screenshots, dev-log

- [ ] **Step 1.1: Locate the original commits**

In the HubMarket repo (not in webkoth):

```bash
cd /path/to/hubmarket
git log --grep="stocksync\|stock sync\|остатк\|синхронизац" --oneline -50
```

Identify the commits that introduced the feature. Note the date range (e.g. 3-4 days of consecutive commits).

- [ ] **Step 1.2: Snapshot timeline and decisions**

Create a working file (locally): `notes/stocksync-case.md`. Fill in:

```md
# HubMarket: Marketplace Stock Synchronization

## Timeline
- Day 0: Founder request received via Telegram (paste actual date)
- Day 1: Architecture sketch + data-source investigation
- Day 2: First end-to-end pipeline (one marketplace)
- Day 3: Extended to all 3 marketplaces; tested with real data
- Day 4: Production release; founder verified

## Decisions made
1. Why Playwright for parsing (versus official API)
2. Why pg-boss queue for sync orchestration
3. Why store deltas, not snapshots
4. Etc.

## Outcome
- Founder feedback (quote if permitted, anonymized if not)
- Metrics: items synced per minute, failure rate, cost per run
```

- [ ] **Step 1.3: Capture screenshots**

Take 2-3 screenshots from HubMarket showing the feature:
- Settings/config UI for the sync
- Status dashboard during/after sync
- Final data view (synced stock per marketplace)

Save to a local `docs/screenshots/` folder in HubMarket repo (do not commit private data — sanitize / anonymize).

- [ ] **Step 1.4: Decide where the case writeup lives**

**DECISION POINT for Минас:** Where to publish the case?

Option A: Add a `docs/cases/stocksync.md` to HubMarket public-facing landing site (if HubMarket has a public landing).
Option B: Create a new dedicated repo `github.com/webkoth/cases` and put it there. Reusable for future case studies.
Option C: Add a hidden page on `webkoth.com/cases/hubmarket-stocksync` (new route in this `webkoth` repo).

Recommendation: **Option C** — case writeup lives in this repo as a sub-page. Lowest setup cost, integrates with existing CMS/i18n. Drawback: every case-study commits go through this repo.

- [ ] **Step 1.5: (If Option C) Create the case sub-page in webkoth**

Create `app/[lang]/cases/hubmarket-stocksync/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HubMarket: Marketplace Stock Sync · webkoth case",
  description: "Founder request → prod in 3 days. Stock sync across 3 marketplaces (WB, Ozon, Yandex Market) for a HubMarket customer.",
};

type Props = { params: Promise<{ lang: string }> };

export default async function Page({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";

  // For now, render a single-language case study (RU). Add EN translation later.
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <article className="prose prose-lg dark:prose-invert">
        {/* Paste timeline, decisions, outcome, screenshots here in markdown-like JSX */}
        <h1>HubMarket: синхронизация остатков</h1>
        <p className="text-muted-foreground">Запрос фаундера → прод за 3 дня</p>
        {/* ... full content ... */}
      </article>
    </main>
  );
}
```

Add screenshots to `public/cases/hubmarket-stocksync/`.

- [ ] **Step 1.6: Link the case from landing CaseGrid**

The new case `case-hubmarket-stocksync` was already added to `copy-i18n.ts > cases.items` in Plan 1 (Task 6). Verify it links to the case sub-page (Option C path):

```ts
{ id: "case-hubmarket-stocksync", title: "...", sub: "...", stack: [...], audienceTag: "founder", link: "/{lang}/cases/hubmarket-stocksync" },
```

If `case-card.tsx` doesn't support `link` field, extend the schema (add optional `link?: string`) and render the card as a `<Link>` when present.

- [ ] **Step 1.7: Update CV portfolio with this case**

In `app/data/cv.ts > portfolio` (both RU and EN), add a new portfolio entry **at the top** (since it's the newest):

```ts
{
  title: "HubMarket: маркетплейс-синхронизация остатков (B-Sprint case)",
  stack: ["Next.js", "Hono", "Playwright", "pg-boss"],
  team: "1 fullstack (от запроса фаундера до прода — 3 дня)",
  functionality: "Production-кейс founder-driven спринта: запрос → архитектура → реализация → передача в прод за 3 дня. Синхронизация остатков по 3 маркетплейсам (WB, Ozon, Yandex Market) для клиента HubMarket. Полный writeup: webkoth.com/cases/hubmarket-stocksync",
  technologies: ["Playwright", "pg-boss", "PostgreSQL"],
  aiTag: null,
},
```

Mirror for EN.

- [ ] **Step 1.8: Typecheck + Lint + Visual**

Run: `npm run typecheck && npm run lint`
Visual at `localhost:3000/ru/cases/hubmarket-stocksync`: case page renders. Click from `localhost:3000/ru` CaseGrid card → navigates to case page.

- [ ] **Step 1.9: Commit**

```bash
git add app/[lang]/cases/hubmarket-stocksync/ public/cases/hubmarket-stocksync/ components/landing/copy-i18n.ts components/landing/case-card.tsx app/data/cv.ts
git commit -m "feat(cases): publish HubMarket stocksync case (3-day B-Sprint proof)"
```

- [ ] **Step 1.10: Deploy + verify live**

Push and deploy. Verify at `https://webkoth.com/ru/cases/hubmarket-stocksync` (live URL). This **fulfills** the Hero promise «MVP за неделю — стартапам» with a concrete public artifact.

---

### Task 2: Build and publish 4th MCP server

**Goal:** Ship a new MCP server for a useful API niche, publish to npm, document in README. Strengthens E-segment (agency) evidence and CV openSource section.

**Total effort:** 3-5 days
**Output:** Public GitHub repo + npm-published package + README writeup

- [ ] **Step 2.1: DECISION POINT — Choose target API**

Candidate APIs (pick one based on personal preference + niche value):

| API | Why interesting | Difficulty |
|---|---|---|
| Linear (project mgmt) | Big AI-tool audience, no good MCP yet | Easy-medium |
| Notion | Popular, official API is decent | Medium |
| Selectel Cloud API (RU) | Local market, no existing MCP | Medium |
| Wildberries Seller API | Local market, you already have stocksync expertise | Medium |
| Yandex Cloud API | Local market + tech-savvy audience | Medium |
| Plausible Analytics | Underserved analytics niche | Easy |
| Cloudflare (you already use it) | Already in stack | Medium |

Recommendation: **Linear** (broad audience, popular AI dev tool) or **Selectel** (local market parallel to existing timeweb-mcp).

- [ ] **Step 2.2: Scaffold the repo**

```bash
mkdir -p ~/projects/<api-name>-mcp-server
cd ~/projects/<api-name>-mcp-server
git init
npm init -y
```

Edit `package.json`:

```json
{
  "name": "<api-name>-mcp-server",
  "version": "0.1.0",
  "description": "MCP server for <API Name>. Use with Claude Desktop, Claude Code, Cursor.",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "<api-name>-mcp-server": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": ["mcp", "model-context-protocol", "<api-name>", "ai-agent"],
  "author": "webkoth",
  "license": "MIT"
}
```

Install MCP SDK:

```bash
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
npx tsc --init
```

- [ ] **Step 2.3: Implement basic MCP server with 3-5 tools**

Create `src/index.ts`:

```ts
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "<api-name>-mcp-server", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// Define 3-5 tools that cover the most common API operations.
// Example for Linear:
//   - list_issues(filter)
//   - create_issue(team, title, body)
//   - update_issue(id, status)
//   - list_projects()
//   - search(query)

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "list_issues",
      description: "List issues with optional filter",
      inputSchema: {
        type: "object",
        properties: {
          filter: { type: "string", description: "Optional filter string" },
        },
      },
    },
    // ... more tools
  ],
}));

server.setRequestHandler("tools/call", async (req) => {
  const apiKey = process.env.<API_NAME>_API_KEY;
  if (!apiKey) throw new Error("<API_NAME>_API_KEY env var required");

  switch (req.params.name) {
    case "list_issues": {
      // call API
      const res = await fetch("https://api.example.com/issues", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    // ... more cases
    default:
      throw new Error(`Unknown tool: ${req.params.name}`);
  }
});

await server.connect(new StdioServerTransport());
```

- [ ] **Step 2.4: Write README**

Create `README.md`:

```md
# <api-name>-mcp-server

MCP server for [<API Name>](https://example.com). Use with Claude Desktop, Claude Code, Cursor, or any MCP-compatible AI agent.

## What this does

Exposes <API Name> as a set of MCP tools: list_issues, create_issue, etc.

## Install

\`\`\`bash
npm install -g <api-name>-mcp-server
\`\`\`

## Configure (Claude Desktop)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

\`\`\`json
{
  "mcpServers": {
    "<api-name>": {
      "command": "<api-name>-mcp-server",
      "env": {
        "<API_NAME>_API_KEY": "your-api-key-here"
      }
    }
  }
}
\`\`\`

## Tools

| Tool | Description | Inputs |
|---|---|---|
| `list_issues` | List issues | `filter?: string` |
| `create_issue` | Create an issue | `team`, `title`, `body` |
| ... | ... | ... |

## Author

Built by [@webkoth](https://github.com/webkoth) (Минас Саркисян).
Part of a series of MCP servers: see also [timeweb-mcp-server](https://github.com/webkoth/timeweb-mcp-server).
Visit [webkoth.com](https://webkoth.com) for AI integration services.

## License

MIT
```

- [ ] **Step 2.5: Build + test locally**

```bash
npm run build
# Test by configuring claude_desktop_config.json (or claude_code) and invoking a tool
```

- [ ] **Step 2.6: Publish to npm**

```bash
npm login  # if not already
npm publish --access public
```

- [ ] **Step 2.7: Create public GitHub repo + push**

```bash
gh repo create webkoth/<api-name>-mcp-server --public --description "MCP server for <API Name>"
git remote add origin https://github.com/webkoth/<api-name>-mcp-server.git
git add -A
git commit -m "feat: initial release of <api-name>-mcp-server v0.1.0"
git push -u origin main
```

- [ ] **Step 2.8: Update webkoth — cv.ts openSource**

Switch back to webkoth repo. In `app/data/cv.ts > openSource`, add new entry (RU + EN):

```ts
{
  name: "<api-name>-mcp-server",
  description: "...short description...",
  npmPkg: "<api-name>-mcp-server",
  ghOwner: "webkoth",
  ghRepo: "<api-name>-mcp-server",
  highlights: ["Node.js + TypeScript", "MCP SDK", "<n> tools covering <API Name>"],
},
```

- [ ] **Step 2.9: Update webkoth — pitch + metrics if NOW true**

If the count «3 MCP servers on npm» becomes more accurate with this 2nd or 3rd publication, update `cv.ts > pitch` and `metrics` accordingly. Conversely, if you only have 2 servers, keep the count at 2.

- [ ] **Step 2.10: Update landing — strengthen E-segment evidence**

In `components/landing/copy-i18n.ts > cases.items`, optionally add a 2nd MCP-related case if the new server is interesting enough. Or update the existing `case-mcp` description to mention «4 MCP servers published» if appropriate.

- [ ] **Step 2.11: Typecheck + Lint + Visual + Commit**

```bash
cd ~/projects/webkoth
npm run typecheck && npm run lint
# Verify live at localhost:3000/ru and localhost:3000/ru/minasarkisyan
git add app/data/cv.ts components/landing/copy-i18n.ts
git commit -m "feat(cv,landing): reference newly published <api-name>-mcp-server"
```

- [ ] **Step 2.12: Deploy**

Push and deploy webkoth updates. Verify live.

---

### Task 3: Eval pipeline + cost-tracking on HubMarket cascade

**Goal:** Build a simple but real eval / cost-tracking system on HubMarket's multi-provider cascade. Publish writeup. This closes the JD-fit gap for «eval pipelines, quality drift, cost-per-request».

**Total effort:** 5-7 days
**Output:** Code committed to HubMarket repo (private) + a public writeup with screenshots + metrics

- [ ] **Step 3.1: Implement cost-tracking in HubMarket**

In HubMarket codebase, in the LLM cascade module:
- For each request, log `provider`, `model`, `prompt_tokens`, `completion_tokens`, `cost_usd`, `latency_ms`, `cache_hit`, `fallback_index` (0=primary, 1=fallback1, etc.)
- Write to a `llm_usage` table in PostgreSQL (or to ClickHouse if MPSTATS-style infra exists)

Schema:

```sql
create table llm_usage (
  id uuid primary key,
  ts timestamptz not null default now(),
  request_id text,
  provider text not null,
  model text not null,
  prompt_tokens int not null,
  completion_tokens int not null,
  cost_usd numeric(10,6) not null,
  latency_ms int not null,
  cache_hit boolean not null default false,
  fallback_index int not null default 0,
  task_type text,
  status text not null default 'success'
);
create index on llm_usage (ts);
create index on llm_usage (provider, ts);
```

- [ ] **Step 3.2: Implement eval pipeline (basic)**

Add a periodic job that:
- Pulls a random sample of recent LLM-generated outputs (e.g., 20 per day)
- Re-runs them on a stronger reference model (Claude Opus) as ground truth
- Computes a simple quality score: semantic similarity (via embeddings) or rule-based check (e.g., for structured output, validate JSON schema; for summaries, check minimum length / contains key terms)
- Logs score to a `llm_eval` table

```sql
create table llm_eval (
  id uuid primary key,
  ts timestamptz not null default now(),
  llm_usage_id uuid references llm_usage(id),
  reference_model text not null,
  quality_score numeric(4,3),
  drift_signal boolean not null default false,
  notes text
);
```

If quality_score drops by >X% over a 7-day rolling window relative to the previous 7 days → `drift_signal = true` → alert.

- [ ] **Step 3.3: Build a simple dashboard**

In HubMarket admin, add a `/admin/llm-metrics` page (or use Grafana if Prometheus is set up later in Task 6). Show:
- Cost per day (line chart by provider)
- Fallback rate (% of requests that went to fallback 1/2)
- p99 latency (line chart)
- Average quality_score (line chart, last 30 days)
- Drift alerts (table of recent drift_signal=true)

- [ ] **Step 3.4: Capture screenshots for writeup**

Run dashboard for at least 7 days to accumulate data. Then screenshot:
- Cost-per-day chart with 2-3 weeks of data
- Fallback distribution (typically 95% primary, 4% fallback 1, 1% fallback 2)
- Quality drift example (a moment where score dropped)

- [ ] **Step 3.5: Write public writeup**

Create a writeup on dev.to / Medium / Habr (Минас's preferred platform). Or in webkoth repo as `app/[lang]/cases/hubmarket-eval-pipeline/page.tsx` (like Task 1 case page).

Sections:
1. The problem: multi-provider cascade saves on cost and uptime, but how do you know quality didn't degrade?
2. The architecture: usage table, eval table, periodic sampling, reference-model comparison
3. Findings: what numbers look like in practice
4. Lessons: what's hard, what's easy, what to do next (e.g. integrate with Prometheus/Grafana — see Task 6)

- [ ] **Step 3.6: Update webkoth cv.ts > productionAI**

Modify the existing `productionAI[0]` entry (the cascade one) to add eval-pipeline evidence:

```ts
{
  title: "Multi-provider LLM cascade в HubMarket + eval pipeline",
  body: "Архитектура с фолбэком Claude → Gemini → Groq: 0 downtime LLM за 8 месяцев в проде. Eval pipeline: автоматический cost-log, quality-drift отслеживание через периодическое сравнение с reference-моделью.",
  evidence: "Featured case + writeup: webkoth.com/cases/hubmarket-eval-pipeline",
},
```

Mirror EN.

- [ ] **Step 3.7: Update landing copy.support copy**

In `components/landing/copy-i18n.ts > pricing.packages.integration.items` and `subcontract`, you can now confidently mention quality-drift / cost-monitoring as services you actually offer (because you've done it on HubMarket). Optionally amend item bullets:

```ts
items: [
  ...,
  "Cost-per-request мониторинг + quality drift checks (как в HubMarket)",
],
```

Mirror EN.

- [ ] **Step 3.8: Typecheck + Lint + Visual + Commit + Deploy**

Standard webkoth verification loop. Then push and deploy.

---

## Phase 2: Tier 2 pet-projects (target: ~4 weeks)

These are sequenced after Phase 1 ships. Each is shorter and more focused than Tier 1.

### Task 4: LangChain/LangGraph port of one HubMarket flow

**Goal:** Take one existing HubMarket AI flow (currently implemented with Vercel AI SDK + custom code) and re-implement it using LangChain/LangGraph. Publish as a comparison repo with writeup.

**Total effort:** 3-5 days

- [ ] **Step 4.1: Pick the flow to port**

DECISION: pick a flow that's small enough to fit in one repo (e.g., the RAG-based question-answering flow, or the Telegram-bot agent). The cascade itself is too big; pick a sub-flow.

- [ ] **Step 4.2: Scaffold a new repo**

```bash
mkdir -p ~/projects/langchain-cascade-port
cd ~/projects/langchain-cascade-port
git init
# Python (LangChain is Python-first) — set up venv, requirements.txt
python -m venv .venv
source .venv/bin/activate
pip install langchain langgraph langchain-anthropic langchain-openai
```

- [ ] **Step 4.3: Reimplement the flow with LangGraph**

Build a `StateGraph` with nodes for: retrieve → answer → reflect. Use LangChain's provider abstractions for Claude + OpenAI fallback. Save as `src/cascade.py`.

- [ ] **Step 4.4: Write comparison README**

```md
# LangGraph port of HubMarket's RAG cascade

A reimplementation of HubMarket's RAG question-answering flow using LangGraph instead of Vercel AI SDK + custom code.

## Why

Compare developer ergonomics, runtime overhead, and observability between the two approaches.

## Findings

- LangGraph is ... [substantive comparison]
- Vercel AI SDK is ... [substantive comparison]
- I would pick X for production for these reasons ...

## Code

src/cascade.py — the LangGraph implementation
src/cascade_vercel.ts — the original Vercel AI SDK version (transcribed from HubMarket, sanitized)

## Quickstart

\`\`\`bash
pip install -r requirements.txt
python src/cascade.py
\`\`\`
```

- [ ] **Step 4.5: Publish repo + cross-link**

```bash
gh repo create webkoth/langchain-cascade-port --public --description "LangGraph reimplementation of HubMarket's RAG cascade — comparison and writeup"
git push -u origin main
```

- [ ] **Step 4.6: Update webkoth cv.ts**

In `cv.ts > skills > AI / LLM category`, add new chip:

```ts
{ name: "LangChain / LangGraph", maturity: "production" },
```

Add to `chipGroups` for first-screen:

```ts
{
  groupLabel: "AI / LLM",
  chips: [..., "LangChain / LangGraph", ...],
},
```

In `productionAI`, add new achievement:

```ts
{
  title: "LangGraph port of HubMarket RAG cascade",
  body: "Reimplemented HubMarket's RAG question-answering flow using LangGraph (Python) as a comparison study against Vercel AI SDK approach.",
  evidence: "github.com/webkoth/langchain-cascade-port",
},
```

Mirror EN.

- [ ] **Step 4.7: Typecheck + Visual + Commit + Deploy**

---

### Task 5: Fine-tuning + quantization

**Goal:** Fine-tune a small open-source LLM (e.g. Qwen-7B or Llama-3-8B) on a domain dataset using LoRA. Quantize with GPTQ or AWQ. Publish writeup with benchmarks.

**Total effort:** 5-7 days

- [ ] **Step 5.1: DECISION — pick base model + domain**

Base model: `Qwen2.5-7B-Instruct` (good RU+EN support) or `Llama-3.1-8B-Instruct` (broader coverage).

Domain: e.g. «AI-сервис, отвечающий на вопросы о российском трудовом кодексе» — there are public datasets you can use as a starting point. Or use HubMarket-related synthetic data (anonymized marketplace product descriptions, sentiment classification).

- [ ] **Step 5.2: Scaffold the repo**

```bash
mkdir -p ~/projects/llm-finetune-experiment
cd ~/projects/llm-finetune-experiment
git init
# Python environment with CUDA support
python -m venv .venv && source .venv/bin/activate
pip install transformers peft accelerate bitsandbytes datasets trl
pip install auto-gptq  # for quantization
```

- [ ] **Step 5.3: Prepare dataset**

`data/train.jsonl`: 500-2000 instruction-response pairs. Either real data (sanitized) or synthetic generated from Claude/GPT.

Format:
```json
{"instruction": "...", "input": "...", "output": "..."}
```

- [ ] **Step 5.4: LoRA fine-tuning script**

`src/finetune.py` — use TRL's `SFTTrainer` with LoRA config (`peft`). Train for 2-3 epochs on a single A100 or RTX 4090 (or rent a runpod/vast.ai instance for 4-8 hours).

- [ ] **Step 5.5: Quantization script**

`src/quantize.py` — use AutoGPTQ to quantize the LoRA-merged model to 4-bit. Compare quality before/after.

- [ ] **Step 5.6: Benchmark**

`src/benchmark.py` — measure:
- Memory footprint (GPU MB) before / after quantization
- Tokens-per-second on a fixed test prompt
- Quality regression (sample 50 prompts, eval by Claude-judge or human)

- [ ] **Step 5.7: Writeup README**

Document: dataset size, training time, LoRA config, quantization config, benchmark numbers (memory / speed / quality delta).

- [ ] **Step 5.8: Publish repo**

```bash
gh repo create webkoth/llm-finetune-experiment --public --description "LoRA fine-tuning + GPTQ quantization of Qwen-7B on domain data — benchmarks and writeup"
git push -u origin main
```

Do **not** push the actual fine-tuned model weights (too large for git, see Hugging Face Hub for that).

- [ ] **Step 5.9: Update cv.ts**

Add to `skills > AI / LLM`:

```ts
{ name: "Fine-tuning (LoRA)", maturity: "production" },
{ name: "Quantization (GPTQ / AWQ)", maturity: "production" },
```

Add to `productionAI`:

```ts
{
  title: "LoRA fine-tuning + GPTQ quantization of Qwen-7B",
  body: "Domain fine-tuning of Qwen-7B with LoRA; 4-bit GPTQ quantization. Benchmarks for memory, throughput, quality regression.",
  evidence: "github.com/webkoth/llm-finetune-experiment",
},
```

- [ ] **Step 5.10: Verify + Commit + Deploy**

---

### Task 6: Prometheus + Grafana on HubMarket

**Goal:** Add Prometheus metrics to HubMarket; visualize in a Grafana dashboard. Closes the JD-fit gap for «Prometheus, Grafana» observability.

**Total effort:** 1-2 days

- [ ] **Step 6.1: Add Prometheus client to HubMarket**

In HubMarket's Hono backend, install `prom-client`. Expose `/metrics` endpoint with default Node metrics + custom counters:

```ts
import client from "prom-client";

const llmRequestCount = new client.Counter({
  name: "llm_requests_total",
  help: "Total LLM requests",
  labelNames: ["provider", "model", "status"],
});

const llmLatency = new client.Histogram({
  name: "llm_request_duration_seconds",
  help: "LLM request duration",
  labelNames: ["provider", "model"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
});

const llmCost = new client.Counter({
  name: "llm_cost_usd_total",
  help: "Total LLM cost in USD",
  labelNames: ["provider", "model"],
});

app.get("/metrics", async (c) => {
  c.header("Content-Type", client.register.contentType);
  return c.text(await client.register.metrics());
});
```

Wire counters/histograms into the LLM cascade module.

- [ ] **Step 6.2: Set up Prometheus + Grafana via docker-compose**

In HubMarket repo, create `docker-compose.observability.yml`:

```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml
    ports: ["9090:9090"]
  grafana:
    image: grafana/grafana
    ports: ["3001:3000"]
    volumes:
      - grafana-data:/var/lib/grafana
volumes:
  grafana-data:
```

And `observability/prometheus.yml` scraping HubMarket's `/metrics`.

- [ ] **Step 6.3: Build a Grafana dashboard**

Manually build a dashboard with 4-6 panels (LLM cost over time, fallback rate, latency p99, error rate). Export as JSON to `observability/grafana-dashboard.json`.

- [ ] **Step 6.4: Capture screenshot of running dashboard**

After 1-2 days of real data accumulation, screenshot the dashboard.

- [ ] **Step 6.5: Document in HubMarket repo + write public excerpt**

In HubMarket: `docs/observability.md` with the architecture. Public excerpt: post screenshot to dev.to / Habr OR add to webkoth case-study page.

- [ ] **Step 6.6: Update webkoth**

`cv.ts > skills > DevOps / Tooling`:

```ts
{ name: "Prometheus / Grafana", maturity: "production" },
```

`cv.ts > productionAI` — add achievement:

```ts
{
  title: "Prometheus + Grafana on HubMarket",
  body: "Exported LLM cascade metrics (cost, latency p99, fallback rate, error rate) via prom-client; built Grafana dashboard.",
  evidence: "Screenshot in case-study writeup",
},
```

- [ ] **Step 6.7: Visual + Commit + Deploy**

---

### Task 7: vLLM self-hosted Llama

**Goal:** Self-host a Llama-3-8B model with vLLM, expose API, benchmark. Closes JD-fit gap for «vLLM, self-hosted LLM, on-premise».

**Total effort:** 2-3 days

- [ ] **Step 7.1: Scaffold repo**

```bash
mkdir -p ~/projects/vllm-llama-self-host
cd ~/projects/vllm-llama-self-host
git init
```

- [ ] **Step 7.2: Set up vLLM server**

Rent a GPU instance (runpod / vast.ai). Install vLLM:

```bash
pip install vllm
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --port 8000
```

This exposes an OpenAI-compatible API at `localhost:8000`.

- [ ] **Step 7.3: Benchmark vs hosted Claude**

Write `src/benchmark.py`: send the same 50 prompts to vLLM (self-hosted Llama) and to Claude (Anthropic). Measure: latency, cost (vLLM free; Claude per-token), quality (human eval or judge-LLM).

- [ ] **Step 7.4: Writeup README**

Sections: setup steps, GPU requirements, latency / cost / quality results, lessons (when self-hosted makes sense vs hosted).

- [ ] **Step 7.5: Publish repo**

```bash
gh repo create webkoth/vllm-llama-self-host --public --description "Self-hosting Llama-3-8B with vLLM — setup, benchmarks, vs hosted Claude comparison"
git push -u origin main
```

- [ ] **Step 7.6: Update webkoth**

`cv.ts > skills > AI / LLM` — promote `self-hosted (Ollama / vLLM)` from `touch` to `production`. Add separate `vLLM` chip if not present.

Add to `productionAI`:

```ts
{
  title: "Self-hosted Llama-3-8B with vLLM",
  body: "Self-hosted Llama-3-8B-Instruct on a single A100 via vLLM; OpenAI-compatible API; benchmarked vs Anthropic Claude.",
  evidence: "github.com/webkoth/vllm-llama-self-host",
},
```

- [ ] **Step 7.7: Visual + Commit + Deploy**

---

## Phase 3: Tier 3 backlog (deferred — execute by signals)

These are not scheduled. Execute only when a signal arrives: a recruiter explicitly asks about one, or a job description repeatedly mentions one, or the topic shows up in 3+ rejected interviews.

### Task 8 (deferred): ChromaDB / Weaviate swap demo
Build a small repo that swaps HubMarket's pgvector for ChromaDB AND for Weaviate. Compare ergonomics + perf.
Estimate: 2 days.

### Task 9 (deferred): Graph RAG prototype
Build a Graph RAG over a small docs corpus (e.g. own blog posts) using llama-index or custom code. Compare vs flat RAG.
Estimate: 3-5 days.

### Task 10 (deferred): Constrained Decoding example
Add JSON-schema-enforced output to an MCP server (e.g. extend timeweb-mcp-server with `outlines` library).
Estimate: 2-3 days.

### Task 11 (deferred): HITL pipeline formal architecture
Build a small example of a human-in-the-loop AI pipeline (e.g., AI generates email draft → human approves in UI → email sent).
Estimate: 2-3 days.

### Task 12 (deferred): Kafka in HubMarket
Replace pg-boss in one HubMarket workflow with Kafka (Confluent Cloud or self-hosted). Compare.
Estimate: 3-4 days. Low priority for solo dev (operational overhead).

---

## Post-each-task: anti-заглушка check

After EVERY Phase 1/2/3 task completes, before merging the webkoth-side update, run this check:

- [ ] **Check 1:** Public GitHub repo exists and is accessible without auth.
- [ ] **Check 2:** README contains: description, quickstart, what was built.
- [ ] **Check 3:** (if npm package) npmjs.com/package/<name> resolves and shows the package.
- [ ] **Check 4:** README has a link back to webkoth.com (so a recruiter who finds the repo can find your services).
- [ ] **Check 5:** The webkoth-side update (cv.ts, copy-i18n.ts) references the repo by its actual URL, not «coming soon» / «in development».

If ANY check fails, the webkoth-side update is **NOT mergeable**. Either finish the pet-project to the standard, or hold the webkoth update.

---

## Out of Scope

- **Choosing whether to register a separate handle on npm/GitHub** — assume `webkoth` is the canonical handle.
- **Optimization of GPU rental costs** for Task 5/7 — Минас's call.
- **Translations of pet-project READMEs** — English-only is fine for pet-projects; translation only matters for webkoth-side copy.
- **Tier 3 detailed planning** — these are deliberately less detailed because their priorities will shift based on real recruiter feedback.

## Self-Review Notes

- Anti-заглушка principle is Task 0 — non-skippable — and re-enforced as a post-each-task check.
- Phase 0 explicitly states the prerequisite (Plans 1+2 done + claims reconciled).
- Tier 1 starts with the fastest unlock (HubMarket stocksync, 1-2 days, documentation only) — maximizes momentum and unblocks Hero promise validity sooner.
- Each Tier 1 task has a webkoth-update sub-step so the planning loop closes.
- Tier 3 backlog is explicitly «signal-driven, not scheduled» — avoids over-planning low-confidence work.
- Reconciliation of «3 MCP servers on npm» claim is repeatedly flagged (Tasks P0.2, 2.9) — keep it visible until resolved.
- Cross-link to Plans 1 and 2 is maintained so the executor can navigate between plans.
