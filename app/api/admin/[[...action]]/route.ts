import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

export const runtime = 'edge'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SCRIPTS_KEY = 'cadlink:scripts'

interface KVNamespace {
    get(key: string, type?: 'text' | 'json'): Promise<any>
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete?: boolean; cursor?: string }>
    delete(key: string): Promise<void>
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const KV = (process.env as any).KV as KVNamespace

    if (action[0] === 'scripts') {
        if (!KV) return NextResponse.json([])
        try {
            const scriptsStr = await KV.get(SCRIPTS_KEY)
            return NextResponse.json(scriptsStr ? JSON.parse(scriptsStr) : [])
        } catch { return NextResponse.json([]) }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const authError = await verifyAdmin(req)
    if (authError) return authError
    const KV = (process.env as any).KV as KVNamespace

    if (action[0] === 'scripts') {
        if (!KV) return NextResponse.json({ error: 'KV not found' }, { status: 500 })
        try {
            const scripts = await req.json()
            await KV.put(SCRIPTS_KEY, JSON.stringify(scripts))
            return NextResponse.json({ success: true })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }

    if (action[0] === 'cleanup') {
        if (!KV) return NextResponse.json({ error: 'KV not found' }, { status: 500 })
        const keepOrderId = req.nextUrl.searchParams.get('keep')
        if (!keepOrderId) return NextResponse.json({ error: 'Missing' }, { status: 400 })
        try {
            const { keys } = await KV.list({ prefix: 'cadlink:order:' })
            let deleted = 0, kept = 0
            for (const key of keys) {
                if (key.name.includes(keepOrderId)) { kept++; continue }
                await KV.delete(key.name); deleted++
            }
            return NextResponse.json({ success: true, deleted, kept })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }

    if (action[0] === 'abandoned-checkouts' && action[1] === 'send-email') {
        try {
            const { email, checkoutId, createdAt, items, recoveryUrl } = await req.json()
            if (!email || !checkoutId) return NextResponse.json({ error: 'Missing' }, { status: 400 })
            const itemsList = items.map((item: any) => `<tr><td>${item.name}</td></tr>`).join('')
            const htmlContent = `<html><body>${itemsList}<a href="${recoveryUrl}">Resume</a></body></html>`
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: 'support@cadlink.store', to: [email], subject: 'Abandoned Cart', html: htmlContent })
            })
            if (!res.ok) return NextResponse.json({ error: 'Resend' }, { status: res.status })
            if (createdAt && KV) {
                const key = `abandoned: ${createdAt}: ${checkoutId}`
                const existing = await KV.get(key)
                if (existing) {
                    const u = { ...JSON.parse(existing), status: 'Email Sent', emailSentAt: Date.now() }
                    await KV.put(key, JSON.stringify(u))
                }
            }
            return NextResponse.json({ success: true })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const authError = await verifyAdmin(req)
    if (authError) return authError
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) return NextResponse.json({ error: 'KV not found' }, { status: 500 })

    if (action[0] === 'batch-delete') {
        try {
            const result = await KV.list({ prefix: 'cadlink:order:', limit: 50 })
            const keys = result.keys || []
            let deleted = 0
            for (const key of keys) { await KV.delete(key.name); deleted++ }
            const remaining = await KV.list({ prefix: 'cadlink:order:', limit: 1 })
            return NextResponse.json({ success: true, deleted, hasMore: (remaining.keys || []).length > 0 })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }

    if (action[0] === 'reset') {
        try {
            let totalDeleted = 0
            for (const prefix of ['cadlink:order:', 'order:', 'analytics:']) {
                let cursor: string | undefined = undefined
                do {
                    const result = await KV.list({ prefix, cursor })
                    const kList = result.keys || []
                    if (kList.length === 0) break
                    for (let i = 0; i < kList.length; i += 10) {
                        const batch = kList.slice(i, i + 10)
                        await Promise.all(batch.map(k => KV.delete(k.name)))
                        totalDeleted += batch.length
                    }
                    cursor = result.list_complete ? undefined : result.cursor
                } while (cursor)
            }
            return NextResponse.json({ success: true, deleted: totalDeleted })
        } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
