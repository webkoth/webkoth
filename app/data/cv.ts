
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
};

export const cvData: Record<"en" | "ru", CVData> = {
  en: {
    name: "Minas Sarkisyan",
    role: "Backend | Fullstack PHP | Laravel",
    location: "",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@minasarkisyan",
      github: "github.com/webkoth",
    },
    about: "I am always studying new technologies in development. Now I am actively learning TALL (Tailwind, Alpine, Laravel, Livewire). I try to direct my development vector towards fullstack development. I am interested in Data Analytics and Machine Learning.",
    skills: [
      { name: "HTML/CSS", level: 90 },
      { name: "Bootstrap/Tailwindcss", level: 85 },
      { name: "JavaScript", level: 85 },
      { name: "Vue.js", level: 75 },
      { name: "TypeScript", level: 70 },
      { name: "Npm/Webpack/Vite", level: 80 },
      { name: "Docker", level: 75 },
      { name: "Nginx/Linux/CLI", level: 70 },
      { name: "MySQL/PgSQL", level: 85 },
      { name: "PHP", level: 95 },
      { name: "Laravel", level: 95 },
      { name: "Symfony", level: 60 },
      { name: "OOP/Patterns/Microservices", level: 90 },
      { name: "SOLID/Clean Code/DDD", level: 85 },
      { name: "Kanban/Jira/Git/IDE", level: 90 },
    ],
    experience: [
      {
        period: "2022-06 - now",
        role: "Backend | Fullstack Developer PHP/Laravel/React",
        company: "alvariumsoft.com",
        type: "office",
        description: [
          "Development of services and ERP systems in Laravel",
          "Development of API for mobile application",
          "Integration with external and internal services",
          "Development and maintenance of ERP for the gas industry",
          "Experience with microservice architecture in Blockchain",
        ],
      },
      {
        period: "2021-11 - 2022-05",
        role: "Backend Developer PHP/Laravel",
        company: "Justcoded",
        type: "office",
        description: [
          "Work in a core product team (50+) at Lenderkit.com",
          "Development of modules and components for fintech product",
          "Modular and microservice architecture",
          "Integration with external services (polymesh, docusign)",
        ],
      },
      {
        period: "2020-05 - 2021-11",
        role: "Backend Developer PHP/Laravel",
        company: "SPDLoad",
        type: "office",
        description: [
          "REST API for WEB/Mobile App",
          "CRM system for insurance company (Laravel, React)",
          "Mobile application (Laravel, React Native)",
          "Finalization of the starting template PHP, JavaScript",
          "Teamlead on a logistics project",
        ],
      },
      {
        period: "2017-10 - 2020-04",
        role: "PHP | JS Web Developer",
        company: "freelance, ag.mos.ru, oxbox.ru",
        type: "remote",
        description: [
          "PHP/Laravel development",
          "Designing an online store of contact lenses",
          "Functional development and support of a medical portal",
          "Deployment to production",
          "Website redesign, layout and support",
          "Build online stores on ready-made CMS (opencart, wordpress)",
          "SEO optimization, work in production server",
          "Bug-fixing",
          "Google Analytics and Yandex.Metrika setup",
          "HTML5/CSS3 page layout",
          "Development using Agile and Scrum methodologies",
          "JavaScript/JQuery functionality development",
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
  },
  ru: {
    name: "Минас Саркисян",
    role: "Backend | Fullstack PHP | Laravel",
    location: "",
    contacts: {
      email: "webkoth@gmail.com",
      telegram: "@minasarkisyan",
      github: "github.com/webkoth",
    },
    about: "Я всегда изучаю новые технологии в разработке. Сейчас я активно изучаю TALL (Tailwind, Alpine, Laravel, Livewire). Стараюсь направлять вектор своего развития в сторону fullstack-разработки. Интересуюсь аналитикой данных и машинным обучением.",
    skills: [
      { name: "HTML/CSS", level: 90 },
      { name: "Bootstrap/Tailwindcss", level: 85 },
      { name: "JavaScript", level: 85 },
      { name: "Vue.js", level: 75 },
      { name: "TypeScript", level: 70 },
      { name: "Npm/Webpack/Vite", level: 80 },
      { name: "Docker", level: 75 },
      { name: "Nginx/Linux/CLI", level: 70 },
      { name: "MySQL/PgSQL", level: 85 },
      { name: "PHP", level: 95 },
      { name: "Laravel", level: 95 },
      { name: "Symfony", level: 60 },
      { name: "OOP/Patterns/Microservices", level: 90 },
      { name: "SOLID/Clean Code/DDD", level: 85 },
      { name: "Kanban/Jira/Git/IDE", level: 90 },
    ],
    experience: [
      {
        period: "2022-06 - по настоящее время",
        role: "Backend | Fullstack Developer PHP/Laravel/React",
        company: "alvariumsoft.com",
        type: "офис",
        description: [
          "Разработка сервисов и ERP-систем на Laravel",
          "Разработка API для мобильного приложения",
          "Интеграция с внешними и внутренними сервисами",
          "Разработка и поддержка ERP для газовой отрасли",
          "Опыт работы с микросервисной архитектурой в Blockchain",
        ],
      },
      {
        period: "2021-11 - 2022-05",
        role: "Backend Developer PHP/Laravel",
        company: "Justcoded",
        type: "офис",
        description: [
          "Работа в основной продуктовой команде (50+) на Lenderkit.com",
          "Разработка модулей и компонентов для финтех-продукта",
          "Модульная и микросервисная архитектура",
          "Интеграция с внешними сервисами (polymesh, docusign)",
        ],
      },
      {
        period: "2020-05 - 2021-11",
        role: "Backend Developer PHP/Laravel",
        company: "SPDLoad",
        type: "офис",
        description: [
          "REST API для WEB/Mobile App",
          "CRM-система для страховой компании (Laravel, React)",
          "Мобильное приложение (Laravel, React Native)",
          "Доработка стартового шаблона PHP, JavaScript",
          "Тимлид на логистическом проекте",
        ],
      },
      {
        period: "2017-10 - 2020-04",
        role: "PHP | JS Web Developer",
        company: "freelance, ag.mos.ru, oxbox.ru",
        type: "удаленно",
        description: [
          "Разработка на PHP/Laravel",
          "Проектирование интернет-магазина контактных линз",
          "Функциональная разработка и поддержка медицинского портала",
          "Деплой в продакшн",
          "Реализация редизайна сайта, верстка и поддержка",
          "Создание интернет-магазинов на готовых CMS (opencart, wordpress)",
          "SEO оптимизация, работа на продакшн-сервере",
          "Исправление багов",
          "Настройка Google Analytics и Яндекс.Метрики",
          "Верстка страниц HTML5/CSS3",
          "Разработка по методологиям Agile и Scrum",
          "Разработка функционала на JavaScript/JQuery",
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
  },
};
