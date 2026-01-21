import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface EducationProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Education({ data, lang }: EducationProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <CardTitle className="flex items-center gap-2 text-primary">
          <GraduationCap className="w-5 h-5" />
          {lang === "en" ? "Education" : "Образование"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
         <div className="space-y-1">
            <h3 className="font-bold">{data.education.university}</h3>
            <p className="text-muted-foreground">{data.education.degree}</p>
            <p className="text-sm text-muted-foreground">{data.education.faculty}</p>
         </div>
      </CardContent>
    </Card>
  );
}
