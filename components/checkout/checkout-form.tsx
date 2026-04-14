"use client"

import { useState, useEffect } from "react"

import { Loader2, Lock, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export function CheckoutForm({
    amount,
    customerDetails
}: {
    amount: number
    customerDetails: { firstName: string; lastName: string; email: string }
}) {
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
            toast.error("Please fill in all customer details.")
            return
        }

        setIsLoading(true)

        // Save details for success page
        localStorage.setItem('checkout_name', `${customerDetails.firstName} ${customerDetails.lastName}`)
        localStorage.setItem('checkout_email', customerDetails.email)

        // Fire Google Analytics conversion event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: amount,
                items: [{ item_name: 'CADLINK V11', price: amount }]
            });
            (window as any).gtag('event', 'conversion', {
                send_to: 'G-TF9G87JX90',
                value: amount,
                currency: 'USD'
            });
        }

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount, 
                    email: customerDetails.email, 
                    name: `${customerDetails.firstName} ${customerDetails.lastName}` 
                })
            })

            const data = await response.json()

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                setMessage(data.error || "An unexpected error occurred.")
                toast.error(data.error || "An unexpected error occurred.")
                setIsLoading(false)
            }
        } catch (error) {
            setMessage("An unexpected error occurred.")
            toast.error("An unexpected error occurred.")
            setIsLoading(false)
        }
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Details */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
                    <div className="flex items-center gap-2 text-xs text-[#00b67a] bg-[#00b67a]/10 px-3 py-1 rounded-full font-bold">
                        <Lock className="w-3 h-3" />
                        Secure Encrypted
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center text-sm text-gray-500">
                    You will be redirected securely to Mollie to complete your purchase using your preferred payment method.
                </div>

                {message && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold">
                        {message}
                    </div>
                )}
            </div>

            <button
                disabled={isLoading}
                id="submit"
                className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0168A0]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        Proceed to Payment (${amount.toFixed(2)})
                    </>
                )}
            </button>

            <p className="text-center text-xs text-gray-400">
                Powered by Mollie. Your payment information is securely processed.
            </p>
        </form>
    )
}
