"use client"

import Image from "next/image"
import {
  Sparkles,
  LayoutGrid,
  Settings,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Sparkles, label: "Templates", active: true },
  { icon: LayoutGrid, label: "Recents", active: false },
]

export function AppSidebar() {
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-[#3D3D3D] bg-[#2D2D2D]">
      {/* Logo Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          {/* Templafy Logo */}
          <Image
            src="/ai-chat-ui/Logo.png"
            alt="Templafy Logo"
            width={94}
            height={94}
            className="flex-shrink-0 brightness-200 contrast-150"
          />
        </div>
        <button className="text-[#757575] hover:text-white transition-colors">
          <ChevronDown size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "relative flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              item.active
                ? "bg-[#3D4757] text-white"
                : "text-[#808080] hover:text-[#B0B0B0]"
            )}
          >
            {item.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3355F5] rounded-l shadow-[inset_4px_0_0_rgba(0,0,0,0.3)]" />
            )}
            <item.icon size={16} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile & Settings */}
      <div className="border-t border-[#3D3D3D] px-3 py-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-sm text-[#808080] transition-all hover:text-white hover:bg-[#373737]">
          <Settings size={16} strokeWidth={1.5} />
          <span>Profile & Settings</span>
        </button>
      </div>
    </aside>
  )
}
