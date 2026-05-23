export function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Dot grid with radial mask */}
      <div
        className="absolute inset-0 opacity-[0.10] dark:opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
          color: "var(--foreground)",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* Static top-right primary glow */}
      <div
        className="absolute -top-32 -right-40 size-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
