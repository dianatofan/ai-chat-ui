"use client"

import { Download, Maximize2 } from "lucide-react"

interface PresentationPreviewProps {
  title: string
}

export function PresentationPreview({ title }: PresentationPreviewProps) {
  // Generate varied slide content based on title
  const slides = [
    {
      type: "title",
      title: title,
      subtitle: "A comprehensive overview",
    },
    {
      type: "content",
      title: "Key Objectives",
      bullets: [
        "Understand core concepts and principles",
        "Identify key stakeholders and their needs",
        "Establish clear goals and deliverables",
      ],
    },
    {
      type: "content",
      title: "Current Status & Insights",
      bullets: [
        "Progress tracking and milestones achieved",
        "Key metrics and performance indicators",
        "Risk assessment and mitigation strategies",
      ],
    },
  ]

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-light-200)]">
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-card-foreground truncate max-w-xs">{title}</h3>
            <p className="text-xs text-muted-foreground">Preview • Auto-generated • 3 slides</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted-foreground transition-colors hover:text-foreground">
              <Maximize2 size={18} strokeWidth={1.5} opacity={0.7} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted-foreground transition-colors hover:text-foreground">
              <Download size={18} strokeWidth={1.5} opacity={0.7} />
            </button>
          </div>
        </div>

        {/* Preview Slides Grid */}
        <div className="p-6 bg-card/50">
          <div className="grid grid-cols-3 gap-4">
            {/* Slide 1 - Title Slide */}
            <div className="group cursor-pointer rounded-lg border border-border bg-white overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-light-100)] hover:border-primary/20">
              <div className="aspect-video bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

                <div className="text-center relative z-10">
                  <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Presentation</p>
                  <h2 className="text-white font-bold text-sm leading-tight line-clamp-3">{title}</h2>
                  <p className="text-white/60 text-xs mt-2">Auto-generated content</p>
                </div>
              </div>
              <div className="bg-white px-3 py-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground font-medium">Title Slide</p>
              </div>
            </div>

            {/* Slide 2 - Content with Bullets */}
            <div className="group cursor-pointer rounded-lg border border-border bg-white overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-light-100)] hover:border-primary/20">
              <div className="aspect-video bg-white p-4 flex flex-col gap-3">
                {/* Header */}
                <div>
                  <div className="h-2.5 w-2/3 rounded-sm bg-primary mb-1" />
                  <div className="h-px w-full bg-primary/10" />
                </div>

                {/* Bullet points */}
                <div className="space-y-2 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/70 flex-shrink-0 mt-1" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full rounded-sm bg-primary/10" />
                        <div className="h-1.5 w-4/5 rounded-sm bg-primary/5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer accent */}
                <div className="h-px w-full bg-primary/5" />
              </div>
              <div className="bg-white px-3 py-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground font-medium">Slide 2 • Key Points</p>
              </div>
            </div>

            {/* Slide 3 - Content with Different Layout */}
            <div className="group cursor-pointer rounded-lg border border-border bg-white overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-light-100)] hover:border-primary/20">
              <div className="aspect-video bg-white p-4 flex flex-col gap-2">
                {/* Title */}
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-primary" />
                  <div className="h-2 w-1/3 rounded-sm bg-primary" />
                </div>

                {/* Two column layout with stats */}
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {/* Left column */}
                  <div className="space-y-2">
                    <div className="h-8 rounded bg-primary/20 flex items-center justify-center">
                      <div className="h-1.5 w-3/5 bg-primary/40 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1 w-full bg-primary/10 rounded" />
                      <div className="h-1 w-5/6 bg-primary/10 rounded" />
                      <div className="h-1 w-4/5 bg-primary/10 rounded" />
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-2">
                    <div className="h-8 rounded bg-primary/15 flex items-center justify-center">
                      <div className="h-1.5 w-2/3 bg-primary/30 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1 w-full bg-primary/10 rounded" />
                      <div className="h-1 w-4/5 bg-primary/10 rounded" />
                      <div className="h-1 w-3/5 bg-primary/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-3 py-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground font-medium">Slide 3 • Details</p>
              </div>
            </div>
          </div>

          {/* Slide Counter */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === 0 ? "w-6 bg-primary" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Preview Footer */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Ready to customize</p>
            <p className="text-xs text-muted-foreground">Click slides to edit content</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:opacity-90 active:scale-95">
            Edit & Download
          </button>
        </div>
      </div>
    </div>
  )
}

