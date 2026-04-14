"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

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
  const { addItem } = useCart()

  const handleBuyNow = async () => {
    try {
      const res = await fetch('/api/product')
      const product = await res.json()
      addItem({
        id: product.id || productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
      window.location.href = "/checkout"
    } catch (e) {
      window.location.href = "/checkout"
    }
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
