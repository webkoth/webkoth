import { CVData } from "@/app/data/cv";

interface EducationProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Education({ data }: EducationProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 space-y-1">
        <h3 className="font-bold">{data.education.university}</h3>
        <p className="text-muted-foreground">{data.education.degree}</p>
        <p className="text-sm text-muted-foreground">{data.education.faculty}</p>
      </div>
    </section>
  );
}
