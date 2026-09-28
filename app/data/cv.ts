
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
      "10+ years of fullstack development in production. 2+ years deep with LLMs: cascades (Claude + Gemini + Groq), RAG, AI agents, 7 MCP servers on npm. Work effectively solo or in a team, from feature delivery to architecture design. Strong hard skills in business analysis and rapid prototyping. Currently building HubMarket, an AI-SaaS for marketplace sellers.",
    pitch:
      "10+ years of fullstack development. 2+ years deep with LLMs. Work effectively solo or in a team. Handle every level, from feature delivery to architecture design. Strong hard skills in business analysis and rapid prototyping.",
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
        body: "HubMarket Telegram bot on grammy + Pyrogram (MTProto): a tool-calling agent over marketplace data.",
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
        description: "Plugin marketplace for Claude Code, installable via /plugin install. Currently ships tw-deploy: commands, agents and skills for deploying applications to Timeweb Cloud directly from inside Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: ["Claude Code plugins", "Marketplace", "Commands + Agents + Skills", "tw-deploy included"],
      },
    ],
    experience: [
      {
        period: "2024-11 – 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Skolkovo School of Management (skolkovo.ru)",
        type: "remote",
        responsibilities: [
          "Owned 5+ production products in the school's digital ecosystem",
          "Maintained auth (SSO/LDAP), billing, marketplace integrations and internal services: daily ops and small features",
          "Architecture decisions for new features (async patterns, AI integration)",
          "Code review and PR reviews across the team",
          "Production incident response and hotfixes",
        ],
        achievements: [
          "Built AI document recognition service (Yandex OCR → Yandex GPT → DB); replaced manual data entry end-to-end",
          "Shipped AI landing-page builder with dual providers (GPT-4o-mini for text + NanoBanano for images)",
          "Launched private alumni social network on Laravel 12 + Vue 3: 100+ API endpoints",
          "Delivered high-load loyalty backend on Octane + Swoole + Reverb + Horizon + Pennant",
        ],
      },
      {
        period: "2024-03 – 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "remote",
        responsibilities: [
          "Built and maintained high-load Laravel microservices for marketplace e-commerce analytics: 1+ TB of data, PostgreSQL / ClickHouse / MongoDB / MySQL / Redis",
          "Database performance tuning (PostgreSQL, ClickHouse): indexes, query plans",
          "Writing unit and integration tests for critical data pipelines",
        ],
        achievements: [
          "Cut critical API latency by 20% and raised throughput by 30% via SQL refactor, indexes and Redis caching",
          "Built ETL / ELT pipelines on Pandas + NumPy and BI-dashboard APIs from scratch",
        ],
      },
      {
        period: "2022-06 – 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "office",
        responsibilities: [
          "Supported ERP for an oil & gas company (500+ users): warehouse, procurement, sales, finance modules on Laravel + Oracle / PostgreSQL",
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
        period: "2020-05 – 2022-05",
        role: "PHP Developer (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "office",
        responsibilities: [
          "Core engineer on the Lenderkit fintech platform, a 50+ engineer team",
          "Mentoring junior PHP developers",
          "Tech documentation: READMEs, ADRs, integration guides",
        ],
        achievements: [
          "Shipped document validation modules, crypto wallet integration and REST API for web and mobile",
          "Led a 5-developer team on a client project; delivered on time and on budget",
          "Integrated Polymesh blockchain and DocuSign into the platform",
        ],
      },
      {
        period: "2017-10 – 2020-04",
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
          "Founder-driven sprint exemplar: request, architecture, implementation, handover to prod in 3 days. Stock sync across 3 marketplaces (WB, Ozon, Yandex Market) for a HubMarket customer",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket: AI-SaaS for marketplace sellers",
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
      "10+ лет fullstack-разработки в продакшене. 2+ года плотно с LLM: каскады моделей (Claude, Gemini, Groq), RAG, AI-агенты, 7 MCP-серверов на npm. Сейчас строю HubMarket, AI-SaaS для селлеров маркетплейсов.",
    pitch:
      "10+ лет fullstack-разработки. 2+ года плотно с LLM. Пишу фичи и проектирую архитектуру. Сильная сторона - бизнес-анализ и быстрые прототипы.",
    metrics: [
      { value: 10, suffix: "+", label: "лет fullstack" },
      { value: 2, suffix: "+", label: "года AI в продакшене" },
      { value: 7, suffix: "", label: "MCP-серверов на npm" },
      { value: 5, suffix: "+", label: "продуктов в продакшене" },
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
      secondaryLabel: "Созвон на 15 минут (Calendar)",
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
        title: "Каскад LLM-провайдеров в HubMarket",
        body: "Каскад Claude, Gemini, Groq: если провайдер падает, запрос уходит к следующему. Ноль минут простоя LLM за 8 месяцев в продакшене. Система сама считает расходы и следит, не падает ли качество ответов.",
        evidence: "Кейс на лендинге webkoth.com",
      },
      {
        title: "RAG-системы и векторный поиск",
        body: "pgvector в HubMarket (в продакшене), конвейер на Yandex GPT у EdTech-заказчика. Эмбеддинги, нарезка текста на фрагменты, настройка поиска под данные заказчика.",
        evidence: "HubMarket и AI-сервис распознавания документов у EdTech-заказчика",
      },
      {
        title: "MCP-серверы для агентной автоматизации",
        body: "7 MCP-серверов на npm, среди них 3 для маркетплейсов (WB, Ozon, Yandex Market) и сервер с полной поддержкой Timeweb Cloud API (серверы, БД, K8s, S3, DNS). Их вызывают AI-агенты из Claude Code и Cursor.",
        evidence: "npmjs.com/~webkoth",
      },
      {
        title: "Конвейеры для документов (OCR, LLM, structured output)",
        body: "Боевой AI-сервис распознавания документов у EdTech-заказчика: PDF проходит через Yandex OCR, затем через Yandex GPT (structured output), и результат ложится в БД с привязкой к образовательным программам.",
        evidence: "EdTech-заказчик · асинхронные очереди, админка",
      },
      {
        title: "AI-конструктор лендингов на двух провайдерах",
        body: "Конструктор работает у EdTech-заказчика: GPT-4o-mini пишет тексты, Nano Banana рисует изображения. 21 готовый блок, многостраничные лендинги, экспорт в HTML.",
        evidence: "EdTech-заказчик · Vue 3 + PHP",
      },
      {
        title: "Агенты с tool calling и доступом через MTProto",
        body: "Telegram-бот HubMarket на grammy и Pyrogram (MTProto): агент с tool calling работает с данными маркетплейсов.",
        evidence: "HubMarket, продакшен",
      },
    ],
    openSource: [
      {
        name: "timeweb-mcp-server",
        description: "Полная поддержка Timeweb Cloud API через MCP: серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Через него AI-агенты в Claude Desktop, Claude Code и Cursor сами деплоят приложения.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: ["Node.js + TypeScript", "MCP SDK", "Весь Timeweb API", "Готов к продакшену"],
      },
      {
        name: "claude-code-plugins",
        description: "Маркетплейс плагинов для Claude Code, ставится через /plugin install. Сейчас в нём есть tw-deploy: команды, агенты и скиллы, чтобы деплоить приложения в Timeweb Cloud прямо из Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: ["Claude Code plugins", "Marketplace", "Commands + Agents + Skills", "tw-deploy включён"],
      },
    ],
    experience: [
      {
        period: "2024-11 - 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Школа управления Сколково (skolkovo.ru)",
        type: "удалённо",
        responsibilities: [
          "Вёл 5+ цифровых продуктов школы",
          "Поддерживал авторизацию (SSO/LDAP), биллинг, интеграции с маркетплейсами и внутренние сервисы, делал небольшие доработки",
          "Проектировал архитектуру новых функций (асинхронная обработка, интеграция AI)",
          "Ревьюил код команды",
          "Разбирал аварии в продакшене и выпускал срочные исправления",
        ],
        achievements: [
          "Запустил AI-сервис распознавания документов (Yandex OCR, затем Yandex GPT, затем запись в БД); сервис полностью заменил ручной ввод",
          "Сделал AI-конструктор лендингов с двумя провайдерами (GPT-4o-mini для текста, Nano Banana для изображений)",
          "Поднял закрытую социальную сеть выпускников на Laravel 12 и Vue 3: 100+ API-эндпоинтов",
          "Сделал высоконагруженный бэкенд программы лояльности на Octane, Swoole, Reverb, Horizon и Pennant",
        ],
      },
      {
        period: "2024-03 - 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "удалённо",
        responsibilities: [
          "Разработал и поддерживал высоконагруженные микросервисы на Laravel для аналитики маркетплейсов: 1+ ТБ данных, PostgreSQL / ClickHouse / MongoDB / MySQL / Redis",
          "Ускорял PostgreSQL и ClickHouse: индексы, разбор планов запросов",
          "Писал юнит- и интеграционные тесты для критичных конвейеров данных",
        ],
        achievements: [
          "Снизил задержку критичных API на 20% и поднял пропускную способность на 30%: переписал SQL, добавил индексы и кэш в Redis",
          "С нуля построил ETL/ELT-конвейеры (Pandas, NumPy) и API для BI-дашбордов",
        ],
      },
      {
        period: "2022-06 - 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "офис",
        responsibilities: [
          "Поддерживал ERP для нефтегазовой компании (500+ пользователей): модули склада, закупок, продаж и финансов на Laravel и Oracle / PostgreSQL",
          "Поддерживал корпоративное медицинское ПО для 100+ врачей и админов",
          "Интегрировал сторонние API (провайдеры авторизации, мобильные клиенты, внутренние сервисы)",
          "Переписывал старый код и разбирал технический долг",
        ],
        achievements: [
          "Построил Docker-микросервисы и мобильный REST API (OAuth 2.0, JWT)",
          "Сдал микросервисную криптобиржу (Lumen, RabbitMQ, PostgreSQL, Redis)",
          "Настроил GitLab CI/CD и нагрузочное тестирование в команде",
        ],
      },
      {
        period: "2020-05 - 2022-05",
        role: "PHP-разработчик (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "офис",
        responsibilities: [
          "Инженер ядра финтех-платформы Lenderkit.com, в команде 50+ инженеров",
          "Наставлял начинающих PHP-разработчиков",
          "Писал техническую документацию: README, ADR, руководства по интеграции",
        ],
        achievements: [
          "Сдал модули валидации документов, интеграцию криптокошельков и REST API для веба и мобильных приложений",
          "Тимлид команды из 5 разработчиков на клиентском проекте",
          "Встроил в платформу блокчейн Polymesh и DocuSign",
        ],
      },
      {
        period: "2017-10 - 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "офис",
        responsibilities: [
          "Полный цикл веб-разработки: бэкенд на Laravel, фронтенд на Vue.js / React / jQuery",
          "Боевые серверы (Linux, Nginx, Docker, SSL), доработка CMS OpenCart",
          "Адаптивная вёрстка, UX/UI, SEO, мониторинг и логирование",
          "Оценка задач и планирование спринтов",
          "Работа с PM, QA и дизайнерами",
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
        title: "HubMarket: синхронизация остатков на маркетплейсах (кейс B-Sprint)",
        stack: ["Next.js", "Hono", "Playwright", "pg-boss"],
        team: "1 fullstack-разработчик (от запроса основателя до продакшена 3 дня)",
        functionality:
          "Спринт по запросу основателя: архитектура, реализация и запуск в продакшен за 3 дня. Синхронизация остатков по 3 маркетплейсам (WB, Ozon, Yandex Market) для клиента HubMarket",
        technologies: ["Playwright", "pg-boss", "PostgreSQL"],
        aiTag: null,
      },
      {
        title: "HubMarket: AI-SaaS для селлеров маркетплейсов",
        stack: ["Next.js 16", "Vercel AI SDK", "Hono", "Python / FastAPI", "PostgreSQL"],
        team: "Основатель и единственный разработчик",
        functionality:
          "Аналитика и автоматизация для селлеров WB / Ozon / Yandex Market. data lake со слоями Bronze и Silver, каскад LLM-провайдеров (Claude, Gemini, Groq), парсер маркетплейсов на Playwright, Telegram-бот, подписки через ЮKassa, расширение для Chrome (MV3)",
        technologies: ["pg-boss", "Sentry", "Zod"],
        aiTag: "AI",
      },
      {
        title: "CRM-система для страховой компании",
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
        functionality: "Маркетплейс логистических услуг для американского e-commerce",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
        aiTag: null,
      },
      {
        title: "ERP-система для нефтегазовой компании",
        stack: ["PHP 7.3", "Laravel 5.7", "PostgreSQL", "Redis", "React"],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality: "Веб- и мобильное приложение для автоматизации работы сотрудников (2000+ пользователей)",
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
        caption: "Свои проекты и open source",
      },
      {
        platform: "npm",
        label: "npm @webkoth",
        url: "https://www.npmjs.com/~webkoth",
        caption: "Опубликованные MCP-серверы",
      },
      {
        platform: "telegram",
        label: "Telegram @abnorsky",
        url: "https://t.me/abnorsky",
        caption: "Личные контакты",
      },
    ],
    video: {
      title: "Мой YouTube-канал",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },
};
