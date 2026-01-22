"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-xs text-primary-foreground bg-primary rounded-md shadow-lg pointer-events-none whitespace-nowrap",
            "bottom-full left-1/2 -translate-x-1/2 mb-2",
            "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
            "before:border-4 before:border-transparent before:border-t-primary",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
