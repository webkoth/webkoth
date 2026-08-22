"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EvolutionData } from "@/app/data/evolution/types"
import { cn } from "@/lib/utils"
import { EASE } from "./animations/seeded"
import { ProductionStack } from "./production-stack"
import { useLeadDialog } from "./lead-dialog"

// Hero — ровно один экран (100svh минус шапка; высоту шапки кладёт в --header-h
// сам HeaderNav). Один ряд, выровненный по верху: слева — подпись-замок, заголовок
// в две строки, описание, одно предложение про подход и кнопка; справа, на уровне
// заголовка, — «живая» схема работающей системы. Заголовок не переносится и может
// выйти за свою колонку — тогда он ложится поверх схемы (схема под ним, z-0): это
// осознанно, на широких экранах схема работает фоном. Внизу по центру — индикатор
// «листай». На мобильном всё идёт столбиком: текст и кнопка, затем схема. Размер
// h1 привязан к ширине окна, его высоте и ширине контейнера, чтобы самая длинная
// фраза (27 знаков) не ломалась на две строки.

/** «**слово**» в тексте → <strong>. Нужен только для описания под заголовком. */
function renderBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  )
}
function ScrollCue({ hint, className }: { hint: string; className?: string }) {
  const reduce = !!useReducedMotion()
  return (
    <a
      href="#system"
      className={cn(
        "group items-center gap-2 text-xs text-muted-foreground transition hover:text-primary md:text-sm",
        className
      )}
    >
      <motion.span
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/70"
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ChevronDown className="size-4" aria-hidden />
      </motion.span>
      <span className="max-w-[28rem] text-balance lg:max-w-none">{hint}</span>
    </a>
  )
}

export function Hero({ data }: { data: EvolutionData["hero"] }) {
  const reduce = !!useReducedMotion()
  const { open } = useLeadDialog()
  const tr = (delay: number) =>
    reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }

  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 md:px-8">
      {/* Классы высоты — литералами: Tailwind не видит собранные из строк имена. */}
      <div className="@container relative flex min-h-[calc(100svh-var(--header-h,6rem))] flex-col justify-center py-8 sm:py-12 lg:pt-0 lg:pb-10">
        {/* Ряд «текст | схема», выровнен по верху: схема на уровне заголовка. */}
        <div className="lg:grid lg:grid-cols-[58fr_42fr] lg:items-start lg:gap-8">
          <div className="relative z-10 min-w-0">
            <motion.p
              className="font-mono text-xs tracking-[0.22em] text-primary uppercase md:text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(0.2)}
            >
              {data.seal}
            </motion.p>

            {/* Размер: от ширины окна, его высоты (один экран) и ширины контейнера
            (6.5cqw при трекинге −0.04em) — чтобы самая длинная фраза (27 знаков
            моноширинным) не ломалась. whitespace-pre-line: \n в данных — перенос.
            На телефоне вторая фраза при читаемом размере переносится — это ожидаемо. */}
            <motion.h1
              className="mt-3 text-[clamp(1.5rem,min(4.6vw,7svh,6.5cqw),4rem)] leading-[1.08] font-bold tracking-[-0.04em] whitespace-pre-line lg:w-max lg:max-w-none"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(0.45)}
            >
              {data.line1}
            </motion.h1>

            <div className="mt-6">
              <div>
                <motion.p
                  className="max-w-2xl text-lg font-medium text-balance md:text-xl lg:text-2xl lg:leading-snug"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={tr(0.85)}
                >
                  {renderBold(data.lead)}
                </motion.p>

                <motion.p
                  className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={tr(1.2)}
                >
                  {data.sub}
                </motion.p>

                <motion.div
                  className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-7"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={tr(1.5)}
                >
                  {/* Button несёт whitespace-nowrap: на 320px длинная подпись даёт
                  горизонтальный скролл, поэтому на узких экранах — во всю ширину. */}
                  <Button
                    size="lg"
                    onClick={open}
                    className="h-auto w-full px-6 py-3 text-base whitespace-normal sm:h-12 sm:w-auto sm:py-0 sm:whitespace-nowrap"
                  >
                    {data.cta}
                    <ArrowRight aria-hidden />
                  </Button>
                </motion.div>

                {/* Мобильный индикатор — сразу под кнопкой, схема идёт следом вторым экраном */}
                <motion.div
                  className="mt-8 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={tr(2.0)}
                >
                  <ScrollCue hint={data.scrollHint} className="flex" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Схема: на мобильном — после кнопки вторым экраном; на десктопе — правая
            колонка ряда, под заголовком по z, сдвинута к уровню h1 (pt ≈ высота замка). */}
          <div className="relative z-0 pt-12 lg:pt-8">
            <ProductionStack
              delay={reduce ? 0 : 1.8}
              copy={{ hint: data.stackHint, nodes: data.stackNodes }}
            />
          </div>
        </div>

        {/* Десктопный индикатор — по центру низа экрана */}
        <motion.div
          className="absolute bottom-5 left-1/2 z-10 hidden w-max max-w-[90%] -translate-x-1/2 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tr(2.3)}
        >
          <ScrollCue hint={data.scrollHint} className="flex" />
        </motion.div>
      </div>
    </section>
  )
}
