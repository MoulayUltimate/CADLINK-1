"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Lock, ShieldCheck, CreditCard, Apple, Wallet } from "lucide-react"
import { toast } from "sonner"

declare global {
    interface Window {
        Mollie: any;
    }
}

// Field-level validation state reported by the Mollie Components SDK.
// Keys match the component ids we create below.
type MollieField = "cardHolder" | "cardNumber" | "expiryDate" | "verificationCode"
type FieldStatus = { focused: boolean; dirty: boolean; valid: boolean; error?: string }

const FIELD_LABEL: Record<MollieField, string> = {
    cardHolder: "Card Holder",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    verificationCode: "CVC",
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
    const [fields, setFields] = useState<Record<MollieField, FieldStatus>>({
        cardHolder: { focused: false, dirty: false, valid: false },
        cardNumber: { focused: false, dirty: false, valid: false },
        expiryDate: { focused: false, dirty: false, valid: false },
        verificationCode: { focused: false, dirty: false, valid: false },
    })

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
                console.error("Mollie Profile ID is missing. Set NEXT_PUBLIC_MOLLIE_PROFILE_ID at build time.")
                setMessage("Payment Gateway Configuration Error: Missing Profile ID")
                return
            }
            // testmode must only be true when using a test profile + test API key.
            // Controlled via NEXT_PUBLIC_MOLLIE_TEST_MODE (must be set at build time).
            const testmode = process.env.NEXT_PUBLIC_MOLLIE_TEST_MODE === 'true'
            if (window.Mollie && !mollieInstance) {
                const instance = window.Mollie(profileId, { locale: 'en_US', testmode })
                setMollieInstance(instance)
            }
        }
    }, [mollieInstance])

    useEffect(() => {
        if (mollieInstance && !componentsMounted.current) {
            componentsMounted.current = true

            // Styles that mirror the CADLINK card-input treatment: subtle gray
            // surface, site-blue focus ring, Inter-ish typography.
            const styles = {
                base: {
                    color: '#111827',
                    fontSize: '15px',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, sans-serif',
                    letterSpacing: '0.01em',
                    '::placeholder': { color: '#9CA3AF' },
                },
                valid: { color: '#111827' },
                invalid: { color: '#DC2626' },
            }

            const controls: Array<[MollieField, string]> = [
                ['cardHolder', '#card-holder'],
                ['cardNumber', '#card-number'],
                ['expiryDate', '#expiry-date'],
                ['verificationCode', '#verification-code'],
            ]

            controls.forEach(([name, mount]) => {
                const component = mollieInstance.createComponent(name, { styles })
                component.mount(mount)
                component.addEventListener('focus', () => {
                    setFields((f) => ({ ...f, [name]: { ...f[name], focused: true } }))
                })
                component.addEventListener('blur', () => {
                    setFields((f) => ({ ...f, [name]: { ...f[name], focused: false } }))
                })
                component.addEventListener('change', (e: any) => {
                    setFields((f) => ({
                        ...f,
                        [name]: {
                            ...f[name],
                            dirty: !!e?.touched || !!e?.dirty || f[name].dirty,
                            valid: !!e?.valid,
                            error: e?.error || undefined,
                        },
                    }))
                })
            })

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
                    currency: 'USD',
                    email: customerDetails.email,
                    name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                    cardToken: cardToken || undefined,
                    method: (alternativeMethod === 'applepay' || alternativeMethod === 'googlepay') ? undefined : alternativeMethod || undefined
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

    // Derive per-field UI state from the live Mollie Components events. Plain
    // functions (no inline component) so the mount <div>s are never remounted
    // by React — Mollie's iframes would otherwise detach on every re-render.
    const wrapClass = (name: MollieField) => {
        const s = fields[name]
        const showError = !!s.error && s.dirty && !s.focused
        const border = showError
            ? "border-red-300 ring-1 ring-red-200"
            : s.focused
                ? "border-[#0168A0] ring-2 ring-[#0168A0]/15"
                : "border-gray-200 hover:border-gray-300"
        return `relative h-[48px] rounded-xl bg-white border ${border} transition-all shadow-[0_1px_2px_rgba(16,24,40,0.04)] px-3.5`
    }
    const fieldError = (name: MollieField) => {
        const s = fields[name]
        return !!s.error && s.dirty && !s.focused ? s.error : null
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Header with trust badge */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-gray-900 leading-none">Payment Details</h3>
                    <p className="text-[13px] text-gray-500 mt-1">Pay securely via Mollie. You'll be redirected to confirm.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#00b67a] bg-[#00b67a]/10 px-2.5 py-1 rounded-full font-bold">
                    <Lock className="w-3 h-3" />
                    256-bit TLS
                </div>
            </div>

            {/* Wallet quick-pay row */}
            <div className="grid grid-cols-2 gap-2.5">
                <button
                    type="button"
                    onClick={() => handleSubmit(undefined, 'applepay')}
                    disabled={isLoading}
                    aria-label="Pay with Apple Pay"
                    className="group h-12 flex items-center justify-center gap-2 bg-black text-white font-semibold rounded-xl transition-all disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                    {loadingMethod === 'applepay' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Apple className="w-5 h-5 fill-current" />
                            <span className="text-[15px]">Pay</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit(undefined, 'googlepay')}
                    disabled={isLoading}
                    aria-label="Pay with Google Pay"
                    className="group h-12 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl transition-all disabled:opacity-50 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:-translate-y-0.5 hover:shadow-md"
                >
                    {loadingMethod === 'googlepay' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Wallet className="w-5 h-5 text-[#0168A0]" />
                            <span className="text-[15px]">Google Pay</span>
                        </>
                    )}
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-[12px] uppercase tracking-[0.14em] text-gray-400 font-bold">
                        or pay by card
                    </span>
                </div>
            </div>

            {/* Card form — each mount node is rendered as a STABLE element so
                Mollie's iframes are never orphaned by re-renders. */}
            <div className="space-y-3.5">
                <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        {FIELD_LABEL.cardHolder}
                    </label>
                    <div id="card-holder" className={wrapClass("cardHolder")} />
                    {fieldError("cardHolder") && (
                        <p className="text-[12px] text-red-600 mt-1.5 font-medium">{fieldError("cardHolder")}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        {FIELD_LABEL.cardNumber}
                    </label>
                    <div id="card-number" className={wrapClass("cardNumber")} />
                    {fieldError("cardNumber") && (
                        <p className="text-[12px] text-red-600 mt-1.5 font-medium">{fieldError("cardNumber")}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                            {FIELD_LABEL.expiryDate}
                        </label>
                        <div id="expiry-date" className={wrapClass("expiryDate")} />
                        {fieldError("expiryDate") && (
                            <p className="text-[12px] text-red-600 mt-1.5 font-medium">{fieldError("expiryDate")}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                            {FIELD_LABEL.verificationCode}
                        </label>
                        <div id="verification-code" className={wrapClass("verificationCode")} />
                        {fieldError("verificationCode") && (
                            <p className="text-[12px] text-red-600 mt-1.5 font-medium">{fieldError("verificationCode")}</p>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] font-semibold flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{message}</span>
                </div>
            )}

            {/* Submit */}
            <button
                disabled={isLoading || !isMollieReady}
                id="submit"
                className="w-full h-14 bg-[#0168A0] hover:bg-[#015580] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0168A0]/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
                {isLoading || (!isMollieReady && !loadingMethod) ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isLoading && !loadingMethod ? 'Securely processing…' : 'Loading secure form…'}</span>
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Pay ${amount.toFixed(2)}</span>
                    </>
                )}
            </button>

            {/* Trust row */}
            <div className="flex flex-col items-center gap-2 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Encrypted end-to-end. We never see your card details.</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                    <span className="text-[11px] font-semibold">Powered by</span>
                    <svg viewBox="0 0 100 24" className="h-4" aria-label="Mollie">
                        <text x="0" y="18" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="18" fill="#0D1117">mollie</text>
                    </svg>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                    <CardBrand name="Visa" />
                    <CardBrand name="Mastercard" />
                    <CardBrand name="Amex" />
                    <CardBrand name="iDEAL" />
                </div>
            </div>
        </form>
    )
}

// Tiny inline brand chips — no external assets needed, match the site's neutral
// palette. Mollie renders its own branded card-number field, these are only for
// reassurance below the submit button.
function CardBrand({ name }: { name: string }) {
    return (
        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-500">
            {name}
        </span>
    )
}
