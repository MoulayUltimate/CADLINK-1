"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useState } from "react"
import { createCheckoutSession } from "@/app/actions/create-checkout"

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
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      const result = await createCheckoutSession(productId)
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        alert("Failed to initiate checkout. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBuyNow} disabled={isLoading} size={size} variant={variant} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now
          </>
        )
      )}
    </Button>
  )
}
