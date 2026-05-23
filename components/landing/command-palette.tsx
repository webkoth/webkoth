"use client";

import * as React from "react";
import {
  Send,
  CalendarClock,
  Code2,
  PlayCircle,
  FileText,
  Briefcase,
  Sparkles,
  Layers,
  MessageSquare,
  HelpCircle,
  Rocket,
  Mail,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { contacts } from "@/lib/landing/contacts";
import type { Lang } from "./copy-i18n";
import { useLeadForm } from "./lead-form-modal";

type Section = { id: string; label: string };

const sectionsByLang: Record<Lang, Section[]> = {
  ru: [
    { id: "hero", label: "Главная" },
    { id: "tasks", label: "Что я делаю" },
    { id: "featured", label: "Кейс: HubMarket" },
    { id: "cases", label: "Портфолио" },
    { id: "voices", label: "Отзывы" },
    { id: "why", label: "Почему я" },
    { id: "tech-stack", label: "Стек" },
    { id: "roadmap", label: "Как мы работаем" },
    { id: "process-pricing", label: "Пакеты и цены" },
    { id: "faq", label: "FAQ" },
  ],
  en: [
    { id: "hero", label: "Home" },
    { id: "tasks", label: "What I do" },
    { id: "featured", label: "HubMarket case" },
    { id: "cases", label: "Portfolio" },
    { id: "voices", label: "Testimonials" },
    { id: "why", label: "Why me" },
    { id: "tech-stack", label: "Stack" },
    { id: "roadmap", label: "How we work" },
    { id: "process-pricing", label: "Packages" },
    { id: "faq", label: "FAQ" },
  ],
};

const iconForSection: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: Sparkles,
  tasks: Layers,
  featured: Briefcase,
  cases: FileText,
  voices: MessageSquare,
  why: Rocket,
  "tech-stack": Layers,
  roadmap: Briefcase,
  "process-pricing": Briefcase,
  faq: HelpCircle,
};

const ui = {
  ru: {
    placeholder: "Поиск по сайту или быстрые действия…",
    empty: "Ничего не найдено.",
    actions: "Действия",
    sections: "Секции",
    external: "Внешнее",
    preferences: "Настройки",
    openForm: "Открыть форму заявки",
    bookCall: "Забронировать Discovery (15 мин)",
    telegram: "Написать в Telegram",
    email: "Написать на email",
    github: "GitHub",
    youtube: "YouTube",
    cv: "Резюме · /minasarkisyan",
    toggleTheme: "Переключить тему",
    toggleLang: "Переключить язык",
  },
  en: {
    placeholder: "Search the site or run an action…",
    empty: "Nothing found.",
    actions: "Actions",
    sections: "Sections",
    external: "External",
    preferences: "Preferences",
    openForm: "Open the lead form",
    bookCall: "Book Discovery call (15 min)",
    telegram: "Message on Telegram",
    email: "Send an email",
    github: "GitHub",
    youtube: "YouTube",
    cv: "CV · /minasarkisyan",
    toggleTheme: "Toggle theme",
    toggleLang: "Toggle language",
  },
} as const;

export function CommandPalette({ lang }: { lang: Lang }) {
  const [open, setOpen] = React.useState(false);
  const { open: openLead } = useLeadForm();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const t = ui[lang];

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 80);
  };

  const goToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleLanguage = () => {
    if (!pathname) return;
    const next: Lang = lang === "ru" ? "en" : "ru";
    const newPath = pathname.replace(/^\/(ru|en)(?=\/|$)/, `/${next}`);
    router.push(newPath);
  };

  const sections = sectionsByLang[lang];

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title={t.placeholder} description={t.empty}>
      <CommandInput placeholder={t.placeholder} />
      <CommandList>
        <CommandEmpty>{t.empty}</CommandEmpty>

        <CommandGroup heading={t.actions}>
          <CommandItem onSelect={() => run(() => openLead())} value="lead form open form">
            <Send className="size-4" />
            <span>{t.openForm}</span>
            <CommandShortcut>⏎</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="discovery call calendar book"
            onSelect={() => run(() => window.open(contacts.calendar, "_blank"))}
          >
            <CalendarClock className="size-4" />
            <span>{t.bookCall}</span>
          </CommandItem>
          <CommandItem
            value="telegram message chat"
            onSelect={() => run(() => window.open(contacts.telegram, "_blank"))}
          >
            <Send className="size-4" />
            <span>{t.telegram}</span>
          </CommandItem>
          <CommandItem
            value="email mail contact"
            onSelect={() =>
              run(() => window.open(`mailto:webkoth@gmail.com`, "_blank"))
            }
          >
            <Mail className="size-4" />
            <span>{t.email}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.sections}>
          {sections.map((s) => {
            const Icon = iconForSection[s.id] ?? Sparkles;
            return (
              <CommandItem
                key={s.id}
                value={`${s.id} ${s.label}`}
                onSelect={() => run(() => goToSection(s.id))}
              >
                <Icon className="size-4" />
                <span>{s.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.external}>
          <CommandItem
            value="cv portfolio resume"
            onSelect={() => run(() => router.push(`/${lang}/minasarkisyan`))}
          >
            <FileText className="size-4" />
            <span>{t.cv}</span>
          </CommandItem>
          <CommandItem
            value="github"
            onSelect={() => run(() => window.open("https://github.com/webkoth", "_blank"))}
          >
            <Code2 className="size-4" />
            <span>{t.github}</span>
          </CommandItem>
          <CommandItem
            value="youtube"
            onSelect={() => run(() => window.open("https://www.youtube.com/@webkoth", "_blank"))}
          >
            <PlayCircle className="size-4" />
            <span>{t.youtube}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.preferences}>
          <CommandItem
            value="theme dark light toggle"
            onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span>{t.toggleTheme}</span>
          </CommandItem>
          <CommandItem
            value="language ru en toggle"
            onSelect={() => run(toggleLanguage)}
          >
            <Languages className="size-4" />
            <span>{t.toggleLang}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
