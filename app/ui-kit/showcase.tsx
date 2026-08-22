"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Copy, Heart, Plus, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { ModeToggle } from "@/components/mode-toggle"
import { PaletteToggle } from "@/components/palette-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Magnetic } from "@/components/landing/magnetic"
import { AnimatedMetric } from "@/components/animated-metric"

const REGISTRY = "https://webkoth.com/r"

const COLORS: { token: string; className: string }[] = [
  { token: "background", className: "bg-background text-foreground ring-1 ring-border" },
  { token: "foreground", className: "bg-foreground text-background" },
  { token: "card", className: "bg-card text-card-foreground ring-1 ring-foreground/10" },
  { token: "primary", className: "bg-primary text-primary-foreground" },
  { token: "secondary", className: "bg-secondary text-secondary-foreground" },
  { token: "muted", className: "bg-muted text-muted-foreground" },
  { token: "accent", className: "bg-accent text-accent-foreground" },
  { token: "destructive", className: "bg-destructive text-white" },
  { token: "chart-1", className: "bg-chart-1 text-black" },
  { token: "chart-2", className: "bg-chart-2 text-black" },
  { token: "chart-3", className: "bg-chart-3 text-white" },
  { token: "chart-4", className: "bg-chart-4 text-white" },
  { token: "chart-5", className: "bg-chart-5 text-white" },
]

const RADII: { label: string; className: string }[] = [
  { label: "sm", className: "rounded-sm" },
  { label: "md", className: "rounded-md" },
  { label: "lg", className: "rounded-lg" },
  { label: "xl", className: "rounded-xl" },
  { label: "2xl", className: "rounded-2xl" },
  { label: "3xl", className: "rounded-3xl" },
  { label: "4xl", className: "rounded-4xl" },
]

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      aria-label="Copy"
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground/70 transition hover:bg-muted hover:text-foreground"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

function CommandRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs text-muted-foreground">{label}</div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
          {value}
        </pre>
      </div>
      <CopyButton value={value} />
    </div>
  )
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-semibold md:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export function Showcase() {
  return (
    <TooltipProvider>
      <main className="relative z-[1] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
              >
                <ArrowLeft className="size-3.5" />
                webkoth.com
              </Link>
              <Separator orientation="vertical" className="h-5" />
              <span className="font-heading text-sm font-semibold">UI Kit</span>
            </div>
            <div className="flex items-center gap-2">
              <PaletteToggle />
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl space-y-16 px-4 py-12 md:px-8 md:py-16">
          {/* Intro */}
          <div className="space-y-3">
            <Badge variant="secondary">shadcn registry · base-vega · Tailwind v4</Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Webkoth UI Kit
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Живая витрина моей темы и компонентов. Переключай тему (☀/🌙) и палитру
              (тёплая/классическая) в шапке — всё перекрашивается через OKLCH-токены.
              Любой агент может забрать это по одной ссылке (см. «Установка» внизу).
            </p>
          </div>

          {/* Colors */}
          <Section
            id="colors"
            title="Цвета"
            description="OKLCH-токены темы. Реагируют на light/dark и переключатель палитры."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {COLORS.map((c) => (
                <div
                  key={c.token}
                  className={`flex h-20 flex-col justify-end rounded-lg p-3 ${c.className}`}
                >
                  <span className="font-mono text-xs opacity-90">{c.token}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Radius */}
          <Section
            id="radius"
            title="Радиусы"
            description="Шкала, выведенная из --radius: 0.625rem."
          >
            <div className="flex flex-wrap items-end gap-4">
              {RADII.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-16 border-2 border-primary/40 bg-primary/10 ${r.className}`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section id="typography" title="Типографика" description="Geist Sans / Geist Mono.">
            <div className="space-y-3">
              <h1 className="font-heading text-4xl font-bold tracking-tight">
                Заголовок H1
              </h1>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Заголовок H2
              </h2>
              <h3 className="font-heading text-xl font-medium">Заголовок H3</h3>
              <p className="max-w-prose text-foreground">
                Обычный абзац. The quick brown fox jumps over the lazy dog. 0123456789.
              </p>
              <p className="max-w-prose text-sm text-muted-foreground">
                Приглушённый текст (muted-foreground) для подписей и пояснений.
              </p>
              <p className="font-mono text-sm">const mono = &quot;Geist Mono&quot;</p>
            </div>
          </Section>

          {/* Buttons */}
          <Section id="buttons" title="Кнопки" description="Варианты и размеры.">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Add">
                  <Plus />
                </Button>
                <Button size="icon-sm" variant="outline" aria-label="Star">
                  <Star />
                </Button>
              </div>
            </div>
          </Section>

          {/* Badges */}
          <Section id="badges" title="Бейджи">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          {/* Inputs */}
          <Section id="inputs" title="Поля ввода">
            <div className="grid max-w-xl gap-4">
              <div className="grid gap-1.5">
                <label htmlFor="demo-input" className="text-sm font-medium">
                  Имя
                </label>
                <Input id="demo-input" placeholder="Введите имя…" />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="demo-textarea" className="text-sm font-medium">
                  Сообщение
                </label>
                <Textarea id="demo-textarea" placeholder="Несколько строк…" rows={4} />
              </div>
            </div>
          </Section>

          {/* Card */}
          <Section id="card" title="Карточка">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Тарифный план</CardTitle>
                <CardDescription>Карточка на токенах темы.</CardDescription>
                <CardAction>
                  <Badge variant="secondary">Pro</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Кольцо, фон и текст берутся из --card / --border / --foreground.
              </CardContent>
              <CardFooter className="gap-2 border-t">
                <Button>Выбрать</Button>
                <Button variant="ghost">Подробнее</Button>
              </CardFooter>
            </Card>
          </Section>

          {/* Tabs + Accordion */}
          <Section id="tabs" title="Tabs и Accordion">
            <div className="grid gap-8 md:grid-cols-2">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="specs">Параметры</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
                  Содержимое вкладки «Обзор».
                </TabsContent>
                <TabsContent value="specs" className="pt-3 text-sm text-muted-foreground">
                  Содержимое вкладки «Параметры».
                </TabsContent>
                <TabsContent value="faq" className="pt-3 text-sm text-muted-foreground">
                  Содержимое вкладки «FAQ».
                </TabsContent>
              </Tabs>

              <Accordion>
                <AccordionItem value="1">
                  <AccordionTrigger>Что входит в kit?</AccordionTrigger>
                  <AccordionContent>
                    Тема + набор моих компонентов поверх базовых shadcn.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger>Как подключить?</AccordionTrigger>
                  <AccordionContent>
                    Одной командой <code>npx shadcn add</code> по ссылке из реестра.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Section>

          {/* Tooltip + Avatar */}
          <Section id="misc" title="Tooltip и Avatar">
            <div className="flex flex-wrap items-center gap-6">
              <Tooltip>
                <TooltipTrigger
                  render={<Button variant="outline">Наведи на меня</Button>}
                />
                <TooltipContent>Подсказка на --primary</TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">Avatar fallback</span>
              </div>
            </div>
          </Section>

          {/* Custom components */}
          <Section
            id="custom"
            title="Мои компоненты"
            description="То, чего нет в базовом shadcn — публикуется в реестре."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Magnetic</CardTitle>
                  <CardDescription>Магнитится к курсору на hover.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-24 items-center justify-center">
                    <Magnetic>
                      <Button size="lg">
                        <Heart className="text-primary-foreground" /> Наведи
                      </Button>
                    </Magnetic>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AnimatedMetric</CardTitle>
                  <CardDescription>Счётчик при появлении в зоне видимости.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <AnimatedMetric value={98} suffix="%" label="Lighthouse" />
                    <AnimatedMetric value={120} suffix="ms" label="TTFB" />
                    <AnimatedMetric value={12} suffix="+" label="Проектов" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ModeToggle / PaletteToggle</CardTitle>
                  <CardDescription>Те же, что в шапке.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <ModeToggle />
                    <PaletteToggle />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>LanguageToggle</CardTitle>
                  <CardDescription>EN/RU сегмент для /[lang] роутов.</CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguageToggle currentLang="ru" />
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Install */}
          <Section
            id="install"
            title="Установка"
            description="Дай агенту эти команды (или просто ссылку на реестр)."
          >
            <div className="space-y-4 rounded-xl border border-border bg-card/60 p-5">
              <CommandRow
                label="Всё сразу (тема + все компоненты)"
                value={`npx shadcn@latest add ${REGISTRY}/webkoth-ui.json`}
              />
              <CommandRow
                label="Только тема"
                value={`npx shadcn@latest add ${REGISTRY}/theme.json`}
              />
              <CommandRow
                label="Отдельный компонент (пример)"
                value={`npx shadcn@latest add ${REGISTRY}/magnetic.json`}
              />
              <Separator />
              <CommandRow
                label="Инструкция для ИИ-агента (правила + ссылки)"
                value="https://webkoth.com/ui-kit.txt"
              />
            </div>
          </Section>

          <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
            Webkoth UI Kit · сгенерировано из{" "}
            <code className="font-mono">registry.json</code> через{" "}
            <code className="font-mono">npx shadcn build</code>.
          </footer>
        </div>
      </main>
    </TooltipProvider>
  )
}
