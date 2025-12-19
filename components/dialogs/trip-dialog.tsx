"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { db, type Trip } from "@/lib/db"
import { Plus, Trash2 } from "lucide-react"

interface TripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editTrip?: Trip
}

export function TripDialog({ open, onOpenChange, editTrip }: TripDialogProps) {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [type, setType] = useState<"trek" | "city" | "beach" | "snow">("trek")
  const [itinerary, setItinerary] = useState<Array<{ day: number; notes: string }>>([])

  useEffect(() => {
    if (editTrip) {
      setDestination(editTrip.destination)
      setStartDate(new Date(editTrip.startDate).toISOString().split("T")[0])
      setEndDate(new Date(editTrip.endDate).toISOString().split("T")[0])
      setType(editTrip.type)
      setItinerary(editTrip.itinerary)
    } else {
      setDestination("")
      setStartDate("")
      setEndDate("")
      setType("trek")
      setItinerary([])
    }
  }, [editTrip, open])

  const handleSave = async () => {
    if (!destination || !startDate || !endDate) return

    const tripData = {
      destination,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      type,
      itinerary,
    }

    if (editTrip) {
      await db.trips.update(editTrip.id, tripData)
    } else {
      await db.trips.add({
        id: crypto.randomUUID(),
        ...tripData,
        createdAt: Date.now(),
      })
    }

    onOpenChange(false)
  }

  const addDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, notes: "" }])
  }

  const updateDay = (index: number, notes: string) => {
    const updated = [...itinerary]
    updated[index].notes = notes
    setItinerary(updated)
  }

  const removeDay = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editTrip ? "Edit Trip" : "Create New Trip"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input
              placeholder="e.g., Everest Base Camp"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trek">Trek</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Itinerary</Label>
              <Button type="button" variant="outline" size="sm" onClick={addDay}>
                <Plus className="h-3 w-3 mr-1" />
                Add Day
              </Button>
            </div>
            {itinerary.map((day, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Day {day.day}</Label>
                  <Textarea
                    placeholder="Notes for this day..."
                    value={day.notes}
                    onChange={(e) => updateDay(index, e.target.value)}
                    rows={2}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="mt-6" onClick={() => removeDay(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!destination || !startDate || !endDate}>
            {editTrip ? "Save Changes" : "Create Trip"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
