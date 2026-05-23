import { copy, type Lang } from "@/components/landing/copy-i18n";
import { buildLandingMarkdown } from "@/lib/landing-markdown";

export const dynamic = "force-static";

export function GET() {
  const langs: Lang[] = ["en", "ru"];
  const sections = langs.map((lang) =>
    buildLandingMarkdown(copy[lang], lang),
  );

  const body = [
    "# Minas Sarkisyan — Production AI Integration",
    "",
    "> Landing page content in Markdown, optimised for LLM ingestion.",
    "> Both English and Russian versions are included.",
    "",
    ...sections,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
