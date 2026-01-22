"use client"

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface SkillsProps {
  data: CVData;
  lang: "en" | "ru";
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
              {/* <span className="text-muted-foreground">{skill.level}%</span> */}
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${skill.level}%` }} 
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
