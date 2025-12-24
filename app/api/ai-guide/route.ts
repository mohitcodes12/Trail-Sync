import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({})

async function askGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })
  return response.text
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message?.toLowerCase() || ""

    let response = ""

    if (message.includes("safety") || message.includes("safe")) {
      response = `Trail Safety Tips:

- Always inform someone of your route and expected return time
- Check weather forecasts before departure
- Carry a first aid kit and know basic first aid
- Stay on marked trails to avoid getting lost
- Bring enough water and high-energy snacks
- Download offline maps before heading out

Stay safe out there!`
    } else if (message.includes("weather") || message.includes("rain") || message.includes("storm")) {
      response = `Weather Preparation:

- Check forecasts 24 hours before departure
- Pack rain gear and extra layers
- Watch for dark clouds and sudden temperature drops
- Seek shelter immediately if lightning is nearby
- Start early to avoid afternoon thunderstorms
- Have a backup plan if conditions worsen

Weather can change quickly in mountains - always be prepared!`
    } else if (message.includes("gear") || message.includes("equipment") || message.includes("pack")) {
      response = `Essential Gear Checklist:

- Proper hiking boots with ankle support
- Moisture-wicking clothing and layers
- Navigation tools (map, compass, GPS)
- Sun protection (hat, sunglasses, sunscreen)
- Headlamp with extra batteries
- Emergency shelter and fire starter
- Sufficient food and water

Pack smart, hike comfortable!`
    } else if (message.includes("water") || message.includes("hydrat")) {
      response = `Hydration Tips:

- Drink water regularly, not just when thirsty
- Carry at least 2 liters for day hikes
- Use water purification tablets or filters for natural sources
- Avoid drinking untreated water from streams
- Monitor urine color - light yellow means good hydration

Staying hydrated is crucial for a safe trek!`
    } else if (message.includes("rest") || message.includes("break") || message.includes("tired")) {
      response = `Rest & Recovery:

- Take short breaks every 45-60 minutes
- Find shaded spots with views for motivation
- Stretch your legs during longer breaks
- Have snacks to maintain energy levels
- Listen to your body - rest when needed
- Pace yourself to avoid exhaustion

Smart rest = enjoyable journey!`
    } else if (message.includes("wildlife") || message.includes("animal") || message.includes("bear")) {
      response = `Wildlife Awareness:

- Make noise on trails to avoid surprising animals
- Store food properly away from camp
- Keep a safe distance - use zoom lenses for photos
- Never feed wildlife
- Know what to do if you encounter common animals
- Carry bear spray in bear country

Respect wildlife and their habitat!`
    } else {
      try {
        response = await askGemini(
          `You are a helpful trekking and travel guide. User question: ${body.message}. Provide clear, practical advice.`
        )
      } catch (error) {
        response = `Trail Guide Tips:

Here are some general hiking recommendations:

- Plan your route and timing carefully
- Check local regulations and permits
- Follow Leave No Trace principles
- Hike with a buddy when possible
- Trust your instincts - turn back if needed

For specific advice about "${body.message}", I'm here to help with safety, gear, weather, hydration, and trail tips!

What would you like to know more about?`
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Guide error:", error)
    return NextResponse.json(
      { response: "I'm here to help with trail advice! Ask me about safety, gear, weather, or hiking tips." },
      { status: 200 },
    )
  }
}