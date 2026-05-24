import type { AiSummary } from './schemas'

const URL = process.env.AI_SERVICE_URL
const TOKEN = process.env.AI_SERVICE_TOKEN

async function aiCall<T>(
  path: string,
  body: object,
  timeoutMs: number,
): Promise<T> {
  if (!URL || !TOKEN) {
    throw new Error('AI service env not configured')
  }
  const res = await fetch(`${URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`ai ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

export type PolishResult = {
  success: true
  result: string
  provider: 'claude' | 'gemini' | 'groq'
  usage: { promptTokens: number; completionTokens: number }
}

export async function callPolish(text: string): Promise<PolishResult> {
  return aiCall<PolishResult>(
    '/api/leads/polish',
    { input: { text } },
    10_000,
  )
}

export type SummaryResult = {
  success: true
  result: AiSummary
  provider: 'claude' | 'gemini' | 'groq'
  usage: { promptTokens: number; completionTokens: number }
}

export async function callSummary(d: {
  name: string
  message: string
}): Promise<SummaryResult> {
  return aiCall<SummaryResult>(
    '/api/leads/summary',
    { input: d },
    4_000,
  )
}
