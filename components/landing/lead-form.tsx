"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
    <div className="text-sm text-muted-foreground">
      <p className="mb-2">{intro}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <a
          href={contacts.calendar}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          📅 {calendarLabel} →
        </a>
        <a
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          ✈️ {telegramLabel} →
        </a>
      </div>
    </div>
  );
}

export function LeadForm({ lang }: { lang: Lang }) {
  const t = copy[lang].form;
  const renderedAt = typeof window !== "undefined" ? Date.now() : 0;
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      audience: "founder",
      name: "",
      contact: "",
      package: "unsure",
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

  // Pre-fill package from URL hash query
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const match = hash.match(/[?&]package=(sprint|integration|subcontract|auditOnly|unsure)/);
    if (match) form.setValue("package", match[1] as FormData["package"]);
  }, [form]);

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
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    }
  };

  if (submitState === "success") {
    return (
      <section id="form" className="border-t border-border">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t.success.title}</h2>
          <p className="text-muted-foreground mb-8">{t.success.body}</p>
          <div className="mx-auto max-w-md">
            <AltChannels
              intro={t.altChannels.intro}
              calendarLabel={t.altChannels.calendar}
              telegramLabel={t.altChannels.telegram}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="border-t border-border">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{t.hint}</p>

        {/* altChannels escape hatch — at the top, before the form */}
        <div className="mb-8 rounded-md border border-border bg-muted/30 p-4">
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

          <div>
            <label className="block text-sm mb-1.5">{t.fields.audience}</label>
            <Select
              value={form.watch("audience")}
              onValueChange={(v) => form.setValue("audience", v as FormData["audience"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
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
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(t.fields.packageOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">{t.fields.message}</label>
            <Textarea rows={5} {...form.register("message")} />
          </div>

          <div>
            <label className="block text-sm mb-1.5">{t.fields.budget}</label>
            <Select
              value={form.watch("budget") ?? "unknown"}
              onValueChange={(v) => form.setValue("budget", v as Exclude<FormData["budget"], undefined>)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(t.fields.budgetOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitState === "loading"}>
            {submitState === "loading" ? "…" : t.submit}
          </Button>
          {submitState === "error" && (
            <p className="text-sm text-destructive">{t.error.title} — {t.error.body}</p>
          )}
        </form>
      </div>
    </section>
  );
}
