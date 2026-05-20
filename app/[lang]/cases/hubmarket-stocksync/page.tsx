import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";

  return {
    title:
      lang === "ru"
        ? "HubMarket: синхронизация остатков · webkoth case"
        : "HubMarket: marketplace stock sync · webkoth case",
    description:
      lang === "ru"
        ? "Запрос фаундера → прод за 3 дня. Синхронизация остатков по 3 маркетплейсам (WB, Ozon, Yandex Market) для клиента HubMarket."
        : "Founder request → prod in 3 days. Stock sync across 3 marketplaces (WB, Ozon, Yandex Market) for a HubMarket customer.",
  };
}

type Copy = {
  title: string;
  pill: string;
  intro: string;
  timelineTitle: string;
  timeline: { day: string; what: string }[];
  decisionsTitle: string;
  decisions: { title: string; body: string }[];
  outcomeTitle: string;
  outcome: string[];
  stackTitle: string;
  stack: string[];
  backLink: string;
};

const copy: Record<"en" | "ru", Copy> = {
  ru: {
    title: "HubMarket: маркетплейс-синхронизация остатков",
    pill: "Запрос фаундера → прод за 3 дня",
    intro:
      "Production-кейс founder-driven спринта внутри HubMarket. Реальный заказчик-фаундер запросил фичу синхронизации остатков по трём маркетплейсам (Wildberries, Ozon, Yandex Market). От первого сообщения в Telegram до релиза прошло 3 дня.",
    timelineTitle: "Таймлайн",
    timeline: [
      { day: "День 0", what: "Запрос фаундера в Telegram, обсуждение требований и формата данных" },
      { day: "День 1", what: "Архитектурный набросок, проверка источников данных по 3 маркетплейсам, выбор очередей" },
      { day: "День 2", what: "End-to-end пайплайн на одном маркетплейсе, тест на реальных данных" },
      { day: "День 3", what: "Расширение на 3 маркетплейса, нагрузочная проверка, релиз в прод" },
    ],
    decisionsTitle: "Принятые решения",
    decisions: [
      {
        title: "Playwright вместо официальных API",
        body: "У части маркетплейсов нужные данные доступны только через UI (или API устаревший / нестабильный). Playwright + stealth даёт стабильный путь с откатом к API там, где он есть.",
      },
      {
        title: "pg-boss как очередь",
        body: "Уже используется в HubMarket для других задач. Зачем тащить новый Kafka/RabbitMQ, если существующая инфра справляется.",
      },
      {
        title: "Хранить дельты, не снимки",
        body: "Снимки остатков по часу = терабайты данных. Дельты + периодический ребейс позволяют держать всё в Postgres без отдельного DWH.",
      },
    ],
    outcomeTitle: "Результат",
    outcome: [
      "Релиз в прод на 3-й день после запроса",
      "Покрытие 3 маркетплейсов (Wildberries, Ozon, Yandex Market)",
      "Цикл «запрос → прод» 3-4 дня стал устойчивым паттерном для HubMarket — featured как 4-я метрика на лендинге",
      "Кейс подтверждает Hero-обещание «MVP за неделю — стартапам»",
    ],
    stackTitle: "Стек",
    stack: ["Next.js", "Hono", "Playwright", "pg-boss", "PostgreSQL"],
    backLink: "← Назад к webkoth.com",
  },
  en: {
    title: "HubMarket: marketplace stock sync",
    pill: "Founder request → prod in 3 days",
    intro:
      "Production case of a founder-driven sprint inside HubMarket. A real founder customer requested stock synchronization across three marketplaces (Wildberries, Ozon, Yandex Market). 3 days passed from the first Telegram message to the release.",
    timelineTitle: "Timeline",
    timeline: [
      { day: "Day 0", what: "Founder request via Telegram, requirements and data format discussion" },
      { day: "Day 1", what: "Architecture sketch, data-source investigation across 3 marketplaces, queue choice" },
      { day: "Day 2", what: "End-to-end pipeline on one marketplace, test on real data" },
      { day: "Day 3", what: "Extended to all 3 marketplaces, load-tested, production release" },
    ],
    decisionsTitle: "Decisions made",
    decisions: [
      {
        title: "Playwright over official APIs",
        body: "Some marketplaces only expose the needed data via UI (or the API is stale/unstable). Playwright + stealth gives a stable path with API fallback where available.",
      },
      {
        title: "pg-boss as the queue",
        body: "Already used elsewhere in HubMarket. No reason to add a Kafka/RabbitMQ when existing infra handles it.",
      },
      {
        title: "Store deltas, not snapshots",
        body: "Hourly stock snapshots = terabytes. Deltas plus periodic rebase let everything live in Postgres without a separate DWH.",
      },
    ],
    outcomeTitle: "Outcome",
    outcome: [
      "Released to prod on day 3 after the request",
      "Coverage: 3 marketplaces (Wildberries, Ozon, Yandex Market)",
      "Request → prod cycle of 3-4 days became a recurring pattern for HubMarket — featured as the 4th metric on the landing",
      "Backs the Hero promise «MVP в неделю — стартапам» / «MVP in a week — founders»",
    ],
    stackTitle: "Stack",
    stack: ["Next.js", "Hono", "Playwright", "pg-boss", "PostgreSQL"],
    backLink: "← Back to webkoth.com",
  },
};

export default async function CasePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";
  const t = copy[lang];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <Link
        href={`/${lang}`}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {t.backLink}
      </Link>

      <article className="mt-8 space-y-10">
        <header>
          <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary">
            {t.pill}
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.intro}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">{t.timelineTitle}</h2>
          <ol className="space-y-3">
            {t.timeline.map((row) => (
              <li
                key={row.day}
                className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 sm:flex-row sm:gap-4"
              >
                <span className="shrink-0 font-mono text-sm font-semibold text-primary sm:w-20">
                  {row.day}
                </span>
                <span className="text-sm text-foreground">{row.what}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">{t.decisionsTitle}</h2>
          <div className="space-y-4">
            {t.decisions.map((d) => (
              <div key={d.title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">{t.outcomeTitle}</h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-foreground">
            {t.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold md:text-2xl">{t.stackTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {t.stack.map((s) => (
              <span
                key={s}
                className="rounded-full bg-muted/60 px-2.5 py-1 font-mono text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
