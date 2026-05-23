import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";

export function SectionHeader({
  icon,
  eyebrow,
  title,
  sub,
  className,
}: {
  icon?: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", className)}>
      <SectionEyebrow icon={icon}>{eyebrow}</SectionEyebrow>
      <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
        {title}
      </h2>
      {sub ? <p className="text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
