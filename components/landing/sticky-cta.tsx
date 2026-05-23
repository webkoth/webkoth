"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lang } from "./copy-i18n";
import { useLeadForm } from "./lead-form-modal";
import { Magnetic } from "./magnetic";

const stickyCopy = {
  ru: { label: "Заказать аудит" },
  en: { label: "Get an audit" },
} as const;

export function StickyCta({ lang }: { lang: Lang }) {
  const [pastHero, setPastHero] = useState(false);
  const { open, isOpen } = useLeadForm();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "0px" },
    );

    heroObserver.observe(hero);
    return () => heroObserver.disconnect();
  }, []);

  const visible = pastHero && !isOpen;

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
          <Magnetic className="inline-block">
            <Button
              size="lg"
              onClick={() => open({ package: "auditOnly" })}
              className={cn("shadow-xl shadow-primary/20 gap-2 group")}
            >
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              <span className="font-mono text-sm tabular-nums">{stickyCopy[lang].label}</span>
            </Button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
