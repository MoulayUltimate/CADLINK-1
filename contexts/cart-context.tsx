"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    image: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(items))
        }
    }, [items, isMounted])

    const addItem = (newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id)
            if (existing) {
                // Don't increase quantity, just return existing items
                return prev
            }
            return [...prev, newItem]
        })
        setIsOpen(true)
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }

    const clearCart = () => {
        setItems([])
    }

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isOpen,
                setIsOpen,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
