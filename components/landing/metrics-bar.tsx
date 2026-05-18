"use client";
import { useEffect, useRef, useState } from "react";
import { copy, type Lang } from "./copy-i18n";

function useCounter(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / durationMs);
        setValue(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

function Metric({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: v, ref } = useCounter(value);
  const display = Number.isInteger(value) ? Math.round(v) : v.toFixed(1);
  return (
    <div className="flex flex-col items-start gap-1">
      <span ref={ref} className="text-2xl md:text-3xl font-semibold tabular-nums">
        {display}{suffix}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

export function MetricsBar({ lang }: { lang: Lang }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
      {copy[lang].hero.metrics.map((m) => (
        <Metric key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
      ))}
    </div>
  );
}
