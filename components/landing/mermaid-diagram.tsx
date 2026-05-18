"use client";
import { useEffect, useRef } from "react";

export function MermaidDiagram({ chart, theme = "dark" }: { chart: string; theme?: "dark" | "default" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, theme, fontFamily: "var(--font-geist-sans)" });
      const id = "m-" + Math.random().toString(36).slice(2);
      const { svg } = await mermaid.render(id, chart);
      if (!cancelled && ref.current) ref.current.innerHTML = svg;
    })();
    return () => { cancelled = true; };
  }, [chart, theme]);

  return <div ref={ref} className="w-full overflow-x-auto" />;
}
