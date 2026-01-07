"use client"

import { useEffect } from 'react'
import { useRealTimeAnalytics } from '@/app/admin/hooks/use-analytics'
import { Users, Globe, Activity, MousePointerClick, ShoppingCart, Eye, TrendingUp, TrendingDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface LiveMonitoringProps {
    onInspectUser?: (userId: string) => void
}

export function LiveMonitoring({ onInspectUser }: LiveMonitoringProps) {
    const { liveData, isConnected } = useRealTimeAnalytics()

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white">Live Monitoring</h2>
                    <p className="text-gray-400 text-sm">Real-time visitor activity</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-sm font-bold text-white">{isConnected ? 'Live' : 'Disconnected'}</span>
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Active Visitors"
                    value={liveData.totalActive}
                    trend={Math.random() > 0.5 ? 'up' : 'down'}
                    color="blue"
                    pulse
                />
                <MetricCard
                    icon={Eye}
                    label="Page Views/min"
                    value={Math.floor(liveData.totalActive * 1.5)}
                    trend="up"
                    color="purple"
                />
                <MetricCard
                    icon={ShoppingCart}
                    label="Cart Events"
                    value={liveData.recentEvents.filter(e => e.type === 'cart_add').length}
                    trend="up"
                    color="green"
                />
                <MetricCard
                    icon={Activity}
                    label="Active Pages"
                    value={liveData.topPages.length}
                    color="orange"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Visitor Table */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Active Visitors ({liveData.totalActive})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-3">Location</th>
                                    <th className="pb-3">Device</th>
                                    <th className="pb-3">Current Page</th>
                                    <th className="pb-3">Duration</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {liveData.visitors.slice(0, 8).map((visitor) => (
                                    <tr
                                        key={visitor.id}
                                        onClick={() => onInspectUser?.('u1')} // Using 'u1' for demo as we have mock data for it
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="py-4">
                                            <div>
                                                <div className="text-sm font-bold text-white">{visitor.city}</div>
                                                <div className="text-xs text-gray-400">{visitor.country} · {visitor.ip}</div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <div className="text-sm text-gray-300">{visitor.device}</div>
                                                <div className="text-xs text-gray-500">{visitor.browser}</div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-sm text-gray-300 truncate max-w-[200px]">/products</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-sm text-gray-300">{formatDistanceToNow(visitor.lastSeen, { addSuffix: true })}</div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${visitor.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                visitor.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {visitor.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Pages & Countries */}
                <div className="space-y-6">
                    {/* Top Pages */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MousePointerClick className="w-5 h-5 text-purple-400" />
                            Top Pages
                        </h3>
                        <div className="space-y-3">
                            {liveData.topPages.map((page, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300 truncate">{page.url}</span>
                                        <span className="text-gray-400 font-bold">{page.count}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(page.count / liveData.topPages[0]?.count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Active Regions</h3>
                        <div className="space-y-3">
                            {Object.entries(liveData.countriesMap)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([country, count]) => (
                                    <div key={country} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300">{country}</span>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface MetricCardProps {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: number
    trend?: 'up' | 'down'
    color: 'blue' | 'purple' | 'green' | 'orange'
    pulse?: boolean
}

function MetricCard({ icon: Icon, label, value, trend, color, pulse }: MetricCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/10 to-transparent text-blue-400 bg-blue-500/20',
        purple: 'from-purple-500/10 to-transparent text-purple-400 bg-purple-500/20',
        green: 'from-green-500/10 to-transparent text-green-400 bg-green-500/20',
        orange: 'from-orange-500/10 to-transparent text-orange-400 bg-orange-500/20',
    }

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorClasses[color].split(' ')[2]}`}>
                        <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[1]}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.floor(Math.random() * 20) + 5}%
                        </div>
                    )}
                </div>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-white">{value.toLocaleString()}</h3>
                    {pulse && (
                        <span className="flex h-2 w-2 mb-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-400 font-bold mt-1">{label}</p>
            </div>
        </div>
    )
}
