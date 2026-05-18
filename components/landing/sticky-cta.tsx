"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lang } from "./copy-i18n";

const stickyCopy = {
  ru: { label: "Аудит за 80 000 ₽" },
  en: { label: "Audit · $1,000" },
} as const;

export function StickyCta({ lang }: { lang: Lang }) {
  const [pastHero, setPastHero] = useState(false);
  const [inForm, setInForm] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const form = document.getElementById("form");
    if (!hero || !form) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "0px" },
    );
    const formObserver = new IntersectionObserver(
      ([entry]) => setInForm(entry.isIntersecting),
      { rootMargin: "0px 0px -30% 0px" },
    );

    heroObserver.observe(hero);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !inForm;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
        >
          <Link
            href="#form?package=audit"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "shadow-xl shadow-primary/20 gap-2 group",
            )}
          >
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            <span className="font-mono text-sm tabular-nums">{stickyCopy[lang].label}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
