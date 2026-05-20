"use client";

import type { ChipGroup } from "@/app/data/cv";

type Props = { groups: ChipGroup[] };

export function Chips({ groups }: Props) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.groupLabel} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {g.groupLabel}:
          </span>
          {g.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
