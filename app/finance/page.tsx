import type { Metadata } from 'next'
import { LandingPage } from '@/components/landings/landing-page'
import { buildLandingMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildLandingMetadata('finance')

export default function FinancePage() {
  return <LandingPage slug="finance" />
}
