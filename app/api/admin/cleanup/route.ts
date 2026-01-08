import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
    delete(key: string): Promise<void>
    get(key: string, type: 'json'): Promise<any>
}

import { verifyAdmin } from '@/lib/auth'

// POST /api/admin/cleanup?keep=ORD-7K0X9R3N
export async function POST(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    const keepOrderId = req.nextUrl.searchParams.get('keep')
    if (!keepOrderId) {
        return NextResponse.json({ error: 'Please provide ?keep=ORDER_ID to keep' }, { status: 400 })
    }

    try {
        const { keys } = await KV.list({ prefix: 'cadlink:order:' })
        let deleted = 0
        let kept = 0

        for (const key of keys) {
            if (key.name.includes(keepOrderId)) {
                kept++
                continue
            }
            await KV.delete(key.name)
            deleted++
        }

        return NextResponse.json({
            success: true,
            deleted,
            kept,
            message: `Deleted ${deleted} orders, kept ${kept} orders containing "${keepOrderId}"`
        })
    } catch (err) {
        console.error('Cleanup failed', err)
        return NextResponse.json({ error: 'Failed to cleanup orders' }, { status: 500 })
    }
}
