"use client"

import * as React from "react"
import { FileText, Copy, Check, X } from "lucide-react"
import { CVData } from "@/app/data/cv"

interface LLMDocsButtonProps {
  data: CVData
  lang: "en" | "ru"
}

function formatCVAsMarkdown(data: CVData, lang: "en" | "ru"): string {
  const labels = {
    en: {
      name: "Name",
      role: "Role",
      contacts: "Contacts",
      email: "Email",
      telegram: "Telegram",
      github: "GitHub",
      about: "About Me",
      skills: "Technical Skills",
      experience: "Work Experience",
      education: "Education",
      portfolio: "Portfolio",
      stack: "Stack",
      team: "Team",
      functionality: "Functionality",
      technologies: "Technologies",
      period: "Period",
      company: "Company",
      type: "Type",
      description: "Description",
      degree: "Degree",
      university: "University",
      faculty: "Faculty",
    },
    ru: {
      name: "Имя",
      role: "Роль",
      contacts: "Контакты",
      email: "Email",
      telegram: "Telegram",
      github: "GitHub",
      about: "Обо мне",
      skills: "Технические навыки",
      experience: "Опыт работы",
      education: "Образование",
      portfolio: "Портфолио",
      stack: "Стек",
      team: "Команда",
      functionality: "Функционал",
      technologies: "Технологии",
      period: "Период",
      company: "Компания",
      type: "Тип",
      description: "Описание",
      degree: "Степень",
      university: "Университет",
      faculty: "Факультет",
    },
  }

  const t = labels[lang]

  let markdown = `# ${data.name}\n\n`
  markdown += `**${t.role}:** ${data.role}\n\n`

  markdown += `## ${t.contacts}\n\n`
  markdown += `- ${t.email}: ${data.contacts.email}\n`
  markdown += `- ${t.telegram}: ${data.contacts.telegram}\n`
  markdown += `- ${t.github}: ${data.contacts.github}\n\n`

  markdown += `## ${t.about}\n\n${data.about}\n\n`

  markdown += `## ${t.skills}\n\n`
  data.skills.forEach((cat) => {
    markdown += `### ${cat.category}\n`
    cat.items.forEach((item) => {
      markdown += `- ${item.name}${item.maturity === "touch" ? " _(touch)_" : ""}\n`
    })
    markdown += `\n`
  })
  markdown += `\n`

  markdown += `## ${t.experience}\n\n`
  data.experience.forEach((job) => {
    markdown += `### ${job.role}\n`
    markdown += `**${t.period}:** ${job.period}\n`
    markdown += `**${t.company}:** ${job.company} (${job.type})\n`
    if (job.responsibilities && job.responsibilities.length > 0) {
      markdown += `**${lang === "en" ? "Responsibilities" : "Обязанности"}:**\n`
      job.responsibilities.forEach((item) => {
        markdown += `- ${item}\n`
      })
    }
    if (job.achievements && job.achievements.length > 0) {
      markdown += `**${lang === "en" ? "Achievements" : "Достижения"}:**\n`
      job.achievements.forEach((item) => {
        markdown += `- ${item}\n`
      })
    }
    markdown += `\n`
  })

  markdown += `## ${t.education}\n\n`
  markdown += `**${t.university}:** ${data.education.university}\n`
  markdown += `**${t.degree}:** ${data.education.degree}\n`
  markdown += `**${t.faculty}:** ${data.education.faculty}\n\n`

  markdown += `## ${t.portfolio}\n\n`
  data.portfolio.forEach((project, index) => {
    markdown += `### ${index + 1}. ${project.title}\n`
    markdown += `**${t.functionality}:** ${project.functionality}\n`
    markdown += `**${t.stack}:** ${project.stack.join(", ")}\n`
    markdown += `**${t.team}:** ${project.team}\n`
    markdown += `**${t.technologies}:** ${project.technologies.join(", ")}\n\n`
  })

  return markdown
}

export function LLMDocsButton({ data, lang }: LLMDocsButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const markdown = React.useMemo(() => formatCVAsMarkdown(data, lang), [data, lang])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const title = lang === "en" ? "LLM Documentation" : "Документация для LLM"
  const description =
    lang === "en"
      ? "Complete CV content in Markdown format, optimized for AI agents and LLMs."
      : "Полное содержание резюме в формате Markdown, оптимизированное для AI агентов и LLM."

  const closeLabel = lang === "en" ? "Close" : "Закрыть"

  return (
    <>
      <button
        type="button"
        title={title}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted hover:text-foreground"
      >
        <FileText className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{title}</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col gap-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-heading text-lg font-medium">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={closeLabel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-muted p-4 font-mono text-sm">
                {markdown}
              </pre>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {lang === "en" ? "Copied!" : "Скопировано!"}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {lang === "en" ? "Copy to Clipboard" : "Копировать"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {closeLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
