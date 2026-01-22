"use client"

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface SkillsProps {
  data: CVData;
  lang: "en" | "ru";
}

function getSkillLevel(level: number, lang: "en" | "ru"): string {
  const levels = {
    en: {
      expert: "Expert",
      advanced: "Advanced",
      intermediate: "Intermediate",
      beginner: "Beginner",
    },
    ru: {
      expert: "Эксперт",
      advanced: "Продвинутый",
      intermediate: "Средний",
      beginner: "Начинающий",
    },
  };

  const t = levels[lang];

  if (level >= 90) return `${t.expert} (${level}%)`;
  if (level >= 75) return `${t.advanced} (${level}%)`;
  if (level >= 50) return `${t.intermediate} (${level}%)`;
  return `${t.beginner} (${level}%)`;
}

export function Skills({ data, lang }: SkillsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wrench className="w-5 h-5" />
          {lang === "en" ? "Technical Skills" : "Технические навыки"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {data.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span>{skill.name}</span>
            </div>
            <Tooltip content={getSkillLevel(skill.level, lang)}>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden cursor-help">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${skill.level}%` }} 
                />
              </div>
            </Tooltip>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
