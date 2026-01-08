"use client"

import { useState, useEffect } from 'react'
import { useLiveTraffic } from '@/app/admin/hooks/use-live-traffic'
import { Users, ShoppingCart, Activity, Globe, MapPin, MessageCircle, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { requestNotificationPermission, sendNotification, getNotificationPermission } from '@/lib/notification-utils'

// Country code to flag and name mapping
const countryData: { [key: string]: { flag: string; name: string } } = {
    'US': { flag: '🇺🇸', name: 'United States' },
    'GB': { flag: '🇬🇧', name: 'United Kingdom' },
    'CA': { flag: '🇨🇦', name: 'Canada' },
    'DE': { flag: '🇩🇪', name: 'Germany' },
    'FR': { flag: '🇫🇷', name: 'France' },
    'AU': { flag: '🇦🇺', name: 'Australia' },
    'NL': { flag: '🇳🇱', name: 'Netherlands' },
    'ES': { flag: '🇪🇸', name: 'Spain' },
    'IT': { flag: '🇮🇹', name: 'Italy' },
    'BR': { flag: '🇧🇷', name: 'Brazil' },
    'IN': { flag: '🇮🇳', name: 'India' },
    'JP': { flag: '🇯🇵', name: 'Japan' },
    'CN': { flag: '🇨🇳', name: 'China' },
    'MX': { flag: '🇲🇽', name: 'Mexico' },
    'KR': { flag: '🇰🇷', name: 'South Korea' },
    'RU': { flag: '🇷🇺', name: 'Russia' },
    'PL': { flag: '🇵🇱', name: 'Poland' },
    'SE': { flag: '🇸🇪', name: 'Sweden' },
    'NO': { flag: '🇳🇴', name: 'Norway' },
    'DK': { flag: '🇩🇰', name: 'Denmark' },
    'BE': { flag: '🇧🇪', name: 'Belgium' },
    'CH': { flag: '🇨🇭', name: 'Switzerland' },
    'AT': { flag: '🇦🇹', name: 'Austria' },
    'IE': { flag: '🇮🇪', name: 'Ireland' },
    'NZ': { flag: '🇳🇿', name: 'New Zealand' },
    'SG': { flag: '🇸🇬', name: 'Singapore' },
    'PT': { flag: '🇵🇹', name: 'Portugal' },
    'AR': { flag: '🇦🇷', name: 'Argentina' },
    'ZA': { flag: '🇿🇦', name: 'South Africa' },
    'AE': { flag: '🇦🇪', name: 'UAE' },
    'SA': { flag: '🇸🇦', name: 'Saudi Arabia' },
    'IL': { flag: '🇮🇱', name: 'Israel' },
    'TR': { flag: '🇹🇷', name: 'Turkey' },
    'EG': { flag: '🇪🇬', name: 'Egypt' },
    'NG': { flag: '🇳🇬', name: 'Nigeria' },
    'KE': { flag: '🇰🇪', name: 'Kenya' },
    'MA': { flag: '🇲🇦', name: 'Morocco' },
    'PH': { flag: '🇵🇭', name: 'Philippines' },
    'ID': { flag: '🇮🇩', name: 'Indonesia' },
    'TH': { flag: '🇹🇭', name: 'Thailand' },
    'VN': { flag: '🇻🇳', name: 'Vietnam' },
    'PK': { flag: '🇵🇰', name: 'Pakistan' },
    'BD': { flag: '🇧🇩', name: 'Bangladesh' },
    'CO': { flag: '🇨🇴', name: 'Colombia' },
    'CL': { flag: '🇨🇱', name: 'Chile' },
    'PE': { flag: '🇵🇪', name: 'Peru' },
}

function getCountryInfo(code: string): { flag: string; name: string } {
    return countryData[code] || { flag: '🌍', name: code }
}

interface ChatSession {
    id: string
    lastMessage: string
    unreadCount: number
}

interface DailyRevenue {
    name: string
    revenue: number
}

interface FunnelItem {
    name: string
    value: number
    fill: string
}

interface ActiveRegion {
    country: string
    count: number
}

interface AnalyticsData {
    visits: number
    activeUsers: number
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    conversionRate: number
    dailyRevenue: DailyRevenue[]
    funnelData: FunnelItem[]
    activeRegions: ActiveRegion[]
}

export function Dashboard() {
    const { activeUsers: liveUsers, cartEvents, activeRegions: liveRegions } = useLiveTraffic()
    const [stats, setStats] = useState<AnalyticsData>({
        visits: 0,
        activeUsers: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        conversionRate: 0,
        dailyRevenue: [],
        funnelData: [],
        activeRegions: []
    })
    const [unreadChats, setUnreadChats] = useState(0)
    const [prevUnreadCount, setPrevUnreadCount] = useState(0)
    const [isLive, setIsLive] = useState(false)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics')
                const data = await res.json()
                if (!data.error) {
                    setStats({
                        visits: data.visits || 0,
                        activeUsers: data.activeUsers || 0,
                        totalRevenue: data.totalRevenue || 0,
                        totalOrders: data.totalOrders || 0,
                        avgOrderValue: data.avgOrderValue || 0,
                        conversionRate: data.conversionRate || 0,
                        dailyRevenue: data.dailyRevenue || [],
                        funnelData: data.funnelData || [],
                        activeRegions: data.activeRegions || []
                    })
                    setIsLive(true)
                }
            } catch (err) {
                console.error('Failed to fetch stats', err)
                setIsLive(false)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    // Fetch chat sessions for notifications
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch('/api/chat?admin=true')
                const data = await res.json()
                if (Array.isArray(data)) {
                    const totalUnread = data.reduce((sum: number, s: ChatSession) => sum + (s.unreadCount || 0), 0)

                    if (totalUnread > prevUnreadCount && getNotificationPermission() === 'granted') {
                        const newChat = data.find((s: ChatSession) => s.unreadCount > 0)
                        if (newChat) {
                            sendNotification('💬 New Chat Message', {
                                body: newChat.lastMessage,
                                tag: 'dashboard-chat'
                            })
                        }
                    }

                    setPrevUnreadCount(totalUnread)
                    setUnreadChats(totalUnread)
                }
            } catch (err) {
                console.error('Failed to fetch chats', err)
            }
        }
        fetchChats()
        const interval = setInterval(fetchChats, 5000)
        return () => clearInterval(interval)
    }, [prevUnreadCount])

    const activeUsers = stats.activeUsers || liveUsers
    const activeRegions = stats.activeRegions.length > 0 ? stats.activeRegions : liveRegions

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-foreground">Dashboard</h2>
                        {isLive && (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                LIVE
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm">Real-time analytics and visitor tracking</p>
                </div>
            </div>

            {/* Unread Chat Alert */}
            {unreadChats > 0 && (
                <div className="bg-gradient-to-r from-[#0168A0] to-[#015580] text-white p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-lg">{unreadChats} Unread Message{unreadChats !== 1 ? 's' : ''}</p>
                            <p className="text-sm opacity-80">Click Live Chat to respond</p>
                        </div>
                    </div>
                    <a
                        href="/admin?view=chat"
                        className="px-6 py-2 bg-white text-[#0168A0] font-bold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        View Chats
                    </a>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    trend={stats.totalOrders > 0 ? `${stats.totalOrders} orders` : 'No orders'}
                    trendUp={stats.totalOrders > 0}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Active Users"
                    value={activeUsers.toString()}
                    trend="Online now"
                    trendUp={true}
                    icon={Users}
                    color="blue"
                    pulse={activeUsers > 0}
                />
                <StatCard
                    label="Cart Events"
                    value={cartEvents.length.toString()}
                    trend="Live"
                    trendUp={cartEvents.length > 0}
                    icon={ShoppingCart}
                    color="purple"
                />
                <StatCard
                    label="Conversion Rate"
                    value={`${stats.conversionRate}%`}
                    trend={stats.visits > 0 ? `${stats.visits} visits` : 'No data'}
                    trendUp={stats.conversionRate > 0}
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-foreground mb-6">Revenue (Last 7 Days)</h3>
                    <div className="h-[250px] w-full">
                        {stats.dailyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.dailyRevenue}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0168A0" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0168A0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip
                                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0168A0" strokeWidth={3} fill="url(#revenueGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>No revenue data yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-foreground mb-6">Conversion Funnel</h3>
                    <div className="space-y-4">
                        {stats.funnelData.length > 0 ? (
                            stats.funnelData.map((item, index) => {
                                const maxValue = Math.max(...stats.funnelData.map(d => d.value), 1)
                                const percentage = ((item.value / maxValue) * 100).toFixed(0)
                                const prevValue = index > 0 ? stats.funnelData[index - 1].value : item.value
                                const dropRate = prevValue > 0 ? ((1 - item.value / prevValue) * 100).toFixed(1) : 0

                                return (
                                    <div key={index} className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: item.fill }}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-bold text-foreground">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-black text-foreground">{item.value.toLocaleString()}</span>
                                                {index > 0 && Number(dropRate) > 0 && (
                                                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                                                        -{dropRate}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{ width: `${percentage}%`, backgroundColor: item.fill }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                                <p>No funnel data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Regions from Google Analytics */}
            <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Active Users by Region
                    </h3>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {activeUsers} online now
                    </span>
                </div>
                {activeRegions.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeRegions.slice(0, 8).map((region, index) => {
                            const info = getCountryInfo(region.country)
                            return (
                                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                    <span className="text-2xl">{info.flag}</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground text-sm">{info.name}</p>
                                        <p className="text-xs text-muted-foreground">{region.count} user{region.count !== 1 ? 's' : ''}</p>
                                    </div>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <MapPin className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm">No active regions detected</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Regions appear as users browse</p>
                    </div>
                )}
            </div>

            {/* User Activity Trace */}
            <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-500" />
                        Live User Activity
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground">Last 5 minutes</span>
                </div>
                <div className="space-y-3">
                    {stats.funnelData.length > 0 ? (
                        <div className="grid md:grid-cols-4 gap-4">
                            {stats.funnelData.map((item, index) => (
                                <div key={index} className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                        <span className="text-sm font-bold text-muted-foreground">{item.name}</span>
                                    </div>
                                    <p className="text-2xl font-black text-foreground">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No user activity yet</p>
                    )}

                    {/* Recent Events Timeline */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-sm font-bold text-muted-foreground mb-3">Recent Events</p>
                        <div className="space-y-2">
                            {cartEvents.length > 0 ? (
                                cartEvents.slice(0, 5).map((_, index) => (
                                    <div key={index} className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span className="text-muted-foreground">Cart event from visitor</span>
                                        <span className="text-xs text-muted-foreground/50 ml-auto">Just now</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground/70">No recent events</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, trend, trendUp, icon: Icon, color, pulse }: any) {
    const colors: any = {
        green: 'bg-green-500/10 text-green-500',
        blue: 'bg-blue-500/10 text-blue-500',
        purple: 'bg-purple-500/10 text-purple-500',
        orange: 'bg-orange-500/10 text-orange-500',
    }

    return (
        <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]} ${pulse ? 'animate-pulse' : ''}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-2xl font-black text-foreground">{value}</h3>
            <p className="text-sm font-bold text-muted-foreground mt-1">{label}</p>
        </div>
    )
}
