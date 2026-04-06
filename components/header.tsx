"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, Download, Globe } from "lucide-react"
import { useState } from "react"
import { BuyNowButton } from "./buy-now-button"
import { useCart } from "@/contexts/cart-context"
import { useTranslation } from "@/contexts/translation-context"
import { usePathname } from "next/navigation"

const locales = [
  { code: "us", label: "English (US)", flag: "🇺🇸" },
  { code: "gb", label: "English (UK)", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
]

export function Header({ lang }: { lang?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const { items, setIsOpen } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const t = useTranslation()
  const pathname = usePathname()

  const currentLocale = locales.find((l) => l.code === lang) || locales[0]

  const switchLocale = (newLang: string) => {
    // Replace current locale prefix with new one
    const segments = pathname.split("/")
    segments[1] = newLang
    window.location.href = segments.join("/") || `/${newLang}`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href={`/${lang || "us"}`} className="flex items-center gap-2 group">
              <Image
                src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                alt="CADLINK"
                width={140}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href={`/${lang || "us"}`} className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors">
                {t.header?.home}
              </Link>
              <Link
                href={`/${lang || "us"}/shipping-policy`}
                className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors"
              >
                {t.header?.shipping_policy}
              </Link>
              <Link href={`/${lang || "us"}/contact`} className="text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors">
                {t.header?.contact_us}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#0168A0] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <span className="text-lg">{currentLocale.flag}</span>
                <Globe className="w-4 h-4" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {locales.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => {
                        switchLocale(locale.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${locale.code === lang
                        ? "bg-[#0168A0]/5 text-[#0168A0] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-lg">{locale.flag}</span>
                      {locale.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.header?.live_status}</span>
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
              {t.header?.download}
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
            <Link href={`/${lang || "us"}`} className="text-lg font-bold text-gray-900">
              {t.header?.home}
            </Link>
            <Link href={`/${lang || "us"}/shipping-policy`} className="text-lg font-bold text-gray-900">
              {t.header?.shipping_policy}
            </Link>
            <Link href={`/${lang || "us"}/contact`} className="text-lg font-bold text-gray-900">
              {t.header?.contact_us}
            </Link>
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => switchLocale(locale.code)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${locale.code === lang
                    ? "bg-[#0168A0]/10 text-[#0168A0]"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-lg">{locale.flag}</span>
                </button>
              ))}
            </div>
            <BuyNowButton
              productId="prod_cadlink_v11"
              className="flex items-center justify-center gap-2 bg-[#0168A0] text-white py-4 rounded-xl font-bold"
            >
              <Download className="w-5 h-5" />
              {t.header?.download_software}
            </BuyNowButton>
          </div>
        </div>
      )}
    </header>
  )
}
