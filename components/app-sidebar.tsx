"use client"

import {
  Sparkles,
  LayoutGrid,
  Settings,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Sparkles, label: "Create", active: true },
  { icon: LayoutGrid, label: "Browse", active: false },
]

export function AppSidebar() {
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-[#3D3D3D] bg-[#2D2D2D]">
      {/* Logo Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          {/* Templafy Logo - Geometric design with curves */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            {/* Top-left rounded square */}
            <rect x="4" y="4" width="9" height="9" rx="2" fill="white" />
            {/* Top-right rounded square */}
            <rect x="15" y="4" width="9" height="9" rx="2" fill="white" opacity="0.5" />
            {/* Bottom-left rounded square */}
            <rect x="4" y="15" width="9" height="9" rx="2" fill="white" opacity="0.5" />
            {/* Bottom-right rounded square */}
            <rect x="15" y="15" width="9" height="9" rx="2" fill="white" />
          </svg>
          <span className="font-sans text-[15px] font-semibold text-white">
            templafy
          </span>
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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#3355F5] rounded-r" />
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
