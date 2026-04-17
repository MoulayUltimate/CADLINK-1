import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { getGA4Data } from '@/lib/ga4'

export const runtime = 'edge'

// --- Constants ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_TTL = 60 * 60 * 24 // 24 hours
const STATELESS_TOKEN = `stateless_v1_${ADMIN_PASSWORD}`
const RESEND_API_KEY = process.env.RESEND_API_KEY
const SCRIPTS_KEY = 'cadlink:scripts'
const OFFLINE_THRESHOLD = 30000 // 30 seconds
const KV_PREFIX = 'cadlink:order:'
const PI_PREFIX = 'cadlink:pi:'

const DEFAULT_PRODUCT = {
    id: "prod_cadlink_v11",
    name: "CADLINK Digital Factory 11 DTF Edition",
    price: 75.19,
    image: "/images/cadlink-product.png",
    cogs: 0,
    adCost: 0,
    stock: 999,
    description: "The world's most powerful DTF RIP software. Engineered for precision color management and high-volume production."
}

// --- Interfaces ---
interface KVNamespace {
    get(key: string, type?: 'text' | 'json'): Promise<any>
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete?: boolean; cursor?: string }>
    delete(key: string): Promise<void>
}

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

// --- Unified Handler ---
export async function GET(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
    const { route = [] } = await params
    const path = route.join('/')
    const KV = (process.env as any).KV as KVNamespace
    const { searchParams } = new URL(req.url)

    // 1. Auth Check (Stateless/KV)
    if (path === 'auth/check') {
        const token = req.cookies.get('admin_session')?.value
        if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })
        if (token === STATELESS_TOKEN) return NextResponse.json({ authenticated: true })
        if (!KV) return NextResponse.json({ authenticated: true })
        try {
            const session = await KV.get(`session:${token}`)
            return NextResponse.json({ authenticated: !!session }, { status: session ? 200 : 401 })
        } catch { return NextResponse.json({ authenticated: false }, { status: 401 }) }
    }

    // 2. Product
    if (path === 'product') {
        try {
            if (!KV) return NextResponse.json(DEFAULT_PRODUCT)
            const productData = await KV.get("product:prod_cadlink_v11")
            if (!productData) {
                await KV.put("product:prod_cadlink_v11", JSON.stringify(DEFAULT_PRODUCT))
                return NextResponse.json(DEFAULT_PRODUCT)
            }
            return NextResponse.json(typeof productData === 'string' ? JSON.parse(productData) : productData)
        } catch { return NextResponse.json(DEFAULT_PRODUCT) }
    }

    // 3. Orders (Admin)
    if (path === 'orders') {
        const authError = await verifyAdmin(req)
        if (authError) return authError
        if (!KV) return NextResponse.json([])
        try {
            const listResult = await KV.list({ prefix: KV_PREFIX })
            const orders = await Promise.all((listResult?.keys || []).map(async (key) => {
                try { return await KV.get(key.name, 'json') } catch { return null }
            }))
            return NextResponse.json(orders.filter(o => o).sort((a, b) => b.timestamp - a.timestamp))
        } catch { return NextResponse.json([]) }
    }

    // 4. Abandoned Checkouts (Admin)
    if (path === 'abandoned-checkouts') {
        const authError = await verifyAdmin(req)
        if (authError) return authError
        if (!KV) return NextResponse.json({ checkouts: [] })
        try {
            const { keys } = await KV.list({ prefix: "abandoned:", limit: 100 })
            const checkouts = []
            for (const key of keys) {
                const data = await KV.get(key.name, 'json')
                if (data) checkouts.push({ ...data, date: new Date(data.created_at).toISOString(), value: data.cartValue })
            }
            return NextResponse.json({ checkouts: checkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) })
        } catch { return NextResponse.json({ checkouts: [] }) }
    }

    // 5. Admin Scripts
    if (path === 'admin/scripts') {
        if (!KV) return NextResponse.json([])
        try {
            const scriptsStr = await KV.get(SCRIPTS_KEY)
            return NextResponse.json(scriptsStr ? JSON.parse(scriptsStr) : [])
        } catch { return NextResponse.json([]) }
    }

    // 6. Analytics
    if (path === 'analytics' || path === 'analytics/live') {
        const authError = await verifyAdmin(req)
        if (authError) return authError
        if (!KV) return NextResponse.json({ error: 'KV needed' }, { status: 500 })

        if (path === 'analytics/live') {
            const { keys } = await KV.list({ prefix: 'presence:' })
            const countryMap: Record<string, number> = {}
            for (const key of keys) {
                const p = await KV.get(key.name, 'json'); if (p?.country) countryMap[p.country] = (countryMap[p.country] || 0) + 1
            }
            const activeRegions = Object.entries(countryMap).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count)
            const cartEvents = await KV.get('analytics:recent_cart_events', 'json') || []
            return NextResponse.json({ activeUsers: keys.length, cartEvents, activeRegions })
        }

        const visits = parseInt(await KV.get('analytics:visits', 'text') || '0')
        const cartEvents = parseInt(await KV.get('analytics:cart_events', 'text') || '0')
        const checkoutStarts = parseInt(await KV.get('analytics:checkout_starts', 'text') || '0')
        const listResult = await KV.list({ prefix: KV_PREFIX })
        const orders = await Promise.all((listResult?.keys || []).map(async (k) => await KV.get(k.name, 'json')))
        const validOrders = orders.filter(o => o)
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
        const dailyRevenue = []
        const now = Date.now(), dayMs = 24 * 60 * 60 * 1000, days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        for (let i = 6; i >= 0; i--) {
            const start = now - (i * dayMs), end = start + dayMs
            const rev = validOrders.filter(o => o.timestamp >= start && o.timestamp < end).reduce((s, o) => s + (o.amount || 0), 0)
            dailyRevenue.push({ name: days[new Date(start).getDay()], revenue: rev })
        }
        const gaStats = await getGA4Data(searchParams.get('startDate') || '7daysAgo', searchParams.get('endDate') || 'today')
        return NextResponse.json({
            visits: gaStats?.visits || visits, activeUsers: gaStats?.activeUsers || 0, totalRevenue, totalOrders: validOrders.length,
            dailyRevenue, funnelData: [{ name: 'Visitors', value: visits }, { name: 'Add to Cart', value: cartEvents }, { name: 'Purchase', value: validOrders.length }]
        })
    }

    // 7a. Payment Status (server-side verification for the success page)
    if (path === 'payment-status') {
        const paymentId = searchParams.get('id')
        if (!paymentId || !/^tr_[A-Za-z0-9]+$/.test(paymentId)) {
            return NextResponse.json({ paid: false, error: 'Missing or malformed payment id' }, { status: 400 })
        }
        try {
            const r = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
                headers: { 'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}` }
            })
            const p = await r.json()
            const paid = p.status === 'paid' || p.status === 'authorized'
            return NextResponse.json({
                paid,
                status: p.status,
                amount: p.amount,
                metadata: p.metadata || null
            })
        } catch {
            return NextResponse.json({ paid: false, error: 'Could not verify payment' }, { status: 502 })
        }
    }

    // 7. Chat
    if (path === 'chat') {
        const sessionId = searchParams.get('sessionId')
        const isAdmin = searchParams.get('admin') === 'true'
        if (isAdmin) { const e = await verifyAdmin(req); if (e) return e }
        if (!KV) return NextResponse.json({ error: 'KV' }, { status: 500 })

        if (isAdmin && !sessionId) {
            const { keys } = await KV.list({ prefix: 'chat:session:' })
            const sessions = await Promise.all(keys.map(async (k) => {
                const d = await KV.get(k.name, 'json'); return d ? { id: d.id, lastTimestamp: d.lastTimestamp, unreadCount: d.unreadByAdmin || 0, isOnline: (Date.now() - (d.lastSeen || 0)) < OFFLINE_THRESHOLD } : null
            }))
            return NextResponse.json(sessions.filter(s => s).sort((a, b) => b.lastTimestamp - a.lastTimestamp))
        }
        if (sessionId) {
            const d = await KV.get(`chat:session:${sessionId}`, 'json') || { messages: [] }
            if (isAdmin && d.unreadByAdmin > 0) { d.unreadByAdmin = 0; await KV.put(`chat:session:${sessionId}`, JSON.stringify(d)) }
            return NextResponse.json(d)
        }
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
    const { route = [] } = await params
    const path = route.join('/')
    const KV = (process.env as any).KV as KVNamespace

    // 1. Auth (Login/Logout)
    if (path === 'auth/login') {
        const { password } = await req.json()
        if (password !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Invalid' }, { status: 401 })
        let token = crypto.randomUUID(), isStateless = false
        if (KV) { try { await KV.put(`session:${token}`, 'valid', { expirationTtl: SESSION_TTL }) } catch { isStateless = true } } else isStateless = true
        if (isStateless) token = STATELESS_TOKEN
        const res = NextResponse.json({ success: true })
        res.cookies.set({ name: 'admin_session', value: token, httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_TTL })
        return res
    }
    if (path === 'auth/logout') {
        const token = req.cookies.get('admin_session')?.value
        if (token && KV) await KV.delete(`session:${token}`)
        const res = NextResponse.json({ success: true })
        res.cookies.set({ name: 'admin_session', value: '', maxAge: 0, path: '/' })
        return res
    }

    // 2. Payment (Mollie)
    if (path === 'payment') {
        const { currency = 'USD', amount: requestedAmount, email, name, cardToken, method } = await req.json()
        let amount = requestedAmount || 75.19
        if (KV) { const d = await KV.get("product:prod_cadlink_v11", 'json'); if (d?.price) amount = Math.min(amount, d.price) }

        // Mollie requires an ISO 4217 currency supported by the merchant's account.
        // Whitelist the ones this storefront advertises so a malformed client payload
        // can't cause Mollie to reject the request.
        const allowedCurrencies = ['EUR', 'USD', 'GBP', 'PLN']
        const payCurrency = allowedCurrencies.includes((currency || '').toUpperCase())
            ? (currency as string).toUpperCase()
            : 'EUR'

        try {
            const baseUrl = req.headers.get('origin') || 'https://' + (req.headers.get('host') || 'localhost:3000')


            const payload: any = {
                amount: {
                    currency: payCurrency,
                    value: amount.toFixed(2)
                },
                description: 'CADLINK Software',
                redirectUrl: `${baseUrl}/checkout/success`,
                webhookUrl: `${baseUrl}/api/mollie-webhook`,
                metadata: { email, name: name || 'Customer', amount, currency: payCurrency }
            }
            if (cardToken) {
                payload.method = 'creditcard'
                payload.cardToken = cardToken
            } else if (method && method !== 'googlepay') {
                payload.method = method
            }

            const response = await fetch('https://api.mollie.com/v2/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            
            const data = await response.json()
            if (data.status === 401) {
                return NextResponse.json({ error: 'Mollie API Key is invalid' }, { status: 401 })
            }
            // Primary path — Mollie returns a hosted checkout URL the customer
            // must complete (card 3DS, Apple/Google Pay sheet, iDEAL, etc.).
            if (data._links && data._links.checkout) {
                return NextResponse.json({ checkoutUrl: data._links.checkout.href })
            }
            // Edge path — Mollie confirmed the payment instantly (rare, e.g. a
            // tokenized card with no 3DS requirement). We still route through
            // the success page WITH the payment id so the success page can
            // re-verify via /api/payment-status before showing confirmation.
            if (data.status === 'paid' || data.status === 'authorized') {
                return NextResponse.json({
                    checkoutUrl: `${baseUrl}/checkout/success?payment_id=${encodeURIComponent(data.id)}`
                })
            }
            // "open"/"pending" on a brand-new payment means the customer hasn't
            // paid yet and Mollie didn't give us a checkout link — surface that
            // as an error instead of silently sending them to a success screen.
            return NextResponse.json({
                error: data.detail || `Payment could not be started (status: ${data.status || 'unknown'})`
            }, { status: 400 })
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
    }

    // Mollie Webhook Callback
    if (path === 'mollie-webhook') {
        const bodyText = await req.text()
        const id = new URLSearchParams(bodyText).get('id')
        if (!id || !KV) return new NextResponse('OK', { status: 200 })

        try {
            const response = await fetch(`https://api.mollie.com/v2/payments/${id}`, {
                headers: { 'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}` }
            })
            const payment = await response.json()
            
            if (payment.status === 'paid') {
                const existingOrderStr = await KV.get(`${PI_PREFIX}${id}`, 'text')
                if (!existingOrderStr) {
                    const meta = payment.metadata || {}
                    const email = meta.email || 'unknown'
                    const name = meta.name || 'Customer'
                    const amount = parseFloat(meta.amount || payment.amount?.value || '75.19')
                    
                    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                    const order = { id: orderId, email, name, amount, status: 'completed', timestamp: Date.now(), paymentIntent: id }
                    await KV.put(`${KV_PREFIX}${orderId}`, JSON.stringify(order))
                    await KV.put(`${PI_PREFIX}${id}`, orderId)
                }
            }
            return new NextResponse('OK', { status: 200 })
        } catch (e) {
            return new NextResponse('OK', { status: 200 })
        }
    }

    // Orders POST removed for security, handled by webhook only

    // 4. Abandoned Checkouts (Capture)
    if (path === 'abandoned-checkouts') {
        const body = await req.json()
        if (!KV) return NextResponse.json({ error: 'KV' }, { status: 500 })
        const id = crypto.randomUUID(), ts = Date.now()
        await KV.put(`abandoned:${ts}:${id}`, JSON.stringify({ ...body, id, created_at: ts, status: 'Not Recovered' }))
        return NextResponse.json({ success: true, id })
    }

    // 5. Admin Actions (Consolidated)
    if (path.startsWith('admin/')) {
        const authError = await verifyAdmin(req); if (authError) return authError
        const action = path.split('/')[1]
        if (action === 'scripts') {
            await KV.put(SCRIPTS_KEY, JSON.stringify(await req.json())); return NextResponse.json({ success: true })
        }
        if (action === 'cleanup') {
            const keep = new URL(req.url).searchParams.get('keep')
            const { keys } = await KV.list({ prefix: KV_PREFIX })
            for (const k of keys) { if (!k.name.includes(keep!)) await KV.delete(k.name) }
            return NextResponse.json({ success: true })
        }
        if (action === 'abandoned-checkouts' && route[2] === 'send-email') {
            const { email, recoveryUrl } = await req.json()
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: 'support@cadlink.store', to: [email], subject: 'Abandoned Cart', html: `<a href="${recoveryUrl}">Resume</a>` })
            })
            return NextResponse.json({ success: true })
        }
    }

    // 6. Analytics (Record)
    if (path === 'analytics/cart' || path === 'analytics/heartbeat' || path === 'analytics') {
        if (!KV) return NextResponse.json({ success: false })
        if (path === 'analytics/cart') {
            const c = parseInt(await KV.get('analytics:cart_events', 'text') || '0') + 1
            await KV.put('analytics:cart_events', c.toString())
            const rStr = await KV.get('analytics:recent_cart_events', 'text')
            const r = rStr ? JSON.parse(rStr) : []; r.push(Date.now())
            await KV.put('analytics:recent_cart_events', JSON.stringify(r.filter((ts: number) => ts > Date.now() - 300000)))
            return NextResponse.json({ success: true })
        }
        if (path === 'analytics/heartbeat') {
            const ip = req.headers.get('CF-Connecting-IP') || 'unknown', country = req.headers.get('CF-IPCountry') || 'Unknown'
            await KV.put(`presence:${ip}`, JSON.stringify({ timestamp: Date.now(), country }), { expirationTtl: 60 })
            return NextResponse.json({ success: true })
        }
        const v = parseInt(await KV.get('analytics:visits', 'text') || '0') + 1
        await KV.put('analytics:visits', v.toString())
        return NextResponse.json({ success: true })
    }

    // 7. Chat (Send)
    if (path === 'chat' || path === 'chat/presence') {
        const body = await req.json(); if (!KV) return NextResponse.json({ error: 'KV' }, { status: 500 })
        if (path === 'chat/presence') {
            const s = await KV.get(`chat:session:${body.sessionId}`, 'json')
            if (s) { s.lastSeen = Date.now(); await KV.put(`chat:session:${body.sessionId}`, JSON.stringify(s)) }
            return NextResponse.json({ success: true })
        }
        if (body.sender === 'admin') { const e = await verifyAdmin(req); if (e) return e }
        const key = `chat:session:${body.sessionId}`
        let s = await KV.get(key, 'json')
        const msg = { id: crypto.randomUUID(), ...body, timestamp: Date.now() }
        if (!s) s = { id: body.sessionId, lastTimestamp: Date.now(), messages: [msg], unreadByAdmin: body.sender === 'user' ? 1 : 0 }
        else { s.messages.push(msg); s.lastTimestamp = Date.now(); if (body.sender === 'user') s.unreadByAdmin = (s.unreadByAdmin || 0) + 1 }
        await KV.put(key, JSON.stringify(s))
        return NextResponse.json(s)
    }

    // 8. Product (Update)
    if (path === 'product') {
        const e = await verifyAdmin(req); if (e) return e
        if (!KV) return NextResponse.json({ error: 'KV' }, { status: 500 })
        const p = await req.json(); await KV.put("product:prod_cadlink_v11", JSON.stringify(p))
        return NextResponse.json({ success: true, product: p })
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
    const { route = [] } = await params
    const path = route.join('/')
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) return NextResponse.json({ error: 'KV needed' }, { status: 500 })

    const e = await verifyAdmin(req); if (e) return e

    if (path === 'orders') {
        const orderId = new URL(req.url).searchParams.get('orderId')
        if (!orderId) return NextResponse.json({ error: 'Missing' }, { status: 400 })
        const o = await KV.get(`${KV_PREFIX}${orderId}`, 'json')
        await KV.delete(`${KV_PREFIX}${orderId}`)
        if (o?.paymentIntent) await KV.delete(`${PI_PREFIX}${o.paymentIntent}`)
        return NextResponse.json({ success: true })
    }

    if (path === 'admin/batch-delete') {
        const { keys } = await KV.list({ prefix: KV_PREFIX, limit: 50 })
        for (const k of keys) await KV.delete(k.name)
        return NextResponse.json({ success: true })
    }

    if (path === 'admin/reset') {
        for (const p of [KV_PREFIX, PI_PREFIX, 'abandoned:', 'presence:', 'analytics:']) {
            const { keys } = await KV.list({ prefix: p })
            for (const k of keys) await KV.delete(k.name)
        }
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
}
