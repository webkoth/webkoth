'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { clamp, mulberry32 } from './animations/seeded'

// Фон всей страницы: поле хаотичных частиц, которое при загрузке медленно
// стягивается в упорядоченную сетку, а собравшись — становится сетью: соседние
// узлы связываются линиями, сеть «дышит» (узлы чуть дрейфуют вокруг своих мест)
// и реагирует на курсор (узлы мягко расступаются, ближние связи подсвечиваются
// акцентом). Сеть живёт на полную в пределах первого экрана, по мере скролла
// гаснет до тихой сетки точек и слегка оживает снова в финале (#finale).
// Это единственная зацикленная анимация на странице: она и есть метафора
// «система работает, а не застыла».

type Particle = {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  accent: boolean
  phase: number
  /** Амплитуда и частота дрейфа вокруг места в сетке — у каждого узла свои. */
  amp: number
  freq: number
  /** Битовая маска связей: 1 — вправо, 2 — вниз, 4 — диагонали разрешены. */
  links: number
  /** Смещение от курсора (пружина): текущее значение, расслабляется к нулю. */
  ox: number
  oy: number
  /** Текущая позиция на кадре — считается в draw, читается при рисовании связей. */
  x: number
  y: number
}

type Colors = { bg: string; fg: string; primary: string; dark: boolean }

const SETTLE_MS = 3400
const TAU = Math.PI * 2

// ─── Сеть ─────────────────────────────────────────────────────
/** Радиус связи в долях шага сетки: ортогональные соседи — всегда, диагонали — только если дрейф их сблизил. */
const LINK_RADIUS = 1.35
/** Доля ортогональных связей, которых нет вовсе — иначе это решётка, а не сеть. */
const LINK_DROP = 0.12
/** Доля узлов, которым разрешены диагональные связи. */
const DIAG_SHARE = 0.35
/** Базовая прозрачность линий (светлая / тёмная тема). */
const LINK_ALPHA_LIGHT = 0.1
const LINK_ALPHA_DARK = 0.16
/** Уровней квантования прозрачности — линии рисуются пачками по уровню, а не по одной. */
const ALPHA_LEVELS = 10

// ─── Курсор ───────────────────────────────────────────────────
/** Радиус, в котором узлы расступаются, и радиус подсветки связей. */
const PUSH_RADIUS = 140
const PUSH_MAX = 26
const GLOW_RADIUS = 110
const GLOW_ALPHA_MAX = 0.55
/** Скорость пружины: доля пути к цели за кадр (30 fps). */
const SPRING = 0.14

