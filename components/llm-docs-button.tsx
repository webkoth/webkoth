"use client"

import * as React from "react"
import { FileText, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  data.skills.forEach((skill) => {
    markdown += `- ${skill.name}: ${skill.level}%\n`
  })
  markdown += `\n`

  markdown += `## ${t.experience}\n\n`
  data.experience.forEach((job) => {
    markdown += `### ${job.role}\n`
    markdown += `**${t.period}:** ${job.period}\n`
    markdown += `**${t.company}:** ${job.company} (${job.type})\n`
    markdown += `**${t.description}:**\n`
    job.description.forEach((item) => {
      markdown += `- ${item}\n`
    })
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9" title={lang === "en" ? "LLM Documentation" : "Документация для LLM"}>
          <FileText className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">LLM Documentation</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="default" className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col data-[size=default]:max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {lang === "en" ? "LLM Documentation" : "Документация для LLM"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {lang === "en"
              ? "Complete CV content in Markdown format, optimized for AI agents and LLMs."
              : "Полное содержание резюме в формате Markdown, оптимизированное для AI агентов и LLM."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex-1 overflow-auto">
          <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-words">
            {markdown}
          </pre>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-2"
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
          </Button>
          <AlertDialogCancel>
            {lang === "en" ? "Close" : "Закрыть"}
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
