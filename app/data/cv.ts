
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

const CALENDAR_URL = "https://calendar.app.google/jY324Q2AHe1apJo79";

export const cvData: Record<"en" | "ru", CVData> = {
  en: {
    name: "Minas Sarkisyan",
    role: "Senior Fullstack & AI Engineer",
    roleSub: "Production AI since 2023: MCP, multi-provider cascade, RAG, agents",
    location: "Krasnodar, Russia · Remote / Hybrid · open to relocation",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Fullstack Engineer with 9 years of production experience in PHP/Laravel and the modern JS stack (TypeScript, React 19, Next.js 16, Vue 3). For the last 2.5 years deeply embedded in production AI: multi-provider LLM cascades (Claude + Gemini + Groq), RAG, AI agents, and 7 published MCP servers on npm (including 3 for marketplaces). Currently supporting 5+ products in the Skolkovo School of Management ecosystem and building HubMarket — an AI-powered SaaS for marketplace sellers (Wildberries, Ozon, Yandex Market).",
    pitch: "9 years fullstack in production, 2.5 years deep with LLMs. 7 published MCP servers on npm (including 3 for marketplaces). Currently: Skolkovo School (5+ products on support) + HubMarket (AI-SaaS, founder + sole dev).",
    metrics: [
      { value: 9, suffix: "+", label: "yrs fullstack" },
      { value: 2.5, suffix: "", label: "yrs production AI" },
      { value: 7, suffix: "", label: "npm MCP servers" },
      { value: 5, suffix: "+", label: "products live" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["Python 3.10+", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono", "PHP 8 / Laravel"],
      },
      {
        groupLabel: "AI / LLM",
        chips: ["Anthropic Claude", "OpenAI", "Google Gemini", "Yandex GPT", "Groq", "MCP (7 servers on npm, +3 for marketplaces)", "Multi-provider cascade", "RAG", "structured output", "tool calling", "pgvector", "Vercel AI SDK"],
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
      secondaryUrl: CALENDAR_URL,
      emailLabel: "webkoth@gmail.com",
    },
    skills: [
      {
        category: "AI / LLM",
        items: [
          { name: "Anthropic Claude", maturity: "production" },
          { name: "OpenAI", maturity: "production" },
          { name: "Google Gemini", maturity: "production" },
          { name: "Yandex GPT", maturity: "production" },
          { name: "Groq", maturity: "production" },
          { name: "MCP (7 servers on npm)", maturity: "production" },
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
    productionAI: [
      {
        title: "Multi-provider LLM cascade in HubMarket",
        body: "Architecture with Claude, Gemini, Groq fallback chain: 0 LLM downtime over 8 months in prod. Automatic cost-log and quality-drift tracking.",
        evidence: "Featured case on webkoth.com",
      },
      {
        title: "RAG systems and vector search",
        body: "pgvector in HubMarket (production), Yandex GPT pipeline in Skolkovo. Embeddings, chunking, retrieval tuning for domain data.",
        evidence: "HubMarket + AI document recognition service in Skolkovo",
      },
      {
        title: "MCP servers for agentic automation",
        body: "7 MCP servers published on npm, including 3 marketplace-specific ones (WB, Ozon, Yandex Market) on top of Timeweb Cloud API coverage (servers, DBs, K8s, S3, DNS). Used by AI agents from Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth",
      },
      {
        title: "Document pipelines (OCR, LLM, structured output)",
        body: "Production AI document recognition service in Skolkovo: PDF passed through Yandex OCR, then Yandex GPT for structured output, then DB write with educational program linkage.",
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
    experience: [
      {
        period: "2024-11 — present",
        role: "Senior Fullstack Engineer",
        company: "Skolkovo School of Management",
        type: "remote",
        aiMarker: "AI / LLM in production (5+ products: OCR, AI-builder, RAG)",
        description: [
          "Support 5+ products in parallel within the school's digital ecosystem",
          "AI document recognition service (Yandex OCR feeding Yandex GPT, async queues)",
          "AI landing builder with two providers: GPT-4o-mini for text + NanoBanano for images",
          "Private alumni social network (Laravel 12, Vue 3 + TypeScript, REST API on 100+ endpoints)",
          "High-load loyalty backend on Octane + Swoole + Reverb + Horizon + Pennant",
          "Also: OAuth/SSO, LDAP microservice, digital signage, billing, Wildberries API integration",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "remote",
        aiMarker: "Data-intensive (1+ TB) — foundation for embeddings / RAG",
        description: [
          "High-load Laravel microservices for marketplace e-commerce analytics — processing 1+ TB of data.",
          "Optimised critical APIs: −20% latency, +30% throughput via SQL, indexes, Redis.",
          "ETL/ELT pipelines on Pandas + NumPy, APIs for BI dashboards.",
          "Stack: PostgreSQL, ClickHouse, MongoDB, MySQL, Redis, Pandas, NumPy.",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "office",
        description: [
          "Support ERP system for an oil & gas company — 500+ users.",
          "Modules: warehouse, procurement, sales, finance. Laravel + Oracle / PostgreSQL.",
          "Docker microservices, REST API for mobile apps with OAuth 2.0 + JWT.",
          "Microservices-based crypto exchange (Lumen + RabbitMQ + PostgreSQL + Redis).",
          "Frontend in React and Vue.js, GitLab CI/CD, load testing.",
          "Corporate medical software development — support and development of internal services for 100+ doctors and administrators.",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP Developer (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "office",
        description: [
          "Core team of the Lenderkit.com fintech platform (50+ engineers).",
          "Document validation modules, crypto wallet integration, REST API for web and mobile.",
          "Team Lead on a client project — managed a team of 5 developers, delivered on time and on budget.",
          "Integrations: Polymesh (blockchain), DocuSign.",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "office",
        description: [
          "Full-cycle: backend (Laravel) + frontend (Vue.js, React, jQuery).",
          "Production servers (Linux, Nginx, Docker, SSL), CMS customisation (OpenCart).",
          "Responsive layouts (HTML5/CSS3, Bootstrap, Tailwind), UX/UI optimisation.",
          "SEO optimisation, meta tags, XML sitemaps, monitoring and logging.",
        ],
      },
    ],
    education: {
      degree: "Specialist degree (2010) · OTUS PHP Developer (2019) · SOLOLEARN PHP (2017)",
      university: "KhNADU (Kharkiv National Automobile and Highway University)",
      faculty: "Transportation Systems",
    },
    portfolio: [
      {
        title: "HubMarket: Marketplace stock sync (B-Sprint case)",
        stack: ["Next.js", "Hono", "Playwright", "pg-boss"],
        team: "1 fullstack (from founder request to prod in 3 days)",
        functionality:
          "Production B-Sprint exemplar: founder request, architecture, implementation, handover to prod in 3 days. Stock sync across 3 marketplaces (WB, Ozon, Yandex Market) for a HubMarket customer. Full writeup: webkoth.com/cases/hubmarket-stocksync.",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket — AI-SaaS for marketplace sellers",
        stack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Prisma 7",
          "PostgreSQL",
          "Vercel AI SDK",
          "Hono",
          "Python / FastAPI",
          "Playwright",
        ],
        team: "Founder + sole developer",
        functionality:
          "Analytics & automation for WB / Ozon / Yandex Market sellers. Bronze-to-Silver data lake, multi-provider LLM cascade (Claude + Gemini + Groq), Playwright-based marketplace parser, FastAPI document parser for Russian self-employment tax, Telegram bot (grammy + Pyrogram MTProto), YooKassa subscriptions, Chrome MV3 extension.",
        technologies: [
          "pg-boss",
          "Sentry",
          "pino",
          "Zod",
          "PostHog",
          "Cloudflare Workers",
        ],
        aiTag: "AI",
      },
      {
        title: "AI document recognition service (Skolkovo)",
        stack: [
          "Laravel 12",
          "PHP 8.3+",
          "Vue 3",
          "Inertia.js",
          "Tailwind 4",
          "Yandex OCR",
          "Yandex GPT",
        ],
        team: "1 fullstack + BA + QA",
        functionality:
          "Production AI pipeline: PDF upload, Yandex OCR for text recognition, Yandex GPT for data structuring, DB write with educational program / student linkage. Async queues for heavy files, admin panel.",
        technologies: ["GIT", "Docker", "MySQL", "Yandex Cloud API"],
        aiTag: "AI",
      },
      {
        title: "AI landing builder with dual AI providers (Skolkovo)",
        stack: [
          "Vue 3",
          "Tailwind",
          "PHP",
          "SQLite",
          "GPT-4o-mini",
          "NanoBanano",
        ],
        team: "1 fullstack",
        functionality:
          "Drag & drop block editor with inline Tailwind class editing. Two production AI integrations: GPT-4o-mini for text generation/improvement, NanoBanano for image generation/enhancement. 21 ready blocks, multi-page landings, HTML export.",
        technologies: ["GIT", "Docker", "OpenAI API"],
        aiTag: "AI",
      },
      {
        title:
          "timeweb-mcp-server — open-source MCP server (npm)",
        stack: ["Node.js", "TypeScript", "MCP SDK", "Timeweb Cloud API"],
        team: "Solo (open source)",
        functionality:
          "Full Timeweb Cloud API coverage: cloud servers, databases (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, domains. Used by AI agents to automate deployments from Claude Desktop / Claude Code / Cursor.",
        technologies: ["npm", "GitHub", "REST API"],
        aiTag: "AI",
      },
      {
        title: "High-load loyalty backend (Skolkovo)",
        stack: [
          "PHP 8.2",
          "Laravel 10",
          "Octane + Swoole",
          "Reverb (WebSocket)",
          "Horizon",
          "Passport",
          "Pennant",
        ],
        team: "2 backend + 1 frontend + BA + QA",
        functionality:
          "Loyalty program backend for the school ecosystem: points balances, transactions, privileges, tiers, badges, referral codes, promo codes, donation collection. Real-time events via Reverb.",
        technologies: [
          "MySQL",
          "Redis",
          "PHPUnit + Paratest",
          "Mailgun",
          "Telegram",
        ],
        aiTag: null,
      },
      {
        title: "ERP system for an oil & gas company (Itpelag)",
        stack: [
          "PHP 7.3+",
          "Laravel",
          "Oracle",
          "PostgreSQL",
          "Redis",
          "React",
          "Vue.js",
        ],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality:
          "Full ERP from scratch for 500+ users. Warehouse, procurement, sales, finance modules. Microservices on Docker, REST API for mobile apps with OAuth 2.0 + JWT, load testing.",
        technologies: ["GIT", "Jira", "GitLab CI/CD", "Docker", "ssh"],
        aiTag: null,
      },
      {
        title: "Lenderkit.com — fintech platform (Justcoded)",
        stack: ["PHP 8", "Laravel", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality:
          "Core team of a fintech investment product (50+ engineers). Document validation modules, crypto wallet integration, REST API. Integrations: Polymesh (blockchain), DocuSign. Team Lead on a client project (5 developers).",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
        aiTag: null,
      },
      {
        title: "E-commerce analytics on 1+ TB data (MPSTATS)",
        stack: [
          "Laravel",
          "PostgreSQL",
          "ClickHouse",
          "MongoDB",
          "MySQL",
          "Redis",
          "Pandas",
          "NumPy",
        ],
        team: "Product team",
        functionality:
          "High-load Laravel microservices for marketplace e-commerce analytics — 1+ TB of data. ETL/ELT pipelines, BI dashboard APIs, automation of routine seller tasks. Optimised critical APIs: −20% latency, +30% throughput.",
        technologies: ["GIT", "Telescope", "Horizon", "GitLab CI/CD"],
        aiTag: "AI-adjacent",
      },
      {
        title: "Microservices crypto exchange (Itpelag)",
        stack: [
          "PHP 8.1",
          "Laravel 10 (Lumen)",
          "PostgreSQL",
          "Redis",
          "RabbitMQ",
        ],
        team: "4+ backend + 2 frontend + Teamlead + PM + BA + QA",
        functionality:
          "Microservices for crypto exchange and external wallet integrations.",
        technologies: ["GIT", "Docker", "Microservices"],
        aiTag: null,
      },
    ],
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
        caption: "MCP servers published",
      },
      {
        platform: "telegram",
        label: "Telegram @abnorsky",
        url: "https://t.me/abnorsky",
        caption: "Direct contact",
      },
    ],
    video: {
      title: "My YouTube Channel",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },

  ru: {
    name: "Минас Саркисян",
    role: "Senior Fullstack & AI Engineer",
    roleSub: "Production AI с 2023: MCP, multi-provider cascade, RAG, агенты",
    location: "Краснодар · Удалённо / Гибрид · готов к переезду",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Fullstack-инженер с 9 годами production-опыта в PHP/Laravel и современном JS-стеке (TypeScript, React 19, Next.js 16, Vue 3). Последние 2.5 года плотно работаю с LLM в продакшене: мульти-провайдерные каскады (Claude + Gemini + Groq), RAG, AI-агенты и 7 опубликованных MCP-серверов на npm (включая 3 для маркетплейсов). Сейчас support 5+ продуктов в Школе управления Сколково и AI-SaaS HubMarket для селлеров маркетплейсов (Wildberries, Ozon, Yandex Market).",
    pitch: "9 лет в проде fullstack, 2.5 года плотно с LLM. 7 опубликованных MCP-серверов на npm (включая 3 для маркетплейсов). Сейчас — Сколково (5+ продуктов в поддержке) + HubMarket (AI-SaaS, founder + sole dev).",
    metrics: [
      { value: 9, suffix: "+", label: "лет fullstack" },
      { value: 2.5, suffix: "", label: "года production AI" },
      { value: 7, suffix: "", label: "MCP-сервера на npm" },
      { value: 5, suffix: "+", label: "продуктов в проде" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["Python 3.10+", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono", "PHP 8 / Laravel"],
      },
      {
        groupLabel: "AI / LLM",
        chips: ["Anthropic Claude", "OpenAI", "Google Gemini", "Yandex GPT", "Groq", "MCP (7 серверов на npm, +3 для маркетплейсов)", "Multi-provider cascade", "RAG", "structured output", "tool calling", "pgvector", "Vercel AI SDK"],
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
        chips: ["Sentry", "pino", "PostHog", "Claude Code (ежедневно)", "Cursor (ежедневно)"],
      },
    ],
    hireCta: {
      headline: "Готов обсудить вакансию или контракт",
      body: "Удалённо / гибрид",
      primaryLabel: "Telegram: @abnorsky",
      primaryUrl: "https://t.me/abnorsky",
      secondaryLabel: "15-мин звонок (Calendar)",
      secondaryUrl: CALENDAR_URL,
      emailLabel: "webkoth@gmail.com",
    },
    skills: [
      {
        category: "AI / LLM",
        items: [
          { name: "Anthropic Claude", maturity: "production" },
          { name: "OpenAI", maturity: "production" },
          { name: "Google Gemini", maturity: "production" },
          { name: "Yandex GPT", maturity: "production" },
          { name: "Groq", maturity: "production" },
          { name: "MCP (7 серверов на npm)", maturity: "production" },
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
    productionAI: [
      {
        title: "Multi-provider LLM cascade в HubMarket",
        body: "Архитектура с каскадом фолбэков Claude, Gemini, Groq: 0 downtime LLM за 8 месяцев в проде. Автоматический cost-log и quality-drift отслеживание.",
        evidence: "Featured case на лендинге webkoth.com",
      },
      {
        title: "RAG-системы и vector search",
        body: "pgvector в HubMarket (production), Yandex GPT pipeline в Сколково. Эмбеддинги, chunking, retrieval-tuning под domain-данные.",
        evidence: "HubMarket + AI-сервис распознавания документов в Сколково",
      },
      {
        title: "MCP-серверы для агентной автоматизации",
        body: "7 опубликованных MCP-серверов на npm: включая 3 специализированных для маркетплейсов (WB, Ozon, Yandex Market) поверх полной поддержки Timeweb Cloud API (серверы, БД, K8s, S3, DNS). Используется AI-агентами из Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth",
      },
      {
        title: "Document-пайплайны (OCR, LLM, structured output)",
        body: "Production AI-сервис распознавания документов в Сколково: PDF проходит через Yandex OCR, затем Yandex GPT (structured output), затем запись в БД с привязкой к образовательным программам.",
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
    openSource: [
      {
        name: "timeweb-mcp-server",
        description: "Полная поддержка Timeweb Cloud API через MCP-протокол. Серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами из Claude Desktop / Claude Code / Cursor для автоматизации деплоев.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: ["Node.js + TypeScript", "MCP SDK", "Full Timeweb API coverage", "Production-ready"],
      },
    ],
    experience: [
      {
        period: "2024-11 — настоящее",
        role: "Senior Fullstack Engineer",
        company: "Школа управления Сколково",
        type: "удаленно",
        aiMarker: "AI / LLM в проде (5+ продуктов: OCR, AI-builder, RAG)",
        description: [
          "Support параллельно 5+ продуктов в цифровой экосистеме школы",
          "AI-сервис распознавания документов (Yandex OCR в связке с Yandex GPT, асинхронные очереди)",
          "AI-конструктор лендингов с двумя провайдерами: GPT-4o-mini для текста + NanoBanano для изображений",
          "Закрытая социальная сеть выпускников (Laravel 12, Vue 3 + TypeScript, REST API на 100+ эндпоинтов)",
          "High-load backend программы лояльности на Octane + Swoole + Reverb + Horizon + Pennant",
          "Также: OAuth/SSO, LDAP-микросервис, digital signage, биллинг, интеграция с Wildberries API",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "удалённо",
        aiMarker: "Data-intensive (1+ ТБ) — фундамент для embeddings / RAG",
        description: [
          "High-load Laravel микросервисы для e-commerce-аналитики маркетплейсов — обработка 1+ ТБ данных",
          "Оптимизация критических API: −20% latency, +30% throughput через сложные SQL, индексы, Redis",
          "ETL / ELT пайплайны на Pandas + NumPy, API для BI-дашбордов",
          "Стек: PostgreSQL, ClickHouse, MongoDB, MySQL, Redis, Pandas, NumPy",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "офис",
        description: [
          "Support ERP для нефтегазовой компании — 500+ пользователей.",
          "Модули: склад, закупки, продажи, финансы. Laravel + Oracle / PostgreSQL.",
          "Микросервисы на Docker, REST API для мобильных приложений с OAuth 2.0 + JWT.",
          "Микросервисная криптобиржа (Lumen + RabbitMQ + PostgreSQL + Redis).",
          "Frontend на React и Vue.js, GitLab CI/CD, нагрузочное тестирование.",
          "Корпоративная разработка медицинского ПО — поддержка и развитие внутренних сервисов для 100+ врачей и администраторов.",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP-разработчик (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "офис",
        description: [
          "Core-команда финтех-платформы Lenderkit.com (50+ инженеров).",
          "Модули валидации документов, интеграция криптокошельков, REST API для web и mobile.",
          "Team Lead на клиентском проекте — команда из 5 разработчиков, проект сдан в срок и в бюджете.",
          "Интеграции: Polymesh (blockchain), DocuSign.",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "офис",
        description: [
          "Полный цикл: backend (Laravel) + frontend (Vue.js, React, jQuery).",
          "Production-серверы (Linux, Nginx, Docker, SSL), кастомизация CMS (OpenCart).",
          "Адаптивная вёрстка (HTML5/CSS3, Bootstrap, Tailwind), оптимизация UX/UI.",
          "SEO, мета-теги, XML sitemap, мониторинг и логирование.",
        ],
      },
    ],
    education: {
      degree: "Специалист (2010) · OTUS PHP-разработчик (2019) · SOLOLEARN PHP (2017)",
      university: "ХНАДУ (Харьковский национальный автомобильно-дорожный университет)",
      faculty: "Транспортные системы",
    },
    portfolio: [
      {
        title: "HubMarket: маркетплейс-синхронизация остатков (B-Sprint case)",
        stack: ["Next.js", "Hono", "Playwright", "pg-boss"],
        team: "1 fullstack (от запроса фаундера до прода — 3 дня)",
        functionality:
          "Production-кейс founder-driven спринта: запрос, архитектура, реализация, передача в прод за 3 дня. Синхронизация остатков по 3 маркетплейсам (WB, Ozon, Yandex Market) для клиента HubMarket. Полный writeup: webkoth.com/cases/hubmarket-stocksync.",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket — AI-SaaS для селлеров маркетплейсов",
        stack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Prisma 7",
          "PostgreSQL",
          "Vercel AI SDK",
          "Hono",
          "Python / FastAPI",
          "Playwright",
        ],
        team: "Founder + единственный разработчик",
        functionality:
          "Аналитика и автоматизация для селлеров WB / Ozon / Yandex Market. Архитектура Data Lake (Bronze, Silver), мульти-провайдерный LLM-каскад (Claude + Gemini + Groq), парсер маркетплейсов на Playwright + stealth, документ-парсер на FastAPI для расчёта НПД, Telegram-бот (grammy + Pyrogram MTProto), ЮKassa-подписки, Chrome MV3 расширение.",
        technologies: [
          "pg-boss",
          "Sentry",
          "pino",
          "Zod",
          "PostHog",
          "Cloudflare Workers",
        ],
        aiTag: "AI",
      },
      {
        title: "AI-сервис распознавания документов (Сколково)",
        stack: [
          "Laravel 12",
          "PHP 8.3+",
          "Vue 3",
          "Inertia.js",
          "Tailwind 4",
          "Yandex OCR",
          "Yandex GPT",
        ],
        team: "1 fullstack + BA + QA",
        functionality:
          "Production AI-пайплайн: загрузка PDF, Yandex OCR (распознавание), Yandex GPT (структурирование данных), запись в БД с привязкой к образовательным программам и студентам. Асинхронные очереди для тяжёлых файлов, админка.",
        technologies: ["GIT", "Docker", "MySQL", "Yandex Cloud API"],
        aiTag: "AI",
      },
      {
        title: "AI-конструктор лендингов с двумя AI-провайдерами (Сколково)",
        stack: [
          "Vue 3",
          "Tailwind",
          "PHP",
          "SQLite",
          "GPT-4o-mini",
          "NanoBanano",
        ],
        team: "1 fullstack",
        functionality:
          "Drag & drop редактор блоков с inline-редактированием Tailwind-классов. Две AI-интеграции в проде: GPT-4o-mini для генерации/перефразирования текстов, NanoBanano для генерации и улучшения изображений. 21 готовый блок, мульти-страничные лендинги, экспорт в HTML.",
        technologies: ["GIT", "Docker", "OpenAI API"],
        aiTag: "AI",
      },
      {
        title:
          "timeweb-mcp-server — open-source MCP-сервер (npm)",
        stack: ["Node.js", "TypeScript", "MCP SDK", "Timeweb Cloud API"],
        team: "Solo (open source)",
        functionality:
          "Полная поддержка Timeweb Cloud API: серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами для автоматизации деплоев из Claude Desktop / Claude Code / Cursor.",
        technologies: ["npm", "GitHub", "REST API"],
        aiTag: "AI",
      },
      {
        title: "High-load backend программы лояльности (Сколково)",
        stack: [
          "PHP 8.2",
          "Laravel 10",
          "Octane + Swoole",
          "Reverb (WebSocket)",
          "Horizon",
          "Passport",
          "Pennant",
        ],
        team: "2 backend + 1 frontend + BA + QA",
        functionality:
          "Backend программы лояльности экосистемы школы: балансы баллов, транзакции, привилегии, уровни, бейджи, реферальные коды, промокоды, сборы пожертвований. Real-time события через Reverb.",
        technologies: [
          "MySQL",
          "Redis",
          "PHPUnit + Paratest",
          "Mailgun",
          "Telegram",
        ],
        aiTag: null,
      },
      {
        title: "ERP для нефтегазовой компании (Itpelag)",
        stack: [
          "PHP 7.3+",
          "Laravel",
          "Oracle",
          "PostgreSQL",
          "Redis",
          "React",
          "Vue.js",
        ],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality:
          "Полноценный ERP с нуля для 500+ пользователей. Модули склада, закупок, продаж, финансов. Микросервисы на Docker, REST API для мобильных приложений с OAuth 2.0 + JWT, нагрузочное тестирование.",
        technologies: ["GIT", "Jira", "GitLab CI/CD", "Docker", "ssh"],
        aiTag: null,
      },
      {
        title: "Lenderkit.com — финтех-платформа (Justcoded)",
        stack: ["PHP 8", "Laravel", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality:
          "Core-команда финтех-продукта в сфере инвестиций (50+ инженеров). Модули валидации документов, интеграция криптокошельков, REST API. Интеграции: Polymesh (blockchain), DocuSign. Team Lead на клиентском проекте (5 разработчиков).",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
        aiTag: null,
      },
      {
        title: "E-commerce аналитика на 1+ ТБ данных (MPSTATS)",
        stack: [
          "Laravel",
          "PostgreSQL",
          "ClickHouse",
          "MongoDB",
          "MySQL",
          "Redis",
          "Pandas",
          "NumPy",
        ],
        team: "Продуктовая команда",
        functionality:
          "High-load Laravel микросервисы для e-commerce-аналитики маркетплейсов — 1+ ТБ данных. ETL/ELT-пайплайны, API для BI-дашбордов, автоматизация рутинных задач селлеров. Оптимизация критических API: −20% latency, +30% throughput.",
        technologies: ["GIT", "Telescope", "Horizon", "GitLab CI/CD"],
        aiTag: "AI-adjacent",
      },
      {
        title: "Микросервисная криптобиржа (Itpelag)",
        stack: [
          "PHP 8.1",
          "Laravel 10 (Lumen)",
          "PostgreSQL",
          "Redis",
          "RabbitMQ",
        ],
        team: "4+ backend + 2 frontend + Teamlead + PM + BA + QA",
        functionality:
          "Микросервисы для обмена криптовалют и интеграции с внешними кошельками.",
        technologies: ["GIT", "Docker", "Microservices"],
        aiTag: null,
      },
    ],
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
        caption: "MCP-серверы в публикации",
      },
      {
        platform: "telegram",
        label: "Telegram @abnorsky",
        url: "https://t.me/abnorsky",
        caption: "Личные контакты",
      },
    ],
    video: {
      title: "Мой YouTube канал",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },
};
