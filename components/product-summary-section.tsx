"use client"

import { Check, Star, Download, ShieldCheck, Clock, Zap } from "lucide-react"
import { BuyNowButton } from "./buy-now-button"
import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/translation-context"
import { useCurrency } from "@/hooks/use-currency"

export function ProductSummarySection() {
  const [price, setPrice] = useState<number>(75.19)
  const t = useTranslation()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => setPrice(data.price))
      .catch(err => console.error('Failed to fetch price', err))
  }, [])

  const icons = [
    <Clock key="clock" className="w-5 h-5 text-[#0168A0]" />,
    <Zap key="zap" className="w-5 h-5 text-[#0168A0]" />,
    <Download key="download" className="w-5 h-5 text-[#0168A0]" />,
    <Check key="check" className="w-5 h-5 text-[#0168A0]" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-[#0168A0]" />,
    <Star key="star" className="w-5 h-5 text-[#0168A0]" />,
  ]

  const features = (t.product_summary?.features || []).map((text: string, i: number) => ({
    icon: icons[i],
    text,
  }))

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F8FAFC] rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              {t.product_summary?.title} <br />
              <span className="text-[#0168A0]">{t.product_summary?.subtitle}</span>
            </h2>

            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">4.9/5</span>
                <span className="text-xs text-gray-400 font-medium ml-1">{t.product_summary?.reviews_count}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-10 max-w-3xl mx-auto">
              {features.map((feature: any, index: number) => (
                <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100">
                  <div className="mt-0.5 bg-[#0168A0]/10 p-2 rounded-lg flex-shrink-0">{feature.icon}</div>
                  <p className="text-gray-700 font-medium leading-snug">{feature.text}</p>
                </div>
              ))}
            </div>

            <BuyNowButton
              productId="prod_cadlink_v11"
              className="w-full md:w-auto bg-[#0168A0] hover:bg-[#015580] text-white font-black px-12 py-6 text-xl rounded-2xl shadow-[0_20px_40px_-12px_rgba(1,104,160,0.5)] transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.product_summary?.get_it_now} - {formatPrice(price)}
            </BuyNowButton>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              {t.product_summary?.instant_delivery_footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
