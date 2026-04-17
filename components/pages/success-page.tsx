"use client"

import { useEffect, Suspense, useRef, useState } from "react"
import { CheckCircle2, ArrowRight, Download, Loader2, XCircle, ShieldCheck } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

type VerificationState =
    | { kind: "loading" }
    | { kind: "paid"; amount?: { currency: string; value: string } }
    | { kind: "unpaid"; status?: string }
    | { kind: "missing_id" }
    | { kind: "error"; message: string }

function SuccessContent() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const didClearCart = useRef(false)
    const [state, setState] = useState<VerificationState>({ kind: "loading" })

    useEffect(() => {
        const paymentId = searchParams.get("payment_id") || searchParams.get("id")
        if (!paymentId) {
            setState({ kind: "missing_id" })
            return
        }

        let cancelled = false
        ;(async () => {
            try {
                const res = await fetch(`/api/payment-status?id=${encodeURIComponent(paymentId)}`, {
                    cache: "no-store",
                })
                const data = await res.json()
                if (cancelled) return
                if (data.paid) {
                    setState({ kind: "paid", amount: data.amount })
                    if (!didClearCart.current) {
                        didClearCart.current = true
                        clearCart()
                    }
                } else {
                    setState({ kind: "unpaid", status: data.status })
                }
            } catch (e: any) {
                if (!cancelled) setState({ kind: "error", message: e?.message || "Could not verify payment" })
            }
        })()

        return () => {
            cancelled = true
        }
    }, [searchParams, clearCart])

    const generateInvoice = () => {
        const clientName = localStorage.getItem("checkout_name") || "Valued Customer"
        const clientEmail = localStorage.getItem("checkout_email") || "N/A"
        const amountLabel =
            state.kind === "paid" && state.amount
                ? `${state.amount.value} ${state.amount.currency}`
                : "Paid"
        const win = window.open("", "_blank")
        if (win) {
            win.document.write(
                `<html><body style="font-family:sans-serif;padding:32px;color:#111"><h1>Order Confirmation</h1><p><strong>${clientName}</strong> (${clientEmail})</p><p>Amount: ${amountLabel}</p><p>Details have been sent to your email.</p><script>window.print()</script></body></html>`
            )
            win.document.close()
        }
    }

    // ─── Paid ─────────────────────────────────────────────────────────────
    if (state.kind === "paid") {
        return (
            <Shell>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful</h1>
                <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
                {state.amount && (
                    <p className="text-lg font-black text-[#0168A0] mb-6">
                        {state.amount.value} {state.amount.currency}
                    </p>
                )}
                <p className="text-gray-500 mb-8 text-sm">
                    A confirmation email with your license details is on its way.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={generateInvoice}
                        className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download Invoice
                    </button>
                    <Link
                        href="/"
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-100"
                    >
                        Return to Store <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </Shell>
        )
    }

    // ─── Loading ──────────────────────────────────────────────────────────
    if (state.kind === "loading") {
        return (
            <Shell>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-10 h-10 text-[#0168A0] animate-spin" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Verifying your payment…</h1>
                <p className="text-gray-500 text-sm">Please don't close this window.</p>
            </Shell>
        )
    }

    // ─── Unpaid / Missing ID / Error ──────────────────────────────────────
    const title =
        state.kind === "missing_id"
            ? "No payment found"
            : state.kind === "unpaid"
                ? "Payment not completed"
                : "Couldn't verify your payment"
    const subtitle =
        state.kind === "missing_id"
            ? "This page should only be reached after a successful payment. If you just tried to pay, please return to checkout."
            : state.kind === "unpaid"
                ? `Your payment is currently "${state.status ?? "incomplete"}". You haven't been charged. Please retry from checkout.`
                : state.kind === "error"
                    ? state.message
                    : ""

    return (
        <Shell>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50">
                <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 mb-8 text-sm">{subtitle}</p>
            <div className="space-y-3">
                <Link
                    href="/checkout"
                    className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <ShieldCheck className="w-4 h-4" /> Return to Checkout
                </Link>
                <Link
                    href="/"
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-100"
                >
                    Return to Store <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </Shell>
    )
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                        alt="CADLINK"
                        width={120}
                        height={32}
                        className="object-contain"
                    />
                </div>
                {children}
            </div>
        </div>
    )
}

export function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <SuccessContent />
        </Suspense>
    )
}
