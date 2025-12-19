"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, MapPin, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { db } from "@/lib/db"

interface PlannerFormData {
  tripName: string
  startDate: string
  duration: string
  destination: string
}

interface DayPlan {
  day: number
  title: string
  activities: string[]
  notes: string
}

export function AITripPlanner() {
  const [formData, setFormData] = useState<PlannerFormData>({
    tripName: "",
    startDate: "",
    duration: "",
    destination: "",
  })
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<DayPlan[] | null>(null)
  const [saved, setSaved] = useState(false)

  const handleGenerate = async () => {
    if (!formData.tripName || !formData.startDate || !formData.duration || !formData.destination) return

    console.log("[v0] Generating trip plan:", formData)
    setLoading(true)
    setSaved(false)
    setPlan(null)

    try {
      const days = Number.parseInt(formData.duration)

      // Call smart planning endpoint (uses rule-based logic)
      const response = await fetch("/api/ai-trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripName: formData.tripName,
          destination: formData.destination,
          startDate: formData.startDate,
          days,
        }),
      })

      const data = await response.json()
      console.log("[v0] Trip plan generated:", data.plan?.length, "days")
      setPlan(data.plan || [])
    } catch (error) {
      console.error("[v0] Trip planner error:", error)
      setPlan([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTrip = async () => {
    if (!plan) return

    console.log("[v0] Saving trip to database")
    const startDate = new Date(formData.startDate).getTime()
    const duration = Number.parseInt(formData.duration)
    const endDate = startDate + duration * 24 * 60 * 60 * 1000

    await db.trips.add({
      id: crypto.randomUUID(),
      destination: formData.destination,
      startDate,
      endDate,
      type: "trek",
      itinerary: plan.map((day) => ({
        day: day.day,
        notes: `${day.title}\n\n${day.activities.map((a) => `• ${a}`).join("\n")}${day.notes ? `\n\n${day.notes}` : ""}`,
      })),
      createdAt: Date.now(),
    })

    console.log("[v0] Trip saved successfully")
    setSaved(true)
  }

  return (
    <div className="space-y-6 p-5 pb-20">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-4 mb-4 animate-pulse-slow">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Plan Your Adventure</h2>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty max-w-md mx-auto">
          Tell us about your journey and we'll create a personalized day-by-day itinerary
        </p>
      </div>

      {!plan ? (
        <Card className="p-6 space-y-5 shadow-lg border-2 hover:shadow-xl transition-shadow">
          <div className="space-y-2">
            <Label htmlFor="tripName" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Trip Name
            </Label>
            <Input
              id="tripName"
              placeholder="e.g., Himalayan Adventure"
              value={formData.tripName}
              onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Everest Base Camp, Nepal"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                placeholder="e.g., 7"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="shadow-sm"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={
              loading || !formData.tripName || !formData.startDate || !formData.duration || !formData.destination
            }
            className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating your plan...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Plan
              </>
            )}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-2 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{formData.tripName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {formData.destination}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(formData.startDate).toLocaleDateString()} • {formData.duration} days
                </p>
              </div>
              {saved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            {plan.map((day) => (
              <Card
                key={day.day}
                className="p-5 shadow-md hover:shadow-lg transition-all border hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary border-2 border-primary/20">
                    {day.day}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold text-base">{day.title}</h4>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{activity}</span>
                        </li>
                      ))}
                    </ul>
                    {day.notes && (
                      <p className="text-xs text-muted-foreground italic bg-muted/50 p-3 rounded-lg">{day.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setPlan(null)
                setSaved(false)
              }}
              className="flex-1 shadow-sm hover:shadow-md transition-all"
            >
              Create New Plan
            </Button>
            <Button
              onClick={handleSaveTrip}
              disabled={saved}
              className="flex-1 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved to Trips
                </>
              ) : (
                "Save to Trips"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
