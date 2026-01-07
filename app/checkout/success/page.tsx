"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Download } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const paymentIntent = searchParams.get("payment_intent")

    useEffect(() => {
        if (paymentIntent) {
            clearCart()
        }
    }, [paymentIntent, clearCart])

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. A confirmation email has been sent to you.
                </p>

                <div className="space-y-3">
                    <button className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Invoice
                    </button>

                    <Link
                        href="/"
                        className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Return to Store
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
