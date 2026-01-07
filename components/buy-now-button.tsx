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
    try {
      const res = await fetch('/api/product')
      const product = await res.json()

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      toast.success("Added to cart")
    } catch (err) {
      console.error('Failed to buy now', err)
      toast.error("Failed to add to cart")
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
