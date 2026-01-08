"use client"

import { useState, useEffect } from 'react'
import { useLiveTraffic } from '@/app/admin/hooks/use-live-traffic'
import { Users, ShoppingCart, Activity, Globe, MapPin, MessageCircle, Bell } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { requestNotificationPermission, sendNotification, getNotificationPermission } from '@/lib/notification-utils'

// Country code to name mapping
const countryNames: Record<string, string> = {
    'US': '🇺🇸 United States',
    'GB': '🇬🇧 United Kingdom',
    'CA': '🇨🇦 Canada',
    'AU': '🇦🇺 Australia',
    'DE': '🇩🇪 Germany',
    'FR': '🇫🇷 France',
    'ES': '🇪🇸 Spain',
    'IT': '🇮🇹 Italy',
    'NL': '🇳🇱 Netherlands',
    'BR': '🇧🇷 Brazil',
    'MX': '🇲🇽 Mexico',
    'IN': '🇮🇳 India',
    'JP': '🇯🇵 Japan',
    'CN': '🇨🇳 China',
    'KR': '🇰🇷 South Korea',
    'MA': '🇲🇦 Morocco',
    'AE': '🇦🇪 UAE',
    'SA': '🇸🇦 Saudi Arabia',
    'Unknown': '🌍 Unknown'
}

interface ChatSession {
    id: string
    lastMessage: string
    unreadCount: number
}

export function Dashboard() {
    const { activeUsers, cartEvents, activeRegions } = useLiveTraffic()
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 })
    const [unreadChats, setUnreadChats] = useState(0)
    const [recentChats, setRecentChats] = useState<ChatSession[]>([])
    const [prevUnreadCount, setPrevUnreadCount] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics')
                const data = await res.json()
                if (!data.error) {
                    setStats({
                        totalRevenue: data.totalRevenue || 0,
                        totalOrders: data.totalOrders || 0
                    })
                }
            } catch (err) {
                console.error('Failed to fetch stats', err)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 10000)
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

                    // Send browser notification if new messages
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
                    setRecentChats(data.filter((s: ChatSession) => s.unreadCount > 0).slice(0, 3))
                }
            } catch (err) {
                console.error('Failed to fetch chats', err)
            }
        }
        fetchChats()
        const interval = setInterval(fetchChats, 5000)
        return () => clearInterval(interval)
    }, [prevUnreadCount])

    const getCountryName = (code: string) => {
        return countryNames[code] || `🌍 ${code}`
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Unread Chat Alert */}
            {unreadChats > 0 && (
                <div className="bg-gradient-to-r from-[#0168A0] to-[#015580] text-white p-4 rounded-2xl flex items-center justify-between animate-pulse">
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

            {/* Live Counters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Chat Messages Card */}
                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Chat Messages</p>
                            <h3 className="text-4xl font-black text-foreground mt-2 flex items-center gap-3">
                                {unreadChats}
                                {unreadChats > 0 && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl ${unreadChats > 0 ? 'bg-orange-500/20 text-orange-500 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>
                            <MessageCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

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
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">Live</span>
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl transition-colors ${cartEvents.length > 0 ? 'bg-purple-500/20 text-purple-500 dark:text-purple-400 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                            <h3 className="text-4xl font-black text-foreground mt-2">
                                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-500 dark:text-green-400">
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
                        <div className="text-center">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground font-bold">{activeUsers} active user{activeUsers !== 1 ? 's' : ''}</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">Real-time visitor count</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        Active Regions
                    </h3>
                    <div className="space-y-3">
                        {activeRegions.length > 0 ? (
                            activeRegions.map((region, idx) => (
                                <div key={region.country} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{getCountryName(region.country)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-foreground">{region.count}</span>
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MapPin className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                                <p className="text-muted-foreground text-sm">No active regions detected</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Regions appear as users browse</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

