"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { createPaymentIntent } from "@/app/actions/create-payment-intent"
import { useCart } from "@/contexts/cart-context"
import { Loader2, ShoppingCart, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder")

export default function CheckoutPage() {
    const { items: cart, subtotal: total } = useCart()
    const [clientSecret, setClientSecret] = useState("")

    // Customer Details State
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    // Coupon State
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [isCouponApplied, setIsCouponApplied] = useState(false)

    const finalTotal = Math.max(0, total - discount)

    const [error, setError] = useState("")

    useEffect(() => {
        if (finalTotal > 0) {
            createPaymentIntent(finalTotal)
                .then((data) => {
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret)
                    } else {
                        console.error("Payment intent error:", data.error)
                        let errorMessage = data.error
                        if (data.debug?.isPlaceholder) {
                            errorMessage += " (Using placeholder key - Env var missing)"
                        } else if (!data.debug?.keyPresent) {
                            errorMessage += " (Stripe Key Missing on Server)"
                        }
                        setError(errorMessage || "Failed to initialize payment")
                    }
                })
                .catch((err) => {
                    console.error("System error:", err)
                    setError(`System error: ${err.message || JSON.stringify(err)}`)
                })
        }
    }, [finalTotal])

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "CAD10") {
            const discountAmount = total * 0.10
            setDiscount(discountAmount)
            setIsCouponApplied(true)
            // toast.success("Coupon applied successfully!") 
        } else {
            // toast.error("Invalid coupon code")
            setDiscount(0)
            setIsCouponApplied(false)
        }
    }

    const handleEmailBlur = async () => {
        if (email && email.includes('@')) {
            try {
                await fetch('/api/abandoned-checkouts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        cartValue: finalTotal,
                        items: cart,
                        stage: 'Payment'
                    })
                })
            } catch (error) {
                console.error('Failed to track abandoned checkout', error)
            }
        }
    }

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0168A0',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    }

    const options = {
        clientSecret,
        appearance,
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Your cart is empty</h1>
                    <p className="text-gray-500">Add some products to proceed to checkout.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0168A0] text-white font-bold rounded-xl hover:bg-[#015580] transition-colors shadow-lg shadow-[#0168A0]/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Store
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#0168A0] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-bold text-sm">Back to Store</span>
                    </Link>
                    <Image
                        src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                        alt="CADLINK"
                        width={120}
                        height={32}
                        className="object-contain"
                    />
                    <div className="w-20" /> {/* Spacer */}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Customer Details & Payment Form */}
                    <div className="space-y-6">
                        {/* Customer Details Inputs */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={handleEmailBlur}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div>
                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm
                                        amount={finalTotal}
                                        customerDetails={{ firstName, lastName, email }}
                                    />
                                </Elements>
                            ) : (
                                <div className="h-[400px] flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    {error ? (
                                        <div className="text-center p-6 max-w-md">
                                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldCheck className="w-6 h-6 text-red-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Payment System Error</h3>
                                            <p className="text-sm text-gray-500 mb-4">{error}</p>
                                            <p className="text-xs text-gray-400">Please try refreshing the page or contact support.</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 text-[#0168A0] animate-spin mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold">Initializing Checkout...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Policy Links */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-gray-400">
                                <Link href="/refund-policy" className="hover:text-gray-900 transition-colors">Refund Policy</Link>
                                <Link href="/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Policy</Link>
                                <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                                <Link href="/terms-of-service" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                                <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6 sticky top-8 h-fit">
                        {/* Order Summary Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-[#0168A0]" />
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code Section */}
                            <div className="mb-6 pt-4 border-t border-gray-100">
                                <label className="text-xs font-bold text-gray-700 mb-2 block">Have a coupon?</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0168A0]"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {isCouponApplied && (
                                    <p className="text-xs text-green-600 font-bold mt-2">Coupon applied successfully!</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                {isCouponApplied && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Discount (10% OFF)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span className="text-[#0168A0]">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg h-fit">
                                <ShieldCheck className="w-5 h-5 text-[#0168A0]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0168A0] text-sm">Secure Checkout</h4>
                                <p className="text-xs text-blue-600/80 mt-1">
                                    Your payment information is encrypted and processed securely by Stripe. We never store your card details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}