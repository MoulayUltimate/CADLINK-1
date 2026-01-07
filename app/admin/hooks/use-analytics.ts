import { useState, useEffect, useCallback } from 'react'
import type { LiveVisitorData } from '@/types/analytics'

// Simulated WebSocket connection (replace with real Socket.io in production)
export function useRealTimeAnalytics() {
    const [liveData, setLiveData] = useState<LiveVisitorData>({
        totalActive: 0,
        visitors: [],
        recentEvents: [],
        topPages: [],
        countriesMap: {},
    })
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Simulate WebSocket connection
        setIsConnected(true)

        // Simulate live data updates
        const interval = setInterval(() => {
            setLiveData((prev) => {
                const change = Math.floor(Math.random() * 10) - 5
                const newTotal = Math.max(20, Math.min(500, prev.totalActive + change))

                // Generate realistic visitor data
                const visitors = Array.from({ length: Math.min(10, newTotal) }, (_, i) => ({
                    id: `visitor-${i}`,
                    sessionId: `session-${i}`,
                    ip: `${Math.floor(Math.random() * 255)}.***.***.***`,
                    country: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP'][Math.floor(Math.random() * 7)],
                    city: ['New York', 'London', 'Berlin', 'Paris', 'Toronto', 'Sydney', 'Tokyo'][Math.floor(Math.random() * 7)],
                    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
                    browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)],
                    os: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'][Math.floor(Math.random() * 5)],
                    firstVisit: new Date(Date.now() - Math.random() * 3600000),
                    lastSeen: new Date(),
                    pageViews: Math.floor(Math.random() * 10) + 1,
                    status: ['active', 'idle', 'offline'][Math.floor(Math.random() * 3)] as 'active' | 'idle' | 'offline',
                }))

                // Generate top pages
                const topPages = [
                    { url: '/', count: Math.floor(Math.random() * 50) + 20 },
                    { url: '/products', count: Math.floor(Math.random() * 30) + 10 },
                    { url: '/checkout', count: Math.floor(Math.random() * 15) + 5 },
                    { url: '/about', count: Math.floor(Math.random() * 10) + 3 },
                ]

                // Generate countries map
                const countriesMap: Record<string, number> = {}
                visitors.forEach((v) => {
                    countriesMap[v.country] = (countriesMap[v.country] || 0) + 1
                })

                return {
                    totalActive: newTotal,
                    visitors,
                    recentEvents: prev.recentEvents.slice(0, 20),
                    topPages,
                    countriesMap,
                }
            })
        }, 3000) // Update every 3 seconds

        return () => {
            clearInterval(interval)
            setIsConnected(false)
        }
    }, [])

    const trackEvent = useCallback((eventType: string, metadata?: Record<string, any>) => {
        // In production, send to backend API
        console.log('Track event:', eventType, metadata)
    }, [])

    return { liveData, isConnected, trackEvent }
}

// Hook for historical analytics data
export function useAnalyticsDashboard(dateRange: { start: Date; end: Date }) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            // Generate realistic time series data
            const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
            const timeSeriesData = Array.from({ length: days }, (_, i) => {
                const date = new Date(dateRange.start.getTime() + i * 24 * 60 * 60 * 1000)
                return {
                    timestamp: date,
                    visitors: Math.floor(Math.random() * 500) + 200,
                    pageViews: Math.floor(Math.random() * 2000) + 800,
                    conversions: Math.floor(Math.random() * 50) + 10,
                }
            })

            setData({
                visitors: {
                    total: timeSeriesData.reduce((sum, d) => sum + d.visitors, 0),
                    new: Math.floor(Math.random() * 1000) + 500,
                    returning: Math.floor(Math.random() * 2000) + 1000,
                    trend: (Math.random() - 0.5) * 0.4, // -20% to +20%
                },
                sessions: {
                    total: timeSeriesData.reduce((sum, d) => sum + d.visitors, 0),
                    avgDuration: Math.floor(Math.random() * 300) + 120, // seconds
                    bounceRate: Math.random() * 0.4 + 0.3, // 30-70%
                },
                conversions: {
                    rate: Math.random() * 0.1 + 0.02, // 2-12%
                    total: timeSeriesData.reduce((sum, d) => sum + d.conversions, 0),
                    revenue: Math.floor(Math.random() * 50000) + 20000,
                },
                timeSeriesData,
            })
            setLoading(false)
        }, 500)
    }, [dateRange])

    return { data, loading }
}
