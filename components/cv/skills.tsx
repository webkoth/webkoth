"use client";

import { cn } from "@/lib/utils";
import { CVData } from "@/app/data/cv";

interface SkillsProps {
  data: CVData;
  lang: "en" | "ru";
}

// Category → accent tone. Touch items keep the muted base regardless of category.
const CATEGORY_TONES: { match: RegExp; tone: string; dot: string }[] = [
  {
    match: /AI|LLM/i,
    tone: "border-primary/40 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  {
    match: /Backend|Бэкенд|бэкенд/i,
    tone:
      "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  {
    match: /Frontend|Фронтенд|фронтенд/i,
    tone:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    match: /Database|Базы|БД/i,
    tone:
      "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    match: /Architecture|Архитектура/i,
    tone:
      "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  {
    match: /DevOps|Tooling|Инфра|Тулинг/i,
    tone:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-500",
  },
  {
    match: /Testing|QA|Тестирование/i,
    tone:
      "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  {
    match: /Big Data|Analytics|Data Engineering|Аналитика|Данные/i,
    tone:
      "border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
];

function toneFor(category: string) {
  for (const t of CATEGORY_TONES) {
    if (t.match.test(category)) return t;
  }
  return {
    tone: "border-border bg-muted/40 text-foreground",
    dot: "bg-foreground/60",
  };
}

export function Skills({ data }: SkillsProps) {
  const touchLabel = "touch";

  return (
    <section className="space-y-5">
      <div className="space-y-5">
        {data.skills.map((cat) => {
          const t = toneFor(cat.category);
          return (
            <div key={cat.category}>
              <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span
                  aria-hidden
                  className={cn("inline-block size-1.5 rounded-full", t.dot)}
                />
                {cat.category}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item.name}
                    title={item.maturity === "production" ? "production" : "touch"}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs",
                      item.maturity === "production"
                        ? t.tone
                        : "border-border bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {item.name}
                    {item.maturity === "touch" ? (
                      <span className="ml-1 font-mono text-[9px] uppercase">
                        · {touchLabel}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
