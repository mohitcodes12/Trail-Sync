import type { TripType } from "./db"

export function generateChecklist(tripType: TripType, days: number) {
  const baseItems = [
    { item: "Passport/ID", category: "documents" },
    { item: "Travel insurance", category: "documents" },
    { item: "Phone & charger", category: "electronics" },
    { item: "Power bank", category: "electronics" },
    { item: "First aid kit", category: "safety" },
    { item: "Medications", category: "safety" },
  ]

  const trekItems = [
    { item: "Hiking boots", category: "gear" },
    { item: "Backpack (40-60L)", category: "gear" },
    { item: "Trekking poles", category: "gear" },
    { item: "Water bottle/hydration pack", category: "gear" },
    { item: "Headlamp with batteries", category: "gear" },
    { item: "Rain jacket", category: "clothing" },
    { item: "Warm layers", category: "clothing" },
    { item: "Quick-dry shirts", category: "clothing" },
    { item: "Trekking pants", category: "clothing" },
    { item: "Sleeping bag", category: "gear" },
    { item: "Energy bars/snacks", category: "food" },
  ]

  const cityItems = [
    { item: "Comfortable walking shoes", category: "clothing" },
    { item: "Day pack", category: "gear" },
    { item: "City map/guidebook", category: "documents" },
    { item: "Camera", category: "electronics" },
    { item: "Casual outfits", category: "clothing" },
    { item: "Umbrella", category: "gear" },
  ]

  const beachItems = [
    { item: "Swimsuit", category: "clothing" },
    { item: "Sunscreen (SPF 50+)", category: "safety" },
    { item: "Sunglasses", category: "gear" },
    { item: "Beach towel", category: "gear" },
    { item: "Flip flops", category: "clothing" },
    { item: "Hat/cap", category: "clothing" },
    { item: "Reef-safe sunscreen", category: "safety" },
  ]

  const snowItems = [
    { item: "Winter jacket", category: "clothing" },
    { item: "Snow pants", category: "clothing" },
    { item: "Insulated gloves", category: "clothing" },
    { item: "Warm hat/beanie", category: "clothing" },
    { item: "Thermal underwear", category: "clothing" },
    { item: "Winter boots", category: "gear" },
    { item: "Hand warmers", category: "gear" },
    { item: "Lip balm", category: "safety" },
  ]

  let typeSpecificItems: typeof baseItems = []
  switch (tripType) {
    case "trek":
      typeSpecificItems = trekItems
      break
    case "city":
      typeSpecificItems = cityItems
      break
    case "beach":
      typeSpecificItems = beachItems
      break
    case "snow":
      typeSpecificItems = snowItems
      break
  }

  if (days > 3) {
    baseItems.push({ item: "Extra clothes", category: "clothing" })
    baseItems.push({ item: "Laundry bag", category: "gear" })
  }

  return [...baseItems, ...typeSpecificItems]
}
