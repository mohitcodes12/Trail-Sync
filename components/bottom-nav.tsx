"use client"

import { Map, ListChecks, MessageSquare, Compass, Backpack } from "lucide-react"

interface BottomNavProps {
  activeView: "trips" | "routes" | "map" | "checklist" | "ai"
  onViewChange: (view: "trips" | "routes" | "map" | "checklist" | "ai") => void
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: "trips" as const, icon: Backpack, label: "Trips" },
    { id: "routes" as const, icon: Compass, label: "Routes" },
    { id: "map" as const, icon: Map, label: "Map" },
    { id: "checklist" as const, icon: ListChecks, label: "Checklist" },
    { id: "ai" as const, icon: MessageSquare, label: "AI Guide" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-2xl border-t border-border/50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              type="button"
              className={`
                flex flex-col items-center justify-center gap-1 flex-1 h-full 
                transition-all duration-300 ease-out rounded-xl relative
                active:scale-95
                ${isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105"}
              `}
            >
              <div className={`relative transition-all duration-300 ${isActive ? "scale-110" : ""}`}>
                <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? "drop-shadow-glow" : ""}`} />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full -z-10 animate-pulse-slow" />
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-300 ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full shadow-lg shadow-primary/50 animate-in fade-in slide-in-from-bottom-2 duration-300" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
