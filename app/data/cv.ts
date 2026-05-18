
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
  skills: { name: string; level: number }[]; // Level 0-100 based on the bars in the CV
  experience: {
    period: string;
    role: string;
    company: string;
    type: string; // remote, office, etc.
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

export const cvData: Record<"en" | "ru", CVData> = {
  en: {
    name: "Minas Sarkisyan",
    role: "Senior Fullstack Engineer",
    location: "Krasnodar, Russia · Remote / Hybrid · open to relocation",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Fullstack Engineer with 9 years of production experience in PHP/Laravel and the modern JS stack (TypeScript, React 19, Next.js 16, Vue 3). For the last 2.5 years deeply embedded in production AI: multi-provider LLM cascades (Claude + Gemini + Groq), RAG, AI agents, and 3 published MCP servers on npm. Currently supporting 5+ products in the Skolkovo School of Management ecosystem and building HubMarket — an AI-powered SaaS for marketplace sellers (Wildberries, Ozon, Yandex Market).",
    skills: [
      { name: "AI / LLM Integration", level: 90 },
      { name: "Vercel AI SDK / RAG / MCP", level: 85 },
      { name: "Claude Code / Cursor", level: 95 },
      { name: "PHP / Laravel / Symfony", level: 95 },
      { name: "TypeScript / Node.js / Hono", level: 85 },
      { name: "Python / FastAPI / asyncio", level: 75 },
      { name: "REST API / Event-driven", level: 90 },
      { name: "Vue 3 / React 19 / Next.js 16", level: 88 },
      { name: "Tailwind CSS / shadcn/ui / Radix", level: 90 },
      { name: "PostgreSQL / MySQL / Redis", level: 90 },
      { name: "OOP / SOLID / DDD", level: 90 },
      { name: "Docker / Nginx / Linux / CI-CD", level: 85 },
    ],
    experience: [
      {
        period: "2024-11 — present",
        role: "Senior Fullstack Engineer",
        company: "Skolkovo School of Management",
        type: "remote",
        description: [
          "Support 5+ products in parallel within the school's digital ecosystem",
          "AI document recognition service (Yandex OCR → Yandex GPT, async queues)",
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
          "Analytics & automation for WB / Ozon / Yandex Market sellers. Bronze→Silver data lake, multi-provider LLM cascade (Claude + Gemini + Groq), Playwright-based marketplace parser, FastAPI document parser for Russian self-employment tax, Telegram bot (grammy + Pyrogram MTProto), YooKassa subscriptions, Chrome MV3 extension.",
        technologies: [
          "pg-boss",
          "Sentry",
          "pino",
          "Zod",
          "PostHog",
          "Cloudflare Workers",
        ],
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
          "Production AI pipeline: PDF upload → Yandex OCR (text recognition) → Yandex GPT (data structuring) → DB write with educational program / student linkage. Async queues for heavy files, admin panel.",
        technologies: ["GIT", "Docker", "MySQL", "Yandex Cloud API"],
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
      },
      {
        title:
          "timeweb-mcp-server — open-source MCP server (npm)",
        stack: ["Node.js", "TypeScript", "MCP SDK", "Timeweb Cloud API"],
        team: "Solo (open source)",
        functionality:
          "Full Timeweb Cloud API coverage: cloud servers, databases (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, domains. Used by AI agents to automate deployments from Claude Desktop / Claude Code / Cursor.",
        technologies: ["npm", "GitHub", "REST API"],
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
      },
      {
        title: "Lenderkit.com — fintech platform (Justcoded)",
        stack: ["PHP 8", "Laravel", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality:
          "Core team of a fintech investment product (50+ engineers). Document validation modules, crypto wallet integration, REST API. Integrations: Polymesh (blockchain), DocuSign. Team Lead on a client project (5 developers).",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
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
      },
    ],
    video: {
      title: "My YouTube Channel",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },

  ru: {
    name: "Минас Саркисян",
    role: "Senior Fullstack Engineer",
    location: "Краснодар · Удалённо / Гибрид · готов к переезду",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@abnorsky",
      github: "github.com/webkoth",
    },
    about:
      "Senior Fullstack-инженер с 9 годами production-опыта в PHP/Laravel и современном JS-стеке (TypeScript, React 19, Next.js 16, Vue 3). Последние 2.5 года плотно работаю с LLM в продакшене: мульти-провайдерные каскады (Claude + Gemini + Groq), RAG, AI-агенты и 3 опубликованных MCP-сервера на npm. Сейчас support 5+ продуктов в Школе управления Сколково и AI-SaaS HubMarket для селлеров маркетплейсов (Wildberries, Ozon, Yandex Market).",
    skills: [
      { name: "AI / LLM Integration", level: 90 },
      { name: "Vercel AI SDK / RAG / MCP", level: 85 },
      { name: "Claude Code / Cursor", level: 95 },
      { name: "PHP / Laravel / Symfony", level: 95 },
      { name: "TypeScript / Node.js / Hono", level: 85 },
      { name: "Python / FastAPI / asyncio", level: 75 },
      { name: "REST API / Event-driven", level: 90 },
      { name: "Vue 3 / React 19 / Next.js 16", level: 88 },
      { name: "Tailwind CSS / shadcn/ui / Radix", level: 90 },
      { name: "PostgreSQL / MySQL / Redis", level: 90 },
      { name: "OOP / SOLID / DDD", level: 90 },
      { name: "Docker / Nginx / Linux / CI-CD", level: 85 },
    ],
    experience: [
      {
        period: "2024-11 — настоящее",
        role: "Senior Fullstack Engineer",
        company: "Школа управления Сколково",
        type: "удаленно",
        description: [
          "Support параллельно 5+ продуктов в цифровой экосистеме школы",
          "AI-сервис распознавания документов (Yandex OCR → Yandex GPT, асинхронные очереди)",
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
          "Аналитика и автоматизация для селлеров WB / Ozon / Yandex Market. Архитектура Bronze→Silver Data Lake, мульти-провайдерный LLM-каскад (Claude + Gemini + Groq), парсер маркетплейсов на Playwright + stealth, документ-парсер на FastAPI для расчёта НПД, Telegram-бот (grammy + Pyrogram MTProto), ЮKassa-подписки, Chrome MV3 расширение.",
        technologies: [
          "pg-boss",
          "Sentry",
          "pino",
          "Zod",
          "PostHog",
          "Cloudflare Workers",
        ],
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
          "Production AI-пайплайн: загрузка PDF → Yandex OCR (распознавание) → Yandex GPT (структурирование данных) → запись в БД с привязкой к образовательным программам и студентам. Асинхронные очереди для тяжёлых файлов, админка.",
        technologies: ["GIT", "Docker", "MySQL", "Yandex Cloud API"],
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
      },
      {
        title:
          "timeweb-mcp-server — open-source MCP-сервер (npm)",
        stack: ["Node.js", "TypeScript", "MCP SDK", "Timeweb Cloud API"],
        team: "Solo (open source)",
        functionality:
          "Полная поддержка Timeweb Cloud API: серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами для автоматизации деплоев из Claude Desktop / Claude Code / Cursor.",
        technologies: ["npm", "GitHub", "REST API"],
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
      },
      {
        title: "Lenderkit.com — финтех-платформа (Justcoded)",
        stack: ["PHP 8", "Laravel", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality:
          "Core-команда финтех-продукта в сфере инвестиций (50+ инженеров). Модули валидации документов, интеграция криптокошельков, REST API. Интеграции: Polymesh (blockchain), DocuSign. Team Lead на клиентском проекте (5 разработчиков).",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
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
      },
    ],
    video: {
      title: "Мой YouTube канал",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },
};
