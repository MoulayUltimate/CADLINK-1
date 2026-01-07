"use client"

import { useState, useEffect } from "react"
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import { Loader2, Lock, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export function CheckoutForm({
    amount,
    customerDetails
}: {
    amount: number
    customerDetails: { firstName: string; lastName: string; email: string }
}) {
    const stripe = useStripe()
    const elements = useElements()

    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        )

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!")
                    toast.success("Payment succeeded!")
                    break
                case "processing":
                    setMessage("Your payment is processing.")
                    break
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.")
                    toast.error("Payment failed. Please try again.")
                    break
                default:
                    setMessage("Something went wrong.")
                    toast.error("Something went wrong.")
                    break
            }
        })
    }, [stripe])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
            toast.error("Please fill in all customer details.")
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
                payment_method_data: {
                    billing_details: {
                        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                        email: customerDetails.email,
                    },
                },
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.")
            toast.error(error.message || "An unexpected error occurred.")
        } else {
            setMessage("An unexpected error occurred.")
            toast.error("An unexpected error occurred.")
        }

        setIsLoading(false)
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

                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

                {message && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold">
                        {message}
                    </div>
                )}
            </div>

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0168A0]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        Pay ${amount.toFixed(2)}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-gray-400">
                Powered by Stripe. Your payment information is securely processed.
            </p>
        </form>
    )
}
