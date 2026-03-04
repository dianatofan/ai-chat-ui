"use client"

import { useState, useRef, useEffect } from "react"
import {
  Presentation,
  BarChart3,
  Target,
  Lightbulb,
  Sparkles,
  Bot,
  User,
} from "lucide-react"
import { SuggestionCard } from "@/components/suggestion-card"
import { ChatInput } from "@/components/chat-input"
import { GeometricAccent } from "@/components/geometric-accent"
import { TopBar } from "@/components/top-bar"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

const suggestions = [
  {
    icon: Presentation,
    title: "Knowledge Sharing",
    description: "Educate your team with structured insights and best practices",
  },
  {
    icon: BarChart3,
    title: "All Hands Meeting",
    description: "Energize the room with company updates and achievements",
  },
  {
    icon: Target,
    title: "Project Status",
    description: "Keep stakeholders aligned on progress and milestones",
  },
  {
    icon: Lightbulb,
    title: "Training & Onboarding",
    description: "Welcome new team members with clear guidance and vision",
  },
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className="inline-block h-1.5 w-1.5 animate-[bounce_1.4s_ease-in-out_infinite] rounded-full bg-primary/50" />
      <span className="inline-block h-1.5 w-1.5 animate-[bounce_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-primary/50" />
      <span className="inline-block h-1.5 w-1.5 animate-[bounce_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-primary/50" />
    </div>
  )
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = (value: string) => {
    setMessages((prev) => [...prev, { role: "user", content: value }])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great choice! I'll help you create a presentation about "${value}". Let me set up the structure with a clear narrative, key talking points, and professional visuals that align with your brand guidelines. Would you like me to proceed, or would you like to refine any details first?`,
        },
      ])
    }, 2000)
  }

  const handleSuggestionClick = (title: string) => {
    handleSubmit(`Create a ${title.toLowerCase()} presentation`)
  }

  const isEmptyState = messages.length === 0

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
      <TopBar />
      <GeometricAccent />

      <div className="relative flex flex-1 flex-col items-center overflow-y-auto px-6 py-8">
        {isEmptyState ? (
          <EmptyState
            onSuggestionClick={handleSuggestionClick}
            onSubmit={handleSubmit}
          />
        ) : (
          <ConversationView
            messages={messages}
            isTyping={isTyping}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  )
}

function EmptyState({
  onSuggestionClick,
  onSubmit,
}: {
  onSuggestionClick: (title: string) => void
  onSubmit: (value: string) => void
}) {
  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-10">
      {/* Hero section */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Sparkles size={14} className="text-primary" strokeWidth={2} />
          <span>AI-powered creation</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-balance">
            What are we <span className="text-primary">creating</span> today?
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-sm">
            Generate stunning, on-brand presentations in seconds. Just describe what you need.
          </p>
        </div>
      </div>

      {/* Chat input */}
      <div className="w-full">
        <ChatInput onSubmit={onSubmit} />
      </div>

      {/* Suggestion cards */}
      <div className="w-full">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          Get started in seconds
        </p>
        <div className="grid grid-cols-2 gap-4">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              description={s.description}
              onClick={() => onSuggestionClick(s.title)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ConversationView({
  messages,
  isTyping,
  onSubmit,
}: {
  messages: Message[]
  isTyping: boolean
  onSubmit: (value: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col">
      {/* Messages */}
      <div className="flex flex-1 flex-col gap-6 pb-6 pt-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] ring-1 ring-primary/10">
                <Bot size={16} className="text-primary" strokeWidth={2} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "border border-border bg-card text-card-foreground shadow-[var(--shadow-light-100)] rounded-bl-md"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <User
                  size={16}
                  className="text-secondary-foreground"
                  strokeWidth={2}
                />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] ring-1 ring-primary/10">
              <Bot size={16} className="text-primary" strokeWidth={2} />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-light-100)]">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sticky input */}
      <div className="sticky bottom-0 bg-background pb-4 pt-2">
        <ChatInput onSubmit={onSubmit} disabled={isTyping} />
      </div>
    </div>
  )
}
