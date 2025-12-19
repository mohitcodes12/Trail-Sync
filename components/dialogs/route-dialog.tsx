"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/db"
import { Plus, Trash2 } from "lucide-react"

interface RouteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RouteDialog({ open, onOpenChange }: RouteDialogProps) {
  const [name, setName] = useState("")
  const [steps, setSteps] = useState<Array<{ instruction: string; lat: number; lng: number }>>([])

  const handleSave = async () => {
    if (!name || steps.length === 0) return

    await db.routes.add({
      id: crypto.randomUUID(),
      name,
      steps,
      polyline: steps.map((s) => [s.lng, s.lat]),
      createdAt: Date.now(),
    })

    setName("")
    setSteps([])
    onOpenChange(false)
  }

  const addStep = () => {
    setSteps([...steps, { instruction: "", lat: 0, lng: 0 }])
  }

  const updateStep = (index: number, field: "instruction" | "lat" | "lng", value: string | number) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Trail Route</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Route Name</Label>
            <Input placeholder="e.g., Annapurna Circuit Day 1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Route Steps</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-3 w-3 mr-1" />
                Add Step
              </Button>
            </div>
            {steps.map((step, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Step {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Turn right at the stone marker..."
                  value={step.instruction}
                  onChange={(e) => updateStep(index, "instruction", e.target.value)}
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Latitude</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="27.9881"
                      value={step.lat || ""}
                      onChange={(e) => updateStep(index, "lat", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Longitude</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="86.9250"
                      value={step.lng || ""}
                      onChange={(e) => updateStep(index, "lng", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || steps.length === 0}>
            Save Route
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
