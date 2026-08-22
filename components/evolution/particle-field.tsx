'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { clamp, mulberry32 } from './animations/seeded'

// Фон всей страницы: поле хаотичных частиц, которое при загрузке медленно
// стягивается в упорядоченную сетку, а собравшись — становится сетью: соседние
// узлы связываются линиями и складываются в соты (гексагональная решётка — та
// же, что в фоновом паттерне body::before), сеть «дышит» (узлы чуть дрейфуют
// вокруг своих мест). На курсор намеренно не реагирует. Сеть живёт на полную в
// пределах первого экрана, по мере скролла гаснет до тихой сетки точек и слегка
// оживает снова в финале (#finale). Это единственная зацикленная анимация на
// странице: она и есть метафора «система работает, а не застыла».

type Particle = {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  accent: boolean
  phase: number
  /** Амплитуда и частота дрейфа вокруг места в решётке — у каждого узла свои. */
  amp: number
  freq: number
  /** Битовая маска связей: 1 — к соседу справа, 2 — к соседу снизу (есть только у половины узлов). */
  links: number
  /** Текущая позиция на кадре — считается в draw, читается при рисовании связей. */
  x: number
  y: number
}

type Colors = { bg: string; fg: string; primary: string; dark: boolean }

const SETTLE_MS = 3400
const TAU = Math.PI * 2

// ─── Соты ─────────────────────────────────────────────────────
// Узлы — вершины шестиугольников с описанным радиусом R (он же длина ребра).
// Индексация (r, c): x = c·a, где a = √3·R/2 — полуширина шестиугольника;
// y = 1.5·R·r − (R, если r+c чётно, иначе R/2). У каждой вершины три соседа:
// (r, c±1) по бокам и один вертикальный — снизу (r+1, c), если r+c нечётно,
// сверху в противном случае. Так каждая вершина хранит не больше двух рёбер
// (вправо и вниз), и все рёбра решётки обходятся за один линейный проход.
/** Радиус шестиугольника: плотность узлов примерно как у прежней квадратной сетки 44px. */
const HEX_R_DESKTOP = 38
const HEX_R_MOBILE = 30
/** Доля рёбер, которых нет вовсе — сеть, а не идеальная решётка; мало, чтобы соты читались. */
const LINK_DROP = 0.06
/** Радиус связи и «плотная» дистанция в долях R: дрейф заметно «дышит» прозрачностью. */
const LINK_RADIUS = 1.35
const LINK_NEAR = 0.75
/** Базовая прозрачность линий (светлая / тёмная тема). */
const LINK_ALPHA_LIGHT = 0.11
const LINK_ALPHA_DARK = 0.17
/** Уровней квантования прозрачности — линии рисуются пачками по уровню, а не по одной. */
const ALPHA_LEVELS = 10

// ─── Скролл ───────────────────────────────────────────────────
/** Сила сети в финале: связи возвращаются, но тише, чем в hero. */
const FINALE_STRENGTH = 0.45
/** Сглаживание силы сети между кадрами, чтобы ничего не «прыгало». */
const NET_LERP = 0.08

function supportsOklch(ctx: CanvasRenderingContext2D): boolean {
  ctx.fillStyle = '#123456'
  ctx.fillStyle = 'oklch(0.5 0 0)'
  return ctx.fillStyle !== '#123456'
}

function readColors(oklchOk: boolean): Colors {
  const root = document.documentElement
  const dark = root.classList.contains('dark')
  if (oklchOk) {
    const cs = getComputedStyle(root)
    return {
      bg: cs.getPropertyValue('--background').trim(),
      fg: cs.getPropertyValue('--foreground').trim(),
      primary: cs.getPropertyValue('--primary').trim(),
      dark,
    }
  }
  // Старые браузеры без oklch в canvas: фон не закрашиваем (остаётся страничный),
  // точки — нейтральные, чтобы страница гарантированно осталась читаемой.
  return { bg: '', fg: dark ? '#ffffff' : '#000000', primary: '#e06a3c', dark }
}

