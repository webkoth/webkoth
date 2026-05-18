"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/spotlight relative isolate",
        // The spotlight layer
        "before:pointer-events-none before:absolute before:inset-0 before:-z-0 before:opacity-0 before:transition-opacity before:duration-300",
        "before:[background:radial-gradient(360px_circle_at_var(--mx,_50%)_var(--my,_50%),color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]",
        "before:rounded-[inherit] hover:before:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
