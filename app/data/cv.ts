
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
  roleSub?: string;
  location?: string;
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
    responsibilities?: string[];
    achievements?: string[];
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
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "10+ years of fullstack development in production. 2+ years deep with LLMs: cascades (Claude + Gemini + Groq), RAG, AI agents, 7 MCP servers on npm. Work effectively solo or in a team — from feature delivery to architecture design. Strong hard skills in business analysis and rapid prototyping. Currently building HubMarket — AI-SaaS for marketplace sellers.",
    pitch:
      "10+ years of fullstack development. 2+ years deep with LLMs. Work effectively solo or in a team. Handle every level — from feature delivery to architecture design. Strong hard skills in business analysis and rapid prototyping.",
    metrics: [
      { value: 10, suffix: "+", label: "yrs fullstack" },
      { value: 2, suffix: "+", label: "yrs production AI" },
      { value: 7, suffix: "", label: "npm MCP servers" },
      { value: 5, suffix: "+", label: "products live" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["Python", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono", "PHP 8 / Laravel"],
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
        category: "Backend",
        items: [
          { name: "Python / FastAPI / asyncio", maturity: "production" },
          { name: "PHP / Laravel / Symfony", maturity: "production" },
          { name: "TypeScript / Node.js / Hono", maturity: "production" },
          { name: "Go", maturity: "touch" },
        ],
      },
      {
        category: "Frontend",
        items: [
          { name: "React 19 / Next.js 16", maturity: "production" },
          { name: "Vue 3 / Inertia.js", maturity: "production" },
          { name: "Tailwind 4 / shadcn/ui", maturity: "production" },
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
    ],
    productionAI: [
      {
        title: "Multi-provider LLM cascade in HubMarket",
        body: "Architecture with Claude, Gemini, Groq fallback chain: 0 LLM downtime over 8 months in prod. Automatic cost-log and quality-drift tracking.",
        evidence: "Featured case on webkoth.com",
      },
      {
        title: "RAG systems and vector search",
        body: "pgvector in HubMarket (production), Yandex GPT pipeline at an EdTech client. Embeddings, chunking, retrieval tuning for domain data.",
        evidence: "HubMarket + AI document recognition for an EdTech client",
      },
      {
        title: "MCP servers for agentic automation",
        body: "7 MCP servers published on npm, including 3 marketplace-specific ones (WB, Ozon, Yandex Market) on top of Timeweb Cloud API coverage (servers, DBs, K8s, S3, DNS). Used by AI agents from Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth",
      },
      {
        title: "Document pipelines (OCR, LLM, structured output)",
        body: "Production AI document recognition service at an EdTech client: PDF passed through Yandex OCR, then Yandex GPT for structured output, then DB write with educational program linkage.",
        evidence: "EdTech client · async queues, admin panel",
      },
      {
        title: "Dual-provider AI landing builder",
        body: "Production AI builder at an EdTech client: GPT-4o-mini for text + NanoBanano for images. 21 ready blocks, multi-page landings, HTML export.",
        evidence: "EdTech client · Vue 3 + PHP",
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
      {
        name: "claude-code-plugins",
        description: "Plugin marketplace for Claude Code — installable via /plugin install. Currently ships tw-deploy: commands, agents and skills for deploying applications to Timeweb Cloud directly from inside Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: ["Claude Code plugins", "Marketplace", "Commands + Agents + Skills", "tw-deploy included"],
      },
    ],
    experience: [
      {
        period: "2024-11 — 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Skolkovo School of Management (skolkovo.ru)",
        type: "remote",
        responsibilities: [
          "Owned 5+ production products in the school's digital ecosystem",
          "Maintained auth (SSO/LDAP), billing, marketplace integrations and internal services — daily ops and small features",
          "Architecture decisions for new features (async patterns, AI integration)",
          "Code review and PR reviews across the team",
          "Production incident response and hotfixes",
        ],
        achievements: [
          "Built AI document recognition service (Yandex OCR → Yandex GPT → DB) — replaced manual data entry end-to-end",
          "Shipped AI landing-page builder with dual providers (GPT-4o-mini for text + NanoBanano for images)",
          "Launched private alumni social network on Laravel 12 + Vue 3 — 100+ API endpoints",
          "Delivered high-load loyalty backend on Octane + Swoole + Reverb + Horizon + Pennant",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "remote",
        responsibilities: [
          "Built and maintained high-load Laravel microservices for marketplace e-commerce analytics — 1+ TB of data, PostgreSQL / ClickHouse / MongoDB / MySQL / Redis",
          "Database performance tuning (PostgreSQL, ClickHouse) — indexes, query plans",
          "Writing unit and integration tests for critical data pipelines",
        ],
        achievements: [
          "Cut critical API latency by 20% and raised throughput by 30% — SQL refactor, indexes, Redis caching",
          "Built ETL / ELT pipelines on Pandas + NumPy and BI-dashboard APIs from scratch",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "office",
        responsibilities: [
          "Supported ERP for an oil & gas company (500+ users) — warehouse, procurement, sales, finance modules on Laravel + Oracle / PostgreSQL",
          "Supported corporate medical software for 100+ doctors and admins",
          "3rd-party API integrations (auth providers, mobile clients, internal services)",
          "Refactoring legacy code and paying down technical debt",
        ],
        achievements: [
          "Built Docker microservices and mobile REST API (OAuth 2.0 + JWT)",
          "Delivered microservices-based crypto exchange (Lumen + RabbitMQ + PostgreSQL + Redis)",
          "Set up GitLab CI/CD and load testing for the team",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP Developer (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "office",
        responsibilities: [
          "Core engineer on the Lenderkit fintech platform — a 50+ engineer team",
          "Mentoring junior PHP developers",
          "Tech documentation: READMEs, ADRs, integration guides",
        ],
        achievements: [
          "Shipped document validation modules, crypto wallet integration and REST API for web and mobile",
          "Led a 5-developer team on a client project — delivered on time and on budget",
          "Integrated Polymesh blockchain and DocuSign into the platform",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "office",
        responsibilities: [
          "Full-cycle web development: Laravel (backend) + Vue.js / React / jQuery (frontend)",
          "Production server setup (Linux, Nginx, Docker, SSL), CMS customisation (OpenCart)",
          "Responsive layouts, UX/UI work, SEO, monitoring and logging",
          "Estimation and sprint planning",
          "Cross-team collaboration with PM, QA and design",
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
        team: "1 fullstack (founder request → prod in 3 days)",
        functionality:
          "Founder-driven sprint exemplar: request, architecture, implementation, handover to prod in 3 days. Stock sync across 3 marketplaces (WB, Ozon, Yandex Market) for a HubMarket customer. Full writeup: webkoth.com/cases/hubmarket-stocksync",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket — AI-SaaS for marketplace sellers",
        stack: ["Next.js 16", "Vercel AI SDK", "Hono", "Python / FastAPI", "PostgreSQL"],
        team: "Founder + sole developer",
        functionality:
          "Analytics & automation for WB / Ozon / Yandex Market sellers. Bronze-to-Silver data lake, multi-provider LLM cascade (Claude + Gemini + Groq), Playwright marketplace parser, Telegram bot, YooKassa subscriptions, Chrome MV3 extension",
        technologies: ["pg-boss", "Sentry", "Zod"],
        aiTag: "AI",
      },
      {
        title: "CRM system for an insurance company",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Insurance claims tracking system for managers with role-based access",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "Mobile app for teachers and students",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React Native"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Application for teachers and students",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "Logistics marketplace",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Vue.js"],
        team: "1 backend + 1 frontend + 1 fullstack + PM + Designer",
        functionality: "Marketplace for the US e-commerce logistics market",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "ERP system for an oil & gas company",
        stack: ["PHP 7.3", "Laravel 5.7", "PostgreSQL", "Redis", "React"],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality: "Web + mobile app for employee workflow automation (2000+ users)",
        technologies: ["GIT", "Jira", "GitLab CI/CD", "Docker", "Postman", "ssh"],
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
    role: "Senior Fullstack | AI Engineer",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "10+ лет fullstack-разработки в продакшене. 2+ года плотно с LLM: каскады (Claude + Gemini + Groq), RAG, AI-агенты, 7 MCP-серверов на npm. Закрываю задачи всех уровней — от разработки фичей до проектирования архитектуры. Сильные hard skills в бизнес-анализе и запуске быстрых прототипов. Сейчас строю HubMarket — AI-SaaS для селлеров маркетплейсов.",
    pitch:
      "10+ лет fullstack-разработки. 2+ года плотно с LLM. Могу работать автономно и в команде. Закрываю задачи всех уровней — от разработки фичей до проектирования архитектуры. Сильные hard skills в бизнес-анализе и запуске быстрых прототипов.",
    metrics: [
      { value: 10, suffix: "+", label: "лет fullstack" },
      { value: 2, suffix: "+", label: "года production AI" },
      { value: 7, suffix: "", label: "MCP-сервера на npm" },
      { value: 5, suffix: "+", label: "продуктов в проде" },
    ],
    chipGroups: [
      {
        groupLabel: "Python / Backend",
        chips: ["PHP / Laravel", "Python", "FastAPI", "asyncio", "TypeScript", "Node.js / Hono"],
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
        category: "Backend",
        items: [
          { name: "PHP / Laravel / Symfony", maturity: "production" },
          { name: "Python / FastAPI", maturity: "production" },
          { name: "TypeScript / Node.js", maturity: "production" },
          { name: "Go", maturity: "touch" },
        ],
      },
      {
        category: "Frontend",
        items: [
          { name: "HTML / CSS", maturity: "production" },
          { name: "Tailwind / Bootstrap", maturity: "production" },
          { name: "JavaScript", maturity: "production" },
          { name: "TypeScript", maturity: "production" },
          { name: "React", maturity: "production" },
          { name: "Vue.js", maturity: "production" },
          { name: "Next.js", maturity: "production" },
          { name: "Inertia.js", maturity: "production" },
          { name: "shadcn/ui", maturity: "production" },
        ],
      },
      {
        category: "Databases",
        items: [
          { name: "PostgreSQL", maturity: "production" },
          { name: "MySQL", maturity: "production" },
          { name: "ClickHouse", maturity: "production" },
          { name: "Oracle", maturity: "production" },
          { name: "MongoDB", maturity: "production" },
          { name: "Redis", maturity: "production" },
          { name: "SQLite", maturity: "production" },
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
        category: "Testing / QA",
        items: [
          { name: "PHPUnit + Pest", maturity: "production" },
          { name: "Playwright", maturity: "production" },
          { name: "Vitest", maturity: "production" },
        ],
      },
      {
        category: "DevOps / Tooling",
        items: [
          { name: "Git", maturity: "production" },
          { name: "VPS", maturity: "production" },
          { name: "Nginx / Linux", maturity: "production" },
          { name: "CI/CD (GitLab / GitHub Actions)", maturity: "production" },
          { name: "Sentry", maturity: "production" },
          { name: "Docker", maturity: "production" },
        ],
      },
      {
        category: "Big Data / Analytics / Data Engineering",
        items: [
          { name: "Pandas / NumPy", maturity: "production" },
          { name: "ETL/ELT pipelines", maturity: "production" },
          { name: "BI dashboard APIs", maturity: "production" },
          { name: "Data optimisation for performance", maturity: "production" },
        ],
      },
      {
        category: "AI / LLM",
        items: [
          { name: "Claude", maturity: "production" },
          { name: "OpenAI", maturity: "production" },
          { name: "Google Gemini", maturity: "production" },
          { name: "Yandex GPT", maturity: "production" },
          { name: "Groq", maturity: "production" },
          { name: "MCP", maturity: "production" },
          { name: "RAG / pgvector", maturity: "production" },
          { name: "Multi-provider cascade", maturity: "production" },
          { name: "structured output / tool calling", maturity: "production" },
          { name: "self-hosted (Ollama / vLLM)", maturity: "touch" },
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
        body: "pgvector в HubMarket (production), Yandex GPT pipeline у EdTech-заказчика. Эмбеддинги, chunking, retrieval-tuning под domain-данные.",
        evidence: "HubMarket + AI-сервис распознавания документов у EdTech-заказчика",
      },
      {
        title: "MCP-серверы для агентной автоматизации",
        body: "7 опубликованных MCP-серверов на npm: включая 3 специализированных для маркетплейсов (WB, Ozon, Yandex Market) поверх полной поддержки Timeweb Cloud API (серверы, БД, K8s, S3, DNS). Используется AI-агентами из Claude Code / Cursor.",
        evidence: "npmjs.com/~webkoth",
      },
      {
        title: "Document-пайплайны (OCR, LLM, structured output)",
        body: "Production AI-сервис распознавания документов у EdTech-заказчика: PDF проходит через Yandex OCR, затем Yandex GPT (structured output), затем запись в БД с привязкой к образовательным программам.",
        evidence: "EdTech-заказчик · async queues, admin panel",
      },
      {
        title: "Dual-provider AI-landing builder",
        body: "Production AI-конструктор у EdTech-заказчика: GPT-4o-mini для текста + NanoBanano для изображений. 21 готовый блок, мульти-страничные лендинги, HTML-экспорт.",
        evidence: "EdTech-заказчик · Vue 3 + PHP",
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
      {
        name: "claude-code-plugins",
        description: "Marketplace плагинов для Claude Code — устанавливается через /plugin install. Сейчас включает tw-deploy: команды, агенты и skills для деплоя приложений в Timeweb Cloud прямо из Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: ["Claude Code plugins", "Marketplace", "Commands + Agents + Skills", "tw-deploy включён"],
      },
    ],
    experience: [
      {
        period: "2024-11 — 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Школа управления Сколково (skolkovo.ru)",
        type: "удаленно",
        responsibilities: [
          "Вёл 5+ продуктов в цифровой экосистеме школы",
          "Поддерживал auth (SSO/LDAP), биллинг, интеграции с маркетплейсами и внутренние сервисы — daily ops и небольшие фичи",
          "Архитектурные решения по новым фичам (асинхронные паттерны, AI-интеграция)",
          "Code review и PR-ревью в команде",
          "Production incident response и хотфиксы",
        ],
        achievements: [
          "Запустил AI-сервис распознавания документов (Yandex OCR → Yandex GPT → запись в БД) — заменил ручной ввод end-to-end",
          "Сделал AI-конструктор лендингов с двумя провайдерами (GPT-4o-mini для текста + NanoBanano для изображений)",
          "Поднял закрытую социальную сеть выпускников на Laravel 12 + Vue 3 — 100+ API-эндпоинтов",
          "Реализовал high-load backend программы лояльности на Octane + Swoole + Reverb + Horizon + Pennant",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "удалённо",
        responsibilities: [
          "Разработал и поддерживал high-load Laravel-микросервисы для e-commerce-аналитики маркетплейсов — 1+ ТБ данных, PostgreSQL / ClickHouse / MongoDB / MySQL / Redis",
          "Тюнинг производительности БД (PostgreSQL, ClickHouse) — индексы, query plans",
          "Юнит- и интеграционные тесты для критических пайплайнов",
        ],
        achievements: [
          "Снизил latency критических API на 20% и поднял throughput на 30% — рефакторинг SQL, индексы, Redis-кэширование",
          "С нуля построил ETL / ELT-пайплайны (Pandas + NumPy) и API для BI-дашбордов",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "офис",
        responsibilities: [
          "Поддерживал ERP для нефтегазовой компании (500+ пользователей) — модули склад, закупки, продажи, финансы на Laravel + Oracle / PostgreSQL",
          "Поддерживал корпоративное медицинское ПО для 100+ врачей и админов",
          "Интеграции со сторонними API (auth-провайдеры, мобильные клиенты, внутренние сервисы)",
          "Рефакторинг legacy-кода и работа с техническим долгом",
        ],
        achievements: [
          "Построил Docker-микросервисы и мобильный REST API (OAuth 2.0 + JWT)",
          "Сдал микросервисную криптобиржу (Lumen + RabbitMQ + PostgreSQL + Redis)",
          "Настроил GitLab CI/CD и нагрузочное тестирование в команде",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP-разработчик (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "офис",
        responsibilities: [
          "Core-инженер финтех-платформы Lenderkit.com — команда 50+ инженеров",
          "Менторство junior PHP-разработчиков",
          "Тех. документация: README, ADR, integration guides",
        ],
        achievements: [
          "Сдал модули валидации документов, интеграцию криптокошельков и REST API для web и mobile",
          "Тимлид команды из 5 разработчиков на клиентском проекте — сдан в срок и в бюджете",
          "Интегрировал Polymesh blockchain и DocuSign в платформу",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "офис",
        responsibilities: [
          "Полный цикл веб-разработки: Laravel (backend) + Vue.js / React / jQuery (frontend)",
          "Production-серверы (Linux, Nginx, Docker, SSL), кастомизация CMS (OpenCart)",
          "Адаптивная вёрстка, UX/UI, SEO, мониторинг и логирование",
          "Оценка задач и sprint-планирование",
          "Кросс-функциональная работа с PM, QA и дизайнерами",
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
          "Production-кейс founder-driven спринта: запрос, архитектура, реализация, передача в прод за 3 дня. Синхронизация остатков по 3 маркетплейсам (WB, Ozon, Yandex Market) для клиента HubMarket. Полный writeup: webkoth.com/cases/hubmarket-stocksync",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket — AI-SaaS для селлеров маркетплейсов",
        stack: ["Next.js 16", "Vercel AI SDK", "Hono", "Python / FastAPI", "PostgreSQL"],
        team: "Founder + единственный разработчик",
        functionality:
          "Аналитика и автоматизация для селлеров WB / Ozon / Yandex Market. Bronze-Silver data lake, мульти-провайдерный LLM-каскад (Claude + Gemini + Groq), Playwright-парсер маркетплейсов, Telegram-бот, ЮKassa-подписки, Chrome MV3 расширение",
        technologies: ["pg-boss", "Sentry", "Zod"],
        aiTag: "AI",
      },
      {
        title: "CRM система для страховой компании",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Система учёта страховых случаев для менеджеров с распределением ролей",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "Мобильное приложение для преподавателей и студентов",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React Native"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Приложение для преподавателей и студентов",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "Маркетплейс в сфере логистики",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Vue.js"],
        team: "1 backend + 1 frontend + 1 fullstack + PM + Designer",
        functionality: "Маркетплейс американского e-commerce рынка логистики",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "ERP система для нефтегазовой компании",
        stack: ["PHP 7.3", "Laravel 5.7", "PostgreSQL", "Redis", "React"],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality: "Web + мобильное приложение для автоматизации работы сотрудников (2000+ пользователей)",
        technologies: ["GIT", "Jira", "GitLab CI/CD", "Docker", "Postman", "ssh"],
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
