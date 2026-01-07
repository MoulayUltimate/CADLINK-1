"use client"

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
    { name: 'Mon', revenue: 4500, orders: 12 },
    { name: 'Tue', revenue: 5200, orders: 15 },
    { name: 'Wed', revenue: 3800, orders: 9 },
    { name: 'Thu', revenue: 6100, orders: 18 },
    { name: 'Fri', revenue: 5900, orders: 17 },
    { name: 'Sat', revenue: 8400, orders: 24 },
    { name: 'Sun', revenue: 7200, orders: 21 },
]

const funnelData = [
    { name: 'Visitors', value: 1000, fill: '#64748b' },
    { name: 'Product Views', value: 650, fill: '#3b82f6' },
    { name: 'Add to Cart', value: 280, fill: '#a855f7' },
    { name: 'Checkout', value: 120, fill: '#f59e0b' },
    { name: 'Purchase', value: 45, fill: '#10b981' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function AnalyticsView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Analytics Command</h2>
                    <p className="text-gray-400">Deep dive into your store's performance metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Last 7 Days
                    </button>
                    <button className="px-4 py-2 bg-[#0168A0] text-white rounded-xl text-sm font-bold hover:bg-[#015580] transition-all shadow-lg shadow-[#0168A0]/20">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value="$42,500.00"
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Conversion Rate"
                    value="4.5%"
                    trend="+0.8%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    label="Avg. Order Value"
                    value="$944.44"
                    trend="-2.4%"
                    trendUp={false}
                    icon={ShoppingCart}
                    color="purple"
                />
                <StatCard
                    label="Total Visitors"
                    value="12,450"
                    trend="+18.2%"
                    trendUp={true}
                    icon={Users}
                    color="orange"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-white">Revenue Velocity</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                $8,400 Peak
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel Chart */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-8">Conversion Funnel</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Dropoff</p>
                            <p className="text-sm font-bold text-red-400">35%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Dropoff</p>
                            <p className="text-sm font-bold text-red-400">57%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Dropoff</p>
                            <p className="text-sm font-bold text-red-400">57%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Success</p>
                            <p className="text-sm font-bold text-green-400">37%</p>
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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-2xl font-black text-white">{value}</h3>
            <p className="text-sm font-bold text-gray-500 mt-1">{label}</p>
        </div>
    )
}
