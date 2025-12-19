"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, type PinType } from "@/lib/db"

interface PinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId: string
  stepIndex: number
  coordinates: { lat: number; lng: number }
}

export function PinDialog({ open, onOpenChange, routeId, stepIndex, coordinates }: PinDialogProps) {
  const [type, setType] = useState<PinType>("viewpoint")
  const [note, setNote] = useState("")

  const handleSave = async () => {
    await db.pins.add({
      id: crypto.randomUUID(),
      routeId,
      stepIndex,
      lat: coordinates.lat,
      lng: coordinates.lng,
      type,
      note,
      createdAt: Date.now(),
    })

    setType("viewpoint")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Trail Pin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Pin Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PinType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewpoint">View Point</SelectItem>
                <SelectItem value="rest">Rest Spot</SelectItem>
                <SelectItem value="water">Water Source</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="caution">Caution</SelectItem>
                <SelectItem value="note">Personal Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Note (Optional)</Label>
            <Textarea
              placeholder="Add details about this location..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Pin</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
