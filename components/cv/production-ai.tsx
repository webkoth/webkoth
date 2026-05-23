"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData; lang: "en" | "ru" };

export function ProductionAI({ data, lang }: Props) {
  const sub =
    lang === "en"
      ? "Concrete achievements with evidence pointers."
      : "Конкретные достижения с указателями на доказательства.";

  return (
    <section className="space-y-5">
      <p className="text-sm text-muted-foreground">{sub}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {data.productionAI.map((a) => (
          <div key={a.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-2 text-base font-semibold">{a.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            {a.evidence ? (
              <div className="mt-3 text-xs text-primary">{a.evidence}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
