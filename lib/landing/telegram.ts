const MAX_ATTEMPTS = 2;
const ATTEMPT_DELAY_MS = 600;
const FETCH_TIMEOUT_MS = 6000;
// Документ тяжелее сообщения и идёт через прокси: одна попытка с запасом по времени.
// Зависший прокси не ждём дважды: у брифа есть запасной путь сообщениями.
const DOCUMENT_ATTEMPTS = 1;
const DOCUMENT_TIMEOUT_MS = 10000;

type TelegramResult = { ok: boolean; error?: string };
type TelegramEnv = { baseUrl: string; token: string; chatId: string };

function describeError(e: unknown): string {
  if (!(e instanceof Error)) return "unknown";
  const cause = (e as { cause?: { message?: string; code?: string } }).cause;
  const parts = [e.message];
  if (cause?.code) parts.push(`code: ${cause.code}`);
  if (cause?.message && cause.message !== e.message) parts.push(`cause: ${cause.message}`);
  return parts.join(" | ");
}

function telegramEnv(): TelegramEnv | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  // Defaults to Telegram's official host. Override with TELEGRAM_API_BASE_URL
  // when the deployment region can't reach api.telegram.org directly
  // (e.g. RU hosting → Cloudflare Worker proxy).
  const baseUrl = (process.env.TELEGRAM_API_BASE_URL ?? "https://api.telegram.org").replace(/\/$/, "");
  return { baseUrl, token, chatId };
}

async function callTelegram(
  env: TelegramEnv,
  method: string,
  body: BodyInit,
  headers: Record<string, string> | undefined,
  timeoutMs: number,
) {
  const res = await fetch(`${env.baseUrl}/bot${env.token}/${method}`, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram ${res.status}: ${text.slice(0, 200)}`);
  }
}

async function withRetries(
  env: TelegramEnv,
  attempt: () => Promise<void>,
  maxAttempts = MAX_ATTEMPTS,
): Promise<TelegramResult> {
  const errors: string[] = [];
  for (let n = 1; n <= maxAttempts; n += 1) {
    try {
      await attempt();
      return { ok: true };
    } catch (e) {
      const desc = describeError(e);
      errors.push(`#${n}: ${desc}`);
      console.warn(`[telegram] attempt ${n} via ${env.baseUrl} failed: ${desc}`);
      if (n < maxAttempts) {
        await new Promise((r) => setTimeout(r, ATTEMPT_DELAY_MS));
      }
    }
  }
  return { ok: false, error: errors.join(" ; ") };
}

export async function sendTelegramMessage(text: string): Promise<TelegramResult> {
  const env = telegramEnv();
  if (!env) {
    return { ok: false, error: "Telegram env not configured" };
  }
  const payload = JSON.stringify({
    chat_id: env.chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  return withRetries(env, () =>
    callTelegram(env, "sendMessage", payload, { "Content-Type": "application/json" }, FETCH_TIMEOUT_MS),
  );
}

/** Файл с подписью (HTML, до 1024 символов). Заголовок multipart ставит сам fetch. */
export async function sendTelegramDocument(
  filename: string,
  content: string,
  caption: string,
): Promise<TelegramResult> {
  const env = telegramEnv();
  if (!env) {
    return { ok: false, error: "Telegram env not configured" };
  }
  return withRetries(
    env,
    () => {
      const form = new FormData();
      form.append("chat_id", env.chatId);
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
      form.append("document", new Blob([content], { type: "text/markdown;charset=utf-8" }), filename);
      return callTelegram(env, "sendDocument", form, undefined, DOCUMENT_TIMEOUT_MS);
    },
    DOCUMENT_ATTEMPTS,
  );
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
