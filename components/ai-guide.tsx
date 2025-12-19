"use client"

import { useState, useEffect } from "react"
import { Send, Sparkles, WifiOff, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function AIGuide() {
  const [isOnline, setIsOnline] = useState(true)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

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

  const handleSend = async () => {
    if (!input.trim() || !isOnline) return

    const userMessage = input.trim()
    console.log("[v0] Sending AI guide message:", userMessage)
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch("/api/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      console.log("[v0] AI guide response received")
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("[v0] Guide error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here to help with trail advice! Ask me about safety, gear, weather, and hiking tips.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full pb-4">
      {!isOnline && (
        <Card className="m-4 p-4 bg-amber-500/10 border-amber-500/30 shadow-md">
          <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
            <WifiOff className="h-5 w-5" />
            <p className="text-sm leading-relaxed">AI Guide requires an internet connection</p>
          </div>
        </Card>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-8 mb-6 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-pulse-slow">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-balance">Your Trail Companion</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed text-pretty mb-6">
              Get smart recommendations about safety, gear, weather, and trail tips
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {["Safety tips", "Gear checklist", "Weather prep", "Hydration guide"].map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(prompt)}
                  disabled={!isOnline}
                  className="shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <Compass className="h-3 w-3 mr-1.5" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <Card
                className={`p-4 max-w-[85%] shadow-md ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </Card>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <Card className="p-4 bg-muted border border-border shadow-md">
              <div className="flex gap-1.5">
                {[0, 150, 300].map((delay, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <Input
            placeholder={isOnline ? "Ask about your trail..." : "Offline - AI unavailable"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!isOnline}
            className="shadow-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!isOnline || !input.trim() || loading}
            className="shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
