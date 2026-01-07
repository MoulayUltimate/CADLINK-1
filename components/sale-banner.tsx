"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-[#4a7c9b] text-white py-3 px-4 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <span className="text-sm font-medium">SALE ENDS IN:</span>
        <div className="flex items-center gap-2 font-mono text-sm font-bold">
          <span>{timeLeft.days} Days</span>
          <span>:</span>
          <span>{timeLeft.hours} Hours</span>
          <span>:</span>
          <span>{timeLeft.minutes} Minutes</span>
          <span>:</span>
          <span>{timeLeft.seconds} Seconds</span>
        </div>
        <span className="text-sm font-bold ml-4">USE CAD10 FOR 10% OFF NOW</span>
        <Link
          href="https://t.co/BfWNfWCCo5"
          className="ml-4 bg-white text-[#4a7c9b] px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Download now
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
