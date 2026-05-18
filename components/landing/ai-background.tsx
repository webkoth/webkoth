"use client";
import { motion, useReducedMotion } from "framer-motion";

export function AiBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dot grid with radial mask — gives the "neural lattice" feel */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
          color: "var(--foreground)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, black 0%, transparent 70%)",
        }}
      />

      {/* Aurora blob — top left */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 size-[28rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 35%, transparent)" }}
        animate={reduce ? undefined : { x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora blob — right */}
      <motion.div
        aria-hidden
        className="absolute top-1/3 -right-32 size-[26rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--chart-3) 28%, transparent)" }}
        animate={reduce ? undefined : { x: [0, -70, 0], y: [0, -50, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora blob — bottom */}
      <motion.div
        aria-hidden
        className="absolute -bottom-40 left-1/3 size-[24rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--chart-2) 24%, transparent)" }}
        animate={reduce ? undefined : { x: [0, 50, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle scanning line */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 60%, transparent), transparent)",
        }}
        initial={{ top: "10%", opacity: 0 }}
        animate={
          reduce
            ? undefined
            : { top: ["10%", "85%", "10%"], opacity: [0, 0.6, 0] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
