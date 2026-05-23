"use client";

import * as React from "react";
import { FileText, Copy, Check, X, Download } from "lucide-react";
import { copy as landingCopy, type Lang } from "./copy-i18n";
import { buildLandingMarkdown } from "@/lib/landing-markdown";

const TEXT = {
  ru: {
    title: "Документация для LLM",
    description:
      "Полное содержание лендинга в markdown — для AI-агентов, парсеров и заметок.",
    download: "Скачать /llms.txt",
    copy: "Копировать markdown",
    copied: "Скопировано",
    close: "Закрыть",
  },
  en: {
    title: "LLM Documentation",
    description:
      "Complete landing content in markdown — for AI agents, parsers and notes.",
    download: "Download /llms.txt",
    copy: "Copy markdown",
    copied: "Copied",
    close: "Close",
  },
} as const;

export function LandingLLMDocsButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const t = TEXT[lang];

  const markdown = React.useMemo(
    () => buildLandingMarkdown(landingCopy[lang], lang),
    [lang],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("clipboard failed", err);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        title={t.title}
        onClick={() => setOpen(true)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted"
      >
        <FileText className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{t.title}</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col gap-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={t.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
                {markdown}
              </pre>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <Download className="h-4 w-4" />
                {t.download}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t.copy}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
