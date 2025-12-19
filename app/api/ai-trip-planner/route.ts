import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { tripName, destination, startDate, days } = await request.json()

    // Smart destination analysis
    const destinationLower = destination?.toLowerCase() || ""

    const isTrek =
      destinationLower.includes("mountain") ||
      destinationLower.includes("trek") ||
      destinationLower.includes("trail") ||
      destinationLower.includes("hike") ||
      destinationLower.includes("peak") ||
      destinationLower.includes("summit") ||
      destinationLower.includes("camp")

    const isBeach =
      destinationLower.includes("beach") ||
      destinationLower.includes("island") ||
      destinationLower.includes("coast") ||
      destinationLower.includes("sea") ||
      destinationLower.includes("ocean")

    const isCity =
      destinationLower.includes("city") ||
      destinationLower.includes("urban") ||
      destinationLower.includes("town") ||
      destinationLower.includes("metro")

    // Generate intelligent plan based on destination type
    let plan

    if (isTrek) {
      plan = generateTrekPlan(destination, days)
    } else if (isBeach) {
      plan = generateBeachPlan(destination, days)
    } else if (isCity) {
      plan = generateCityPlan(destination, days)
    } else {
      plan = generateGenericPlan(destination, days)
    }

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Trip planner error:", error)
    return NextResponse.json({ plan: [] }, { status: 200 })
  }
}

function generateTrekPlan(destination: string, days: number) {
  const trekActivities = [
    {
      title: "Arrival & Acclimatization",
      activities: [
        "Arrive at base location and check into accommodation",
        "Light orientation walk to adjust to altitude",
        "Gear check and final preparations",
        "Early dinner and rest for tomorrow's trek",
      ],
      notes: "Take it easy on day one. Proper acclimatization prevents altitude sickness.",
    },
    {
      title: "Trail Begins",
      activities: [
        "Early morning start (6-7 AM)",
        "Steady pace on marked trails",
        "Regular water and snack breaks",
        "Lunch at a scenic viewpoint",
        "Afternoon: Continue trek or explore camp area",
      ],
      notes: "Maintain a comfortable pace. The journey is as important as the destination.",
    },
    {
      title: "Deep Into Nature",
      activities: [
        "Morning: Wake up with sunrise views",
        "Trek through diverse terrain",
        "Photography and wildlife spotting",
        "Rest at key viewpoints",
        "Evening: Campfire and stargazing",
      ],
      notes: "Stay on marked trails and respect local regulations.",
    },
    {
      title: "Summit Day or Peak Experience",
      activities: [
        "Pre-dawn start for best conditions",
        "Gradual ascent with regular breaks",
        "Reach summit or highest viewpoint",
        "Celebrate and capture memories",
        "Careful descent back to camp",
      ],
      notes: "Safety first! Turn back if weather worsens or you feel unwell.",
    },
    {
      title: "Return Journey",
      activities: [
        "Final morning views and breakfast",
        "Pack up and begin descent",
        "Visit any missed spots on the way back",
        "Arrive at base by afternoon",
        "Hot meal and well-deserved rest",
      ],
      notes: "Descending requires focus too. Watch your step and enjoy the views.",
    },
  ]

  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...trekActivities[i % trekActivities.length],
  }))
}

function generateBeachPlan(destination: string, days: number) {
  const beachActivities = [
    {
      title: "Coastal Welcome",
      activities: [
        "Morning: Sunrise beach walk",
        "Check into beachside accommodation",
        "Afternoon: Swimming and beach relaxation",
        "Evening: Beachfront dinner with local seafood",
      ],
      notes: "Apply sunscreen regularly and stay hydrated!",
    },
    {
      title: "Water Adventures",
      activities: [
        "Morning: Snorkeling or diving excursion",
        "Explore coral reefs and marine life",
        "Beach picnic lunch",
        "Afternoon: Kayaking or paddleboarding",
        "Sunset viewing from the beach",
      ],
      notes: "Book water activities in advance during peak season.",
    },
    {
      title: "Island Exploration",
      activities: [
        "Boat tour to nearby islands",
        "Visit hidden beaches and coves",
        "Local market and cultural sites",
        "Beach volleyball or water sports",
        "Evening: Bonfire on the beach",
      ],
      notes: "Respect marine life and avoid touching coral reefs.",
    },
    {
      title: "Relaxation Day",
      activities: [
        "Sleep in and late breakfast",
        "Beach yoga or meditation",
        "Spa or massage by the ocean",
        "Leisurely swim and sunbathing",
        "Evening: Live music or beach party",
      ],
      notes: "A true vacation includes rest days!",
    },
  ]

  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...beachActivities[i % beachActivities.length],
  }))
}

function generateCityPlan(destination: string, days: number) {
  const cityActivities = [
    {
      title: "City Center Discovery",
      activities: [
        "Visit iconic landmarks and monuments",
        "Walking tour of historic districts",
        "Lunch at a popular local restaurant",
        "Museum or art gallery visit",
        "Evening: City lights and night photography",
      ],
      notes: "Get a transit pass for unlimited travel within the city.",
    },
    {
      title: "Cultural Immersion",
      activities: [
        "Morning: Local markets and street food",
        "Visit cultural and religious sites",
        "Traditional craft workshops",
        "Afternoon: Neighborhood exploration",
        "Attend local performance or show",
      ],
      notes: "Try to learn a few basic phrases in the local language!",
    },
    {
      title: "Hidden Gems",
      activities: [
        "Off-the-beaten-path neighborhoods",
        "Local cafes and artisan shops",
        "Street art and urban culture",
        "Rooftop views or observation deck",
        "Trendy dinner spot recommended by locals",
      ],
      notes: "Ask locals for recommendations - they know the best spots!",
    },
    {
      title: "Modern & Historic Blend",
      activities: [
        "Modern architecture and skyscrapers",
        "Shopping districts and boutiques",
        "Lunch at a fusion restaurant",
        "Historical museum or heritage site",
        "Farewell dinner at signature restaurant",
      ],
      notes: "Balance tourist attractions with authentic local experiences.",
    },
  ]

  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...cityActivities[i % cityActivities.length],
  }))
}

function generateGenericPlan(destination: string, days: number) {
  const genericActivities = [
    {
      title: `Welcome to ${destination}`,
      activities: [
        "Arrive and settle into accommodation",
        "Orientation walk around the area",
        "Visit local information center",
        "Dinner at a recommended restaurant",
      ],
      notes: "First day is for getting oriented and resting from travel.",
    },
    {
      title: "Main Attractions",
      activities: [
        "Visit top-rated attractions",
        "Guided tour or self-exploration",
        "Local cuisine for lunch",
        "Afternoon: Continue sightseeing",
        "Evening: Relaxed dinner and planning",
      ],
      notes: "Research attractions in advance and book tickets if needed.",
    },
    {
      title: "Local Experiences",
      activities: [
        "Interact with local culture",
        "Visit markets and local shops",
        "Try traditional activities",
        "Photography and exploration",
        "Sample regional specialties",
      ],
      notes: "Engage with locals to discover authentic experiences.",
    },
    {
      title: "Adventure & Relaxation",
      activities: [
        "Morning: Adventure activity or excursion",
        "Scenic spots and viewpoints",
        "Leisurely lunch",
        "Afternoon: Free time or spa",
        "Final evening memories",
      ],
      notes: "Balance activity with rest for an enjoyable trip.",
    },
  ]

  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...genericActivities[i % genericActivities.length],
  }))
}
