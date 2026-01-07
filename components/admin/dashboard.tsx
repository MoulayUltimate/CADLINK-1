"use client"

import { useState } from 'react'
import { useLiveTraffic } from '@/app/admin/hooks/use-live-traffic'
import { Users, ShoppingCart, Activity, Globe } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: '00:00', users: 40 },
    { name: '04:00', users: 30 },
    { name: '08:00', users: 120 },
    { name: '12:00', users: 250 },
    { name: '16:00', users: 310 },
    { name: '20:00', users: 180 },
    { name: '23:59', users: 90 },
]

export function Dashboard() {
    const { activeUsers, cartEvents } = useLiveTraffic()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Live Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Live Users</p>
                            <h3 className="text-4xl font-black text-white mt-2 flex items-center gap-3">
                                {activeUsers}
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Cart Actions</p>
                            <h3 className="text-4xl font-black text-white mt-2 flex items-center gap-2">
                                {cartEvents.length}
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl transition-colors ${cartEvents.length > 0 ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Revenue Forecast</p>
                            <h3 className="text-4xl font-black text-white mt-2">$42.5k</h3>
                            <p className="text-xs text-gray-500 mt-1">Projected EOM</p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chart & Map */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Traffic Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0168A0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0168A0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#0168A0" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Active Regions
                    </h3>
                    <div className="space-y-4">
                        {[
                            { country: 'United States', count: 45, percent: 45 },
                            { country: 'United Kingdom', count: 25, percent: 25 },
                            { country: 'Germany', count: 15, percent: 15 },
                            { country: 'France', count: 10, percent: 10 },
                        ].map((region) => (
                            <div key={region.country}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300 font-medium">{region.country}</span>
                                    <span className="text-gray-400">{region.count} users</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${region.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
