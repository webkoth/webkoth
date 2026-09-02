// app/data/landings/registry.ts
import type { LandingMeta, LandingSlug } from './types'

export const LANDING_SLUGS = ['kontur', 'it-director', 'agent', 'finance'] as const

export const isLandingSlug = (v: unknown): v is LandingSlug =>
  typeof v === 'string' && (LANDING_SLUGS as readonly string[]).includes(v)

export const landingMeta: Record<LandingSlug, LandingMeta> = {
  kontur: {
    slug: 'kontur',
    skeleton: 'case-first',
    heroCase: 'data-platform',
    cases: ['data-platform', 'finance-loop', 'stock-sync', 'payout-documents'],
    presets: ['kontur-stocks', 'kontur-reports', 'kontur-orders', 'kontur-payouts'],
    campaign: 'kontur',
  },
  'it-director': {
    slug: 'it-director',
    skeleton: 'symptoms-first',
    cases: ['it-inventory', 'legacy-db-map', 'deploy-from-chat', 'project-generator'],
    presets: ['it-access', 'it-backups', 'it-unknown', 'it-vendors'],
    campaign: 'it-director',
  },
  agent: {
    slug: 'agent',
    skeleton: 'symptoms-first',
    cases: ['ads-agents', 'agents-platform', 'store-to-claude', 'marketplace-knowledge'],
    presets: ['agent-inbox', 'agent-reports', 'agent-calls', 'agent-content'],
    campaign: 'agent',
  },
  finance: {
    slug: 'finance',
    skeleton: 'case-first',
    heroCase: 'finance-loop',
    cases: ['finance-loop', 'data-marts', 'payout-documents', 'data-platform'],
    presets: ['finance-pervichka', 'finance-otchet', 'finance-statements', 'finance-payments'],
    campaign: 'finance',
  },
}
