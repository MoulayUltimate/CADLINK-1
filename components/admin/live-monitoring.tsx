"use client"

import { useState, useEffect } from 'react'
import { Users, Globe, Activity, MousePointerClick, ShoppingCart, Eye, MapPin } from 'lucide-react'

interface ActiveRegion {
    country: string
    count: number
}

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

export function LiveMonitoring() {
    const [activeUsers, setActiveUsers] = useState(0)
    const [cartEvents, setCartEvents] = useState<number[]>([])
    const [activeRegions, setActiveRegions] = useState<ActiveRegion[]>([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const fetchLiveData = async () => {
            try {
                const res = await fetch('/api/analytics/live')
                if (res.ok) {
                    const data = await res.json()
                    setActiveUsers(data.activeUsers || 0)
                    setCartEvents(data.cartEvents || [])
                    setActiveRegions(data.activeRegions || [])
                    setIsConnected(true)
                }
            } catch (err) {
                console.error('Failed to fetch live data', err)
                setIsConnected(false)
            }
        }

        fetchLiveData()
        const interval = setInterval(fetchLiveData, 5000)
        return () => clearInterval(interval)
    }, [])

    const getCountryName = (code: string) => {
        return countryNames[code] || `🌍 ${code}`
    }

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-foreground">Live Monitoring</h2>
                    <p className="text-muted-foreground text-sm">Real-time visitor activity</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card backdrop-blur-md border border-border rounded-xl">
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-sm font-bold text-foreground">{isConnected ? 'Live' : 'Connecting...'}</span>
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Active Visitors"
                    value={activeUsers}
                    color="blue"
                    pulse={activeUsers > 0}
                />
                <MetricCard
                    icon={Eye}
                    label="Page Views/min"
                    value={activeUsers}
                    color="purple"
                />
                <MetricCard
                    icon={ShoppingCart}
                    label="Cart Events"
                    value={cartEvents.length}
                    color="green"
                    pulse={cartEvents.length > 0}
                />
                <MetricCard
                    icon={Activity}
                    label="Active Regions"
                    value={activeRegions.length}
                    color="orange"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Visitor List */}
                <div className="lg:col-span-2 bg-card backdrop-blur-md border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Active Visitors ({activeUsers})
                        </h3>
                    </div>

                    {activeUsers > 0 ? (
                        <div className="space-y-3">
                            {activeRegions.map((region, idx) => (
                                <div key={region.country} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{getCountryName(region.country)}</p>
                                            <p className="text-xs text-muted-foreground">Active now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-foreground">{region.count}</span>
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-xl">
                            <Users className="w-12 h-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground font-bold">No active visitors at the moment</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Visitors will appear here in real-time</p>
                        </div>
                    )}
                </div>

                {/* Top Pages & Countries */}
                <div className="space-y-6">
                    {/* Top Pages */}
                    <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <MousePointerClick className="w-5 h-5 text-purple-400" />
                            Top Pages
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                                <span className="text-sm text-foreground font-medium">/</span>
                                <span className="text-xs text-muted-foreground">Homepage</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm text-foreground font-medium">/checkout</span>
                                <span className="text-xs text-muted-foreground">Checkout</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Regions */}
                    <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-400" />
                            Active Regions
                        </h3>
                        {activeRegions.length > 0 ? (
                            <div className="space-y-2">
                                {activeRegions.slice(0, 5).map((region) => (
                                    <div key={region.country} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                                        <span className="text-sm text-foreground">{getCountryName(region.country)}</span>
                                        <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">{region.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">No data available</p>
                        )}
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
    color: 'blue' | 'purple' | 'green' | 'orange'
    pulse?: boolean
}

function MetricCard({ icon: Icon, label, value, color, pulse }: MetricCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/10 to-transparent text-blue-400 bg-blue-500/20',
        purple: 'from-purple-500/10 to-transparent text-purple-400 bg-purple-500/20',
        green: 'from-green-500/10 to-transparent text-green-400 bg-green-500/20',
        orange: 'from-orange-500/10 to-transparent text-orange-400 bg-orange-500/20',
    }

    return (
        <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-border transition-colors">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorClasses[color].split(' ')[2]}`}>
                        <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[1]}`} />
                    </div>
                </div>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-foreground">{value.toLocaleString()}</h3>
                    {pulse && (
                        <span className="flex h-2 w-2 mb-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground font-bold mt-1">{label}</p>
            </div>
        </div>
    )
}
