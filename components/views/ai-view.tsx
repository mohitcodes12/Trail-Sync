"use client"

import { useState, useEffect } from "react"
import { Sparkles, Map, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AITripPlanner } from "@/components/ai-trip-planner"
import { AIGuide } from "@/components/ai-guide"

type AIViewMode = "planner" | "guide"

export function AIView() {
  const [isOnline, setIsOnline] = useState(true)
  const [mode, setMode] = useState<AIViewMode>("planner")

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 bg-background/95 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2 animate-pulse-slow">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">Smart tools for your journey</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "planner" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("planner")}
            className="flex-1 shadow-sm hover:shadow-md transition-all"
          >
            <Map className="h-4 w-4 mr-1.5" />
            Trip Planner
          </Button>
          <Button
            variant={mode === "guide" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("guide")}
            className="flex-1 shadow-sm hover:shadow-md transition-all"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            AI Guide
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">{mode === "planner" ? <AITripPlanner /> : <AIGuide />}</div>
    </div>
  )
}
