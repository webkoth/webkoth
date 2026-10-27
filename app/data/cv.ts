export type SkillMaturity = "production" | "touch"

export type SkillItem = {
  name: string
  maturity: SkillMaturity
}

export type SkillCategory = {
  category: string
  items: SkillItem[]
}

export type ChipGroup = {
  groupLabel: string
  chips: string[]
}

export type ProductionAIAchievement = {
  title: string
  body: string
  evidence?: string
}

export type OpenSourcePackage = {
  name: string
  description: string
  npmPkg?: string
  ghOwner: string
  ghRepo: string
  highlights: string[]
}

export type ContentLink = {
  platform: "youtube" | "github" | "npm" | "telegram" | "blog"
  label: string
  url: string
  caption?: string
}

export type HireCta = {
  headline: string
  body: string
  primaryLabel: string
  primaryUrl: string
  secondaryLabel: string
  secondaryUrl: string
  emailLabel: string
}

export type CVData = {
  name: string
  role: string
  roleSub?: string
  location?: string
  downloads?: { label: string; url: string }[]
  contacts: {
    email: string
    telegram: string
    github: string
    linkedin?: string
  }
  about: string
  pitch: string
  chipGroups: ChipGroup[]
  metrics: { value: number; suffix: string; label: string }[]
  skills: SkillCategory[]
  productionAI: ProductionAIAchievement[]
  openSource: OpenSourcePackage[]
  experience: {
    period: string
    role: string
    company: string
    type: string
    aiMarker?: string
    responsibilities?: string[]
    achievements?: string[]
  }[]
  education: {
    degree: string
    university: string
    faculty: string
  }
  portfolio: {
    title: string
    stack: string[]
    team: string
    functionality: string
    technologies: string[]
    aiTag?: "AI" | "AI-adjacent" | null
  }[]
  content: ContentLink[]
  hireCta: HireCta
  video?: {
    title: string
    url: string
  }
}

