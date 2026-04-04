import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { getGA4Data } from '@/lib/ga4'

export const runtime = 'edge'

interface Order {
    id: string
    amount: number
    timestamp: number
}

interface KVNamespace {
    get(key: string, type: 'text' | 'json'): Promise<any>
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
    list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
    delete(key: string): Promise<void>
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const KV = (process.env as any).KV as KVNamespace

    if (action[0] === 'live') {
        const authError = await verifyAdmin(req)
        if (authError) return authError
        if (!KV) return NextResponse.json({ activeUsers: 0, cartEvents: [], activeRegions: [] })
        try {
            const { keys } = await KV.list({ prefix: 'presence:' })
            const activeUsers = keys.length
            const activeRegions: { country: string; count: number }[] = []
            const countryMap: Record<string, number> = {}
            for (const key of keys) {
                const data = await KV.get(key.name, 'text')
                if (data) {
                    const parsed = JSON.parse(data)
                    const country = parsed.country || 'Unknown'
                    countryMap[country] = (countryMap[country] || 0) + 1
                }
            }
            for (const [country, count] of Object.entries(countryMap)) activeRegions.push({ country, count })
            activeRegions.sort((a, b) => b.count - a.count)
            const cartEventsStr = await KV.get('analytics:recent_cart_events', 'text')
            const cartEvents = cartEventsStr ? JSON.parse(cartEventsStr) : []
            return NextResponse.json({ activeUsers, cartEvents, activeRegions })
        } catch {
            return NextResponse.json({ activeUsers: 0, cartEvents: [], activeRegions: [] })
        }
    }

    if (action.length === 0) {
        const authError = await verifyAdmin(req)
        if (authError) return authError
        if (!KV) return NextResponse.json({ visits: 0, activeUsers: 0, totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, conversionRate: 0, dailyRevenue: [], funnelData: [] })
        try {
            const visitsStr = await KV.get('analytics:visits', 'text')
            let visits = parseInt(visitsStr || '0')
            const cartEventsStr = await KV.get('analytics:cart_events', 'text')
            const cartEvents = parseInt(cartEventsStr || '0')
            const checkoutStartsStr = await KV.get('analytics:checkout_starts', 'text')
            const checkoutStarts = parseInt(checkoutStartsStr || '0')

            const listResult = await KV.list({ prefix: 'cadlink:order:' })
            const orderKeys = listResult?.keys || []
            const orders = await Promise.all(orderKeys.map(async (k) => await KV.get(k.name, 'json')))
            const validOrders = orders.filter((o): o is Order => !!o)
            const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
            const totalOrders = validOrders.length
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
            const conversionRate = visits > 0 ? (totalOrders / visits) * 100 : 0
            const now = Date.now(), dayMs = 24 * 60 * 60 * 1000, days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], dailyRevenue = []
            for (let i = 6; i >= 0; i--) {
                const dayStart = now - (i * dayMs), dayEnd = dayStart + dayMs, dayName = days[new Date(dayStart).getDay()]
                const dayTotal = validOrders.filter(o => o.timestamp >= dayStart && o.timestamp < dayEnd).reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
                dailyRevenue.push({ name: dayName, revenue: dayTotal })
            }
            const funnelData = [{ name: 'Visitors', value: visits, fill: '#0168A0' }, { name: 'Add to Cart', value: cartEvents, fill: '#015580' }, { name: 'Checkout', value: checkoutStarts, fill: '#014460' }, { name: 'Purchase', value: totalOrders, fill: '#4CAF50' }]
            const url = new URL(req.url)
            const gaStats = await getGA4Data(url.searchParams.get('startDate') || '7daysAgo', url.searchParams.get('endDate') || 'today')
            return NextResponse.json({ visits: gaStats?.visits || visits, activeUsers: gaStats?.activeUsers || 0, activeUsers30Min: gaStats?.activeUsers30Min || 0, activeRegions: gaStats?.activeRegions || [], cityStats: gaStats?.cityStats || [], totalRevenue, totalOrders, avgOrderValue, conversionRate, dailyRevenue, funnelData })
        } catch (err) { return NextResponse.json({ visits: 0, activeUsers: 0, totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, conversionRate: 0, dailyRevenue: [], funnelData: [] }) }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) return NextResponse.json({ success: false, error: 'KV not found' }, { status: 500 })

    if (action[0] === 'cart') {
        try {
            const currentCount = await KV.get('analytics:cart_events', 'text')
            const count = parseInt(currentCount || '0') + 1
            await KV.put('analytics:cart_events', count.toString())
            const recentEventsStr = await KV.get('analytics:recent_cart_events', 'text')
            let recentEvents: number[] = recentEventsStr ? JSON.parse(recentEventsStr) : []
            const now = Date.now()
            recentEvents.push(now)
            const fiveMinutesAgo = now - (5 * 60 * 1000)
            recentEvents = recentEvents.filter(ts => ts > fiveMinutesAgo)
            await KV.put('analytics:recent_cart_events', JSON.stringify(recentEvents))
            return NextResponse.json({ success: true, totalCartEvents: count, recentCount: recentEvents.length })
        } catch { return NextResponse.json({ success: false }) }
    }

    if (action[0] === 'heartbeat') {
        try {
            const ip = req.headers.get('CF-Connecting-IP') || 'unknown', country = req.headers.get('CF-IPCountry') || 'Unknown', timestamp = Date.now()
            await KV.put(`presence:${ip}`, JSON.stringify({ timestamp, country }), { expirationTtl: 60 })
            try {
                const countryStatsStr = await KV.get('analytics:countries', 'text')
                const countryStats: Record<string, number> = countryStatsStr ? JSON.parse(countryStatsStr) : {}
                countryStats[country] = (countryStats[country] || 0) + 1
                await KV.put('analytics:countries', JSON.stringify(countryStats))
            } catch { }
            return NextResponse.json({ success: true, country })
        } catch { return NextResponse.json({ success: false }) }
    }

    if (action.length === 0) {
        try {
            let visits = await KV.get('analytics:visits', 'text')
            let count = parseInt(visits || '0') + 1
            await KV.put('analytics:visits', count.toString())
            return NextResponse.json({ success: true, visits: count })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
