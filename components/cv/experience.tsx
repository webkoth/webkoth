import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface ExperienceProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Experience({ data, lang }: ExperienceProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Briefcase className="w-5 h-5" />
          {lang === "en" ? "Experience" : "Опыт работы"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {data.experience.map((job, index) => (
          <div key={index} className="relative pl-6 border-l-2 border-muted pb-8 last:pb-0">
             <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
             
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg">{job.role}</h3>
                <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    {job.period}
                </span>
             </div>
             
             <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-primary">{job.company}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{job.type}</span>
             </div>

             <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground">
                {job.description.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
             </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