/** Сила сети по положению скролла: 1 на первом экране, 0 после ~одного экрана прокрутки. */
function netFromScroll(scrollY: number, vh: number): number {
  return clamp(1 - (scrollY - 0.15 * vh) / (0.9 * vh), 0, 1)
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
    let cols = 0
    let rows = 0
    let hexR = HEX_R_DESKTOP
    let w = 0
    let h = 0
    let raf = 0
    let lastDraw = 0
    const start = performance.now()
    const rnd = mulberry32(2026)

    // Состояние вне React: скролл и сила сети.
    let scrollY = window.scrollY
    let finaleVisible = false
    let net = reduce ? netFromScroll(scrollY, window.innerHeight) : 0

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      hexR = w < 640 ? HEX_R_MOBILE : HEX_R_DESKTOP
      const a = (Math.sqrt(3) / 2) * hexR
      const rowH = 1.5 * hexR
      // Запас по краю, чтобы соты не обрывались у границ окна.
      cols = Math.ceil(w / a) + 3
      rows = Math.ceil(h / rowH) + 3
      const offX = (w - (cols - 1) * a) / 2
      const offY = (h - (rows - 1) * rowH) / 2 + hexR * 0.75
      // После того как решётка собралась, ресайз не должен снова разбрасывать
      // частицы — новые цели сразу считаются «уже на месте».
      const settled = reduce || performance.now() - start > SETTLE_MS * 1.6

      particles = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const even = (r + c) % 2 === 0
          const tx = offX + c * a
          const ty = offY + r * rowH - (even ? hexR : hexR / 2)
          // Ребро вправо — у всех, ребро вниз — только у «нечётных» вершин: это и даёт соты.
          const links = (rnd() < LINK_DROP ? 0 : 1) | (!even && rnd() >= LINK_DROP ? 2 : 0)
          particles.push({
            tx,
            ty,
            sx: settled ? tx : rnd() * w,
            sy: settled ? ty : rnd() * h,
            delay: rnd() * 0.45,
            accent: rnd() < 0.06,
            phase: rnd() * TAU,
            amp: 2.5 + rnd() * 2,
            freq: 0.25 + rnd() * 0.25,
            links,
            x: tx,
            y: ty,
          })
        }
      }
    }

    // Решётка — сама себе пространственный индекс: соседи вершины (r, c) —
    // это (r, c±1) и (r±1, c); дрейф мал относительно R, поэтому ближайшие
    // узлы всегда топологические соседи, и связи обходятся линейно.
    const at = (r: number, c: number): Particle | null =>
      r < 0 || c < 0 || r >= rows || c >= cols ? null : particles[r * cols + c]

    const drawLinks = (strength: number, fade: number) => {
      const linkR = hexR * LINK_RADIUS
      const nearR = hexR * LINK_NEAR
      const base = (colors.dark ? LINK_ALPHA_DARK : LINK_ALPHA_LIGHT) * strength * fade
      if (base < 0.004) return

      // Пачки линий по уровню прозрачности: десяток stroke() вместо тысяч.
      const batches: Path2D[] = []
      const warm: Path2D[] = []
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        batches.push(new Path2D())
        warm.push(new Path2D())
      }

      const link = (p: Particle, q: Particle) => {
        const dx = q.x - p.x
        const dy = q.y - p.y
        const d = Math.hypot(dx, dy)
        if (d >= linkR) return
        // Чем ближе узлы, тем плотнее связь: дрейф заметно «дышит» прозрачностью.
        const k = clamp(1 - (d - nearR) / (linkR - nearR), 0, 1)
        if (k < 0.02) return
        const level = Math.min(ALPHA_LEVELS - 1, (k * ALPHA_LEVELS) | 0)
        // Рёбра, касающиеся акцентных узлов, — чуть теплее: отдельная пачка акцентным цветом.
        const path = p.accent || q.accent ? warm[level] : batches[level]
        path.moveTo(p.x, p.y)
        path.lineTo(q.x, q.y)
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = particles[r * cols + c]
          if (p.links & 1) {
            const q = at(r, c + 1)
            if (q) link(p, q)
          }
          if (p.links & 2) {
            const q = at(r + 1, c)
            if (q) link(p, q)
          }
        }
      }

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.strokeStyle = colors.fg
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        const alpha = base * ((i + 0.5) / ALPHA_LEVELS)
        if (alpha < 0.004) continue
        ctx.globalAlpha = alpha
        ctx.stroke(batches[i])
      }
      ctx.strokeStyle = colors.primary
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        const alpha = base * 1.5 * ((i + 0.5) / ALPHA_LEVELS)
        if (alpha < 0.004) continue
        ctx.globalAlpha = alpha
        ctx.stroke(warm[i])
      }
      ctx.globalAlpha = 1
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000
      const p = reduce ? 1 : clamp((now - start) / SETTLE_MS, 0, 1)
      // Связи проявляются на последней трети сборки — когда узлы уже почти на местах.
      const linkFade = reduce ? 1 : clamp((p - 0.65) / 0.35, 0, 1) ** 2

      // Сила сети: скролл → цель, финал поднимает её до FINALE_STRENGTH; сглаживаем.
      const target = Math.max(netFromScroll(scrollY, h), finaleVisible ? FINALE_STRENGTH : 0)
      net = reduce ? target : net + (target - net) * NET_LERP
      if (Math.abs(net - target) < 0.004) net = target

      ctx.clearRect(0, 0, w, h)
      if (colors.bg) {
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, w, h)
      }

      for (const q of particles) {
        const pp = clamp((p - q.delay) / (1 - q.delay), 0, 1)
        const eased = 1 - Math.pow(1 - pp, 3)
        // Дрейф вокруг места в решётке включается только у осевших узлов —
        // от него связи «дышат». При reduced-motion узлы стоят ровно.
        const drift = reduce ? 0 : eased * q.amp
        const dx = drift * Math.sin(t * q.freq + q.phase)
        const dy = drift * Math.cos(t * q.freq * 0.8 + q.phase * 1.3)
        q.x = q.sx + (q.tx - q.sx) * eased + dx
        q.y = q.sy + (q.ty - q.sy) * eased + dy
      }

      if (net > 0.01) drawLinks(net, linkFade)

      for (const q of particles) {
        const pp = clamp((p - q.delay) / (1 - q.delay), 0, 1)
        const eased = 1 - Math.pow(1 - pp, 3)
        // Пульс включается только у осевших частиц; волна идёт по диагонали.
        const wave = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.9 + q.phase * 0.3 + (q.tx + q.ty) * 0.004)
        const pulse = eased * wave
        const alpha = q.accent ? 0.55 + 0.25 * pulse : 0.34 - 0.16 * eased + 0.08 * pulse
        const r = 1.7 - 0.45 * eased + 0.35 * pulse

        ctx.globalAlpha = alpha
        ctx.fillStyle = q.accent ? colors.primary : colors.fg
        ctx.beginPath()
        ctx.arc(q.x, q.y, r, 0, TAU)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      const settled = now - start > SETTLE_MS
      // После сборки хватает ~30 fps: дрейф и пульс медленные, а страница длинная.
      if (!settled || now - lastDraw > 32) {
        draw(now)
        lastDraw = now
      }
      raf = requestAnimationFrame(loop)
    }

    // При reduced-motion кадры рисуются только по событиям — один за тик.
    let staticRaf = 0
    const drawStatic = () => {
      if (!reduce) return
      cancelAnimationFrame(staticRaf)
      staticRaf = requestAnimationFrame((now) => draw(now))
    }

    build()
    if (reduce) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      build()
      drawStatic()
    }
    window.addEventListener('resize', onResize)

    const onScroll = () => {
      scrollY = window.scrollY
      drawStatic()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Финал: пока секция с формой на экране, сеть снова слегка оживает.
    let io: IntersectionObserver | null = null
    const finale = document.getElementById('finale')
    if (finale) {
      io = new IntersectionObserver(
        ([entry]) => {
          finaleVisible = entry.isIntersecting
          drawStatic()
        },
        { threshold: 0.2 },
      )
      io.observe(finale)
    }

    // Переключение темы/палитры меняет CSS-переменные на <html> — перечитываем.
    const mo = new MutationObserver(() => {
      colors = readColors(oklchOk)
      drawStatic()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(staticRaf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
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
