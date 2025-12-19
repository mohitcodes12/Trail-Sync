"use client"

import { useEffect, useState } from "react"
import { MapContainer } from "@/components/map/map-container"
import { db, type Route } from "@/lib/db"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map } from "lucide-react"

export function MapView() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<string>("")

  useEffect(() => {
    const loadRoutes = async () => {
      const allRoutes = await db.routes.toArray()
      setRoutes(allRoutes)
      if (allRoutes.length > 0 && !selectedRouteId) {
        setSelectedRouteId(allRoutes[0].id)
      }
    }
    loadRoutes()
  }, [selectedRouteId])

  const selectedRoute = routes.find((r) => r.id === selectedRouteId)

  return (
    <div className="h-screen pb-16">
      <div className="p-5 bg-background/95 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2">
            <Map className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Trail Map</h1>
        </div>
        {routes.length > 0 ? (
          <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select a route" />
            </SelectTrigger>
            <SelectContent>
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 leading-relaxed">
            No routes available. Create one in the Routes tab to view it here.
          </div>
        )}
      </div>
      <MapContainer route={selectedRoute} />
    </div>
  )
}
