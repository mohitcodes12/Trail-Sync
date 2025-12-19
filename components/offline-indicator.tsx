"use client"

import { useEffect, useState } from "react"
import { WifiOff, Check } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShow(true)
      setTimeout(() => setShow(false), 3000)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setShow(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!show && isOnline) return null

  return (
    <div
      className={`
      fixed top-0 left-0 right-0 z-50 
      transition-transform duration-500 ease-out
      ${show ? "translate-y-0" : "-translate-y-full"}
      ${isOnline ? "bg-emerald-500" : "bg-amber-500"}
    `}
    >
      <div className="py-3 px-4 flex items-center justify-center gap-2 max-w-lg mx-auto">
        {isOnline ? (
          <>
            <Check className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Back online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">You're good — offline mode active</span>
          </>
        )}
      </div>
    </div>
  )
}
