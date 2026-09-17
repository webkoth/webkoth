// IP клиента за nginx. nginx-webkoth.conf перезаписывает X-Real-IP адресом соединения,
// а X-Forwarded-For дописывает реальный адрес в конец того, что прислал клиент:
// первое значение XFF подделывается, последнее нет.
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real
  const forwarded = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return forwarded[forwarded.length - 1] ?? 'unknown'
}
