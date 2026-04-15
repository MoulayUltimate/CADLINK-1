"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Lock, ShieldCheck, CreditCard, Apple, Wallet, ChevronRight } from "lucide-react"
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
    const [activeMethod, setActiveMethod] = useState<'card' | null>('card')
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
            {/* Apple Pay Button (Standalone at top) */}
            <button
                type="button"
                onClick={() => handleSubmit(undefined, 'applepay')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
            >
                {loadingMethod === 'applepay' ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Apple className="w-6 h-6 filling-current -mt-1" /> <span className="text-xl">Pay</span></>}
            </button>

            {/* Accordion Payment Methods */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                
                {/* 1. Card Option */}
                <div 
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${activeMethod === 'card' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveMethod(activeMethod === 'card' ? null : 'card')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-7 bg-[#1F2937] rounded flex items-center justify-center text-white shadow-sm">
                            <CreditCard className="w-4 h-4 opacity-80" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Card</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex gap-1">
                            <div className="bg-[#142A5C] text-white text-[10px] font-bold px-1 rounded flex items-center">VISA</div>
                            <div className="bg-[#EB001B] text-white text-[10px] font-bold px-1 rounded flex items-center shadow-inner">MC</div>
                            <div className="bg-[#0070CE] text-white text-[10px] font-bold px-1 rounded flex items-center">AMEX</div>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${activeMethod === 'card' ? 'rotate-90 text-gray-800' : ''}`} />
                    </div>
                </div>

                {/* Card Expanded Content */}
                {activeMethod === 'card' && (
                    <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                        <div className="mb-5">
                            <label className="block text-[15px] font-semibold text-gray-600 mb-2">Card information</label>
                            
                            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#0168A0] focus-within:border-[#0168A0] transition-all">
                                {/* Card Number Row */}
                                <div className="p-3 border-b border-gray-200">
                                    <div id="card-number" className="h-[22px]"></div>
                                </div>
                                {/* Expiry & CVC Row */}
                                <div className="flex">
                                    <div className="p-3 flex-1 border-r border-gray-200">
                                        <div id="expiry-date" className="h-[22px]"></div>
                                    </div>
                                    <div className="p-3 flex-1">
                                        <div id="verification-code" className="h-[22px]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[15px] font-semibold text-gray-600 mb-2">Cardholder name</label>
                            <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-1 focus-within:ring-[#0168A0] focus-within:border-[#0168A0] transition-all">
                                <div id="card-holder" className="h-[22px]"></div>
                            </div>
                        </div>

                        {message && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold">
                                {message}
                            </div>
                        )}

                        <button
                            disabled={isLoading || !isMollieReady}
                            id="submit"
                            className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-[#0168A0]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading || (!isMollieReady && !loadingMethod) ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isLoading && !loadingMethod ? 'Processing payment...' : 'Initializing Secure Gateway...'}
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Pay ${amount.toFixed(2)}
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* 2. iDEAL Option */}
                <div 
                    className="flex items-center justify-between p-4 cursor-pointer border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSubmit(undefined, 'ideal')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-7 bg-[#FFF0F4] rounded flex items-center justify-center text-[#E5005B] font-extrabold text-[10px] border border-[#ffb3cf] shadow-sm">
                            iDEAL
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">iDEAL | Wero</span>
                    </div>
                    {loadingMethod === 'ideal' ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>

                {/* 3. Bank Transfer Option */}
                <div 
                    className="flex items-center justify-between p-4 cursor-pointer border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSubmit(undefined, 'banktransfer')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-7 bg-[#0055A5] rounded flex items-center justify-center text-white font-extrabold text-[10px] shadow-sm">
                            SEPA
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">Bank transfer</span>
                    </div>
                    {loadingMethod === 'banktransfer' ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>

            </div>

            <p className="text-center text-xs text-gray-400">
                Powered by Mollie. Your payment information is securely processed.
            </p>
        </form>
    )
}
