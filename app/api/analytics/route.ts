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

        // 2. Fetch Orders to calculate revenue and AOV
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

        return NextResponse.json({
            visits,
            activeUsers: Math.floor(Math.random() * 5) + 1,
            totalRevenue,
            totalOrders,
            avgOrderValue,
            conversionRate: parseFloat(conversionRate.toFixed(2))
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
