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
// сам HeaderNav). Текст одной колонкой слева: подпись-замок, заголовок в две
// строки, описание результатов, одно предложение про подход и кнопка; внизу по
// центру — индикатор «листай». «Живая» схема работающей системы на десктопе —
// фон: справа, по центру высоты, под текстом и полупрозрачная; крупный заголовок
// может на неё заходить — это задумано. На мобильном схема идёт после кнопки,
// непрозрачная. Размер h1 привязан к ширине окна, его высоте и ширине контейнера,
// чтобы самая длинная фраза (27 знаков моноширинным) не ломалась на две строки.
// Ширина описания ограничена ~50 знаками — так читается комфортнее.
// Пропорции — как у обложек для соцсетей (banner-specs.ts): заголовок ≈3% ширины
// окна, описание ≈1.4%, схема ≈44% ширины целиком в кадре с прозрачностью 30%.

/** «**слово**» в тексте → <strong>. Нужен только для описания под заголовком. */
function renderBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-primary">
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
      {/* Классы высоты — литералами: Tailwind не видит собранные из строк имена.
          @container — от ширины этого блока считается размер h1. */}
      <div className="@container relative flex min-h-[calc(100svh-var(--header-h,6rem))] flex-col justify-center py-8 sm:py-12 lg:pt-0 lg:pb-14">
        {/* Схема: на мобильном — последней, после кнопки; на десктопе — фон справа,
            по центру высоты, под текстом (z-0) и полупрозрачная. Появляется после
            текста: выезжает со стороны заголовка и медленно проявляется, чтобы не
            спорить с ним за внимание. Прозрачность — на внутреннем слое, чтобы
            motion не перебивал её своим inline-opacity. Один экземпляр на оба режима. */}
        {/* Ширина: 81% контейнера, но не выше первого экрана: высота схемы ≈ 0.744·ширины,
            отсюда ограничение через 100svh (на 1366×678 ≈ 700px, на 1920×1080 — все 81%).
            Левый край растворён градиентной маской: заголовок ложится на «дымку», а не на
            узлы, и переход от текста к схеме выглядит цельно. Строки статуса нет —
            она упиралась в подсказку «листай». */}
        <motion.div
          className="order-last pt-12 lg:absolute lg:top-1/2 lg:right-0 lg:z-0 lg:w-[min(44%,calc((100svh-var(--header-h,6rem)-3.5rem)/0.744))] lg:-translate-y-1/2 lg:pt-0"
          initial={{ opacity: 0, x: -140 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 2.2, delay: 1.7, ease: EASE }
          }
        >
          <div className="lg:[mask-image:linear-gradient(to_right,transparent,black_30%)] lg:opacity-30 lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_30%)]">
            <ProductionStack
              delay={0}
              showStatus={false}
              copy={{ hint: data.stackHint, nodes: data.stackNodes }}
            />
          </div>
        </motion.div>

        <div className="relative z-10">
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
            className="mt-3 text-[clamp(1.5rem,min(3vw,7svh,6.5cqw),3.5rem)] leading-[1.08] font-bold tracking-[-0.04em] whitespace-pre-line"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.45)}
          >
            {data.line1}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[34ch] text-lg font-medium text-balance md:mt-6 md:max-w-[46ch] md:text-xl lg:text-[clamp(1.05rem,1.4vw,1.7rem)] lg:leading-snug"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.85)}
          >
            {renderBold(data.lead)}
          </motion.p>

          <motion.p
            className="mt-4 max-w-[52ch] text-base text-muted-foreground md:text-lg lg:text-[clamp(1rem,1.15vw,1.25rem)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(1.2)}
          >
            {data.sub}
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(1.5)}
          >
            {/* Button несёт whitespace-nowrap: на 320px длинная подпись даёт
              горизонтальный скролл, поэтому на узких экранах — во всю ширину. */}
            <Button
              size="lg"
              onClick={open}
              className="h-auto w-full px-6 py-3 text-base whitespace-normal sm:h-12 sm:w-auto sm:py-0 sm:whitespace-nowrap lg:h-12 lg:px-6 lg:text-base"
            >
              {data.cta}
              <ArrowRight aria-hidden />
            </Button>
          </motion.div>

          {/* Мобильный индикатор — сразу под кнопкой */}
          <motion.div
            className="mt-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tr(2.0)}
          >
            <ScrollCue hint={data.scrollHint} className="flex" />
          </motion.div>
        </div>

        {/* Десктопный индикатор — по центру низа экрана */}
        <motion.div
          className="absolute bottom-5 left-1/2 hidden w-max max-w-[90%] -translate-x-1/2 lg:block"
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
