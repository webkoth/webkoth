import { CVData } from "@/app/data/cv";

interface ExperienceProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Experience({ data, lang }: ExperienceProps) {
  const title = lang === "en" ? "Experience" : "Опыт работы";

  return (
    <section className="space-y-5">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-8">
        {data.experience.map((job, index) => (
          <div key={index} className="relative pl-6 border-l-2 border-muted pb-2">
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

            {job.aiMarker ? (
              <div className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {job.aiMarker}
              </div>
            ) : null}

            <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground">
              {job.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
