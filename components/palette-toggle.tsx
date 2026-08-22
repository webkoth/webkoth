"use client";

import * as React from "react";
import { Droplet } from "lucide-react";

type Palette = "warm" | "classic";

// The <html> class list is the source of truth for the palette: the inline
// preferences script sets it before hydration, and this toggle mutates it.
// Reading it through useSyncExternalStore keeps SSR ("warm") and the client
// in sync without a mounted flag + setState-in-effect.
function getPalette(): Palette {
  return document.documentElement.classList.contains("palette-classic")
    ? "classic"
    : "warm";
}

function getServerPalette(): Palette {
  return "warm";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function PaletteToggle() {
  const palette = React.useSyncExternalStore(subscribe, getPalette, getServerPalette);

  const toggle = () => {
    const next: Palette = palette === "warm" ? "classic" : "warm";
    document.documentElement.classList.toggle("palette-classic", next === "classic");
    try {
      localStorage.setItem("palette", next);
    } catch {}
  };

  const isClassic = palette === "classic";
  const label = isClassic ? "Switch to warm palette" : "Switch to classic palette";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted"
    >
      <Droplet
        className="h-[1.2rem] w-[1.2rem]"
        fill="currentColor"
        style={{ color: "var(--primary)" }}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}
