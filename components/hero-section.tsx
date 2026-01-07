"use client"

import { BuyNowButton } from "./buy-now-button"
import Image from "next/image"
import { Star, ShieldCheck, Zap } from "lucide-react"

import { useState, useEffect } from "react"

export function HeroSection() {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => setPrice(data.price))
      .catch(err => console.error('Failed to fetch price', err))
  }, [])

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0168A0]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4CAF50]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-[#0168A0]/5 border border-[#0168A0]/10 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4 text-[#0168A0] fill-[#0168A0]" />
              <span className="text-xs font-black text-[#0168A0] uppercase tracking-widest">Digital Factory 11</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">
              CADlink <br />
              <span className="text-[#0168A0]">Digital Factory 11</span>
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Complete Your Activation and Get Your License Key Now ! The industry standard for professional DTF printing.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-12">
              <div className="flex items-center gap-4">
                <BuyNowButton
                  productId="prod_cadlink_v11"
                  className="bg-[#0168A0] hover:bg-[#015580] text-white font-black px-12 py-7 text-xl rounded-2xl shadow-[0_20px_40px_-12px_rgba(1,104,160,0.5)] transition-all hover:-translate-y-1 active:scale-95"
                >
                  Buy Now
                </BuyNowButton>
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-black text-gray-900">${price ? price.toFixed(2) : '75.19'}</span>
                  <span className="text-sm font-bold text-gray-400 line-through">$800.00</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#00b67a] text-[#00b67a]" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 leading-none">Trustpilot</p>
                  <p className="text-xs font-bold text-gray-400">Excellent 4.9/5</p>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-[#0168A0]" strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 leading-none">Verified Partner</p>
                  <p className="text-xs font-bold text-gray-400">Official CADlink Reseller</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0168A0]/10 rounded-full blur-[100px] animate-pulse" />
              <Image
                src="/images/cadlink-product.png"
                alt="CADlink Digital Factory 11 Software Box"
                width={500}
                height={600}
                className="relative z-10 drop-shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-1000"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
