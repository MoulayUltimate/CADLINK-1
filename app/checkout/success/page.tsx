"use client"

import { useEffect, Suspense } from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Download } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const paymentIntent = searchParams.get("payment_intent")

    useEffect(() => {
        if (paymentIntent) {
            // Record order
            const email = localStorage.getItem('checkout_email') || 'unknown@example.com'
            const amount = 75.19 // Default price, should ideally come from session

            fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    amount,
                    paymentIntent,
                    currency: 'USD'
                })
            }).catch(err => console.error('Failed to record order', err))

            clearCart()
        }
    }, [paymentIntent, clearCart])

    const generateInvoice = () => {
        const clientName = localStorage.getItem('checkout_name') || 'Valued Customer'
        const clientEmail = localStorage.getItem('checkout_email') || 'N/A'
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        const orderId = paymentIntent ? `ORD-${paymentIntent.substring(3, 11).toUpperCase()}` : 'ORD-PENDING'

        const invoiceHtml = `
            <html>
            <head>
                <title>Invoice - ${orderId}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
                    .store-name { font-size: 24px; font-weight: 900; color: #0168A0; }
                    .invoice-title { font-size: 32px; font-weight: 900; }
                    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; color: #999; margin-bottom: 10px; }
                    table { w-full; border-collapse: collapse; width: 100%; }
                    th { text-align: left; border-bottom: 1px solid #eee; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #999; }
                    td { padding: 20px 0; border-bottom: 1px solid #eee; }
                    .total-row { font-weight: 900; font-size: 18px; }
                    .footer { margin-top: 60px; font-size: 12px; color: #999; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="store-name">CADLINK</div>
                        <div>Professional Sign Making Software</div>
                    </div>
                    <div class="invoice-title">INVOICE</div>
                </div>
                
                <div class="details">
                    <div>
                        <div class="section-title">Billed To</div>
                        <div style="font-weight: bold;">${clientName}</div>
                        <div>${clientEmail}</div>
                    </div>
                    <div>
                        <div class="section-title">Order Details</div>
                        <div><strong>Order ID:</strong> ${orderId}</div>
                        <div><strong>Date:</strong> ${date}</div>
                        <div><strong>Status:</strong> Paid</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style="font-weight: bold;">CADLINK V11 Professional</div>
                                <div style="font-size: 12px; color: #666;">Lifetime License - Instant Digital Delivery</div>
                            </td>
                            <td style="text-align: right; font-weight: bold;">$75.19</td>
                        </tr>
                        <tr class="total-row">
                            <td style="text-align: right;">Total Paid</td>
                            <td style="text-align: right;">$75.19</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Thank you for your business! If you have any questions, please contact support.</p>
                    <p>&copy; ${new Date().getFullYear()} CADLINK. All rights reserved.</p>
                </div>

                <script>
                    window.onload = () => {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `

        const win = window.open('', '_blank')
        if (win) {
            win.document.write(invoiceHtml)
            win.document.close()
        }
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500 relative z-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. A confirmation email has been sent to you.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={generateInvoice}
                        className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download Invoice
                    </button>

                    <Link
                        href="/"
                        className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative z-20"
                    >
                        Return to Store
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
            <SuccessContent />
        </Suspense>
    )
}
