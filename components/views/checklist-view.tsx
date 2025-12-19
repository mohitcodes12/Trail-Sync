"use client"

import { useEffect, useState } from "react"
import { Plus, Check, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { db, type ChecklistItem } from "@/lib/db"
import { generateChecklist } from "@/lib/checklist-generator"

export function ChecklistView() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItem, setNewItem] = useState("")

  const loadItems = async () => {
    const allItems = await db.checklist.toArray()
    setItems(allItems.sort((a, b) => a.createdAt - b.createdAt))
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleToggle = async (id: string, checked: boolean) => {
    await db.checklist.update(id, { checked })
    loadItems()
  }

  const handleAdd = async () => {
    if (!newItem.trim()) return
    await db.checklist.add({
      id: crypto.randomUUID(),
      item: newItem.trim(),
      checked: false,
      category: "custom",
      createdAt: Date.now(),
    })
    setNewItem("")
    loadItems()
  }

  const handleGenerateChecklist = async () => {
    const trips = await db.trips.toArray()
    if (trips.length === 0) return

    const latestTrip = trips.sort((a, b) => b.createdAt - a.createdAt)[0]
    const generatedItems = generateChecklist(latestTrip.type, latestTrip.itinerary.length)

    for (const item of generatedItems) {
      await db.checklist.add({
        id: crypto.randomUUID(),
        item: item.item,
        checked: false,
        category: item.category,
        createdAt: Date.now(),
      })
    }
    loadItems()
  }

  const checkedCount = items.filter((i) => i.checked).length
  const totalCount = items.length

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>,
  )

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Gear Checklist</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {totalCount > 0 ? `${checkedCount} of ${totalCount} items packed` : "Build your packing list"}
        </p>
      </div>

      {totalCount > 0 && (
        <Card className="p-4 mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-semibold min-w-[3rem] text-right">
              {totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add custom item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="shadow-sm"
        />
        <Button
          onClick={handleAdd}
          size="icon"
          className="shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-8 mb-6 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
            <Check className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-balance">No items yet</h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed text-pretty">
            Generate a smart checklist based on your trip type or add items manually
          </p>
          <Button
            onClick={handleGenerateChecklist}
            className="shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Generate Checklist
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-100 ${
                      item.checked ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked) => handleToggle(item.id, checked as boolean)}
                        className="transition-all duration-200"
                      />
                      <span
                        className={`flex-1 transition-all duration-300 ${
                          item.checked ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.item}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
