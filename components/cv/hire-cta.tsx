"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData; variant?: "primary" | "compact" };

export function HireCta({ data, variant = "primary" }: Props) {
  const { hireCta } = data;

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{hireCta.headline}</div>
            <div className="text-xs text-muted-foreground">{hireCta.body}</div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href={hireCta.primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              ✈ Telegram
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={hireCta.secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              📅 Calendar
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={`mailto:${hireCta.emailLabel}`}
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              {hireCta.emailLabel}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
      <div className="mb-2 text-lg font-semibold md:text-xl">{hireCta.headline}</div>
      <p className="mb-5 text-sm text-muted-foreground md:text-base">{hireCta.body}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={hireCta.primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          ✈ {hireCta.primaryLabel}
        </a>
        <a
          href={hireCta.secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          📅 {hireCta.secondaryLabel}
        </a>
        <a
          href={`mailto:${hireCta.emailLabel}`}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {hireCta.emailLabel}
        </a>
      </div>
    </div>
  );
}
