import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'edge'

interface Order {
    id: string
    email: string
    name: string
    amount: number
    currency: string
    status: string
    timestamp: number
    paymentIntent: string
}

// Cloudflare KV type definition
interface KVNamespace {
    get(key: string, type: 'json'): Promise<any>
    get(key: string, type: 'text'): Promise<string | null>
    put(key: string, value: string): Promise<void>
    delete(key: string): Promise<void>
    list(options?: { prefix?: string; limit?: number }): Promise<{ keys: { name: string }[] }>
}

const KV_PREFIX = 'cadlink:order:'
const PI_PREFIX = 'cadlink:pi:'  // For paymentIntent deduplication

import { verifyAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json([])
    }

    try {
        const listResult = await KV.list({ prefix: KV_PREFIX })
        const keys = listResult?.keys || []
        const orders = await Promise.all(
            keys.map(async (key: { name: string }) => {
                try {
                    return await KV.get(key.name, 'json') as Order
                } catch {
                    return null
                }
            })
        )
        const validOrders = orders.filter((o): o is Order => o !== null && typeof o === 'object')
        return NextResponse.json(validOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)))
    } catch (err) {
        console.error('Failed to fetch orders:', err)
        return NextResponse.json([])
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email: clientEmail, name: clientName, amount: clientAmount, currency, paymentIntent } = body

    if (!paymentIntent) {
        return NextResponse.json({ error: 'Missing paymentIntent' }, { status: 400 })
    }

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    // 1. Fast duplicate check using PI_PREFIX key
    try {
        const existingOrderId = await KV.get(`${PI_PREFIX}${paymentIntent}`, 'text')
        if (existingOrderId) {
            // Already have an order for this payment intent
            const existingOrder = await KV.get(`${KV_PREFIX}${existingOrderId}`, 'json')
            if (existingOrder) {
                return NextResponse.json({ ...existingOrder, duplicate: true })
            }
        }
    } catch (err) {
        console.error('Duplicate check failed:', err)
    }

    // 2. Try to fetch details from Stripe for verification
    let email = clientEmail || 'unknown@example.com'
    let name = clientName || 'Valued Customer'
    let amount = clientAmount || 75.19

    try {
        if (process.env.STRIPE_SECRET_KEY) {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                httpClient: Stripe.createFetchHttpClient(),
            })
            const pi = await stripe.paymentIntents.retrieve(paymentIntent)

            if (pi.status !== 'succeeded') {
                return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
            }

            if (pi) {
                email = pi.receipt_email || email
                const charge = typeof pi.latest_charge === 'string'
                    ? await stripe.charges.retrieve(pi.latest_charge)
                    : (pi as any).charges?.data?.[0]

                if (charge) {
                    email = charge.billing_details?.email || email
                    name = charge.billing_details?.name || name
                }
                amount = pi.amount / 100
            }
        } else {
            console.warn('Skipping Stripe verification: STRIPE_SECRET_KEY not set')
        }
    } catch (err) {
        console.error('Stripe verification failed:', err)
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    const order: Order = {
        id: orderId,
        email,
        name,
        amount,
        currency: currency || 'USD',
        status: 'completed',
        timestamp: Date.now(),
        paymentIntent
    }

    try {
        // Save order
        await KV.put(`${KV_PREFIX}${orderId}`, JSON.stringify(order))
        // Save paymentIntent lookup key for fast deduplication
        await KV.put(`${PI_PREFIX}${paymentIntent}`, orderId)
        return NextResponse.json(order)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV not available' }, { status: 500 })
    }

    try {
        // Get the order first to find the paymentIntent
        const order = await KV.get(`${KV_PREFIX}${orderId}`, 'json') as Order | null

        // Delete the order
        await KV.delete(`${KV_PREFIX}${orderId}`)

        // Also delete the paymentIntent lookup key if exists
        if (order?.paymentIntent) {
            await KV.delete(`${PI_PREFIX}${order.paymentIntent}`)
        }

        return NextResponse.json({ success: true, deleted: orderId })
    } catch (err) {
        console.error('Failed to delete order:', err)
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }
}
