"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "./lead-form";
import { copy, type Lang } from "./copy-i18n";

type PackageId = "sprint" | "integration" | "subcontract" | "auditOnly" | "unsure";

type OpenOptions = {
  package?: PackageId;
};

type Ctx = {
  open: (opts?: OpenOptions) => void;
  close: () => void;
  isOpen: boolean;
};

const LeadFormContext = React.createContext<Ctx | null>(null);

export function useLeadForm(): Ctx {
  const ctx = React.useContext(LeadFormContext);
  if (!ctx) {
    throw new Error("useLeadForm must be used within <LeadFormModalProvider>");
  }
  return ctx;
}

const VALID_PACKAGES: PackageId[] = [
  "sprint",
  "integration",
  "subcontract",
  "auditOnly",
  "unsure",
];

function parseHash(hash: string): { isForm: boolean; pkg?: PackageId } {
  if (!hash) return { isForm: false };
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  const [path, query] = cleaned.split("?");
  if (path !== "form") return { isForm: false };
  if (!query) return { isForm: true };
  const params = new URLSearchParams(query);
  const raw = params.get("package");
  const pkg = raw && (VALID_PACKAGES as string[]).includes(raw) ? (raw as PackageId) : undefined;
  return { isForm: true, pkg };
}

export function LeadFormModalProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pkg, setPkg] = React.useState<PackageId | undefined>(undefined);
  const t = copy[lang].form;

  const open = React.useCallback((opts?: OpenOptions) => {
    setPkg(opts?.package);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  // Deep-link support: open on initial hash + listen to changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const apply = () => {
      const { isForm, pkg: parsedPkg } = parseHash(window.location.hash);
      if (isForm) {
        setPkg(parsedPkg);
        setIsOpen(true);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // When dialog closes, scrub the #form hash so reopening works
  const handleOpenChange = React.useCallback((next: boolean) => {
    setIsOpen(next);
    if (!next && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.startsWith("#form")) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }, []);

  const value = React.useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <LeadFormContext.Provider value={value}>
      {children}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.hint}</DialogDescription>
          </DialogHeader>
          <LeadForm
            key={isOpen ? `open-${pkg ?? "unsure"}` : "closed"}
            lang={lang}
            initialPackage={pkg}
            onSuccess={() => {
              // keep modal open on success — user can read confirmation
            }}
          />
        </DialogContent>
      </Dialog>
    </LeadFormContext.Provider>
  );
}
