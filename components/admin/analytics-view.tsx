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

const revenueData: any[] = []
const funnelData: any[] = []

export function AnalyticsView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Analytics Command</h2>
                    <p className="text-gray-400">Deep dive into your store's performance metrics.</p>
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
                    value="$0.00"
                    trend="0%"
                    trendUp={true}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Conversion Rate"
                    value="0%"
                    trend="0%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    label="Avg. Order Value"
                    value="$0.00"
                    trend="0%"
                    trendUp={true}
                    icon={ShoppingCart}
                    color="purple"
                />
                <StatCard
                    label="Total Visitors"
                    value="0"
                    trend="0%"
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
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                        <p className="text-gray-500 font-bold">Waiting for transaction data...</p>
                    </div>
                </div>

                {/* Funnel Chart */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-8">Conversion Funnel</h3>
                    <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                        <p className="text-gray-500 font-bold">Waiting for visitor data...</p>
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
