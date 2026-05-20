"use client";

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface SkillsProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Skills({ data, lang }: SkillsProps) {
  const title = lang === "en" ? "Technical Skills" : "Технические навыки";
  const touchLabel = "touch";

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wrench className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
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
      </CardContent>
    </Card>
  );
}
