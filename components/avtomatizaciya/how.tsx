'use client'

import { motion } from 'framer-motion'
import type { AvtomatizaciyaCopy } from '@/app/data/avtomatizaciya'
import { GlassPanel, SPRING, useSeen } from './motion'
import { SectionHead } from './scene'

// Три шага одной стеклянной карточкой в центре, как у Elasti: много воздуха, шаги строками
// через тонкие линии, номер — мелкой моноширинной подписью, точка шага загорается по очереди.
export function How({ copy }: { copy: AvtomatizaciyaCopy['how'] }) {
  const { ref, seen } = useSeen<HTMLOListElement>()
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-28 px-3 py-20 md:px-8 md:py-32">
      <GlassPanel className="mx-auto max-w-3xl rounded-[32px] p-8 md:p-12">
        <SectionHead eyebrow={copy.eyebrow} title={copy.title} />
        <ol ref={ref} className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">
          {copy.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-6 md:grid-cols-[5rem_minmax(0,1fr)]">
              <span className="micro flex items-center gap-2 pt-1.5 text-muted-foreground">
                <motion.span
                  aria-hidden
                  className="size-1.5 rounded-full bg-[#00b8db]"
                  initial={{ opacity: 0.2, scale: 0.6 }}
                  animate={seen ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.6 }}
                  transition={{ ...SPRING, delay: 0.2 + i * 0.35 }}
                />
                0{i + 1}
              </span>
              <div>
                <h3 className="text-xl font-normal tracking-[-0.015em] md:text-2xl">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </GlassPanel>
    </section>
  )
}
