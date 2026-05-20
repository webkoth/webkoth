"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData };

export function HireCta({ data }: Props) {
  const { hireCta } = data;
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
      <div className="mb-2 text-lg font-semibold md:text-xl">{hireCta.headline}</div>
      <p className="mb-5 text-sm text-muted-foreground md:text-base">{hireCta.body}</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={hireCta.primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          ✈️ {hireCta.primaryLabel}
        </a>
        <a
          href={hireCta.secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          📅 {hireCta.secondaryLabel}
        </a>
        <a
          href={`mailto:${hireCta.emailLabel}`}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {hireCta.emailLabel}
        </a>
      </div>
    </div>
  );
}
