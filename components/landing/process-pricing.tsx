"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { packageIds } from "@/lib/landing/pricing";
import { copy, type Lang } from "./copy-i18n";
import { SpotlightCard } from "./spotlight-card";
import { StaggerGroup, StaggerItem } from "./stagger";

export function ProcessPricing({ lang }: { lang: Lang }) {
  const pricing = copy[lang].pricing;

  return (
    <section id="process-pricing" className="border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div id="pricing" className="scroll-mt-20">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
            {pricing.title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mb-10 max-w-3xl">
            {pricing.subtitle}
          </p>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packageIds.map((id) => {
              const isFeatured = id === "integration";
              const data = pricing.packages[id];
              return (
                <StaggerItem key={id} className="h-full">
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
                        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          {data.audience}
                        </div>
                        <h3 className="text-xl font-semibold">{data.name}</h3>
                        <div>
                          <Badge
                            variant={isFeatured ? "default" : "secondary"}
                            className="text-sm font-mono tabular-nums"
                          >
                            {data.pill}
                          </Badge>
                        </div>
                        <ul className="flex-1 space-y-2">
                          {data.items.map((item) => (
                            <li key={item} className="flex gap-2 text-sm">
                              <Check className="size-4 mt-0.5 text-primary shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {data.excludes.length > 0 && (
                          <div className="border-t border-border pt-3">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              {pricing.excludesLabel}
                            </div>
                            <ul className="space-y-1">
                              {data.excludes.map((item) => (
                                <li
                                  key={item}
                                  className="text-xs text-muted-foreground leading-snug"
                                >
                                  · {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Link
                          href={`#form?package=${id}`}
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
