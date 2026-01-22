
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
    role: "Fullstack Engineer",
    location: "",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@minasarkisyan",
      github: "github.com/webkoth",
    },
    about: "Fullstack Engineer with 9+ years of experience in building complex web applications (ERP, CRM, Marketplaces). I specialize in the Laravel ecosystem and modern JavaScript frameworks (Vue, React). I focus on delivering complete, scalable solutions by combining strong architectural principles with AI-augmented workflows (Claude Code, Cursor) to maximize development efficiency and code quality.",
    skills: [
      // Backend
      { name: "PHP / Laravel / Symfony", level: 95 },
      { name: "MySQL / PostgreSQL / Redis", level: 90 },
      { name: "Microservices / REST API", level: 90 },
      { name: "OOP / SOLID / DDD", level: 90 },
      
      // Frontend
      { name: "JavaScript / TypeScript", level: 85 },
      { name: "Vue.js / React / Next.js", level: 85 },
      { name: "HTML / CSS / Tailwind", level: 90 },
      
      // DevOps & Tools
      { name: "Docker / Nginx / Linux", level: 85 },
      { name: "CI/CD / Git / Jira", level: 90 },
      
      // AI & Efficiency
      { name: "Claude Code / Cursor (AI Workflow)", level: 95 },
    ],
    experience: [
      {
        period: "2024-11 - now",
        role: "Fullstack Engineer",
        company: "Skolkovo",
        type: "hybrid",
        description: [
          "Full-cycle development of a private social network ecosystem (Architecture, Backend, Frontend, DevOps).",
          "Developed a text recognition application integrating Yandex GPT models.",
          "Implemented complex Telegram bot integrations for user interaction and notification systems.",
          "Frontend development using Vue.js 3, TypeScript, and Composition API.",
        ],
      },
      {
        period: "2022-06 - 2024-11",
        role: "Backend | Fullstack Developer",
        company: "alvariumsoft.com",
        type: "office",
        description: [
          "Developed complex ERP systems and microservices for the gas industry (Laravel, PostgreSQL, Redis).",
          "Built secure REST APIs for mobile applications and internal services.",
          "Integrated Blockchain-based microservices and external APIs.",
          "Managed full-cycle development from database design to frontend implementation (React).",
        ],
      },
      {
        period: "2021-11 - 2022-05",
        role: "Backend Developer",
        company: "Justcoded",
        type: "office",
        description: [
          "Developed core modules for a Fintech product (Lenderkit.com) in a team of 50+ engineers.",
          "Designed and implemented modular architecture for white-label solutions.",
          "Integrated external services including Polymesh (Blockchain) and Docusign.",
          "Worked within a strict Agile environment using Jira and CI/CD pipelines.",
        ],
      },
      {
        period: "2020-05 - 2021-11",
        role: "Backend Developer",
        company: "SPDLoad",
        type: "office",
        description: [
          "Designed high-load REST APIs for Insurance CRM and Mobile Apps.",
          "Acted as Team Lead on a logistics marketplace project (managed backend architecture and tasks).",
          "Developed mobile application backends using Laravel and React Native integration.",
          "Refactored legacy code and optimized database performance.",
        ],
      },
      {
        period: "2017-10 - 2020-04",
        role: "Web Developer (PHP/JS)",
        company: "freelance, ag.mos.ru, oxbox.ru",
        type: "remote",
        description: [
          "Full-cycle development of e-commerce sites and medical portals.",
          "Deployed and maintained projects on production servers (Linux, Nginx, SSL).",
          "Developed custom functionality using PHP, Laravel, and JavaScript/jQuery.",
          "Optimized websites for SEO and performance (Google PageSpeed).",
        ],
      },
    ],
    education: {
      degree: "Specialist degree",
      university: "KHNADU",
      faculty: "Transportation Systems",
    },
    portfolio: [
      {
        title: "CRM system for an insurance company",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Insurance claims system for managers with role distribution",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Mobile application for teachers and students",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React Native"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Application for faculty and students",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Logistics marketplace",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Vue.js"],
        team: "1 backend + 1 frontend + 1 fullstack + PM + Designer",
        functionality: "U.S. e-commerce logistics marketplace",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Product development",
        stack: ["PHP 8.0", "Laravel 8", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality: "Product for the investment sector",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
      },
      {
        title: "ERP system for an oil and gas company",
        stack: ["PHP 7.3", "Laravel 5.7", "PostgreSQL", "Redis", "React"],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality: "Web + mobile application for employee automation (2000+)",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Docker", "Postman", "ssh"],
      },
      {
        title: "Cryptocurrency exchange service",
        stack: ["PHP 8.1", "Laravel 10 (Lumen)", "PostgreSQL", "Redis", "RabbitMQ"],
        team: "4+ backend + 2 frontend + Teamlead + PM + BA + QA",
        functionality: "Creation of microservices for cryptocurrency exchange",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Docker", "Postman", "ssh", "Microservices"],
      },
      {
        title: "Commodity marketplace hubmarket",
        stack: ["PHP 8.2", "Laravel 10", "PostgreSQL", "Redis", "TALL stack", "Vue.js"],
        team: "1 backend + 1 frontend + 1 fullstack + BA + QA",
        functionality: "Marketplace for direct suppliers and manufacturers",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Postman", "ssh"],
      },
    ],
    video: {
      title: "My YouTube Channel",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },
  ru: {
    name: "Минас Саркисян",
    role: "Fullstack Engineer",
    location: "",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@minasarkisyan",
      github: "github.com/webkoth",
    },
    about: "Fullstack-инженер с 9+ годами опыта разработки сложных веб-приложений (ERP, CRM, Маркетплейсы). Специализируюсь на экосистеме Laravel и современных JS-фреймворках (Vue, React). Фокусируюсь на создании полных продуктовых решений, объединяя сильные архитектурные принципы с использованием AI-инструментов (Claude Code, Cursor) для максимальной эффективности разработки и качества кода.",
    skills: [
      // Backend
      { name: "PHP / Laravel / Symfony", level: 95 },
      { name: "MySQL / PostgreSQL / Redis", level: 90 },
      { name: "Microservices / REST API", level: 90 },
      { name: "OOP / SOLID / DDD", level: 90 },
      
      // Frontend
      { name: "JavaScript / TypeScript", level: 85 },
      { name: "Vue.js / React / Next.js", level: 85 },
      { name: "HTML / CSS / Tailwind", level: 90 },
      
      // DevOps & Tools
      { name: "Docker / Nginx / Linux", level: 85 },
      { name: "CI/CD / Git / Jira", level: 90 },
      
      // AI & Efficiency
      { name: "Claude Code / Cursor (AI Workflow)", level: 95 },
    ],
    experience: [
      {
        period: "2024-11 - по настоящее время",
        role: "Fullstack Engineer",
        company: "Сколково",
        type: "гибрид",
        description: [
          "Полный цикл разработки закрытой социальной сети: от проектирования архитектуры до реализации (Backend, Frontend, DevOps).",
          "Разработка сервиса распознавания текста с интеграцией моделей Yandex GPT.",
          "Глубокая интеграция Telegram-бота в платформу для взаимодействия с пользователями.",
          "Frontend-разработка с использованием Vue.js 3, TypeScript и Composition API.",
        ],
      },
      {
        period: "2022-06 - 2024-11",
        role: "Backend | Fullstack Developer",
        company: "alvariumsoft.com",
        type: "офис",
        description: [
          "Разработка сложных ERP-систем и микросервисов для газовой отрасли (Laravel, PostgreSQL, Redis).",
          "Создание безопасных REST API для мобильных приложений и внутренних сервисов.",
          "Интеграция микросервисов на базе Blockchain и внешних API.",
          "Управление полным циклом разработки от проектирования БД до реализации фронтенда (React).",
        ],
      },
      {
        period: "2021-11 - 2022-05",
        role: "Backend Developer",
        company: "Justcoded",
        type: "офис",
        description: [
          "Разработка ядра финтех-платформы (Lenderkit.com) в команде из 50+ инженеров.",
          "Проектирование модульной архитектуры для White-label решений.",
          "Интеграция внешних сервисов, включая Polymesh (Blockchain) и Docusign.",
          "Работа в строгом Agile-процессе с использованием Jira и CI/CD pipelines.",
        ],
      },
      {
        period: "2020-05 - 2021-11",
        role: "Backend Developer",
        company: "SPDLoad",
        type: "офис",
        description: [
          "Проектирование High-load REST API для страховых CRM и мобильных приложений.",
          "Выполнял обязанности Team Lead на проекте логистического маркетплейса (управление архитектурой бэкенда).",
          "Разработка бэкенда для мобильных приложений (интеграция с React Native).",
          "Рефакторинг легаси-кода и оптимизация производительности баз данных.",
        ],
      },
      {
        period: "2017-10 - 2020-04",
        role: "Web Developer (PHP/JS)",
        company: "freelance, ag.mos.ru, oxbox.ru",
        type: "удаленно",
        description: [
          "Разработка полного цикла (Full-cycle) для интернет-магазинов и медицинских порталов.",
          "Настройка и поддержка продакшн-серверов (Linux, Nginx, SSL).",
          "Разработка кастомного функционала на PHP, Laravel и JavaScript/jQuery.",
          "Оптимизация сайтов для SEO и производительности (Google PageSpeed).",
        ],
      },
    ],
    education: {
      degree: "Специалист",
      university: "ХНАДУ",
      faculty: "Транспортные системы",
    },
    portfolio: [
      {
        title: "CRM система для страховой компании",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Система учета страховых случаев для менеджеров с распределением ролей",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Мобильное приложение для преподавателей и студентов",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "React Native"],
        team: "2 backend + 1 frontend + QA + BA",
        functionality: "Приложение для преподавателей и студентов",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Маркетплейс в сфере логистики",
        stack: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Vue.js"],
        team: "1 backend + 1 frontend + 1 fullstack + PM + Designer",
        functionality: "Маркетплейс американского e-commerce рынка логистики",
        technologies: ["GIT", "Jira", "Postman", "Laravel Forge", "Laravel Nova"],
      },
      {
        title: "Продуктовая разработка",
        stack: ["PHP 8.0", "Laravel 8", "PostgreSQL", "Redis", "Vue.js"],
        team: "25+ backend + 20+ frontend + Techlead + Teamlead + PM + BA + 4 QA",
        functionality: "Продукт для сферы инвестиций",
        technologies: ["GIT", "Youtrack", "Jenkins", "Docker", "Swagger"],
      },
      {
        title: "ERP система для нефтегазовой компании",
        stack: ["PHP 7.3", "Laravel 5.7", "PostgreSQL", "Redis", "React"],
        team: "5+ backend + 2+ frontend + Techlead + Teamlead + PM + 2 BA + 2 QA",
        functionality: "Web + мобильное приложение для автоматизации работы сотрудников (2000+)",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Docker", "Postman", "ssh"],
      },
      {
        title: "Сервис по обмену криптовалют",
        stack: ["PHP 8.1", "Laravel 10 (Lumen)", "PostgreSQL", "Redis", "RabbitMQ"],
        team: "4+ backend + 2 frontend + Teamlead + PM + BA + QA",
        functionality: "Создание микросервисов для обмена криптовалют",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Docker", "Postman", "ssh", "Microservices"],
      },
      {
        title: "Разработка ПО в сфере медицины",
        stack: ["PHP 8.2", "Laravel 9", "PostgreSQL", "Redis", "React.js", "JSONRPC"],
        team: "15+ backend + 10+ frontend + BA + QA",
        functionality: "ERP система для автоматизации процессов для больниц, поликлиник и лабораторий",
        technologies: ["GIT", "Jira", "Gitlab CI/CD", "Postman", "ssh"],
      },
    ],
    video: {
      title: "Мой YouTube канал",
      url: "https://www.youtube.com/watch?v=WwpUeTx1SOc",
    },
  },
};
