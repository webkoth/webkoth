"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { packages } from "@/lib/landing/pricing";
import { copy, type Lang } from "./copy-i18n";
import { SpotlightCard } from "./spotlight-card";
import { StaggerGroup, StaggerItem } from "./stagger";

export function ProcessPricing({ lang }: { lang: Lang }) {
  const roadmap = copy[lang].roadmap;
  const pricing = copy[lang].pricing;

  return (
    <section id="process-pricing" className="border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 space-y-20">
        <div>
          <div className="max-w-2xl mb-14">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">
              {roadmap.title}
            </h2>
            <p className="text-muted-foreground">{roadmap.sub}</p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
            {roadmap.steps.map((s) => (
              <StaggerItem key={s.num}>
                <article className="relative h-full pt-10">
                  <span
                    aria-hidden
                    className="absolute -top-2 left-0 font-serif italic text-5xl md:text-6xl text-muted-foreground/30 leading-none"
                  >
                    {s.num}
                  </span>
                  <div className="relative border-l-2 border-primary/30 pl-4 pt-2">
                    <h3 className="text-base font-semibold mb-1">{s.title}</h3>
                    <p className="font-mono text-xs text-muted-foreground mb-3">{s.time}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div id="pricing" className="scroll-mt-20">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-10">
            {pricing.title}
          </h3>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((p) => {
              const isFeatured = p.id === "mvp";
              const data = pricing.packages[p.id];
              const price = lang === "ru" ? p.priceRu : p.priceEn;
              const duration = lang === "ru" ? p.duration.ru : p.duration.en;
              return (
                <StaggerItem key={p.id} className="h-full">
                  <SpotlightCard
                    className={cn("h-full rounded-3xl", isFeatured && "md:-translate-y-2")}
                  >
                    <Card
                      className={cn(
                        "h-full flex flex-col relative z-10",
                        isFeatured && "ring-2 ring-primary shadow-xl",
                      )}
                    >
                      <CardContent className="p-6 flex flex-col flex-1 gap-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-semibold">{data.name}</h3>
                          <Badge variant={isFeatured ? "default" : "secondary"}>
                            {data.pill}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-3xl font-semibold tabular-nums">{price}</div>
                          <div className="text-sm text-muted-foreground mt-1">{duration}</div>
                        </div>
                        <ul className="flex-1 space-y-2">
                          {data.items.map((item) => (
                            <li key={item} className="flex gap-2 text-sm">
                              <Check className="size-4 mt-0.5 text-primary shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`#form?package=${p.id}`}
                          className={buttonVariants({
                            variant: isFeatured ? "default" : "outline",
                          })}
                        >
                          {data.cta}
                        </Link>
                      </CardContent>
                    </Card>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
