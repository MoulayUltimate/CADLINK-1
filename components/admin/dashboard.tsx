"use client"

import { useState } from 'react'
import { useLiveTraffic } from '@/app/admin/hooks/use-live-traffic'
import { Users, ShoppingCart, Activity, Globe } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: '00:00', users: 0 },
    { name: '04:00', users: 0 },
    { name: '08:00', users: 0 },
    { name: '12:00', users: 0 },
    { name: '16:00', users: 0 },
    { name: '20:00', users: 0 },
    { name: '23:59', users: 0 },
]

export function Dashboard() {
    const { activeUsers, cartEvents } = useLiveTraffic()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Live Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Live Users</p>
                            <h3 className="text-4xl font-black text-foreground mt-2 flex items-center gap-3">
                                {activeUsers}
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500 dark:text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Cart Actions</p>
                            <h3 className="text-4xl font-black text-foreground mt-2 flex items-center gap-2">
                                {cartEvents.length}
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">0%</span>
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl transition-colors ${cartEvents.length > 0 ? 'bg-purple-500/20 text-purple-500 dark:text-purple-400 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Revenue Forecast</p>
                            <h3 className="text-4xl font-black text-foreground mt-2">$0.00</h3>
                            <p className="text-xs text-muted-foreground mt-1">No orders yet</p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500 dark:text-orange-400">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chart & Map */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6">Traffic Overview</h3>
                    <div className="h-[300px] w-full flex items-center justify-center border border-border rounded-xl bg-muted/20">
                        <p className="text-muted-foreground font-bold">Waiting for traffic data...</p>
                    </div>
                </div>

                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        Active Regions
                    </h3>
                    <div className="space-y-4">
                        <p className="text-muted-foreground text-sm text-center py-8">No active regions detected</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

