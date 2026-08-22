"use client";

import * as React from "react";
import { Type } from "lucide-react";

type Mono = "jetbrains" | "geist";

// Тумблер моноширинного шрифта — по той же схеме, что палитра: класс
// `mono-geist` на <html> — источник истины, inline-скрипт ставит его до
// гидратации, кнопка переключает и пишет в localStorage('mono').
// По умолчанию — JetBrains Mono (без класса).
function getMono(): Mono {
  return document.documentElement.classList.contains("mono-geist") ? "geist" : "jetbrains";
}

function getServerMono(): Mono {
  return "jetbrains";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function FontToggle() {
  const mono = React.useSyncExternalStore(subscribe, getMono, getServerMono);

  const toggle = () => {
    const next: Mono = mono === "jetbrains" ? "geist" : "jetbrains";
    document.documentElement.classList.toggle("mono-geist", next === "geist");
    try {
      localStorage.setItem("mono", next);
    } catch {}
  };

  const isGeist = mono === "geist";
  const label = isGeist ? "Switch to JetBrains Mono" : "Switch to Geist Mono";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={!isGeist}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted"
    >
      <Type className="h-[1.2rem] w-[1.2rem]" style={{ color: isGeist ? "currentColor" : "var(--primary)" }} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
