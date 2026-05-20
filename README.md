# webkoth · AI Integration

> I ship AI into products. From idea to production. One person, end-to-end.

**Audit in 1 day · MVP in 1 week.**

[![webkoth.com](https://img.shields.io/badge/site-webkoth.com-007492?style=flat-square)](https://webkoth.com)
[![CV](https://img.shields.io/badge/CV-webkoth.com%2Fminasarkisyan-007492?style=flat-square)](https://webkoth.com/minasarkisyan)
[![Telegram](https://img.shields.io/badge/Telegram-@abnorsky-26a5e4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/abnorsky)
[![Calendar](https://img.shields.io/badge/Book%2015--min-Google%20Calendar-34a853?style=flat-square)](https://calendar.app.google/jY324Q2AHe1apJo79)

---

I'm **Minas Sarkisyan** — senior fullstack engineer, 9+ years in production, 2.5+ years shipping AI features into real products.

I work as a single contractor from idea to prod — no agency handoffs, no account managers. The code you see is my code.

## What I solve

- **RAG** — search across your docs and knowledge base
- **LLM agents** — tool use, orchestration, autonomous workflows
- **MCP servers** — connect your API/service to Claude and other agents (3 published on npm)
- **Multi-provider cascade** — Claude → Gemini → Groq fallback, no vendor lock-in
- **Document pipelines** — OCR → LLM → structured data
- **AI features in existing products** — no rewrites, clean integration

## Featured work

### HubMarket — AI-SaaS for marketplace sellers

Founder + sole developer · production · 3 marketplaces (WB, Ozon, Yandex Market) · 0 LLM downtime via cascade

`Next.js 16` `React 19` `Hono` `Prisma` `pg-boss` `Vercel AI SDK` `Python/FastAPI`

### timeweb-mcp-server — open-source MCP for Timeweb Cloud

[![npm downloads](https://img.shields.io/npm/dw/timeweb-mcp-server?style=flat-square&color=cb3837)](https://www.npmjs.com/package/timeweb-mcp-server)
[![GitHub stars](https://img.shields.io/github/stars/webkoth/timeweb-mcp-server?style=flat-square)](https://github.com/webkoth/timeweb-mcp-server)

`Node.js` `TypeScript` `MCP SDK`

### Other production work

AI OCR ⇢ GPT (Skolkovo) · AI Landing builder · Lenderkit fintech (50+ engineers) · ERP oil & gas (500+ users) · 1+ TB analytics

→ Full portfolio: **[webkoth.com/minasarkisyan](https://webkoth.com/minasarkisyan)**

## Daily stack

**AI:** Claude, Gemini, Groq, Yandex GPT · MCP · Vercel AI SDK · pgvector

**Backend:** Next.js, Hono, FastAPI, PHP/Laravel · Postgres, ClickHouse, Redis · pg-boss queues

**Frontend:** React 19, Vue 3, TypeScript, Tailwind v4, shadcn/ui

**DevOps:** Docker, Linux, Cloudflare, PM2

**Tooling:** Claude Code, Cursor (daily)

## About this repo

This is the source for **[webkoth.com](https://webkoth.com)** — the bilingual (RU / EN) landing for my AI integration service plus CV at `/minasarkisyan`.

Built with Next.js 16 (Turbopack), React 19, Tailwind v4, shadcn/ui (base-vega + Base UI primitives), Framer Motion, Shiki, Mermaid.

## Get in touch

- Site: **[webkoth.com](https://webkoth.com)**
- CV: [webkoth.com/minasarkisyan](https://webkoth.com/minasarkisyan)
- Book a 15-min Discovery: [Google Calendar](https://calendar.app.google/jY324Q2AHe1apJo79)
- Telegram: [@abnorsky](https://t.me/abnorsky)
- Email: webkoth@gmail.com

---

## Changelog

### 2026-05-20 — CV redesign (`/[lang]/minasarkisyan`)

- Two-layer structure: above-the-fold pitch + 8 deep sections (Production AI, Open Source / MCP, Skills, Experience, Portfolio, Education, Content, Final Hire CTA)
- Single-column vertical-flow layout (dropped 2-column sidebar)
- Removed 0-100 progress bars on skills; replaced with categorized chips + production/touch maturity markers
- New sections: Production AI / LLM achievements, Open Source / MCP packages, Content & Channels, Hire CTA (x2 on page)
- AI / AI-adjacent chips on portfolio cards; AI markers on Skolkovo + MPSTATS experience entries
- SEO updates: keyword-dense title + description, 28 keywords array, robots index:true, expanded JSON-LD knowsAbout with AI engineering terms
- New portfolio entry at top: HubMarket stocksync (B-Sprint case, founder 3-day delivery)

**Reconciliation note:** `pitch` and `metrics` claim "3 MCP servers on npm" — only `timeweb-mcp-server` is verified public. Either lower the claim to 1, or ship Pet-projects Tier 1 Task 2 (4th MCP server) before publishing. The CV is otherwise ready to deploy.

Plans: `docs/superpowers/plans/2026-05-20-cv-redesign.md`
PRD: [#2](https://github.com/webkoth/webkoth/issues/2)

### 2026-05-20 — Landing rewrite

- Hero repositioned to «Production AI в вашем продукте — за дни, не за кварталы.»
- Pricing restructured into 3 audience-segmented packages (founder / SMB / agency)
- TaskGrid items rewritten as outcome vignettes (trigger → action → outcome with a number)
- New Tech Stack section with 6 categorized chip groups + multi-provider cascade mermaid diagram
- Roadmap redesigned as vertical zigzag timeline (chaseai.io-inspired)
- Audience tags on all 7 case cards; new HubMarket stocksync case (founder 3-day delivery proof)
- FAQ extended +4 items (sprint templates / whitelabel / code ownership / post-free-month support)
- Lead-form: audience selector + progress indicator + altChannels escape hatch at top + new package/budget options
- Hero code mockup: outcome comments (latency / cost / uptime)
- HubMarket featured: +4th metric («cycle from feature-request to prod: 3-4 days»)
- «Один X» positioning removed from Hero / WhyMe / FAQ — replaced with positive framings

Plans: `docs/superpowers/plans/2026-05-20-landing-rewrite.md`
PRD: [#1](https://github.com/webkoth/webkoth/issues/1) · Slices: [#4](https://github.com/webkoth/webkoth/issues/4)–[#11](https://github.com/webkoth/webkoth/issues/11)
