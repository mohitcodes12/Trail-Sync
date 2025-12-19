"use client"

import { useEffect, useState } from "react"
import { Plus, MapPin, Calendar, Trash2, Edit, Mountain, Building2, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TripDialog } from "@/components/dialogs/trip-dialog"
import { db, type Trip } from "@/lib/db"

export function TripsView() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>()

  const loadTrips = async () => {
    const allTrips = await db.trips.toArray()
    setTrips(allTrips.sort((a, b) => b.createdAt - a.createdAt))
  }

  useEffect(() => {
    loadTrips()
  }, [])

  const handleDelete = async (id: string) => {
    await db.trips.delete(id)
    loadTrips()
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingTrip(undefined)
    loadTrips()
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const getTripIcon = (type: string) => {
    switch (type) {
      case "trek":
        return Mountain
      case "city":
        return Building2
      case "beach":
        return Waves
      default:
        return MapPin
    }
  }

  return (
    <div className="relative">
      <div className="relative h-64 overflow-hidden">
        <img
          src="/beautiful-mountain-landscape-at-sunrise-with-hikin.jpg"
          alt="Mountain landscape"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-in fade-in duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-6 left-4 right-4 animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-5xl font-bold tracking-tight text-foreground drop-shadow-2xl text-balance">My Trips</h1>
          <p className="text-sm text-foreground/90 mt-3 drop-shadow-lg leading-relaxed max-w-md">
            Plan your next adventure
          </p>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto -mt-10 relative z-10">
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleOpenDialog}
            size="icon"
            type="button"
            className="rounded-full h-14 w-14 shadow-2xl hover:shadow-primary/25 hover:scale-110 active:scale-95 transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-10 mb-8 backdrop-blur-sm border border-primary/20 shadow-xl">
              <MapPin className="h-14 w-14 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-balance">No trips yet</h3>
            <p className="text-sm text-muted-foreground mb-10 max-w-sm leading-relaxed text-pretty">
              Start planning your next adventure by creating your first trip
            </p>
            <Button
              onClick={handleOpenDialog}
              type="button"
              className="shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 px-6 py-5 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip, index) => {
              const TripIcon = getTripIcon(trip.type)
              return (
                <Card
                  key={trip.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/30 cursor-pointer group active:scale-100 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:scale-110 transition-all duration-300 shadow-md">
                      <TripIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors leading-tight">
                        {trip.destination}
                      </h3>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="capitalize px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {trip.type}
                        </span>
                      </div>
                      {trip.itinerary.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                          {trip.itinerary.length} day{trip.itinerary.length !== 1 ? "s" : ""} planned
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(trip)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-9 w-9 hover:bg-destructive/10 text-destructive hover:scale-110 active:scale-95 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(trip.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <TripDialog open={dialogOpen} onOpenChange={handleDialogClose} editTrip={editingTrip} />
      </div>
    </div>
  )
}
