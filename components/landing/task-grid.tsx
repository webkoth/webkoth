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
  return (
    <section id="tasks" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-12">{t.title}</h2>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <StaggerItem key={item.title}>
                <Link href={item.anchor} className="group block h-full">
                  <Card className="h-full transition-all hover:border-primary/40 hover:-translate-y-0.5">
                    <CardContent className="p-6">
                      <Icon className="size-6 mb-4 text-primary" strokeWidth={1.5} />
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
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
