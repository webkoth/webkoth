import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LiveNpmBadge } from "./live-npm-badge";
import { LiveGhStars } from "./live-gh-stars";

export type CaseItem = {
  id: string;
  title: string;
  sub: string;
  stack: string[];
  group: "ai" | "production";
  link?: string;
  openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
};

const ACCENT_TECH = /\b(claude|gemini|groq|openai|gpt|llm|mcp|rag|yandex\s*(gpt|ocr)|nanobanano|ai\s*sdk|ocr)\b/i;
const isAccent = (tech: string) => ACCENT_TECH.test(tech);

export function CaseCard({
  item,
  groupLabel,
}: {
  item: CaseItem;
  groupLabel?: string;
}) {
  const cardEl = (
    <Card
      id={item.id}
      className={cn(
        "group relative h-full overflow-hidden transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/40",
      )}
    >
      {/* Hover accent — diagonal sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {groupLabel ? (
        <span className="absolute right-3 top-3 rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
          {groupLabel}
        </span>
      ) : null}
      <CardContent className="flex flex-col gap-3 p-5">
        <h3 className="pr-24 text-base font-semibold transition-colors duration-200 group-hover:text-primary">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground">{item.sub}</p>
        <div className="flex flex-wrap gap-1">
          {item.stack.map((s) => {
            const accent = isAccent(s);
            return (
              <Badge
                key={s}
                variant={accent ? "outline" : "secondary"}
                className={cn(
                  "font-mono text-[10px]",
                  accent &&
                    "border-primary/40 bg-primary/5 text-primary group-hover:bg-primary/10",
                )}
              >
                {s}
              </Badge>
            );
          })}
        </div>
        {item.openSource && (
          <div className="flex flex-wrap gap-1 pt-1">
            <LiveNpmBadge pkg={item.openSource.npmPkg} />
            <LiveGhStars
              owner={item.openSource.ghOwner}
              repo={item.openSource.ghRepo}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (item.link) {
    return (
      <Link href={item.link} className="block h-full">
        {cardEl}
      </Link>
    );
  }
  return cardEl;
}
