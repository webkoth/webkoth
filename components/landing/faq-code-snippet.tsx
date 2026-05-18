"use client";
import { useEffect, useState } from "react";

export function FaqCodeSnippet({ code, lang = "ts" }: { code: string; lang?: string }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { codeToHtml } = await import("shiki");
      const out = await codeToHtml(code, {
        lang,
        themes: { light: "github-light", dark: "github-dark" },
      });
      if (!cancelled) setHtml(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (!html) {
    return (
      <pre className="text-xs md:text-sm p-4 rounded-md border border-border bg-muted/50 overflow-x-auto">
        {code}
      </pre>
    );
  }
  return (
    <div
      className="text-xs md:text-sm rounded-md overflow-x-auto border border-border [&_pre]:p-4 [&_pre]:bg-muted/50"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
