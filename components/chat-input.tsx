"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim())
      setValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card transition-all duration-200",
        isFocused
          ? "border-primary/30 shadow-[0_0_0_3px_rgba(51,85,245,0.08)]"
          : "border-border shadow-[var(--shadow-light-100)]"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Sparkles
          size={18}
          className="mt-0.5 shrink-0 text-primary opacity-60"
          strokeWidth={2}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Q3 sales pitch, team update, product roadmap..."
          disabled={disabled}
          rows={1}
          className="min-h-[24px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Describe your presentation"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            aria-label="Attach file"
          >
            <Paperclip size={16} strokeWidth={1.5} opacity={0.7} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
            value.trim()
              ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
              : "bg-secondary text-muted-foreground"
          )}
          aria-label="Send message"
        >
          <ArrowUp size={16} strokeWidth={2.5} opacity={0.7} />
        </button>
      </div>
    </div>
  )
}
