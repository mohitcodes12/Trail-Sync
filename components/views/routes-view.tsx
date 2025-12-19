"use client"

import { useEffect, useState } from "react"
import { Plus, Navigation, Trash2, Eye, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RouteDialog } from "@/components/dialogs/route-dialog"
import { RouteDetailDialog } from "@/components/dialogs/route-detail-dialog"
import { db, type Route } from "@/lib/db"

export function RoutesView() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailRoute, setDetailRoute] = useState<Route | undefined>()

  const loadRoutes = async () => {
    const allRoutes = await db.routes.toArray()
    setRoutes(allRoutes.sort((a, b) => b.createdAt - a.createdAt))
  }

  useEffect(() => {
    loadRoutes()
  }, [])

  const handleDelete = async (id: string) => {
    await db.routes.delete(id)
    await db.pins.where("routeId").equals(id).delete()
    loadRoutes()
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    loadRoutes()
  }

  return (
    <div className="relative">
      <div className="relative h-64 overflow-hidden">
        <img
          src="/winding-forest-trail-path-through-trees-aerial-vie.jpg"
          alt="Trail path"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-in fade-in duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-6 left-4 right-4 animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-5xl font-bold tracking-tight text-foreground drop-shadow-2xl text-balance">
            Trail Routes
          </h1>
          <p className="text-sm text-foreground/90 mt-3 drop-shadow-lg leading-relaxed max-w-md">
            Navigate offline with confidence
          </p>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto -mt-10 relative z-10">
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setDialogOpen(true)}
            size="icon"
            className="rounded-full h-14 w-14 shadow-2xl hover:shadow-accent/25 hover:scale-110 active:scale-95 transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="rounded-full bg-gradient-to-br from-accent/10 via-accent/5 to-primary/10 p-10 mb-8 backdrop-blur-sm border border-accent/20 shadow-xl">
              <Navigation className="h-14 w-14 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-balance">No routes saved</h3>
            <p className="text-sm text-muted-foreground mb-10 max-w-sm leading-relaxed text-pretty">
              Save trail routes with turn-by-turn instructions for offline replay
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 px-6 py-5 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Route
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => (
              <Card
                key={route.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1 hover:scale-[1.02] hover:border-accent/30 cursor-pointer group active:scale-100 animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-3 group-hover:from-accent/30 group-hover:to-primary/30 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Navigation className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-accent-foreground transition-colors leading-tight">
                      {route.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-semibold">
                        <ArrowRight className="h-3.5 w-3.5" />
                        {route.steps.length} step{route.steps.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-accent/10 hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all"
                      onClick={() => setDetailRoute(route)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-destructive/10 text-destructive hover:scale-110 active:scale-95 transition-all"
                      onClick={() => handleDelete(route.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <RouteDialog open={dialogOpen} onOpenChange={handleDialogClose} />
        <RouteDetailDialog route={detailRoute} onClose={() => setDetailRoute(undefined)} />
      </div>
    </div>
  )
}
