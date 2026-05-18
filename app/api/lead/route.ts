import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sendTelegramMessage, escapeHtml } from "@/lib/landing/telegram";
import { rateLimitTake } from "@/lib/landing/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(120),
  contact: z.string().min(2).max(200),
  package: z.enum(["audit", "mvp", "support", "unsure"]),
  message: z.string().min(10).max(4000),
  budget: z.enum(["unknown", "under500", "to2m", "over2m", "usd"]).optional(),
  website: z.string().optional(), // honeypot — checked in body, not schema
  filledAtMs: z.number(),
  lang: z.enum(["en", "ru"]).optional(),
});

const MIN_FILL_MS = 1500;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimitTake(`lead:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limit" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const filledFor = Date.now() - parsed.data.filledAtMs;
  if (filledFor < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const text =
    `<b>📨 New lead</b>\n\n` +
    `<b>Name:</b> ${escapeHtml(parsed.data.name)}\n` +
    `<b>Contact:</b> ${escapeHtml(parsed.data.contact)}\n` +
    `<b>Package:</b> ${parsed.data.package}\n` +
    (parsed.data.budget ? `<b>Budget:</b> ${parsed.data.budget}\n` : "") +
    `<b>Lang:</b> ${parsed.data.lang ?? "?"}\n` +
    `<b>IP:</b> ${ip}\n\n` +
    `<b>Message:</b>\n${escapeHtml(parsed.data.message)}`;

  const result = await sendTelegramMessage(text);
  if (!result.ok) {
    console.error("Telegram send failed:", result.error);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
