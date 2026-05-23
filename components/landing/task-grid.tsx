"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Bot,
  Plug,
  Scale,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { copy, type Lang } from "./copy-i18n";
import { StaggerGroup, StaggerItem } from "./stagger";

const iconMap: Record<string, LucideIcon> = {
  search: Search,
  bot: Bot,
  plug: Plug,
  scale: Scale,
  doc: FileText,
  sparkles: Sparkles,
};

export function TaskGrid({ lang }: { lang: Lang }) {
  const t = copy[lang].tasks;
  const eyebrow = lang === "ru" ? "С ЧЕМ Я РАБОТАЮ" : "WHAT I WORK ON";
  const sub =
    lang === "ru"
      ? "Шесть форматов задач — выберите вход, который ближе всего к вашей ситуации."
      : "Six task formats — pick the entry point closest to your situation.";
  return (
    <section id="tasks" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_55%)]"
      />
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
          <h2 className="mb-3 text-2xl md:text-4xl font-semibold tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground">{sub}</p>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <StaggerItem key={item.title}>
                <Link href={item.anchor} className="group block h-full">
                  <Card className="h-full transition-all hover:border-primary/40 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <Icon className="size-6 mb-4 text-primary" strokeWidth={1.5} />
                      <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                      <div className="space-y-1.5 text-sm leading-snug">
                        <div className="text-muted-foreground">{item.trigger}</div>
                        <div className="text-muted-foreground">{item.action}</div>
                        <div className="font-medium text-foreground transition-colors group-hover:text-primary">
                          {item.outcome}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
