"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { Check, Star } from "lucide-react"
import Image from "next/image"

export function ProductCardSection() {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: "prod_cadlink_v11",
      name: "CADLINK Digital Factory 11 DTF Edition",
      price: 75.19,
      image: "/images/cadlink-product.png",
      quantity: quantity,
    })
    toast.success("Added to cart")
  }

  return (
    <section className="py-20 bg-white" id="product">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Section - Product Image */}
              <div className="bg-[#F8FAFC] p-6 md:p-16 flex items-center justify-center relative">
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#00b67a] text-[#00b67a]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">4.9/5</span>
                  </div>
                </div>
                <div className="relative z-10 w-full max-w-[450px]">
                  <Image
                    src="/images/cadlink-product.png"
                    alt="CADLINK Digital Factory 11 DTF"
                    width={600}
                    height={600}
                    className="w-full h-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.15)]"
                    priority
                  />
                </div>
              </div>

              {/* Right Section - Product Details */}
              <div className="p-6 md:p-16 flex flex-col">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#0168A0]/10 text-[#0168A0] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      Official License
                    </span>
                    <div className="flex items-center gap-1.5 text-[#4CAF50] text-sm font-bold">
                      <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
                      In Stock & Ready
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                    CADLINK Digital Factory 11 DTF Edition
                  </h2>
                  <p className="text-gray-500 leading-relaxed">
                    The world's most powerful DTF RIP software. Engineered for precision color management and high-volume
                    production.
                  </p>
                </div>

                {/* Price Section */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Special Offer Price</span>
                    <span className="bg-[#4CAF50] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">SAVE 90%</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-gray-900">$75.19</span>
                    <span className="text-lg text-gray-400 line-through font-medium">$800.00</span>
                  </div>
                </div>

                {/* Quantity & Action */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center justify-between bg-white border-2 border-gray-100 rounded-xl overflow-hidden h-[56px]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-14 h-full flex items-center justify-center text-xl font-bold text-gray-400 hover:text-[#0168A0] hover:bg-gray-50 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        readOnly
                        className="w-12 h-full text-center font-bold text-gray-900 bg-transparent focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                        className="w-14 h-full flex items-center justify-center text-xl font-bold text-gray-400 hover:text-[#0168A0] hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      // Mobile optimized button size
                      className="flex-1 w-full h-[64px] sm:h-[56px] bg-[#0168A0] hover:bg-[#015580] text-white text-lg sm:text-base font-bold rounded-xl shadow-[0_12px_24px_-8px_rgba(1,104,160,0.4)] transition-all hover:-translate-y-0.5"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tight">
                      <Check className="w-4 h-4 text-[#4CAF50]" strokeWidth={3} />
                      Instant Key Delivery
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tight">
                      <Check className="w-4 h-4 text-[#4CAF50]" strokeWidth={3} />
                      Lifetime Activation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}