"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db, type Route, type Pin, getPinType } from "@/lib/db"
import { Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MapContainerProps {
  route?: Route
}

export function MapContainer({ route }: MapContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    viewpoint: true,
    rest: true,
    water: true,
    food: true,
    caution: true,
    note: true,
  })

  useEffect(() => {
    if (route) {
      loadPins()
    }
  }, [route])

  const loadPins = async () => {
    if (!route) return
    const routePins = await db.pins.where("routeId").equals(route.id).toArray()
    setPins(routePins)
  }

  useEffect(() => {
    if (!route || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-muted").trim()
    ctx.fillRect(0, 0, width, height)

    if (route.steps.length === 0) return

    const lats = route.steps.map((s) => s.lat)
    const lngs = route.steps.map((s) => s.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const padding = 40
    const scaleX = (width - 2 * padding) / (maxLng - minLng || 1)
    const scaleY = (height - 2 * padding) / (maxLat - minLat || 1)

    const toX = (lng: number) => padding + (lng - minLng) * scaleX
    const toY = (lat: number) => height - padding - (lat - minLat) * scaleY

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    route.steps.forEach((step, i) => {
      const x = toX(step.lng)
      const y = toY(step.lat)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    route.steps.forEach((step, i) => {
      const x = toX(step.lng)
      const y = toY(step.lat)
      ctx.fillStyle = i === 0 ? "#22c55e" : i === route.steps.length - 1 ? "#ef4444" : "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    const filteredPins = pins.filter((pin) => filters[pin.type])
    filteredPins.forEach((pin) => {
      const x = toX(pin.lng)
      const y = toY(pin.lat)
      const pinType = getPinType(pin.type)
      ctx.fillStyle = pinType.color
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [route, pins, filters])

  if (!route) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a route to view the map</p>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
      <div className="absolute top-4 right-4">
        <Button variant="secondary" size="icon" onClick={() => setFilterOpen(!filterOpen)}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      {filterOpen && (
        <Card className="absolute top-16 right-4 p-4 space-y-2 w-48">
          <p className="text-sm font-medium mb-2">Filter Pins</p>
          {Object.entries(filters).map(([key, value]) => {
            const pinType = getPinType(key as any)
            return (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, [key]: checked as boolean }))}
                />
                <Label htmlFor={key} className="text-xs cursor-pointer">
                  {pinType.label}
                </Label>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}