// ─── Скролл ───────────────────────────────────────────────────
/** Сила сети в финале: связи и курсор возвращаются, но тише, чем в hero. */
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
    let spacing = 44
    let w = 0
    let h = 0
    let raf = 0
    let lastDraw = 0
    const start = performance.now()
    const rnd = mulberry32(2026)

    // Состояние вне React: скролл, курсор, сила сети.
    let scrollY = window.scrollY
    let finaleVisible = false
    let net = reduce ? netFromScroll(scrollY, window.innerHeight) : 0
    const pointer = { x: -1e4, y: -1e4, active: false }

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      spacing = w < 640 ? 34 : 44
      cols = Math.ceil(w / spacing) + 1
      rows = Math.ceil(h / spacing) + 1
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
          const links = (rnd() < LINK_DROP ? 0 : 1) | (rnd() < LINK_DROP ? 0 : 2) | (rnd() < DIAG_SHARE ? 4 : 0)
          particles.push({
            tx,
            ty,
            sx: settled ? tx : rnd() * w,
            sy: settled ? ty : rnd() * h,
            delay: rnd() * 0.45,
            accent: rnd() < 0.06,
            phase: rnd() * TAU,
            amp: 3 + rnd() * 2,
            freq: 0.25 + rnd() * 0.25,
            links,
            ox: 0,
            oy: 0,
            x: tx,
            y: ty,
          })
        }
      }
    }

    // Сетка частиц — сама себе пространственный индекс: соседи узла (r, c) —
    // это узлы (r, c±1), (r±1, c), (r±1, c±1); дрейф и отталкивание малы
    // относительно шага, поэтому ближайшие узлы всегда топологические соседи.
    // Так поиск связей линейный по числу узлов, без перебора всех пар.
    const at = (r: number, c: number): Particle | null =>
      r < 0 || c < 0 || r >= rows || c >= cols ? null : particles[r * cols + c]

    const updateCursor = (strength: number) => {
      const active = pointer.active && strength > 0.02
      const px = pointer.x
      const py = pointer.y
      for (const q of particles) {
        let txo = 0
        let tyo = 0
        if (active) {
          const dx = q.x - px
          const dy = q.y - py
          const d = Math.hypot(dx, dy)
          if (d < PUSH_RADIUS && d > 0.01) {
            const f = (1 - d / PUSH_RADIUS) ** 2 * PUSH_MAX * strength
            txo = (dx / d) * f
            tyo = (dy / d) * f
          }
        }
        q.ox += (txo - q.ox) * SPRING
        q.oy += (tyo - q.oy) * SPRING
      }
    }

    const drawLinks = (strength: number, fade: number) => {
      const linkR = spacing * LINK_RADIUS
      const nearR = spacing * 0.75
      const base = (colors.dark ? LINK_ALPHA_DARK : LINK_ALPHA_LIGHT) * strength * fade
      if (base < 0.004) return

      // Пачки линий по уровню прозрачности: десяток stroke() вместо тысяч.
      const batches: Path2D[] = []
      const warm: Path2D[] = []
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        batches.push(new Path2D())
        warm.push(new Path2D())
      }
      const hot: { x1: number; y1: number; x2: number; y2: number; a: number }[] = []

      const cursorOn = pointer.active && strength > 0.02
      const px = pointer.x
      const py = pointer.y

      const link = (a: Particle, b: Particle) => {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        if (d >= linkR) return
        // Чем ближе узлы, тем плотнее связь: дрейф заметно «дышит» прозрачностью.
        const k = clamp(1 - (d - nearR) / (linkR - nearR), 0, 1)
        if (k < 0.02) return
        const level = Math.min(ALPHA_LEVELS - 1, (k * ALPHA_LEVELS) | 0)
        // Связи, касающиеся акцентных узлов, — чуть теплее: отдельная пачка акцентным цветом.
        const path = a.accent || b.accent ? warm[level] : batches[level]
        path.moveTo(a.x, a.y)
        path.lineTo(b.x, b.y)
        if (cursorOn) {
          const da = Math.hypot(a.x - px, a.y - py)
          const db = Math.hypot(b.x - px, b.y - py)
          const dmin = Math.min(da, db)
          if (dmin < GLOW_RADIUS) {
            const hl = (1 - dmin / GLOW_RADIUS) ** 1.5
            hot.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, a: GLOW_ALPHA_MAX * hl * strength * fade })
          }
        }
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
          if (p.links & 4) {
            const q1 = at(r + 1, c + 1)
            if (q1) link(p, q1)
            const q2 = at(r + 1, c - 1)
            if (q2) link(p, q2)
          }
        }
      }

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.strokeStyle = colors.fg
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        const a = base * ((i + 0.5) / ALPHA_LEVELS)
        if (a < 0.004) continue
        ctx.globalAlpha = a
        ctx.stroke(batches[i])
      }
      ctx.strokeStyle = colors.primary
      for (let i = 0; i < ALPHA_LEVELS; i++) {
        const a = base * 1.5 * ((i + 0.5) / ALPHA_LEVELS)
        if (a < 0.004) continue
        ctx.globalAlpha = a
        ctx.stroke(warm[i])
      }
      // Подсветка у курсора — поверх базовых линий, акцентным цветом.
      if (hot.length) {
        ctx.lineWidth = 1.25
        for (const s of hot) {
          ctx.globalAlpha = s.a
          ctx.beginPath()
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const drawCursorGlow = (strength: number, fade: number) => {
      if (!pointer.active || strength < 0.02) return
      // Ближайший узел — по индексу сетки, без перебора.
      const c = clamp(Math.round((pointer.x - particles[0].tx) / spacing), 0, cols - 1)
      const r = clamp(Math.round((pointer.y - particles[0].ty) / spacing), 0, rows - 1)
      const q = at(r, c)
      if (!q) return
      const d = Math.hypot(q.x - pointer.x, q.y - pointer.y)
      if (d > spacing) return
      const a = 0.35 * strength * fade * (1 - d / spacing)
      const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 16)
      g.addColorStop(0, colors.primary)
      g.addColorStop(1, 'transparent')
      ctx.globalAlpha = a
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(q.x, q.y, 16, 0, TAU)
      ctx.fill()
      ctx.globalAlpha = Math.min(1, a * 2.2)
      ctx.fillStyle = colors.primary
      ctx.beginPath()
      ctx.arc(q.x, q.y, 2.6, 0, TAU)
      ctx.fill()
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

      if (!reduce) updateCursor(net * linkFade)

      ctx.clearRect(0, 0, w, h)
      if (colors.bg) {
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, w, h)
      }

      for (const q of particles) {
        const pp = clamp((p - q.delay) / (1 - q.delay), 0, 1)
        const eased = 1 - Math.pow(1 - pp, 3)
        // Дрейф вокруг места в сетке включается только у осевших узлов —
        // от него связи «дышат». При reduced-motion узлы стоят ровно.
        const drift = reduce ? 0 : eased * q.amp
        const dx = drift * Math.sin(t * q.freq + q.phase)
        const dy = drift * Math.cos(t * q.freq * 0.8 + q.phase * 1.3)
        q.x = q.sx + (q.tx - q.sx) * eased + dx + q.ox
        q.y = q.sy + (q.ty - q.sy) * eased + dy + q.oy
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

      if (!reduce) drawCursorGlow(net, linkFade)
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

    // Курсор: холст не ловит события (pointer-events: none), слушаем окно.
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      window.addEventListener('pointercancel', onLeave)
      window.addEventListener('blur', onLeave)
    }

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
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointercancel', onLeave)
      window.removeEventListener('blur', onLeave)
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
