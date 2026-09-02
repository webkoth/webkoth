import type { Metadata } from 'next'
import { LandingPage } from '@/components/landings/landing-page'
import { buildLandingMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildLandingMetadata('agent')

export default function AgentPage() {
  return <LandingPage slug="agent" />
}
