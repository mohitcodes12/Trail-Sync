import Dexie, { type Table } from "dexie"
import {
  Mountain,
  Building2,
  Waves,
  Snowflake,
  Eye,
  Coffee,
  Droplets,
  Utensils,
  AlertTriangle,
  StickyNote,
} from "lucide-react"

export type TripType = "trek" | "city" | "beach" | "snow"

export interface Trip {
  id: string
  destination: string
  startDate: number
  endDate: number
  type: TripType
  itinerary: Array<{ day: number; notes: string }>
  createdAt: number
}

export interface Route {
  id: string
  name: string
  steps: Array<{ instruction: string; lat: number; lng: number }>
  polyline: Array<[number, number]>
  createdAt: number
}

export type PinType = "viewpoint" | "rest" | "water" | "food" | "caution" | "note"

export interface Pin {
  id: string
  routeId: string
  stepIndex: number
  lat: number
  lng: number
  type: PinType
  note: string
  createdAt: number
}

export interface ChecklistItem {
  id: string
  item: string
  checked: boolean
  category: string
  createdAt: number
}

class TrailSyncDB extends Dexie {
  trips!: Table<Trip>
  routes!: Table<Route>
  pins!: Table<Pin>
  checklist!: Table<ChecklistItem>

  constructor() {
    super("TrailSyncDB")
    this.version(1).stores({
      trips: "id, createdAt",
      routes: "id, createdAt",
      pins: "id, routeId, stepIndex",
      checklist: "id, createdAt",
    })
  }
}

export const db = new TrailSyncDB()

export function getTripType(type: TripType) {
  const types = {
    trek: { icon: Mountain, label: "Trek" },
    city: { icon: Building2, label: "City" },
    beach: { icon: Waves, label: "Beach" },
    snow: { icon: Snowflake, label: "Snow" },
  }
  return types[type]
}

export function getPinType(type: PinType) {
  const types = {
    viewpoint: { icon: Eye, label: "View Point", color: "#3b82f6" },
    rest: { icon: Coffee, label: "Rest Spot", color: "#8b5cf6" },
    water: { icon: Droplets, label: "Water Source", color: "#06b6d4" },
    food: { icon: Utensils, label: "Food", color: "#f59e0b" },
    caution: { icon: AlertTriangle, label: "Caution", color: "#ef4444" },
    note: { icon: StickyNote, label: "Personal Note", color: "#10b981" },
  }
  return types[type]
}
