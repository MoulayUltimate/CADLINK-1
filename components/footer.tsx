import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] border-t-4 border-[#0168A0]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Information Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Refund and Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Terms and conditions
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  My account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-[#0168A0] transition-colors">
                  Contact Us
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
          <p className="text-sm text-muted-foreground">Copyright © 2025 CADlink . All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
