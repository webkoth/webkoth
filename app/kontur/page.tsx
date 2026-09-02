import type { Metadata } from 'next'
import { LandingPage } from '@/components/landings/landing-page'
import { buildLandingMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildLandingMetadata('kontur')

export default function KonturPage() {
  return <LandingPage slug="kontur" />
}
