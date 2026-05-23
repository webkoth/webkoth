import type { LucideIcon } from "lucide-react";

export function SectionEyebrow({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      <span>{children}</span>
    </div>
  );
}
