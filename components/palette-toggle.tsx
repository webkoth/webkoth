"use client";

import * as React from "react";
import { Droplet } from "lucide-react";

type Palette = "warm" | "classic";

function getPalette(): Palette {
  if (typeof document === "undefined") return "warm";
  return document.documentElement.classList.contains("palette-classic")
    ? "classic"
    : "warm";
}

export function PaletteToggle() {
  const [palette, setPalette] = React.useState<Palette>("warm");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setPalette(getPalette());
  }, []);

  const toggle = () => {
    const next: Palette = palette === "warm" ? "classic" : "warm";
    const root = document.documentElement;
    if (next === "classic") root.classList.add("palette-classic");
    else root.classList.remove("palette-classic");
    try {
      localStorage.setItem("palette", next);
    } catch {}
    setPalette(next);
  };

  const isClassic = mounted && palette === "classic";
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
