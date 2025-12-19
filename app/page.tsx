"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { TripsView } from "@/components/views/trips-view"
import { RoutesView } from "@/components/views/routes-view"
import { MapView } from "@/components/views/map-view"
import { ChecklistView } from "@/components/views/checklist-view"
import { AIView } from "@/components/views/ai-view"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function Home() {
  const [activeView, setActiveView] = useState<"trips" | "routes" | "map" | "checklist" | "ai">("trips")

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration can fail in preview environments - this is expected
      })
    }
  }, [])

  const handleViewChange = (view: "trips" | "routes" | "map" | "checklist" | "ai") => {
    setActiveView(view)
  }

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-amber-50/30 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900">
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none">
        <div className="absolute inset-0 bg-[url('/beautiful-mountain-landscape-at-sunrise-with-hikin.jpg')] bg-cover bg-center mix-blend-overlay" />
      </div>

      <OfflineIndicator />

      <div className="relative z-10">
        {activeView === "trips" && (
          <div className="animate-in fade-in duration-300">
            <TripsView />
          </div>
        )}
        {activeView === "routes" && (
          <div className="animate-in fade-in duration-300">
            <RoutesView />
          </div>
        )}
        {activeView === "map" && (
          <div className="animate-in fade-in duration-300">
            <MapView />
          </div>
        )}
        {activeView === "checklist" && (
          <div className="animate-in fade-in duration-300">
            <ChecklistView />
          </div>
        )}
        {activeView === "ai" && (
          <div className="animate-in fade-in duration-300">
            <AIView />
          </div>
        )}
      </div>

      <BottomNav activeView={activeView} onViewChange={handleViewChange} />
    </main>
  )
}
