import type { copy, Lang } from "@/components/landing/copy-i18n";

type Copy = (typeof copy)[Lang];

const HEADINGS = {
  ru: {
    lang: "## Русская версия",
    hero: "Hero",
    tasks: "Задачи, которые я закрываю",
    featured: "Featured кейс",
    cases: "Портфолио",
    why: "Почему я",
    techStack: "Стек",
    roadmap: "Процесс",
  },
  en: {
    lang: "## English version",
    hero: "Hero",
    tasks: "What I solve",
    featured: "Featured case",
    cases: "Portfolio",
    why: "Why me",
    techStack: "Stack",
    roadmap: "Process",
  },
} as const;

export function buildLandingMarkdown(c: Copy, lang: Lang): string {
  const h = HEADINGS[lang];
  const lines: string[] = [];

  lines.push(h.lang, "");

  // Hero
  lines.push(`### ${h.hero}`, "");
  lines.push(c.hero.h1, "");
  lines.push(c.hero.sub, "");
  lines.push(`Specs: ${c.hero.specs.join(" · ")}`, "");
  lines.push(
    `Metrics: ${c.hero.metrics.map((m) => `${m.value}${m.suffix} ${m.label}`).join(" · ")}`,
    "",
  );

  // Tasks
  lines.push(`### ${h.tasks}`, "");
  lines.push(`**${c.tasks.title}**`, "");
  for (const item of c.tasks.items) {
    lines.push(
      `- **${item.title}** — trigger: _${item.trigger}_; action: ${item.action}; outcome: **${item.outcome}**`,
    );
  }
  lines.push("");

  // Featured
  lines.push(`### ${h.featured}`, "");
  lines.push(`**${c.featured.title}** — ${c.featured.sub}`, "");
  lines.push(`Stack: ${c.featured.stack.join(", ")}`, "");

  // Cases
  lines.push(`### ${h.cases}`, "");
  lines.push(`**${c.cases.title}** — ${c.cases.sub}`, "");
  for (const item of c.cases.items) {
    lines.push(`- **${item.title}** [${item.group}] — ${item.sub}`);
    lines.push(`  - Stack: ${item.stack.join(", ")}`);
  }
  lines.push("");

  // Why
  lines.push(`### ${h.why}`, "");
  lines.push(`**${c.why.title}**`, "");
  for (const item of c.why.items) {
    lines.push(`- **${item.title}** — ${item.body}`);
  }
  lines.push("");

  // Tech stack
  lines.push(`### ${h.techStack}`, "");
  lines.push(`**${c.techStack.title}** — ${c.techStack.sub}`, "");
  for (const cat of c.techStack.categories) {
    lines.push(`- **${cat.name}:** ${cat.items.join(", ")}`);
  }
  lines.push("");

  // Roadmap
  lines.push(`### ${h.roadmap}`, "");
  lines.push(`**${c.roadmap.title}** — ${c.roadmap.sub}`, "");
  for (const step of c.roadmap.steps) {
    lines.push(`- **${step.num} ${step.title}** [${step.pill}] — ${step.body}`);
  }
  lines.push("");

  // FAQ
  lines.push(`### FAQ`, "");
  lines.push(`**${c.faq.title}**`, "");
  for (const item of c.faq.items) {
    lines.push(`- **Q:** ${item.q}`);
    lines.push(`  **A:** ${item.a}`);
  }
  lines.push("");

  return lines.join("\n");
}
