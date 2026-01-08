"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Mail, Clock, ShoppingCart, AlertCircle, ArrowRight } from "lucide-react"
import Image from "next/image"

// Mock Data for Abandoned Checkouts
const MOCK_ABANDONED_CHECKOUTS = [
    {
        id: "ac_1",
        email: "john.doe@example.com",
        date: "2024-01-07T10:30:00",
        value: 75.19,
        items: [
            {
                name: "CADLINK Digital Factory 11 DTF Edition",
                image: "/images/cadlink-product.png",
                price: 75.19,
            },
        ],
        stage: "Payment", // Where they dropped off
        status: "Not Recovered",
    },
    {
        id: "ac_2",
        email: "sarah.smith@gmail.com",
        date: "2024-01-07T09:15:00",
        value: 75.19,
        items: [
            {
                name: "CADLINK Digital Factory 11 DTF Edition",
                image: "/images/cadlink-product.png",
                price: 75.19,
            },
        ],
        stage: "Shipping Info",
        status: "Email Sent",
    },
    {
        id: "ac_3",
        email: "mike.wilson@outlook.com",
        date: "2024-01-06T18:45:00",
        value: 75.19,
        items: [
            {
                name: "CADLINK Digital Factory 11 DTF Edition",
                image: "/images/cadlink-product.png",
                price: 75.19,
            },
        ],
        stage: "Cart",
        status: "Recovered",
    },
    {
        id: "ac_4",
        email: "unknown-guest-882@temp.com",
        date: "2024-01-06T14:20:00",
        value: 75.19,
        items: [
            {
                name: "CADLINK Digital Factory 11 DTF Edition",
                image: "/images/cadlink-product.png",
                price: 75.19,
            },
        ],
        stage: "Checkout Init",
        status: "Not Recovered",
    },
]

export function AbandonedCheckoutsView() {
    const [searchTerm, setSearchTerm] = useState("")
    const [checkouts, setCheckouts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCheckouts = async () => {
            try {
                const response = await fetch('/api/abandoned-checkouts')
                if (response.ok) {
                    const data = await response.json()
                    setCheckouts(data.checkouts || [])
                }
            } catch (error) {
                console.error("Failed to fetch checkouts", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCheckouts()
    }, [])

    const filteredCheckouts = checkouts.filter(
        (checkout) =>
            checkout.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            checkout.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSendEmail = async (checkout: any) => {
        try {
            // Show loading state (optimistic)
            const originalStatus = checkout.status
            setCheckouts(prev => prev.map(c =>
                c.id === checkout.id ? { ...c, status: 'Sending...' } : c
            ))

            const res = await fetch('/api/admin/abandoned-checkouts/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: checkout.email,
                    checkoutId: checkout.id,
                    items: checkout.items,
                    recoveryUrl: `https://cadlink.store/checkout?recovery=${checkout.id}`
                })
            })

            if (!res.ok) throw new Error('Failed to send email')

            // Update status to Sent
            setCheckouts(prev => prev.map(c =>
                c.id === checkout.id ? { ...c, status: 'Email Sent' } : c
            ))

            // Ideally update backend status here too

        } catch (error) {
            console.error('Failed to send email', error)
            // Revert status
            setCheckouts(prev => prev.map(c =>
                c.id === checkout.id ? { ...c, status: 'Not Recovered' } : c
            ))
            alert('Failed to send email. Please check the console.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Abandoned Rate</p>
                            <h3 className="text-2xl font-black text-foreground">
                                {checkouts.length > 0
                                    ? ((checkouts.filter(c => c.status === 'Not Recovered').length / checkouts.length) * 100).toFixed(1)
                                    : 0}%
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Emails Sent</p>
                            <h3 className="text-2xl font-black text-foreground">
                                {checkouts.filter(c => c.status === 'Email Sent').length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Recovered Revenue</p>
                            <h3 className="text-2xl font-black text-foreground">
                                ${checkouts
                                    .filter(c => c.status === 'Recovered')
                                    .reduce((acc, curr) => acc + (curr.value || 0), 0)
                                    .toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Abandoned Checkouts
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search emails..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-[#0168A0] w-64"
                            />
                        </div>
                        <button className="p-2 bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <th className="px-6 py-4">Checkout ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Cart Value</th>
                                <th className="px-6 py-4">Drop-off Stage</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCheckouts.map((checkout) => (
                                <tr key={checkout.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-muted-foreground">#{checkout.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0168A0] to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                {checkout.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{checkout.email}</p>
                                                <p className="text-xs text-muted-foreground">{checkout.items.length} items</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-foreground">${checkout.value.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                                            {checkout.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(checkout.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${checkout.status === "Recovered"
                                                ? "bg-green-500/10 text-green-500"
                                                : checkout.status === "Email Sent"
                                                    ? "bg-blue-500/10 text-blue-500"
                                                    : checkout.status === "Sending..."
                                                        ? "bg-yellow-500/10 text-yellow-500"
                                                        : "bg-gray-500/10 text-gray-500"
                                                }`}
                                        >
                                            {checkout.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleSendEmail(checkout)}
                                                disabled={checkout.status === 'Sending...' || checkout.status === 'Email Sent' || checkout.status === 'Recovered'}
                                                className="p-2 hover:bg-muted rounded-lg text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Send Recovery Email"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
