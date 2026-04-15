"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Lock, ShieldCheck, CreditCard, Apple, Wallet } from "lucide-react"
import { toast } from "sonner"

declare global {
    interface Window {
        Mollie: any;
    }
}

export function CheckoutForm({
    amount,
    customerDetails
}: {
    amount: number
    customerDetails: { firstName: string; lastName: string; email: string }
}) {
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMethod, setLoadingMethod] = useState<string | null>(null)
    const [mollieInstance, setMollieInstance] = useState<any>(null)
    const [isMollieReady, setIsMollieReady] = useState(false)
    const componentsMounted = useRef(false)

    useEffect(() => {
        if (document.getElementById('mollie-script')) {
            if (window.Mollie) initMollie()
            return
        }
        const script = document.createElement("script")
        script.id = 'mollie-script'
        script.src = "https://js.mollie.com/v1/mollie.js"
        script.onload = initMollie
        document.body.appendChild(script)

        function initMollie() {
            const profileId = process.env.NEXT_PUBLIC_MOLLIE_PROFILE_ID
            if (!profileId || profileId.includes('replace_me')) {
                console.error("Mollie Profile ID is missing in .env.local")
                setMessage("Payment Gateway Configuration Error: Missing Profile ID")
                return
            }
            if (window.Mollie && !mollieInstance) {
                const instance = window.Mollie(profileId, { locale: 'en_US', testmode: true })
                setMollieInstance(instance)
            }
        }
    }, [mollieInstance])

    useEffect(() => {
        if (mollieInstance && !componentsMounted.current) {
            componentsMounted.current = true
            
            const styles = { base: { color: '#111827', fontSize: '15px' }, '::placeholder': { color: '#9CA3AF' } }
            const cardNumber = mollieInstance.createComponent('cardNumber', { styles })
            const cardHolder = mollieInstance.createComponent('cardHolder', { styles })
            const expiryDate = mollieInstance.createComponent('expiryDate', { styles })
            const verificationCode = mollieInstance.createComponent('verificationCode', { styles })

            cardNumber.mount('#card-number')
            cardHolder.mount('#card-holder')
            expiryDate.mount('#expiry-date')
            verificationCode.mount('#verification-code')
            
            setIsMollieReady(true)
        }
    }, [mollieInstance])

    const handleSubmit = async (e?: React.FormEvent, alternativeMethod?: string) => {
        if (e) e.preventDefault()

        if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
            toast.error("Please fill in all customer details.")
            return
        }

        setIsLoading(true)
        if (alternativeMethod) setLoadingMethod(alternativeMethod)

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
            let cardToken = null
            if (mollieInstance && !alternativeMethod) {
                const { token, error } = await mollieInstance.createToken()
                if (error) {
                    toast.error(error.message)
                    setIsLoading(false)
                    setLoadingMethod(null)
                    return
                }
                cardToken = token
            }

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount, 
                    email: customerDetails.email, 
                    name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                    cardToken: cardToken || undefined,
                    method: alternativeMethod || undefined
                })
            })

            const data = await response.json()

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                setMessage(data.error || "An unexpected error occurred.")
                toast.error(data.error || "An unexpected error occurred.")
                setIsLoading(false)
                setLoadingMethod(null)
            }
        } catch (error) {
            setMessage("An unexpected error occurred.")
            toast.error("An unexpected error occurred.")
            setIsLoading(false)
            setLoadingMethod(null)
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

                <div className="mb-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleSubmit(undefined, 'applepay')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loadingMethod === 'applepay' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Apple className="w-5 h-5 filling-current" /> Pay</>}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit(undefined, 'googlepay')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                    >
                        {loadingMethod === 'googlepay' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wallet className="w-5 h-5" /> GPay</>}
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400 font-medium">Or pay with card</span></div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Card Holder</label>
                        <div id="card-holder" className="h-[46px] border border-gray-200 rounded-lg p-3 bg-gray-50 focus-within:border-[#0168A0] focus-within:ring-1 focus-within:ring-[#0168A0] transition-all"></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                           <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                           <div id="card-number" className="h-[46px] border border-gray-200 rounded-lg pl-10 pr-3 py-3 bg-gray-50 focus-within:border-[#0168A0] focus-within:ring-1 focus-within:ring-[#0168A0] transition-all"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date</label>
                            <div id="expiry-date" className="h-[46px] border border-gray-200 rounded-lg p-3 bg-gray-50 focus-within:border-[#0168A0] focus-within:ring-1 focus-within:ring-[#0168A0] transition-all"></div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
                            <div id="verification-code" className="h-[46px] border border-gray-200 rounded-lg p-3 bg-gray-50 focus-within:border-[#0168A0] focus-within:ring-1 focus-within:ring-[#0168A0] transition-all"></div>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold">
                        {message}
                    </div>
                )}
            </div>

            <button
                disabled={isLoading || !isMollieReady}
                id="submit"
                className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0168A0]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
                {isLoading || (!isMollieReady && !loadingMethod) ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isLoading && !loadingMethod ? 'Decrypting Secure Gateway...' : 'Loading Payment System...'}
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
