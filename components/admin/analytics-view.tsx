"use client"

import { useState, useEffect } from "react"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import {
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Filter
} from 'lucide-react'

const revenueData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3800 },
    { name: 'Wed', revenue: 5100 },
    { name: 'Thu', revenue: 4600 },
    { name: 'Fri', revenue: 5900 },
    { name: 'Sat', revenue: 7200 },
    { name: 'Sun', revenue: 6800 },
]

const funnelData = [
    { name: 'Visitors', value: 1000, fill: '#0168A0' },
    { name: 'Add to Cart', value: 450, fill: '#015580' },
    { name: 'Checkout', value: 280, fill: '#014460' },
    { name: 'Purchase', value: 120, fill: '#4CAF50' },
]

export function AnalyticsView() {
    const [stats, setStats] = useState({ visits: 0, activeUsers: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics')
                const data = await res.json()
                if (data.visits) setStats(data)
            } catch (err) {
                console.error('Failed to fetch analytics', err)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-foreground">Analytics Command</h2>
                    <p className="text-muted-foreground">Deep dive into your store's performance metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="https://analytics.google.com/analytics/web/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#0168A0] text-white rounded-xl text-sm font-bold hover:bg-[#015580] transition-all shadow-lg shadow-[#0168A0]/20 flex items-center gap-2"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        Open Google Analytics
                    </a>
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <strong>Note:</strong> Real-time analytics are currently managed via Google Analytics. Click the button above to view detailed reports.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={`$${(stats as any).totalRevenue?.toLocaleString() || '0.00'}`}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Conversion Rate"
                    value={`${(stats as any).conversionRate || '0'}%`}
                    trend="+0.8%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    label="Avg. Order Value"
                    value={`$${(stats as any).avgOrderValue?.toFixed(2) || '0.00'}`}
                    trend="-1.2%"
                    trendUp={false}
                    icon={ShoppingCart}
                    color="purple"
                />
                <StatCard
                    label="Total Visitors"
                    value={stats.visits.toLocaleString()}
                    trend="Live"
                    trendUp={true}
                    icon={Users}
                    color="orange"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-foreground">Revenue Velocity</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0168A0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0168A0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0168A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel Chart */}
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-foreground mb-8">Conversion Funnel</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={funnelData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {funnelData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                    <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function StatCard({ label, value, trend, trendUp, icon: Icon, color }: any) {
    const colors: any = {
        green: 'bg-green-500/10 text-green-400',
        blue: 'bg-blue-500/10 text-blue-400',
        purple: 'bg-purple-500/10 text-purple-400',
        orange: 'bg-orange-500/10 text-orange-400',
    }

    return (
        <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-2xl font-black text-foreground">{value}</h3>
            <p className="text-sm font-bold text-muted-foreground mt-1">{label}</p>
        </div>
    )
}
