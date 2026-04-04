"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/contexts/translation-context"

export function Footer() {
  const t = useTranslation()

  return (
    <footer className="bg-[#f5f5f5] border-t-4 border-[#0168A0]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Information Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t.footer?.information}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.privacy_policy}
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.refund_returns}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.terms_conditions}
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.faqs}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.shipping_policy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t.footer?.services}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.my_account}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.cart}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.checkout}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.wishlist}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t.footer?.contact}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  {t.footer?.contact_us}
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo Column */}
          <div className="flex justify-end items-start">
            <Link href="/">
              <Image
                src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                alt="CADLINK"
                width={180}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <p className="text-sm text-muted-foreground">{t.footer?.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
