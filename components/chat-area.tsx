"use client"

import { useState, useRef, useEffect } from "react"
import {
  Presentation,
  BarChart3,
  Target,
  Lightbulb,
  Bot,
  User,
  Clock,
  Plus,
  Download,
  Check,
} from "lucide-react"
import { SuggestionCard } from "@/components/suggestion-card"
import { ChatInput } from "@/components/chat-input"
import { GeometricAccent } from "@/components/geometric-accent"
import { PresentationPreview } from "@/components/presentation-preview"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  presentationTitle?: string
}

type GenerationStatus = "idle" | "generating" | "done"

const GENERATION_STEPS = [
  { id: "analyze", label: "Analyzing your request" },
  { id: "outline", label: "Building presentation outline" },
  { id: "slides", label: "Generating slides" },
  { id: "finalize", label: "Finalizing content" },
]

function GenerationLoader({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] ring-1 ring-primary/10">
        <img
          src="/logo-blue.png"
          alt="Loading"
          className="h-4 w-4 animate-spin"
        />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-light-100)]">
        <div className="mb-3 text-sm font-medium text-card-foreground">
          Generating presentation
        </div>
        <div className="space-y-2">
          {GENERATION_STEPS.map((step, idx) => {
            const isComplete = idx < currentStep
            const isActive = idx === currentStep

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 text-xs rounded-md px-2 py-1.5 transition-all",
                  isComplete
                    ? "text-emerald-700 bg-emerald-50"
                    : isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-medium",
                    isComplete
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isActive
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check size={10} strokeWidth={3} /> : ""}
                </div>
                <span className="font-medium">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function GenerationDone({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] ring-1 ring-primary/10">
        <img
          src="/logo-blue.png"
          alt="Done"
          className="h-4 w-4"
        />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-border bg-white px-4 py-3.5 shadow-[var(--shadow-light-100)]">
        <div className="mb-3 text-sm font-medium text-muted-foreground">
          Presentation done!
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-all hover:opacity-90 active:scale-95"
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}

function RecentPresentationItem({ title, date }: { title: string; date: string }) {
  return (
    <button className="group relative flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left transition-all duration-200 hover:border-primary/20 hover:bg-card/80 hover:shadow-[var(--shadow-light-100)] overflow-hidden min-w-0">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-2 min-w-0">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-sm font-medium text-card-foreground truncate">{title}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} strokeWidth={2} opacity={0.6} />
            <span>{date}</span>
          </div>
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
          <Presentation size={14} className="text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} opacity={0.7} />
        </div>
      </div>
    </button>
  )
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
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle")
  const [generationStep, setGenerationStep] = useState(0)

  const handleSubmit = (value: string) => {
    setMessages((prev) => [...prev, { role: "user", content: value }])

    // Add AI response immediately
    const presentationTitle = value.charAt(0).toUpperCase() + value.slice(1)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Great choice! I'll help you create a presentation about "${value}". Let me set up the structure with a clear narrative, key talking points, and professional visuals that align with your brand guidelines.`,
        presentationTitle: presentationTitle,
      },
    ])

    // Then start generation loading after a brief delay
    setTimeout(() => {
      setIsTyping(true)
      setGenerationStatus("generating")
      setGenerationStep(0)

      // Simulate step progression
      let step = 0
      const stepInterval = setInterval(() => {
        step += 1
        setGenerationStep(step)
        if (step >= GENERATION_STEPS.length) {
          clearInterval(stepInterval)
          setTimeout(() => {
            setIsTyping(false)
            setGenerationStatus("done")
          }, 500)
        }
      }, 800)
    }, 600)
  }

  const handleSuggestionClick = (title: string) => {
    handleSubmit(`Create a ${title.toLowerCase()} presentation`)
  }

  const handleNewChat = () => {
    setMessages([])
    setIsTyping(false)
    setGenerationStatus("idle")
    setGenerationStep(0)
  }

  const handleDownload = () => {
    console.log("Downloading presentation...")
    // Add actual download logic here
  }

  const isEmptyState = messages.length === 0

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
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
            generationStatus={generationStatus}
            generationStep={generationStep}
            onSubmit={handleSubmit}
            onNewChat={handleNewChat}
            onDownload={handleDownload}
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
  const [activeTab, setActiveTab] = useState<"recent" | "templates">("templates")

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center gap-10 pt-8">
      {/* Hero section */}
      <div className="flex flex-col items-center gap-6 text-center">
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

      {/* Tab toggle buttons */}
      <div className="w-full flex justify-center">
        <div className="flex gap-2 p-1 rounded-lg bg-secondary">
          <button
            onClick={() => setActiveTab("recent")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === "recent"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === "templates"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Content Container - Fixed height to prevent position shifting */}
      <div className="w-full h-[340px]">
        {/* Recent Presentations */}
        {activeTab === "recent" && (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-3 gap-3">
              <RecentPresentationItem title="Q1 Financial Review" date="2 days ago" />
              <RecentPresentationItem title="Product Roadmap 2026" date="1 week ago" />
              <RecentPresentationItem title="Team Onboarding Guide" date="2 weeks ago" />
            </div>
          </div>
        )}

        {/* Templates */}
        {activeTab === "templates" && (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
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
        )}
      </div>
    </div>
  )
}

function ConversationView({
  messages,
  isTyping,
  generationStatus,
  generationStep,
  onSubmit,
  onNewChat,
  onDownload,
}: {
  messages: Message[]
  isTyping: boolean
  generationStatus: GenerationStatus
  generationStep: number
  onSubmit: (value: string) => void
  onNewChat: () => void
  onDownload: () => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping, generationStatus])

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col">
      {/* New Chat Button */}
      <div className="flex justify-center pb-4 pt-2">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-card-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card/80 hover:shadow-[var(--shadow-light-100)]"
        >
          <Plus size={16} strokeWidth={2} opacity={0.7} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-6 pb-6 pt-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div
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
          </div>
        ))}

        {generationStatus === "generating" && (
          <GenerationLoader currentStep={generationStep} />
        )}

        {generationStatus === "done" && (
          <GenerationDone onDownload={onDownload} />
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
