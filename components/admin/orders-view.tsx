"use client"

import { useState, useEffect } from 'react'
import {
    Package,
    Search,
    Filter,
    Download,
    MoreVertical,
    ExternalLink,
    Mail,
    Calendar,
    DollarSign,
    Loader2
} from 'lucide-react'

interface Order {
    id: string
    email: string
    name: string
    amount: number
    currency: string
    status: string
    timestamp: number
    paymentIntent: string
}

export function OrdersView() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                const data = await res.json()
                setOrders(data)
            } catch (err) {
                console.error('Failed to fetch orders', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const filteredOrders = orders.filter(order =>
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Orders Command</h2>
                    <p className="text-gray-400">Manage and track your store's sales performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
                    </div>
                    <p className="text-3xl font-black text-white">{orders.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-black text-white">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Calendar className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Avg. Order Value</span>
                    </div>
                    <p className="text-3xl font-black text-white">
                        ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by email or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#0168A0] outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-[#0168A0] animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center opacity-30">
                                        <Package className="w-12 h-12 mx-auto mb-4" />
                                        <p className="font-bold">No orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-[#0168A0]">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{order.name || 'Valued Customer'}</div>
                                                    <div className="text-xs text-gray-400">{order.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400">
                                                {new Date(order.timestamp).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-white">
                                                ${order.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
