import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { StickyCta } from '@/components/evolution/sticky-cta'
import { contacts } from '@/lib/landing/contacts'
import { evolutionBlockOrder, evolutionData as data } from '@/app/data/evolution'
import { ParticleField } from '@/components/evolution/particle-field'
import { HeaderNav } from '@/components/evolution/header-nav'
import { Hero } from '@/components/evolution/hero'
import { BlockSection } from '@/components/evolution/block-section'
import { Finale } from '@/components/evolution/finale'
import { JsonLdEvolution } from '@/components/evolution/json-ld'
import { FragmentsToStructure } from '@/components/evolution/animations/fragments-to-structure'
import { FogToDashboard } from '@/components/evolution/animations/fog-to-dashboard'
import { NoiseToSignal } from '@/components/evolution/animations/noise-to-signal'
import { Conveyor } from '@/components/evolution/animations/conveyor'
import { TimelineCompress } from '@/components/evolution/animations/timeline-compress'
import { CellsGrid } from '@/components/evolution/animations/cells-grid'

const navItems = evolutionBlockOrder.map((key) => ({
  id: data.blocks[key].id,
  label: data.blocks[key].slogan,
}))

// Экспонаты плашек — то, что в документе помечено «Показать: …».
function DataFlowExhibit() {
  const { nodes, note } = data.exhibits.dataFlow
  return (
    <div>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-2">
            <span
              className={
                i === nodes.length - 1
                  ? 'rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 font-medium text-primary'
                  : 'rounded-lg border border-border bg-background/60 px-3 py-1.5'
              }
            >
              {n}
            </span>
            {i < nodes.length - 1 ? <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

function BeforeAfterExhibit() {
  const { beforeTitle, before, afterTitle, after } = data.exhibits.beforeAfter
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-background/60 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{beforeTitle}</p>
        <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {before.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="font-mono text-xs tabular-nums opacity-60">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col rounded-xl border border-primary/50 bg-primary/10 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{afterTitle}</p>
        <div className="flex flex-1 items-center justify-center py-6">
          <span className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">
            {after}
          </span>
        </div>
      </div>
    </div>
  )
}

function LaunchTableExhibit() {
  const { head, rows } = data.exhibits.launchTable
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[22rem] text-sm">
        <thead>
          <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {head.map((h) => (
              <th key={h} scope="col" className="py-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-border/60 last:border-0">
              <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                {r[0]}
              </th>
              <td className="py-2.5 pr-4 font-mono tabular-nums text-muted-foreground">{r[1]}</td>
              <td className="py-2.5 pr-4 font-mono tabular-nums text-muted-foreground">{r[2]}</td>
              <td className="py-2.5 font-mono font-semibold text-primary">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SharesExhibit() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {data.exhibits.shares.map((s) => (
        <div key={s.role} className="rounded-xl border border-border bg-background/60 p-4">
          <p className="text-3xl font-bold tracking-tight text-primary tabular-nums md:text-4xl">{s.value}</p>
          <p className="mt-1 text-sm font-medium">{s.role}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{s.detail}</p>
        </div>
      ))}
    </div>
  )
}

export default function EvolutionPage() {
  return (
    <>
      <JsonLdEvolution />
      <ParticleField />
      <main className="relative z-[1] min-h-screen" lang="ru">
        <HeaderNav brand={data.brand} back={data.nav.back} cta={data.nav.cta} items={navItems} />

        <Hero data={data.hero} />

        <BlockSection block={data.blocks.system} animation={<FragmentsToStructure />} />
        <BlockSection block={data.blocks.money} animation={<FogToDashboard />} />
        <BlockSection block={data.blocks.decisions} animation={<NoiseToSignal />} exhibit={<DataFlowExhibit />} />
        <BlockSection block={data.blocks.automation} animation={<Conveyor />} exhibit={<BeforeAfterExhibit />} />
        <BlockSection block={data.blocks.speed} animation={<TimelineCompress />} exhibit={<LaunchTableExhibit />} />
        <BlockSection block={data.blocks.resources} animation={<CellsGrid />} exhibit={<SharesExhibit />} />

        <Finale data={data.finale} />

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {data.footer.owner}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="text-foreground/80 transition hover:text-primary">
                {data.brand}
              </Link>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition hover:text-primary"
              >
                Telegram
              </a>
            </div>
          </div>
        </footer>

        <StickyCta label={data.nav.cta} />
      </main>
    </>
  )
}
