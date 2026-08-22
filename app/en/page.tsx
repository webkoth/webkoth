import type { Metadata } from 'next'
import { EvolutionPage } from '@/components/evolution/evolution-page'
import { buildHomeMetadata } from '@/lib/evolution/metadata'

export const metadata: Metadata = buildHomeMetadata('en')

export default function HomeEn() {
  return <EvolutionPage lang="en" />
}