export const cvData: Record<"en" | "ru", CVData> = {
  en: {
    name: "Minas Sarkisyan",
    role: "Senior Product Engineer",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Product Engineer across FinTech, logistics, ERP and marketplaces. Architecture, financial accuracy and AI automation from specification to production.",
    pitch:
      "Senior Product Engineer building software since 2017: I turn business problems into working products, from process analysis and specifications to launch and operations. I specialize in FinTech, logistics, ERP and marketplaces, where accurate calculations and reliable integrations directly affect business outcomes. I connect engineering decisions to process lead time, system performance and Time-to-Market. I design architecture for growing workloads, access control and external service failures. I use Spec-Driven Development and AI-assisted engineering to accelerate delivery while keeping business rules and quality under Human-in-the-Loop control.",
    metrics: [
      {
        value: 3,
        suffix: " days",
        label: "from request to production in the HubMarket case",
      },
      {
        value: 20,
        suffix: "%",
        label: "lower critical API latency at MPSTATS",
      },
      {
        value: 30,
        suffix: "%",
        label: "higher throughput at MPSTATS",
      },
      {
        value: 17,
        suffix: "",
        label: "WB reports reconciled without differences in Finstock",
      },
    ],
    chipGroups: [
      {
        groupLabel: "Product & Architecture",
        chips: [
          "End-to-End Product Ownership",
          "Business analysis / prototyping",
          "Spec-Driven Development",
          "System Design / DDD",
          "C4 Model / IcePanel",
          "Business process automation",
        ],
      },
      {
        groupLabel: "AI & Agent Systems",
        chips: [
          "AI Agents / MCP / tool calling",
          "RAG / pgvector",
          "Vercel AI SDK / structured output",
          "Multi-provider fallback",
          "Human-in-the-Loop",
          "Decision APIs / Jev AI",
        ],
      },
      {
        groupLabel: "Development",
        chips: [
          "PHP / Laravel / Symfony",
          "Python / FastAPI / Django",
          "TypeScript / Node.js",
          "React / Next.js",
          "Vue / Inertia.js",
        ],
      },
      {
        groupLabel: "Data & Integrations",
        chips: [
          "PostgreSQL / Supabase",
          "ClickHouse / MySQL / Redis",
          "ETL/ELT / dbt / Dagster",
          "REST API / Event-driven",
          "RabbitMQ / pg-boss",
        ],
      },
      {
        groupLabel: "Reliability & Engineering Practice",
        chips: [
          "Idempotency / financial reconciliation",
          "OAuth 2.0 / JWT / SSO / RBAC",
          "Docker / CI/CD / Sentry",
          "PHPUnit / Pest / Vitest / Playwright",
          "Claude Code / Codex / Cursor",
          "Code review / mentoring / ADRs",
        ],
      },
    ],
    hireCta: {
      headline: "Let’s discuss a Senior Product Engineer role",
      body: "FinTech, ERP, logistics and marketplaces. From business problem to working product.",
      primaryLabel: "Telegram: @abnorsky",
      primaryUrl: "https://t.me/abnorsky",
      secondaryLabel: "15-min call (Calendar)",
      secondaryUrl: "https://calendar.app.google/jY324Q2AHe1apJo79",
      emailLabel: "webkoth@gmail.com",
    },
    skills: [
      {
        category: "Product & Architecture",
        items: [
          {
            name: "End-to-End Product Ownership",
            maturity: "production",
          },
          {
            name: "Business analysis / prototyping",
            maturity: "production",
          },
          {
            name: "Spec-Driven Development",
            maturity: "production",
          },
          {
            name: "System Design / DDD",
            maturity: "production",
          },
          {
            name: "C4 Model / IcePanel",
            maturity: "production",
          },
          {
            name: "Business process automation",
            maturity: "production",
          },
        ],
      },
      {
        category: "AI & Agent Systems",
        items: [
          {
            name: "AI Agents / MCP / tool calling",
            maturity: "production",
          },
          {
            name: "RAG / pgvector",
            maturity: "production",
          },
          {
            name: "Vercel AI SDK / structured output",
            maturity: "production",
          },
          {
            name: "Multi-provider fallback",
            maturity: "production",
          },
          {
            name: "Human-in-the-Loop",
            maturity: "production",
          },
          {
            name: "Decision APIs / Jev AI",
            maturity: "production",
          },
        ],
      },
      {
        category: "Development",
        items: [
          {
            name: "PHP / Laravel / Symfony",
            maturity: "production",
          },
          {
            name: "Python / FastAPI / Django",
            maturity: "production",
          },
          {
            name: "TypeScript / Node.js",
            maturity: "production",
          },
          {
            name: "React / Next.js",
            maturity: "production",
          },
          {
            name: "Vue / Inertia.js",
            maturity: "production",
          },
        ],
      },
      {
        category: "Data & Integrations",
        items: [
          {
            name: "PostgreSQL / Supabase",
            maturity: "production",
          },
          {
            name: "ClickHouse / MySQL / Redis",
            maturity: "production",
          },
          {
            name: "ETL/ELT / dbt / Dagster",
            maturity: "production",
          },
          {
            name: "REST API / Event-driven",
            maturity: "production",
          },
          {
            name: "RabbitMQ / pg-boss",
            maturity: "production",
          },
        ],
      },
      {
        category: "Reliability & Engineering Practice",
        items: [
          {
            name: "Idempotency / financial reconciliation",
            maturity: "production",
          },
          {
            name: "OAuth 2.0 / JWT / SSO / RBAC",
            maturity: "production",
          },
          {
            name: "Docker / CI/CD / Sentry",
            maturity: "production",
          },
          {
            name: "PHPUnit / Pest / Vitest / Playwright",
            maturity: "production",
          },
          {
            name: "Claude Code / Codex / Cursor",
            maturity: "production",
          },
          {
            name: "Code review / mentoring / ADRs",
            maturity: "production",
          },
        ],
      },
    ],
    productionAI: [
      {
        title: "Automated document data entry",
        body: "Fully replaced manual entry with a Yandex OCR → Yandex GPT → structured output → database pipeline. Asynchronous processing links results to educational programs.",
        evidence: "Skolkovo School of Management · production",
      },
      {
        title: "RAG and resilient LLM integrations",
        body: "Implemented pgvector-based RAG and a Claude, Gemini and Groq fallback chain in HubMarket. Requests switch providers on failure, with per-request cost tracking.",
        evidence: "HubMarket · production",
      },
      {
        title: "Controlled AI-agent actions",
        body: "Separated deterministic financial calculations from model reasoning in WB × Codex. Marketplace writes require human approval, changes are logged, and price changes are verified by reading the resulting state.",
        evidence: "WB × Codex · MCP, Human-in-the-Loop, change log",
      },
      {
        title: "Product content generation and review",
        body: "Built AI-provider integrations, background jobs and agent workflows for content generation in Laretto AI. An approval queue lets staff review materials before publication.",
        evidence: "Laretto AI · Django, Celery, React",
      },
    ],
    openSource: [
      {
        name: "timeweb-mcp-server",
        description:
          "Full Timeweb Cloud API coverage via MCP protocol. Cloud servers, databases (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, domains. Used by AI agents from Claude Desktop / Claude Code / Cursor for deployment automation.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: [
          "Node.js + TypeScript",
          "MCP SDK",
          "Full Timeweb API coverage",
          "Production-ready",
        ],
      },
      {
        name: "claude-code-plugins",
        description:
          "Plugin marketplace for Claude Code, installable via /plugin install. Currently ships tw-deploy: commands, agents and skills for deploying applications to Timeweb Cloud directly from inside Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: [
          "Claude Code plugins",
          "Marketplace",
          "Commands + Agents + Skills",
          "tw-deploy included",
        ],
      },
      {
        name: "AI Automation Standard",
        description:
          "An open practical standard for choosing between deterministic software, LLM pipelines, agents and humans. Six modules cover AI-step specifications, Human-in-the-Loop, acceptance and operations. Status: v1.0.0-draft.",
        ghOwner: "webkoth",
        ghRepo: "ai-automation-standard",
        highlights: [
          "Spec-Driven Development",
          "Human-in-the-Loop",
          "6 modules",
          "Draft",
        ],
      },
    ],
    experience: [
      {
        period: "2024-11 — 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Skolkovo School of Management (skolkovo.ru)",
        type: "remote",
        responsibilities: [
          "Developed and operated 5+ digital products covering SSO/LDAP, billing, integrations and internal services; designed features, reviewed code and resolved production incidents.",
        ],
        achievements: [
          "Fully replaced manual document data entry with a Yandex OCR → Yandex GPT → structured output → database pipeline.",
          "Built an AI landing-page builder with 21 reusable blocks, multi-page support and HTML export, integrating separate text and image generation providers.",
          "Launched a private alumni network with 100+ API endpoints on Laravel and Vue.",
          "Built a loyalty-program backend with asynchronous processing on Octane, Swoole, Reverb and Horizon.",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "remote",
        responsibilities: [
          "Developed marketplace analytics microservices processing more than 1 TB of data with Laravel, PostgreSQL, ClickHouse, MongoDB and Redis.",
        ],
        achievements: [
          "Reduced critical API latency by 20% and increased throughput by 30% through SQL optimization, indexing and Redis caching.",
          "Built ETL/ELT pipelines and BI-dashboard APIs with Python, Pandas and NumPy; covered critical pipelines with unit and integration tests.",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "on-site",
        responsibilities: [
          "Developed an ERP serving 500+ users at an oil and gas company, covering warehouse operations, procurement, sales and finance with Laravel, Oracle and PostgreSQL.",
        ],
        achievements: [
          "Built Docker microservices and a mobile REST API with OAuth 2.0 / JWT to connect corporate systems to mobile clients.",
          "Implemented a microservices-based crypto exchange with Lumen, RabbitMQ, PostgreSQL and Redis.",
          "Introduced GitLab CI/CD and load testing for the team.",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP Developer (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "on-site",
        responsibilities: [
          "Developed the LenderKit FinTech platform core in an engineering organization of 50+ specialists; mentored developers and maintained technical documentation.",
        ],
        achievements: [
          "Built document validation modules, crypto-wallet integrations and REST APIs for web and mobile applications.",
          "Led a team of 5 developers on a client project.",
          "Integrated Polymesh and DocuSign to support digital assets and electronic document signing.",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "on-site",
        achievements: [
          "Delivered web products end-to-end: Laravel backend, Vue and React interfaces, Linux/Nginx/Docker deployment and operations; estimated work and planned delivery with product managers, QA and designers.",
        ],
      },
    ],
    education: {
      degree:
        "Specialist degree (2010) · OTUS PHP Developer (2019) · SOLOLEARN PHP (2017)",
      university: "KhNADU (Kharkiv National Automobile and Highway University)",
      faculty: "Transportation Systems",
    },
    portfolio: [
      {
        title: "HubMarket — marketplace business operations",
        stack: ["Next.js", "TypeScript", "Python / FastAPI", "PostgreSQL"],
        team: "Founder and developer; ownership from business request to production",
        functionality:
          "Shipped stock synchronization across Wildberries, Ozon and Yandex Market in 3 days from request to production. Built an AI-SaaS combining marketplace data, unit economics, P&L and AI tools, with RAG, LLM-provider fallback and YooKassa subscriptions.",
        technologies: ["Vercel AI SDK", "pgvector", "pg-boss", "Sentry"],
        aiTag: "AI",
      },
      {
        title: "Finstock — financial and inventory accounting",
        stack: ["TypeScript", "Next.js", "PostgreSQL"],
        team: "Business rules, development and acceptance on real data",
        functionality:
          "Matched calculated Wildberries payouts to all 17 marketplace reports for June–August 2026 with a zero-kopeck difference. Connected reports from three marketplaces, cost of goods, bank transactions and P&L; validated the shared stock pool in shadow mode.",
        technologies: [
          "Financial reconciliation",
          "FBS",
          "RBAC",
          "AES-256-GCM",
        ],
        aiTag: null,
      },
      {
        title: "Corporate data platform",
        stack: ["Python", "PostgreSQL", "dlt", "dbt", "Dagster"],
        team: "Data architecture, integrations, quality control and operations",
        functionality:
          "Unified Wildberries, Ozon and 1C data for financial applications, Power BI and AI agents. Matched seven control indicators exactly against the Wildberries API on verified daily samples. Separated ingestion, normalization and business data into raw → staging → core → marts.",
        technologies: ["FastAPI", "MCP", "MinIO", "Automated reconciliation"],
        aiTag: "AI-adjacent",
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
    roleSub:
      "FinTech · Logistics & Supply Chain · ERP · Marketplace Automation · AI Systems",
  },
  ru: {
    name: "Минас Саркисян",
    downloads: [
      {
        label: "Резюме PDF",
        url: "/resume/minas-sarkisyan-senior-product-engineer-ru.pdf",
      },
      {
        label: "Резюме DOCX",
        url: "/resume/minas-sarkisyan-senior-product-engineer-ru.docx",
      },
    ],
    role: "Senior Product Engineer",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Product Engineer. FinTech, логистика, ERP и маркетплейсы. Архитектура, точность финансовых расчетов и AI-автоматизация от спецификации до production.",
    pitch:
      "Senior Product Engineer с опытом разработки с 2017 года: превращаю задачи бизнеса в работающие продукты — от анализа процессов и спецификаций до запуска и эксплуатации. Специализируюсь на FinTech, логистике, ERP и маркетплейсах, где точность расчетов и надежность интеграций определяют результат бизнеса. Связываю инженерные решения со временем выполнения процессов, производительностью систем и Time-to-Market. Проектирую архитектуру с учетом роста нагрузки, разграничения доступа и сбоев внешних сервисов. Использую Spec-Driven Development и AI-assisted engineering для ускорения поставки, сохраняя контроль над бизнес-правилами и качеством через Human-in-the-Loop.",
    metrics: [
      {
        value: 3,
        suffix: " дня",
        label: "от запроса до production в кейсе HubMarket",
      },
      {
        value: 20,
        suffix: "%",
        label: "снижение задержки критичных API в MPSTATS",
      },
      {
        value: 30,
        suffix: "%",
        label: "рост пропускной способности в MPSTATS",
      },
      {
        value: 17,
        suffix: "",
        label: "отчетов WB сверены без расхождений в Finstock",
      },
    ],
    chipGroups: [
      {
        groupLabel: "Продукт и архитектура",
        chips: [
          "End-to-End Product Ownership",
          "Бизнес-анализ / прототипирование",
          "Spec-Driven Development",
          "System Design / DDD",
          "C4 Model / IcePanel",
          "Автоматизация бизнес-процессов",
        ],
      },
      {
        groupLabel: "AI и агентные системы",
        chips: [
          "AI Agents / MCP / tool calling",
          "RAG / pgvector",
          "Vercel AI SDK / structured output",
          "Multi-provider fallback",
          "Human-in-the-Loop",
          "Decision APIs / Jev AI",
        ],
      },
      {
        groupLabel: "Разработка",
        chips: [
          "PHP / Laravel / Symfony",
          "Python / FastAPI / Django",
          "TypeScript / Node.js",
          "React / Next.js",
          "Vue / Inertia.js",
        ],
      },
      {
        groupLabel: "Данные и интеграции",
        chips: [
          "PostgreSQL / Supabase",
          "ClickHouse / MySQL / Redis",
          "ETL/ELT / dbt / Dagster",
          "REST API / Event-driven",
          "RabbitMQ / pg-boss",
        ],
      },
      {
        groupLabel: "Надежность и инженерная практика",
        chips: [
          "Идемпотентность / финансовая сверка",
          "OAuth 2.0 / JWT / SSO / RBAC",
          "Docker / CI/CD / Sentry",
          "PHPUnit / Pest / Vitest / Playwright",
          "Claude Code / Codex / Cursor",
          "Code review / наставничество / ADR",
        ],
      },
    ],
    hireCta: {
      headline: "Обсудим роль Senior Product Engineer",
      body: "FinTech, ERP, логистика и маркетплейсы. От бизнес-задачи до работающего продукта.",
      primaryLabel: "Telegram: @abnorsky",
      primaryUrl: "https://t.me/abnorsky",
      secondaryLabel: "Созвон на 15 минут (Calendar)",
      secondaryUrl: "https://calendar.app.google/jY324Q2AHe1apJo79",
      emailLabel: "webkoth@gmail.com",
    },
    skills: [
      {
        category: "Продукт и архитектура",
        items: [
          {
            name: "End-to-End Product Ownership",
            maturity: "production",
          },
          {
            name: "Бизнес-анализ / прототипирование",
            maturity: "production",
          },
          {
            name: "Spec-Driven Development",
            maturity: "production",
          },
          {
            name: "System Design / DDD",
            maturity: "production",
          },
          {
            name: "C4 Model / IcePanel",
            maturity: "production",
          },
          {
            name: "Автоматизация бизнес-процессов",
            maturity: "production",
          },
        ],
      },
      {
        category: "AI и агентные системы",
        items: [
          {
            name: "AI Agents / MCP / tool calling",
            maturity: "production",
          },
          {
            name: "RAG / pgvector",
            maturity: "production",
          },
          {
            name: "Vercel AI SDK / structured output",
            maturity: "production",
          },
          {
            name: "Multi-provider fallback",
            maturity: "production",
          },
          {
            name: "Human-in-the-Loop",
            maturity: "production",
          },
          {
            name: "Decision APIs / Jev AI",
            maturity: "production",
          },
        ],
      },
      {
        category: "Разработка",
        items: [
          {
            name: "PHP / Laravel / Symfony",
            maturity: "production",
          },
          {
            name: "Python / FastAPI / Django",
            maturity: "production",
          },
          {
            name: "TypeScript / Node.js",
            maturity: "production",
          },
          {
            name: "React / Next.js",
            maturity: "production",
          },
          {
            name: "Vue / Inertia.js",
            maturity: "production",
          },
        ],
      },
      {
        category: "Данные и интеграции",
        items: [
          {
            name: "PostgreSQL / Supabase",
            maturity: "production",
          },
          {
            name: "ClickHouse / MySQL / Redis",
            maturity: "production",
          },
          {
            name: "ETL/ELT / dbt / Dagster",
            maturity: "production",
          },
          {
            name: "REST API / Event-driven",
            maturity: "production",
          },
          {
            name: "RabbitMQ / pg-boss",
            maturity: "production",
          },
        ],
      },
      {
        category: "Надежность и инженерная практика",
        items: [
          {
            name: "Идемпотентность / финансовая сверка",
            maturity: "production",
          },
          {
            name: "OAuth 2.0 / JWT / SSO / RBAC",
            maturity: "production",
          },
          {
            name: "Docker / CI/CD / Sentry",
            maturity: "production",
          },
          {
            name: "PHPUnit / Pest / Vitest / Playwright",
            maturity: "production",
          },
          {
            name: "Claude Code / Codex / Cursor",
            maturity: "production",
          },
          {
            name: "Code review / наставничество / ADR",
            maturity: "production",
          },
        ],
      },
    ],
    productionAI: [
      {
        title: "Автоматизация ввода документов",
        body: "Полностью заменил ручной ввод конвейером Yandex OCR → Yandex GPT → structured output → база данных. Асинхронная обработка связывает результат с образовательными программами.",
        evidence: "Школа управления СКОЛКОВО · production",
      },
      {
        title: "RAG и отказоустойчивые LLM-интеграции",
        body: "Реализовал RAG на pgvector и каскад Claude, Gemini и Groq в HubMarket: при отказе провайдера запрос переключается на следующий. Предусмотрел учет стоимости запросов.",
        evidence: "HubMarket · production",
      },
      {
        title: "Управляемые действия AI-агента",
        body: "В WB × Codex отделил детерминированные финансовые расчеты от работы модели. Запись в маркетплейс требует подтверждения человека; изменения журналируются, а изменение цены проверяется повторным чтением.",
        evidence: "WB × Codex · MCP, Human-in-the-Loop, журнал изменений",
      },
      {
        title: "Генерация и проверка товарного контента",
        body: "Разработал в Laretto AI инструменты генерации контента через AI-провайдеров, фоновые задачи и агентные сценарии. Очередь согласования позволяет сотруднику проверить материалы перед публикацией.",
        evidence: "Laretto AI · Django, Celery, React",
      },
    ],
    openSource: [
      {
        name: "timeweb-mcp-server",
        description:
          "Полная поддержка Timeweb Cloud API через MCP: серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Через него AI-агенты в Claude Desktop, Claude Code и Cursor сами деплоят приложения.",
        npmPkg: "timeweb-mcp-server",
        ghOwner: "webkoth",
        ghRepo: "timeweb-mcp-server",
        highlights: [
          "Node.js + TypeScript",
          "MCP SDK",
          "Весь Timeweb API",
          "Готов к продакшену",
        ],
      },
      {
        name: "claude-code-plugins",
        description:
          "Маркетплейс плагинов для Claude Code, ставится через /plugin install. Сейчас в нём есть tw-deploy: команды, агенты и скиллы, чтобы деплоить приложения в Timeweb Cloud прямо из Claude Code.",
        ghOwner: "webkoth",
        ghRepo: "claude-code-plugins",
        highlights: [
          "Claude Code plugins",
          "Marketplace",
          "Commands + Agents + Skills",
          "tw-deploy включён",
        ],
      },
      {
        name: "AI Automation Standard",
        description:
          "Открытый прикладной стандарт выбора между программой, LLM-конвейером, агентом и человеком. Шесть модулей описывают спецификации AI-шагов, Human-in-the-Loop, приемку и эксплуатацию. Статус: v1.0.0-draft.",
        ghOwner: "webkoth",
        ghRepo: "ai-automation-standard",
        highlights: [
          "Spec-Driven Development",
          "Human-in-the-Loop",
          "6 модулей",
          "Draft",
        ],
      },
    ],
    experience: [
      {
        period: "2024-11 — 2026-04",
        role: "Senior Fullstack Engineer",
        company: "Школа управления СКОЛКОВО (skolkovo.ru)",
        type: "удалённо",
        responsibilities: [
          "Развивал и сопровождал 5+ цифровых продуктов: SSO/LDAP, биллинг, интеграции и внутренние сервисы; проектировал новые функции, проводил code review и устранял production-инциденты.",
        ],
        achievements: [
          "Автоматизировал перенос данных из документов в учетную систему, полностью заменив ручной ввод конвейером Yandex OCR → Yandex GPT → structured output → база данных.",
          "Разработал AI-конструктор лендингов с 21 готовым блоком, многостраничной структурой и экспортом в HTML, интегрировав отдельных провайдеров генерации текста и изображений.",
          "Запустил закрытую социальную сеть выпускников со 100+ API-эндпоинтами на Laravel и Vue.",
          "Разработал Backend программы лояльности с асинхронной обработкой на Octane, Swoole, Reverb и Horizon.",
        ],
      },
      {
        period: "2024-03 — 2024-11",
        role: "Backend Developer · Data-Intensive",
        company: "MPSTATS (mpstats.io)",
        type: "удалённо",
        responsibilities: [
          "Разрабатывал микросервисы аналитики маркетплейсов с объемом данных более 1 ТБ на Laravel, PostgreSQL, ClickHouse, MongoDB и Redis.",
        ],
        achievements: [
          "Снизил задержку критичных API на 20% и увеличил пропускную способность на 30%, оптимизировав SQL-запросы, индексы и кеширование в Redis.",
          "Построил ETL/ELT-конвейеры и API для BI-дашбордов с использованием Python, Pandas и NumPy; покрыл критичные конвейеры unit- и интеграционными тестами.",
        ],
      },
      {
        period: "2022-06 — 2024-02",
        role: "Backend / Fullstack Developer",
        company: "Itpelag (itpelag.com)",
        type: "офис",
        responsibilities: [
          "Развивал ERP для нефтегазовой компании с 500+ пользователями: склад, закупки, продажи и финансы на Laravel, Oracle и PostgreSQL.",
        ],
        achievements: [
          "Разработал Docker-микросервисы и мобильный REST API с OAuth 2.0 / JWT для интеграции корпоративных систем с мобильными клиентами.",
          "Реализовал микросервисную криптобиржу на Lumen, RabbitMQ, PostgreSQL и Redis.",
          "Внедрил в команде GitLab CI/CD и нагрузочное тестирование.",
        ],
      },
      {
        period: "2020-05 — 2022-05",
        role: "PHP Developer (Laravel)",
        company: "Justcoded (justcoded.com)",
        type: "офис",
        responsibilities: [
          "Разрабатывал ядро FinTech-платформы LenderKit в инженерной организации из 50+ специалистов; наставлял разработчиков и вел техническую документацию.",
        ],
        achievements: [
          "Разработал модули валидации документов, интеграцию криптокошельков и REST API для веб- и мобильных приложений.",
          "Возглавил команду из 5 разработчиков на клиентском проекте.",
          "Интегрировал Polymesh и DocuSign, расширив возможности платформы по работе с цифровыми активами и электронным подписанием.",
        ],
      },
      {
        period: "2017-10 — 2020-04",
        role: "Web Developer",
        company: "SpdLoad (spdload.com)",
        type: "офис",
        achievements: [
          "Выпускал веб-продукты полным циклом: Backend на Laravel, интерфейсы на Vue и React, развертывание на Linux/Nginx/Docker и эксплуатация; участвовал в оценке задач и планировании поставки с PM, QA и дизайнерами.",
        ],
      },
    ],
    education: {
      degree:
        "Специалист (2010) · OTUS PHP-разработчик (2019) · SOLOLEARN PHP (2017)",
      university:
        "ХНАДУ (Харьковский национальный автомобильно-дорожный университет)",
      faculty: "Транспортные системы",
    },
    portfolio: [
      {
        title: "HubMarket — управление бизнесом на маркетплейсах",
        stack: ["Next.js", "TypeScript", "Python / FastAPI", "PostgreSQL"],
        team: "Основатель и разработчик; полный цикл от задачи до production",
        functionality:
          "Запустил синхронизацию остатков между Wildberries, Ozon и Яндекс Маркетом за 3 дня от запроса до production. В AI-SaaS объединил данные площадок, unit-экономику, P&L и AI-инструменты; реализовал RAG, переключение LLM-провайдеров и подписки через ЮKassa.",
        technologies: ["Vercel AI SDK", "pgvector", "pg-boss", "Sentry"],
        aiTag: "AI",
      },
      {
        title: "Finstock — финансовый и складской учет",
        stack: ["TypeScript", "Next.js", "PostgreSQL"],
        team: "Проектирование бизнес-правил, разработка и приемка на реальных данных",
        functionality:
          "Обеспечил совпадение расчетных выплат Wildberries с итогами площадки по всем 17 отчетам за июнь–август 2026 года: расхождение 0 копеек. Связал отчеты трех маркетплейсов, себестоимость, банковские операции и P&L; общий пул остатков проверялся в теневом режиме.",
        technologies: ["Финансовая сверка", "FBS", "RBAC", "AES-256-GCM"],
        aiTag: null,
      },
      {
        title: "Корпоративная платформа данных",
        stack: ["Python", "PostgreSQL", "dlt", "dbt", "Dagster"],
        team: "Архитектура данных, интеграции, контроль качества и эксплуатация",
        functionality:
          "Объединил данные Wildberries, Ozon и 1С для финансовых приложений, Power BI и AI-агентов. Обеспечил точное совпадение семи контрольных показателей с API Wildberries на проверенных суточных выборках. Разделил загрузку, нормализацию и витрины на слои raw → staging → core → marts.",
        technologies: ["FastAPI", "MCP", "MinIO", "Автоматическая сверка"],
        aiTag: "AI-adjacent",
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
    roleSub:
      "FinTech · Logistics & Supply Chain · ERP · Marketplace Automation · AI Systems",
  },
}
