"use client";

import { CVData } from "@/app/data/cv";

interface SkillsProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Skills({ data, lang }: SkillsProps) {
  const title = lang === "en" ? "Skills" : "Навыки";
  const touchLabel = "touch";

  return (
    <section className="space-y-5">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-5">
        {data.skills.map((cat) => (
          <div key={cat.category}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.category}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  title={item.maturity === "production" ? "production" : "touch"}
                  className={
                    item.maturity === "production"
                      ? "rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs text-foreground"
                      : "rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                  }
                >
                  {item.name}
                  {item.maturity === "touch" ? (
                    <span className="ml-1 font-mono text-[9px] uppercase">· {touchLabel}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
