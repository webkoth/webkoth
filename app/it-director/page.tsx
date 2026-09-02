import type { Metadata } from 'next'
import { LandingPage } from '@/components/landings/landing-page'
import { buildLandingMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildLandingMetadata('it-director')

export default function ItDirectorPage() {
  return <LandingPage slug="it-director" />
}
