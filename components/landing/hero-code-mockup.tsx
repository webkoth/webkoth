"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CODE = `// hubmarket/lib/llm-cascade.ts
// latency p99: ~180ms · cost: ~$0.0003/req
// 0 LLM downtime since launch (8 months in prod)
import { generateText } from "ai";
import { anthropic, gemini, groq } from "@/providers";

// primary → fallback 1 → fallback 2 (cheapest)
const providers = [anthropic, gemini, groq];

export async function withCascade(prompt: string) {
  for (const p of providers) {
    try {
      return await generateText({ model: p, prompt });
    } catch (e) {
      logger.warn(\`fallback from \${p.name}\`, e);
    }
  }
  throw new Error("all providers down");
}`;

const FOOTER_LOG = "✓ 12,847 calls · 0 downtime · 3 fallbacks today";

export function HeroCodeMockup() {
  const [html, setHtml] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { codeToHtml } = await import("shiki");
      const out = await codeToHtml(CODE, {
        lang: "ts",
        themes: { light: "github-light", dark: "github-dark" },
      });
      if (!cancelled) setHtml(out);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Glow behind window */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-3xl opacity-50 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 28%, transparent)" }}
      />

      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            llm-cascade.ts
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            production
          </span>
        </div>

        {/* Code */}
        <div className="text-[12px] md:text-[13px] [&_pre]:p-5 [&_pre]:!bg-transparent [&_pre]:overflow-x-auto">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <pre className="p-5 font-mono">{CODE}</pre>
          )}
        </div>

        {/* Footer log */}
        <div className="px-5 py-3 border-t border-border bg-muted/30 font-mono text-xs text-muted-foreground">
          {FOOTER_LOG}
        </div>
      </div>
    </motion.div>
  );
}
