'use client'

import { motion } from 'framer-motion'
import { useReveal } from './use-reveal'

// Блок 5. Таймлайн, который сжимается: длинная линия «7–13 недель» схлопывается
// в отрезок «1 день». Ниже — бегущая лента коммитов, превращающихся в галочки
// деплоя: проверка и выкладка происходят тем же днём.

const W = 480
const H = 300
const X0 = 40
const X1 = 440
const FULL = X1 - X0
const WEEKS = 13
const DAY_W = 18

const HASHES = ['a1f3c9e', '7d02b4c', 'e9c71aa', '3b8f0d2', 'c04e9f7', '51ad6b3', 'f7e2c08', '9bd41e5']
const CHIP_W = 46
const CHIP_GAP = 5
const CHIP_Y = 222

export function TimelineCompress() {
  const { ref, active, reduce, tr } = useReveal()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Таймлайн: линия в 7–13 недель сжимается в отрезок в один день; лента коммитов превращается в галочки деплоя"
    >
      {/* Рыночная альтернатива */}
      <text x={X0} y={52} className="fill-muted-foreground text-[10px]">
        Заказная разработка · базовый модуль
      </text>
      <rect x={X0} y={62} width={FULL} height={10} rx={5} className="fill-muted stroke-border" />
      {Array.from({ length: WEEKS + 1 }, (_, i) => (
        <line
          key={i}
          x1={X0 + (i / WEEKS) * FULL}
          y1={76}
          x2={X0 + (i / WEEKS) * FULL}
          y2={i % 4 === 0 ? 84 : 80}
          className="stroke-muted-foreground/50"
        />
      ))}
      <text x={X1} y={98} textAnchor="end" className="fill-foreground font-mono text-[11px] font-semibold">
        7–13 недель
      </text>

      {/* Здесь: линия схлопывается в день */}
      <text x={X0} y={132} className="fill-muted-foreground text-[10px]">
        Здесь · от первого коммита до промышленного контура
      </text>
      <rect x={X0} y={142} width={FULL} height={10} rx={5} fill="none" className="stroke-border" strokeDasharray="3 4" />
      <motion.rect
        x={X0}
        y={142}
        height={10}
        rx={5}
        className="fill-primary"
        initial={{ width: FULL }}
        animate={{ width: active ? DAY_W : FULL }}
        transition={tr(1.7, 0.4)}
      />
      <motion.text
        y={178}
        className="fill-primary font-mono text-[13px] font-bold"
        initial={{ x: X0 + FULL + 6, opacity: 0 }}
        animate={active ? { x: X0 + DAY_W + 8, opacity: 1 } : { x: X0 + FULL + 6, opacity: 0 }}
        transition={tr(1.7, 0.4)}
      >
        1 день
      </motion.text>
      <motion.text
        x={X1}
        y={178}
        textAnchor="end"
        className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.18em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={tr(0.6, 1.9)}
      >
        база · роли · тесты · CI · два контура
      </motion.text>

      {/* Лента коммитов → галочки деплоя */}
      <text x={X0} y={CHIP_Y - 12} className="fill-muted-foreground text-[10px]">
        Изменения доезжают тем же днём: автопроверка, автодеплой, автооткат
      </text>
      {HASHES.map((hsh, i) => {
        const x = X0 + i * (CHIP_W + CHIP_GAP)
        const appear = 2.0 + i * 0.22
        return (
          <g key={hsh}>
            <motion.g
              initial={{ opacity: 0, x: 14 }}
              animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
              transition={tr(0.45, appear)}
            >
              <rect x={x} y={CHIP_Y} width={CHIP_W} height={20} rx={5} className="fill-card stroke-border" />
              <motion.text
                x={x + CHIP_W / 2}
                y={CHIP_Y + 13.5}
                textAnchor="middle"
                className="fill-foreground font-mono text-[8.5px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: active ? 0.3 : 1 }}
                transition={tr(0.4, appear + 0.6)}
              >
                {hsh}
              </motion.text>
            </motion.g>
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: appear + 0.6, type: 'spring', bounce: 0.4 }}
              style={{ originX: `${x + CHIP_W - 6}px`, originY: `${CHIP_Y + 2}px` }}
            >
              <circle cx={x + CHIP_W - 6} cy={CHIP_Y + 2} r={7} className="fill-primary" />
              <path
                d={`M${x + CHIP_W - 9.5} ${CHIP_Y + 2.3}l2.4 2.4 4.4-4.8`}
                fill="none"
                className="stroke-primary-foreground"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </g>
        )
      })}
      <motion.text
        x={X1}
        y={CHIP_Y + 46}
        textAnchor="end"
        className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.18em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={tr(0.6, 4.2)}
      >
        коммит → проверка → production
      </motion.text>
    </svg>
  )
}
