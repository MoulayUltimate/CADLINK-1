"use client"

import { useState } from 'react'
import {
    CreditCard,
    DollarSign,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Download,
    ExternalLink,
    Copy
} from 'lucide-react'
import { toast } from 'sonner'

export function PaymentsView() {
    const [stripeKey, setStripeKey] = useState('pk_test_51O...')
    const [webhookSecret, setWebhookSecret] = useState('whsec_...')

    const transactions: any[] = []

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Monetization Command</h2>
                    <p className="text-gray-400">Manage payments, webhooks, and revenue streams.</p>
                </div>
                <button className="bg-[#635BFF] hover:bg-[#534be0] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#635BFF]/20">
                    <ExternalLink className="w-5 h-5" />
                    Open Stripe Dashboard
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Stripe Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                                <CreditCard className="w-6 h-6 text-[#635BFF]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Stripe Integration</h3>
                                <p className="text-sm text-gray-400">Configure your payment gateway settings.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Publishable Key</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={stripeKey}
                                        onChange={(e) => setStripeKey(e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(stripeKey)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Webhook Secret</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={webhookSecret}
                                        onChange={(e) => setWebhookSecret(e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(webhookSecret)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    Webhooks Not Configured
                                </div>
                                <button className="text-sm font-bold text-[#635BFF] hover:text-[#534be0] transition-colors">
                                    Test Connection
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Transactions</h3>
                        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-xl">
                            <p className="text-gray-500 font-bold">No transactions found</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#635BFF] to-[#534be0] rounded-2xl p-6 text-white shadow-xl shadow-[#635BFF]/20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                <ArrowUpRight className="w-3 h-3" />
                                0%
                            </span>
                        </div>
                        <p className="text-sm font-medium opacity-80 mb-1">Total Revenue (This Month)</p>
                        <h3 className="text-4xl font-black">$0.00</h3>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group text-left">
                                <span className="font-bold text-gray-300 group-hover:text-white">Process Refund</span>
                                <RefreshCw className="w-4 h-4 text-gray-500 group-hover:text-white" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group text-left">
                                <span className="font-bold text-gray-300 group-hover:text-white">Download Invoice</span>
                                <Download className="w-4 h-4 text-gray-500 group-hover:text-white" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group text-left">
                                <span className="font-bold text-gray-300 group-hover:text-white">View Failed Payments</span>
                                <AlertCircle className="w-4 h-4 text-gray-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

