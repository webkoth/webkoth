"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarClock, Send, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { copy, type Lang } from "./copy-i18n";
import { contacts } from "@/lib/landing/contacts";

const schema = z.object({
  audience: z.enum(["founder", "smb", "agency", "other"]),
  name: z.string().min(1).max(120),
  contact: z.string().min(2).max(200),
  package: z.enum(["sprint", "integration", "subcontract", "auditOnly", "unsure"]),
  message: z.string().min(10).max(4000),
  budget: z.enum(["under200", "to600", "to12m", "over12m", "usd", "unknown"]).optional(),
  // honeypot
  website: z.string().max(0).optional(),
  // timing guard
  filledAtMs: z.number(),
});

type FormData = z.infer<typeof schema>;

const PROGRESS_FIELDS: (keyof FormData)[] = [
  "audience",
  "name",
  "contact",
  "package",
  "message",
  "budget",
];

function AltChannels({
  intro,
  calendarLabel,
  telegramLabel,
}: {
  intro: string;
  calendarLabel: string;
  telegramLabel: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-transparent p-4">
      <p className="mb-3 text-sm leading-relaxed text-foreground/85">{intro}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={contacts.calendar}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/90 hover:shadow-sm"
        >
          <CalendarClock className="size-4 text-primary" strokeWidth={1.75} />
          <span>{calendarLabel}</span>
          <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </a>
        <a
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/90 hover:shadow-sm"
        >
          <Send className="size-4 text-primary" strokeWidth={1.75} />
          <span>{telegramLabel}</span>
          <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </a>
      </div>
    </div>
  );
}

export function LeadForm({
  lang,
  initialPackage,
  onSuccess,
}: {
  lang: Lang;
  initialPackage?: FormData["package"];
  onSuccess?: () => void;
}) {
  const t = copy[lang].form;
  const renderedAt = typeof window !== "undefined" ? Date.now() : 0;
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      audience: "founder",
      name: "",
      contact: "",
      package: initialPackage ?? "unsure",
      message: "",
      website: "",
      filledAtMs: renderedAt,
    },
  });

  const watched = useWatch({ control: form.control });
  const filledCount = PROGRESS_FIELDS.reduce((acc, k) => {
    const v = watched[k];
    return v !== undefined && v !== null && String(v).length > 0 ? acc + 1 : acc;
  }, 0);
  const totalCount = PROGRESS_FIELDS.length;
  const progressPct = (filledCount / totalCount) * 100;

  // Pre-fill package from URL hash query (only when no explicit prop)
  useEffect(() => {
    if (initialPackage) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const match = hash.match(/[?&]package=(sprint|integration|subcontract|auditOnly|unsure)/);
    if (match) form.setValue("package", match[1] as FormData["package"]);
  }, [form, initialPackage]);

  const onSubmit = async (data: FormData) => {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setSubmitState("success");
        form.reset({ ...form.getValues(), name: "", contact: "", message: "" });
        toast.success(t.success.title, { description: t.success.body });
        onSuccess?.();
      } else {
        setSubmitState("error");
        toast.error(t.error.title, { description: t.error.body });
      }
    } catch {
      setSubmitState("error");
      toast.error(t.error.title, { description: t.error.body });
    }
  };

  if (submitState === "success") {
    return (
      <div className="py-2 text-center">
        <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">{t.success.title}</h3>
        <p className="text-muted-foreground mb-6">{t.success.body}</p>
        <div className="mx-auto max-w-md">
          <AltChannels
            intro={t.altChannels.intro}
            calendarLabel={t.altChannels.calendar}
            telegramLabel={t.altChannels.telegram}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{t.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t.hint}</p>
      </div>

      {/* altChannels escape hatch — at the top, before the form */}
      <div className="mb-6 rounded-md border border-border bg-muted/30 p-4">
        <AltChannels
          intro={t.altChannelsTop}
          calendarLabel={t.altChannels.calendar}
          telegramLabel={t.altChannels.telegram}
        />
      </div>

      {/* progress indicator */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t.progressLabel}</span>
        <span className="font-mono tabular-nums">
          {filledCount} / {totalCount}
        </span>
      </div>
      <div className="mb-6 h-1 w-full rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* honeypot */}
          <input type="text" {...form.register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1.5">{t.fields.audience}</label>
            <Select
              value={form.watch("audience")}
              onValueChange={(v) => form.setValue("audience", v as FormData["audience"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(v: unknown) => {
                    const key = typeof v === "string" ? v : "";
                    return (
                      t.fields.audienceOptions[
                        key as keyof typeof t.fields.audienceOptions
                      ] ?? key
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.fields.audienceOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">{t.fields.name}</label>
            <Input {...form.register("name")} />
          </div>

          <div>
            <label className="block text-sm mb-1.5">{t.fields.contact}</label>
            <Input {...form.register("contact")} />
          </div>

          <div>
            <label className="block text-sm mb-1.5">{t.fields.package}</label>
            <Select
              value={form.watch("package")}
              onValueChange={(v) => form.setValue("package", v as FormData["package"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(v: unknown) => {
                    const key = typeof v === "string" ? v : "";
                    return (
                      t.fields.packageOptions[
                        key as keyof typeof t.fields.packageOptions
                      ] ?? key
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.fields.packageOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1.5">{t.fields.message}</label>
            <Textarea rows={5} {...form.register("message")} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1.5">{t.fields.budget}</label>
            <Select
              value={form.watch("budget") ?? "unknown"}
              onValueChange={(v) => form.setValue("budget", v as Exclude<FormData["budget"], undefined>)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(v: unknown) => {
                    const key = typeof v === "string" ? v : "";
                    return (
                      t.fields.budgetOptions[
                        key as keyof typeof t.fields.budgetOptions
                      ] ?? key
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.fields.budgetOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitState === "loading"}>
            {submitState === "loading" ? "…" : t.submit}
          </Button>
          {submitState === "error" && (
            <p className="text-sm text-destructive">{t.error.title} — {t.error.body}</p>
          )}
      </form>
    </div>
  );
}
