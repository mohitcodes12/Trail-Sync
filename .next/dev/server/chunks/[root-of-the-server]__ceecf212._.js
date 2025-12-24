module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/ai-guide/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const body = await request.json();
        const message = body.message?.toLowerCase() || "";
        // Smart rule-based responses based on keywords
        let response = "";
        if (message.includes("safety") || message.includes("safe")) {
            response = `Trail Safety Tips:

• Always inform someone of your route and expected return time
• Check weather forecasts before departure
• Carry a first aid kit and know basic first aid
• Stay on marked trails to avoid getting lost
• Bring enough water and high-energy snacks
• Download offline maps before heading out

Stay safe out there!`;
        } else if (message.includes("weather") || message.includes("rain") || message.includes("storm")) {
            response = `Weather Preparation:

• Check forecasts 24 hours before departure
• Pack rain gear and extra layers
• Watch for dark clouds and sudden temperature drops
• Seek shelter immediately if lightning is nearby
• Start early to avoid afternoon thunderstorms
• Have a backup plan if conditions worsen

Weather can change quickly in mountains - always be prepared!`;
        } else if (message.includes("gear") || message.includes("equipment") || message.includes("pack")) {
            response = `Essential Gear Checklist:

• Proper hiking boots with ankle support
• Moisture-wicking clothing and layers
• Navigation tools (map, compass, GPS)
• Sun protection (hat, sunglasses, sunscreen)
• Headlamp with extra batteries
• Emergency shelter and fire starter
• Sufficient food and water

Pack smart, hike comfortable!`;
        } else if (message.includes("water") || message.includes("hydrat")) {
            response = `Hydration Tips:

• Drink water regularly, not just when thirsty
• Carry at least 2 liters for day hikes
• Use water purification tablets or filters for natural sources
• Avoid drinking untreated water from streams
• Monitor urine color - light yellow means good hydration

Staying hydrated is crucial for a safe trek!`;
        } else if (message.includes("rest") || message.includes("break") || message.includes("tired")) {
            response = `Rest & Recovery:

• Take short breaks every 45-60 minutes
• Find shaded spots with views for motivation
• Stretch your legs during longer breaks
• Have snacks to maintain energy levels
• Listen to your body - rest when needed
• Pace yourself to avoid exhaustion

Smart rest = enjoyable journey!`;
        } else if (message.includes("wildlife") || message.includes("animal") || message.includes("bear")) {
            response = `Wildlife Awareness:

• Make noise on trails to avoid surprising animals
• Store food properly away from camp
• Keep a safe distance - use zoom lenses for photos
• Never feed wildlife
• Know what to do if you encounter common animals
• Carry bear spray in bear country

Respect wildlife and their habitat!`;
        } else {
            response = `Trail Guide Tips:

Here are some general hiking recommendations:

• Plan your route and timing carefully
• Check local regulations and permits
• Follow Leave No Trace principles
• Hike with a buddy when possible
• Trust your instincts - turn back if needed

For specific advice about "${body.message}", I'm here to help with safety, gear, weather, hydration, and trail tips!

What would you like to know more about?`;
        }
        // Simulate natural response delay
        await new Promise((resolve)=>setTimeout(resolve, 800));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response
        });
    } catch (error) {
        console.error("Guide error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response: "I'm here to help with trail advice! Ask me about safety, gear, weather, or hiking tips."
        }, {
            status: 200
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ceecf212._.js.map