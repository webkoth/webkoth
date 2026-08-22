'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { clamp, mulberry32 } from './animations/seeded'

// Фон всей страницы: поле хаотичных частиц, которое при загрузке медленно
// стягивается в упорядоченную сетку. Сетка остаётся живой — лёгкая волна
// прозрачности, без мельтешения. Это единственная зацикленная анимация на
// странице: она и есть метафора «система работает, а не застыла».

type Particle = {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  accent: boolean
  phase: number
}

type Colors = { bg: string; fg: string; primary: string }

const SETTLE_MS = 3400
const TAU = Math.PI * 2

function supportsOklch(ctx: CanvasRenderingContext2D): boolean {
  ctx.fillStyle = '#123456'
  ctx.fillStyle = 'oklch(0.5 0 0)'
  return ctx.fillStyle !== '#123456'
}

function readColors(oklchOk: boolean): Colors {
  const root = document.documentElement
  if (oklchOk) {
    const cs = getComputedStyle(root)
    return {
      bg: cs.getPropertyValue('--background').trim(),
      fg: cs.getPropertyValue('--foreground').trim(),
      primary: cs.getPropertyValue('--primary').trim(),
    }
  }
  // Старые браузеры без oklch в canvas: фон не закрашиваем (остаётся страничный),
  // точки — нейтральные, чтобы страница гарантированно осталась читаемой.
  const dark = root.classList.contains('dark')
  return { bg: '', fg: dark ? '#ffffff' : '#000000', primary: '#e06a3c' }
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = !!useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const oklchOk = supportsOklch(ctx)
    let colors = readColors(oklchOk)
    let particles: Particle[] = []
    let w = 0
    let h = 0
    let raf = 0
    let lastDraw = 0
    const start = performance.now()
    const rnd = mulberry32(2026)

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const spacing = w < 640 ? 34 : 44
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const offX = (w - (cols - 1) * spacing) / 2
      const offY = (h - (rows - 1) * spacing) / 2
      // После того как сетка собралась, ресайз не должен снова разбрасывать
      // частицы — новые цели сразу считаются «уже на месте».
      const settled = reduce || performance.now() - start > SETTLE_MS * 1.6

      particles = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = offX + c * spacing
          const ty = offY + r * spacing
          particles.push({
            tx,
            ty,
            sx: settled ? tx : rnd() * w,
            sy: settled ? ty : rnd() * h,
            delay: rnd() * 0.45,
            accent: rnd() < 0.06,
            phase: rnd() * TAU,
          })
        }
      }
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000
      const p = reduce ? 1 : clamp((now - start) / SETTLE_MS, 0, 1)

      ctx.clearRect(0, 0, w, h)
      if (colors.bg) {
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, w, h)
      }

      for (const q of particles) {
        const pp = clamp((p - q.delay) / (1 - q.delay), 0, 1)
        const eased = 1 - Math.pow(1 - pp, 3)
        const x = q.sx + (q.tx - q.sx) * eased
        const y = q.sy + (q.ty - q.sy) * eased
        // Пульс включается только у осевших частиц; волна идёт по диагонали.
        const wave = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.9 + q.phase * 0.3 + (q.tx + q.ty) * 0.004)
        const pulse = eased * wave
        const alpha = q.accent
          ? 0.55 + 0.25 * pulse
          : 0.34 - 0.16 * eased + 0.08 * pulse
        const r = 1.7 - 0.45 * eased + 0.35 * pulse

        ctx.globalAlpha = alpha
        ctx.fillStyle = q.accent ? colors.primary : colors.fg
        ctx.beginPath()
        ctx.arc(x, y, r, 0, TAU)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      const settled = now - start > SETTLE_MS
      // После сборки хватает ~30 fps: пульс медленный, а страница длинная.
      if (!settled || now - lastDraw > 32) {
        draw(now)
        lastDraw = now
      }
      raf = requestAnimationFrame(loop)
    }

    build()
    if (reduce) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      build()
      if (reduce) draw(performance.now())
    }
    window.addEventListener('resize', onResize)

    // Переключение темы/палитры меняет CSS-переменные на <html> — перечитываем.
    const mo = new MutationObserver(() => {
      colors = readColors(oklchOk)
      if (reduce) draw(performance.now())
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      mo.disconnect()
    }
  }, [reduce])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="absolute -top-32 -right-40 size-[36rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)',
        }}
      />
    </div>
  )
}
