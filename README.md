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

This is the source for **[webkoth.com](https://webkoth.com)** — the bilingual (RU at `/`, EN at `/en`) landing «Эволюция бизнеса / Business evolution», case pages at `/ru/cases/…` · `/en/cases/…` and CV at `/ru/minasarkisyan` · `/en/minasarkisyan`.

Layout: all page copy lives in `app/data/evolution/{ru,en}.ts` (shared type in `types.ts`), case copy in `app/data/cases/{ru,en}.ts` over the language-neutral `registry.ts`, page composition in `components/evolution/evolution-page.tsx`, one-shot SVG scenes in `components/evolution/animations/`, lead API at `app/api/evolution/lead`. Redirects (`/ru`, `/evolution`, `/minasarkisyan`, `/cases/:slug`) are in `next.config.mjs`; `/llms.txt` and `sitemap.xml` are generated from the same data.

Built with Next.js 16 (Turbopack), React 19, Tailwind v4, shadcn/ui (base-vega + Base UI primitives), Framer Motion, Shiki, Mermaid.

## Get in touch

- Site: **[webkoth.com](https://webkoth.com)**
- CV: [webkoth.com/minasarkisyan](https://webkoth.com/minasarkisyan)
- Book a 15-min Discovery: [Google Calendar](https://calendar.app.google/jY324Q2AHe1apJo79)
- Telegram: [@abnorsky](https://t.me/abnorsky)
- Email: webkoth@gmail.com

---

## Changelog

### 2026-08-23 — Cases: business-level cards, carousels, case pages

- Cases no longer belong to a single block. The unit of data is a **system** (13 of them, one case page per language), the unit of display is an **angle** — a system × block pair with its own pain/outcome and characteristics (23 angles). A system shown in several blocks carries a «the same system pays off across N more steps» badge, with its own wording when there is exactly one
- Card characteristics are business-level and come from a closed vocabulary of eight icons (scale, timeline, who maintains it, what it replaced, money, trust in the numbers, what now runs itself, coverage), 2–3 per angle — lines of code, commits and DB models are gone. Optional share bar renders only where a real ratio exists (4 angles of 23)
- New `app/data/cases/`: `registry.ts` (language-neutral structure), `types.ts`, `ru.ts`/`en.ts` (copy), `index.ts` (selectors), `cases.test.ts` — locale parity of shape, 2–3 chips with length caps, block balance 3–4, blocks in page order, effects table matching `meta.blocks`, oss/internal links, screenshot captions, `metaDescription` ≤ 160, `{i}`/`{n}` placeholders
- `components/evolution/case-card.tsx` + `case-carousel.tsx` — one card per view, autoplay every 7 s; paused on hover, on focus within, while under 20 % in view and while the tab is in the background; never starts under `prefers-reduced-motion`; stopped for good once the reader takes over (arrow, dot, horizontal swipe or focus landing inside a card). CSS scroll-snap, no new dependency. Each of the six carousels is named after its own step for screen readers
- Case pages at `/[lang]/cases/[slug]` (26 static pages): facts panel (sticky from `lg`, right under the heading on narrow screens), effects-across-steps table for systems with more than one angle, diagram, before/after tabs, screenshots section (wired, the anonymised shots come separately), stack, links, sibling cases of the same step. `/cases/:slug` → `/ru/cases/:slug` (308)
- Data-flow and before/after exhibits moved into case data (`components/cases/case-diagram.tsx` draws the flow from `detail.diagramNodes`); the launch table (step 05) and the 43/73/73 % shares (step 06) stay on the landing and moved **above** the carousel
- `case-plaque.tsx` and the per-block `caseLabel` / `caseBody` / `mainFact` / `facts` copy fields are gone; `/llms.txt` lists every angle under its step — with its type · status and repository / product links, so open-source work reads as an equal there too — and `sitemap.xml` grew to 30 URLs

### 2026-08-22 — «Эволюция бизнеса» becomes the home page (`/`, `/en`); old landing removed

- Root `/` now serves the Evolution landing directly (RU); full English version at `/en` («I»-form, same structure). Language toggle in the header (`/` ↔ `/en`, CV `/ru/…` ↔ `/en/…`), `hreflang` ru/en/x-default=ru, sitemap updated
- Carried over from the old landing: the live **production-stack** scene in the hero (right column), the named **HubMarket.ru** case (interactive architecture diagram + stack + 4 product screenshots, account sidebar cropped off) and **«От идеи до прода»** rewritten for the new offer (Разбор → Аудит и карта → Запуск первого процесса → Сопровождение; no prices)
- Copy split into `app/data/evolution/{ru,en}.ts` with a shared `EvolutionData` type; SVG scene labels parametrised per language
- Redirects in `next.config.mjs`: `/ru` → `/`, `/evolution` → `/`, `/minasarkisyan` → `/ru/minasarkisyan`; `proxy.ts` removed
- Lead form sends `lang`; Telegram/email notification is marked «Главная webkoth.com (RU · /)» / «(EN · /en)»
- `/llms.txt` rebuilt from the new data (RU + EN)
- Removed: `app/[lang]/page.tsx` + layout, `components/landing/*` (except `magnetic.tsx` used by ui-kit and `page-background.tsx` used by CV), `copy-i18n.ts`, `lib/landing-markdown.ts`, JSON-LD ProfessionalService with old package prices, `/api/lead`, `lib/landing/pricing.ts`, leftover `components/marketplaces/*`; `lib/marketplaces/delivery.ts` moved to `lib/evolution/delivery.ts`
- Single set of handles site-wide: Telegram `@abnorsky`, GitHub `webkoth`, YouTube `@msarkisyan`

### 2026-08-22 — Landing «Эволюция бизнеса» (`/evolution`)

- New RU-only landing at `/evolution`, outside `[lang]` (whitelisted in `proxy.ts`, added to sitemap)
- Structure follows `../docs/2026-08-22-landing-evolyuciya-biznesa.md`: Hero → 6 postulate blocks (system / money / decisions / automation / speed / resources) → finale with manifesto, «graveyard» table (4 attempts, 3 stopped, 1 alive) and lead form
- One visual metaphor across the page — «chaos becomes order»: canvas particle field that settles into a living grid (`components/evolution/particle-field.tsx`) + 7 one-shot SVG/framer-motion scenes in `components/evolution/animations/` (play once on viewport entry, final state under `prefers-reduced-motion`, deterministic seeded layouts for SSR)
- All copy in `app/data/evolution.ts` («я»-form). Case facts are anonymised git numbers — no client names, no employee names, no revenue
- Lead form (name · contact · «Что уже пробовали с ИИ и что из этого работает?») → `POST /api/evolution/lead` → Telegram + email-relay, same protections as `/marketplaces` (honeypot, min-fill-time, rate limit); schema + Telegram text covered by vitest

### 2026-05-20 — Pet-projects Tier 1 Task 1 (in-repo portion)

- New case page at `/[lang]/cases/hubmarket-stocksync` — backs the founder-tagged case card on landing and the «B-Sprint case» portfolio entry on CV
- Bilingual (RU+EN), contains: timeline (4 days), decisions made (Playwright vs official APIs, pg-boss as queue, deltas vs snapshots), outcome bullets, stack
- Resolves the cross-PRD dependency: stocksync card on landing no longer links to a 404

Pet-projects PRD remaining items (Tier 1 Task 2 — 4th MCP server, Tier 1 Task 3 — eval pipeline, Tier 2 backlog) are external work (separate GitHub repos, GPU rental, etc.) and are not implemented in this branch. See `docs/superpowers/plans/2026-05-20-pet-projects.md` for the full backlog.

Plans: `docs/superpowers/plans/2026-05-20-pet-projects.md`
PRD: [#3](https://github.com/webkoth/webkoth/issues/3)

### 2026-05-20 — CV redesign (`/[lang]/minasarkisyan`)

- Two-layer structure: above-the-fold pitch + 8 deep sections (Production AI, Open Source / MCP, Skills, Experience, Portfolio, Education, Content, Final Hire CTA)
- Single-column vertical-flow layout (dropped 2-column sidebar)
- Removed 0-100 progress bars on skills; replaced with categorized chips + production/touch maturity markers
- New sections: Production AI / LLM achievements, Open Source / MCP packages, Content & Channels, Hire CTA (x2 on page)
- AI / AI-adjacent chips on portfolio cards; AI markers on Skolkovo + MPSTATS experience entries
- SEO updates: keyword-dense title + description, 28 keywords array, robots index:true, expanded JSON-LD knowsAbout with AI engineering terms
- New portfolio entry at top: HubMarket stocksync (B-Sprint case, founder 3-day delivery)

**MCP count update (resolved 2026-05-20):** `pitch`/`metrics`/`chipGroups` now reflect **7 MCP servers on npm (including 3 for marketplaces)**. Previous reconciliation flag closed.

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
