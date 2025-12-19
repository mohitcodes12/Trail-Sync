"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db, type Route, type Pin, getPinType } from "@/lib/db"
import { Plus, Navigation2, MapPin } from "lucide-react"
import { PinDialog } from "./pin-dialog"

interface RouteDetailDialogProps {
  route?: Route
  onClose: () => void
}

export function RouteDetailDialog({ route, onClose }: RouteDetailDialogProps) {
  const [pins, setPins] = useState<Pin[]>([])
  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState(0)

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

  const handleAddPin = (stepIndex: number) => {
    setSelectedStep(stepIndex)
    setPinDialogOpen(true)
  }

  const handlePinDialogClose = () => {
    setPinDialogOpen(false)
    loadPins()
  }

  if (!route) return null

  return (
    <>
      <Dialog open={!!route} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 p-2.5">
                <Navigation2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <DialogTitle className="text-xl">{route.name}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
            <MapPin className="h-4 w-4" />
            <span>{route.steps.length} steps on this route</span>
          </div>

          <div className="space-y-4 py-2">
            {route.steps.map((step, index) => {
              const stepPins = pins.filter((p) => p.stepIndex === index)
              const isLastStep = index === route.steps.length - 1

              return (
                <div key={index} className="relative">
                  {!isLastStep && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-transparent -translate-x-1/2 z-0" />
                  )}

                  <Card className="p-4 hover:shadow-md transition-all duration-300 relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-sm border-2 border-primary/30">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm leading-relaxed flex-1">{step.instruction}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95 transition-all flex-shrink-0"
                            onClick={() => handleAddPin(index)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1 inline-block">
                          {step.lat.toFixed(6)}, {step.lng.toFixed(6)}
                        </p>

                        {stepPins.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {stepPins.map((pin) => {
                              const pinType = getPinType(pin.type)
                              const PinIcon = pinType.icon
                              return (
                                <div
                                  key={pin.id}
                                  className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-muted/70 border border-border/50 hover:bg-muted transition-colors"
                                >
                                  <div className="rounded p-1 bg-background">
                                    <PinIcon className="h-3.5 w-3.5 text-primary" />
                                  </div>
                                  <span className="flex-1 leading-relaxed">{pin.note || pinType.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
      <PinDialog
        open={pinDialogOpen}
        onOpenChange={handlePinDialogClose}
        routeId={route.id}
        stepIndex={selectedStep}
        coordinates={route.steps[selectedStep]}
      />
    </>
  )
}
