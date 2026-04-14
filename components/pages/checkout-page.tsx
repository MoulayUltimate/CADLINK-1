"use client"

import { useState, useEffect } from "react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { useCart } from "@/contexts/cart-context"
import { Loader2, ShoppingCart, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CheckoutPage() {
    const { items: cart, subtotal: total } = useCart()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [isCouponApplied, setIsCouponApplied] = useState(false)

    const finalTotal = Math.max(0, total - discount)
    const [error, setError] = useState("")



    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "CAD10") {
            setDiscount(total * 0.10); setIsCouponApplied(true)
        } else {
            setDiscount(0); setIsCouponApplied(false)
        }
    }

    const handleEmailBlur = async () => {
        if (email && email.includes('@')) {
            try {
                await fetch('/api/abandoned-checkouts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, cartValue: finalTotal, items: cart, stage: 'Payment' })
                })
            } catch (error) { console.error('Failed to track abandoned checkout', error) }
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Your cart is empty</h1>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0168A0] text-white font-bold rounded-xl hover:bg-[#015580] transition-colors shadow-lg shadow-[#0168A0]/20">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#0168A0] transition-colors font-bold text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Link>
                    <Image src="/images/cropped-ixtzd985wxrrucij9vkr.avif" alt="CADLINK" width={120} height={32} className="object-contain" />
                    <div className="w-20" />
                </div>
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">First Name</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <CheckoutForm amount={finalTotal} customerDetails={{ firstName, lastName, email }} />
                        </div>
                    </div>
                    <div className="space-y-6 lg:sticky lg:top-8 h-fit">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-[#0168A0]" /> Order Summary</h2>
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg relative flex-shrink-0 border"><Image src={item.image} alt={item.name} fill className="object-contain p-2" /></div>
                                    <div className="flex-1 font-bold text-sm">{item.name}<p className="text-xs text-gray-500 font-normal">Qty: {item.quantity}</p></div>
                                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <div className="border-t pt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                                {isCouponApplied && <div className="flex justify-between text-green-600 font-bold"><span>Discount (10% OFF)</span><span>-${discount.toFixed(2)}</span></div>}
                                <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t"><span>Total</span><span className="text-[#0168A0]">${finalTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
