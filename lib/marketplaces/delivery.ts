// Два канала доставки заявки сообщают об отказе по-разному:
//   sendTelegramMessage (lib/landing/telegram.ts) ВОЗВРАЩАЕТ { ok:false } и не бросает —
//     Promise.allSettled увидит его как fulfilled;
//   relaySend (lib/email-relay.ts) БРОСАЕТ.
// Проверка по статусу промиса посчитала бы упавший Telegram успехом и вернула бы
// пользователю 200 при нуле доставленных заявок. Поэтому оба канала нормализуются здесь.

export type DeliveryChannel = 'telegram' | 'email'
export type Delivery = { channel: DeliveryChannel; ok: boolean; error?: string }

function describe(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/** Для канала, который сообщает об отказе возвратом `{ ok:false }`. */
export async function settleReturning(
  channel: DeliveryChannel,
  p: Promise<{ ok: boolean; error?: string }>,
): Promise<Delivery> {
  try {
    const r = await p
    return r.ok ? { channel, ok: true } : { channel, ok: false, error: r.error ?? 'unknown' }
  } catch (e) {
    return { channel, ok: false, error: describe(e) }
  }
}

/** Для канала, который сообщает об отказе исключением. */
export async function settleThrowing(
  channel: DeliveryChannel,
  p: Promise<unknown>,
): Promise<Delivery> {
  try {
    await p
    return { channel, ok: true }
  } catch (e) {
    return { channel, ok: false, error: describe(e) }
  }
}

/** Успех = доставлен хотя бы один канал. */
export function summarize(deliveries: Delivery[]): {
  ok: boolean
  partial: boolean
  missing: DeliveryChannel[]
} {
  const missing = deliveries.filter((d) => !d.ok).map((d) => d.channel)
  const ok = deliveries.some((d) => d.ok)
  return { ok, partial: ok && missing.length > 0, missing }
}
