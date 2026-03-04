"use client"

import { Search, Bell } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-[15px] font-medium text-foreground">
          AI Assistant
        </h2>
        <span className="rounded-full bg-primary/[0.08] px-2 py-0.5 text-[11px] font-semibold text-primary">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          aria-label="Search"
        >
          <Search size={16} strokeWidth={1.5} />
        </button>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/[0.08] text-xs font-semibold text-primary">
          JD
        </div>
      </div>
    </header>
  )
}
