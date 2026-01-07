"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

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
  const { addItem } = useCart()

  const handleBuyNow = async () => {
    setIsLoading(true)
    // Simulate a small delay for effect
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem({
      id: productId, // Use the passed productId
      name: "CADLINK Digital Factory 11 DTF Edition",
      price: 75.19,
      image: "/images/cadlink-product.png",
      quantity: 1,
    })
    toast.success("Added to cart")
    setIsLoading(false)
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
