import { CVData } from "@/app/data/cv";
import { cn } from "@/lib/utils";

interface ExperienceProps {
  data: CVData;
  lang?: "en" | "ru";
}

const LABELS = {
  en: { responsibilities: "Responsibilities", achievements: "Achievements" },
  ru: { responsibilities: "Обязанности", achievements: "Достижения" },
} as const;

function GroupBadge({
  variant,
  children,
}: {
  variant: "responsibilities" | "achievements";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        variant === "achievements"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-border bg-muted/60 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-muted-foreground/60"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Experience({ data, lang = "en" }: ExperienceProps) {
  const labels = LABELS[lang];

  return (
    <section className="space-y-5">
      <div className="space-y-8">
        {data.experience.map((job, index) => (
          <div key={index} className="relative pb-2 pl-6 border-l-2 border-muted">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />

            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold">{job.role}</h3>
              <span className="rounded bg-muted px-2 py-1 font-mono text-sm text-muted-foreground">
                {job.period}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="font-semibold text-primary">{job.company}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{job.type}</span>
            </div>

            {job.aiMarker ? (
              <div className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {job.aiMarker}
              </div>
            ) : null}

            {job.responsibilities && job.responsibilities.length > 0 ? (
              <div className="mt-4">
                <GroupBadge variant="responsibilities">
                  {labels.responsibilities}
                </GroupBadge>
                <BulletList items={job.responsibilities} />
              </div>
            ) : null}

            {job.achievements && job.achievements.length > 0 ? (
              <div className="mt-4">
                <GroupBadge variant="achievements">
                  {labels.achievements}
                </GroupBadge>
                <BulletList items={job.achievements} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
