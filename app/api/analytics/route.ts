import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Order {
    id: string
    amount: number
    timestamp: number
}

interface KVNamespace {
    get(key: string, type: 'text'): Promise<string | null>
    put(key: string, value: string): Promise<void>
    list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
    get(key: string, type: 'json'): Promise<any>
}

export async function GET(req: NextRequest) {
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        // 1. Fetch Visits
        const visitsStr = await KV.get('analytics:visits', 'text')
        const visits = parseInt(visitsStr || '0')

        // 2. Fetch cart events count
        const cartEventsStr = await KV.get('analytics:cart_events', 'text')
        const cartEvents = parseInt(cartEventsStr || '0')

        // 3. Fetch checkout starts count
        const checkoutStartsStr = await KV.get('analytics:checkout_starts', 'text')
        const checkoutStarts = parseInt(checkoutStartsStr || '0')

        // 4. Fetch Orders to calculate revenue and AOV
        const { keys: orderKeys } = await KV.list({ prefix: 'cadlink:order:' })
        const orders = await Promise.all(
            orderKeys.map(async (key) => {
                return await KV.get(key.name, 'json') as Order
            })
        )

        const validOrders = orders.filter(o => o)
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
        const totalOrders = validOrders.length
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        const conversionRate = visits > 0 ? (totalOrders / visits) * 100 : 0

        // 5. Calculate daily revenue for the last 7 days
        const now = Date.now()
        const dayMs = 24 * 60 * 60 * 1000
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dailyRevenue: { name: string; revenue: number }[] = []

        for (let i = 6; i >= 0; i--) {
            const dayStart = now - (i * dayMs)
            const dayEnd = dayStart + dayMs
            const dayName = days[new Date(dayStart).getDay()]
            const dayTotal = validOrders
                .filter(o => o.timestamp >= dayStart && o.timestamp < dayEnd)
                .reduce((sum, o) => sum + (o.amount || 0), 0)
            dailyRevenue.push({ name: dayName, revenue: dayTotal })
        }

        // 6. Build funnel data
        const funnelData = [
            { name: 'Visitors', value: visits, fill: '#0168A0' },
            { name: 'Add to Cart', value: cartEvents, fill: '#015580' },
            { name: 'Checkout', value: checkoutStarts, fill: '#014460' },
            { name: 'Purchase', value: totalOrders, fill: '#4CAF50' },
        ]

        return NextResponse.json({
            visits,
            activeUsers: Math.floor(Math.random() * 5) + 1,
            totalRevenue,
            totalOrders,
            avgOrderValue,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            dailyRevenue,
            funnelData
        })
    } catch (err) {
        console.error('Analytics fetch failed', err)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        let visits = await KV.get('analytics:visits', 'text')
        let count = parseInt(visits || '0')
        count++
        await KV.put('analytics:visits', count.toString())
        return NextResponse.json({ success: true, visits: count })
    } catch (err) {
        return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 })
    }
}
