"use client"

import { useState } from 'react'
import {
    X,
    Clock,
    MapPin,
    Globe,
    Monitor,
    Smartphone,
    ArrowRight,
    ShoppingCart,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    History
} from 'lucide-react'
import { format } from 'date-fns'
import { mockUsers, mockUserHistory } from '@/app/admin/lib/mock-data'

interface UserInspectorProps {
    userId: string | null
    onClose: () => void
}

export function UserInspector({ userId, onClose }: UserInspectorProps) {
    if (!userId) return null

    const user = mockUsers.find(u => u.id === userId)
    const history = mockUserHistory[userId as keyof typeof mockUserHistory] || []

    if (!user) return null

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#1e293b] border-l border-white/10 shadow-2xl z-[100] animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0f172a]/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0168A0] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#0168A0]/20">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">{user.name}</h3>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* User Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total LTV</p>
                            <p className="text-xl font-black text-green-400">${user.ltv.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Last Seen</p>
                            <p className="text-sm font-bold text-white">{user.lastSeen}</p>
                        </div>
                    </div>

                    {/* Device Info */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Device & Origin</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Monitor className="w-4 h-4 text-blue-400" />
                                <span>Chrome / macOS</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Globe className="w-4 h-4 text-purple-400" />
                                <span>Direct Traffic</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <MapPin className="w-4 h-4 text-red-400" />
                                <span>{user.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* The Time Machine (Timeline) */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-[#0168A0]" />
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Time Machine</h4>
                        </div>

                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#0168A0] before:via-white/5 before:to-transparent">
                            {history.map((item, index) => (
                                <div key={index} className="relative flex items-start gap-6 group">
                                    <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-[#1e293b] flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${item.type === 'purchase' ? 'bg-green-500' :
                                            item.type === 'error' ? 'bg-red-500' :
                                                item.type === 'cart' ? 'bg-purple-500' :
                                                    'bg-[#0168A0]'
                                        }`}>
                                        {item.type === 'purchase' ? <CheckCircle2 className="w-3 h-3 text-white" /> :
                                            item.type === 'error' ? <AlertCircle className="w-3 h-3 text-white" /> :
                                                item.type === 'cart' ? <ShoppingCart className="w-3 h-3 text-white" /> :
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-sm font-bold ${item.type === 'purchase' ? 'text-green-400' :
                                                    item.type === 'error' ? 'text-red-400' :
                                                        'text-white'
                                                }`}>
                                                {item.event}
                                            </p>
                                            <span className="text-[10px] font-bold text-gray-500">{item.time}</span>
                                        </div>
                                        {item.type === 'error' && (
                                            <p className="text-xs text-red-400/70 bg-red-400/5 p-2 rounded-lg border border-red-400/10">
                                                Cart abandoned at checkout. Potential revenue loss: $1,995.00
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-[#0f172a]/50 flex gap-3">
                    <button className="flex-1 bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        God Mode
                    </button>
                    <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                        Email User
                    </button>
                </div>
            </div>
        </div>
    )
}
