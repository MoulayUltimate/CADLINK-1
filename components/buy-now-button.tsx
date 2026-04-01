"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

const PAYMENT_LINK = "https://buy.stripe.com/00w4gy0uffWyelu19h5wI00"

interface BuyNowButtonProps {
  productId: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

export function BuyNowButton({
  productId,
  size = "default",
  variant = "default",
  className,
  children,
}: BuyNowButtonProps) {
  const handleBuyNow = () => {
    window.open(PAYMENT_LINK, "_blank")
  }

  return (
    <Button onClick={handleBuyNow} size={size} variant={variant} className={className}>
      {children || (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now
        </>
      )}
    </Button>
  )
}
