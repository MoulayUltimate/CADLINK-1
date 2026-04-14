"use client"

import { useEffect, Suspense, useRef } from "react"
import { CheckCircle2, ArrowRight, Download } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const isRecording = useRef(false)

    useEffect(() => {
        if (!isRecording.current) {
            isRecording.current = true
            clearCart()
        }
    }, [clearCart])

    const generateInvoice = () => {
        const clientName = localStorage.getItem('checkout_name') || 'Valued Customer'
        const clientEmail = localStorage.getItem('checkout_email') || 'N/A'
        const win = window.open('', '_blank')
        if (win) {
            win.document.write(`<html><body><h1>Order Confirmation</h1><p>${clientName} (${clientEmail})</p><p>Amount: Paid</p><p>Details have been sent to your email.</p><script>window.print()</script></body></html>`)
            win.document.close()
        }
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-400" /></div>
                <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-400 mb-8">Thank you for your purchase. A confirmation email has been sent to you.</p>
                <div className="space-y-3">
                    <button onClick={generateInvoice} className="w-full bg-[#0168A0] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download Invoice</button>
                    <button onClick={() => window.location.href = "/"} className="w-full bg-white/5 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">Return to Store <ArrowRight className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    )
}

export function SuccessPage() {
    return <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}><SuccessContent /></Suspense>
}
