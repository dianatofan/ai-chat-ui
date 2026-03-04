"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SuggestionCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick?: () => void
  className?: string
}

export function SuggestionCard({
  icon: Icon,
  title,
  description,
  onClick,
  className,
}: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all duration-200 overflow-hidden",
        "hover:border-primary/20 hover:shadow-[var(--shadow-light-200)] hover:bg-card",
        "active:scale-[0.98]",
        className
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
        <Icon
          size={20}
          className="text-muted-foreground transition-colors group-hover:text-primary"
          strokeWidth={1.5}
          opacity={0.7}
        />
      </div>
      <div className="relative z-10 flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-card-foreground leading-snug">
          {title}
        </span>
        {description && (
          <span className="text-xs leading-relaxed text-muted-foreground/80">
            {description}
          </span>
        )}
      </div>
    </button>
  )
}
