"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, Download } from "lucide-react"
import { useState } from "react"
import { BuyNowButton } from "./buy-now-button"

import { useCart } from "@/contexts/cart-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items, setIsOpen } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                alt="CADLINK"
                width={140}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors">
                Home
              </Link>
              <Link
                href="/shipping-policy"
                className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors"
              >
                Shipping Policy
              </Link>
              <Link href="/contact" className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Status</span>
            </div>

            <button onClick={() => setIsOpen(true)} className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-900 group-hover:text-[#0168A0] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0168A0] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            <BuyNowButton
              productId="prod_cadlink_v11"
              className="hidden md:flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download
            </BuyNowButton>

            <button className="lg:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white py-6 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 flex flex-col gap-6">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Home
            </Link>
            <Link href="/shipping-policy" className="text-lg font-bold text-gray-900">
              Shipping Policy
            </Link>
            <Link href="/contact" className="text-lg font-bold text-gray-900">
              Contact Us
            </Link>
            <BuyNowButton
              productId="prod_cadlink_v11"
              className="flex items-center justify-center gap-2 bg-[#0168A0] text-white py-4 rounded-xl font-bold"
            >
              <Download className="w-5 h-5" />
              Download Software
            </BuyNowButton>
          </div>
        </div>
      )}
    </header>
  )
}
