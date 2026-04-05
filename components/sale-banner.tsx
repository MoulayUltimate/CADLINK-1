"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { BuyNowButton } from "./buy-now-button"
import { useTranslation } from "@/contexts/translation-context"
import { useCurrency } from "@/hooks/use-currency"

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { activeLang, currency } = useCurrency()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const t = useTranslation()

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
        <span className="text-sm font-medium">{t.sale_banner?.sale_ends_in}</span>
        <div className="flex items-center gap-2 font-mono text-sm font-bold">
          <span>{timeLeft.days} {t.sale_banner?.days}</span>
          <span>:</span>
          <span>{timeLeft.hours} {t.sale_banner?.hours}</span>
          <span>:</span>
          <span>{timeLeft.minutes} {t.sale_banner?.minutes}</span>
          <span>:</span>
          <span>{timeLeft.seconds} {t.sale_banner?.seconds}</span>
        </div>
        <span className="text-sm font-bold ml-4">{t.sale_banner?.promo_text}</span>
        <BuyNowButton
          productId="prod_cadlink_v11"
          className="ml-4 bg-white text-[#4a7c9b] px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          {t.sale_banner?.download_now}
        </BuyNowButton>
      </div>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-white/40 font-mono hidden md:inline">
        [{activeLang}:{currency}]
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
