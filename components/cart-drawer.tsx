"use client"

import { useCart } from "@/contexts/cart-context"
import { X, Minus, Plus, ShoppingBag, Trash2, Lock } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createCheckoutSession } from "@/app/actions/create-checkout"

export function CartDrawer() {
    const { items, removeItem, updateQuantity, isOpen, setIsOpen, subtotal } = useCart()
    const [isLoading, setIsLoading] = useState(false)

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const handleCheckout = () => {
        setIsOpen(false)
        window.location.href = "/checkout"
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#0168A0]" />
                        <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
                        <span className="bg-[#0168A0]/10 text-[#0168A0] text-xs font-bold px-2 py-1 rounded-full">
                            {items.length} items
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
                                <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#0168A0] font-bold text-sm hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                                            <p className="text-[#0168A0] font-bold mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold text-[#4CAF50]">Free</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-black border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-900">Total</span>
                                <span className="text-[#0168A0]">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0168A0]/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Secure Checkout
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            Guaranteed Safe & Secure Checkout
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
