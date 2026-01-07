import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Order {
    id: string
    email: string
    amount: number
    currency: string
    status: string
    timestamp: number
    paymentIntent: string
}

// Cloudflare KV type definition
interface KVNamespace {
    get(key: string, type: 'json'): Promise<any>
    put(key: string, value: string | ArrayBuffer | ReadableStream): Promise<void>
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[] }>
}

export async function GET(req: NextRequest) {
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        const { keys } = await KV.list({ prefix: 'order:' })
        const orders = await Promise.all(
            keys.map(async (key: { name: string }) => {
                return await KV.get(key.name, 'json') as Order
            })
        )
        return NextResponse.json(orders.sort((a, b) => b.timestamp - a.timestamp))
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email, amount, currency, paymentIntent } = body

    if (!email || !amount || !paymentIntent) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    const order: Order = {
        id: orderId,
        email,
        amount,
        currency: currency || 'USD',
        status: 'completed',
        timestamp: Date.now(),
        paymentIntent
    }

    try {
        await KV.put(`order:${orderId}`, JSON.stringify(order))
        return NextResponse.json(order)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }
}
