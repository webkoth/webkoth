const MAX_ATTEMPTS = 2;
const ATTEMPT_DELAY_MS = 600;
const FETCH_TIMEOUT_MS = 6000;

function describeError(e: unknown): string {
  if (!(e instanceof Error)) return "unknown";
  const cause = (e as { cause?: { message?: string; code?: string } }).cause;
  const parts = [e.message];
  if (cause?.code) parts.push(`code: ${cause.code}`);
  if (cause?.message && cause.message !== e.message) parts.push(`cause: ${cause.message}`);
  return parts.join(" | ");
}

async function attemptSend(baseUrl: string, token: string, chatId: string, text: string) {
  const res = await fetch(`${baseUrl}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram ${res.status}: ${body.slice(0, 200)}`);
  }
}

export async function sendTelegramMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "Telegram env not configured" };
  }
  // Defaults to Telegram's official host. Override with TELEGRAM_API_BASE_URL
  // when the deployment region can't reach api.telegram.org directly
  // (e.g. RU hosting → Cloudflare Worker proxy).
  const baseUrl = (process.env.TELEGRAM_API_BASE_URL ?? "https://api.telegram.org").replace(/\/$/, "");

  const errors: string[] = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await attemptSend(baseUrl, token, chatId, text);
      return { ok: true };
    } catch (e) {
      const desc = describeError(e);
      errors.push(`#${attempt}: ${desc}`);
      console.warn(`[telegram] attempt ${attempt} via ${baseUrl} failed: ${desc}`);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, ATTEMPT_DELAY_MS));
      }
    }
  }
  return { ok: false, error: errors.join(" ; ") };
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
