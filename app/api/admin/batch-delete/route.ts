import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    list(options?: { prefix?: string; limit?: number }): Promise<{ keys: { name: string }[] }>
    delete(key: string): Promise<void>
}

import { verifyAdmin } from '@/lib/auth'

// DELETE /api/admin/batch-delete - Deletes 50 orders at a time
export async function DELETE(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        // Get only 50 keys at a time to avoid rate limits
        const result = await KV.list({ prefix: 'cadlink:order:', limit: 50 })
        const keys = result.keys || []

        if (keys.length === 0) {
            return NextResponse.json({
                success: true,
                deleted: 0,
                remaining: 0,
                message: 'All orders have been deleted!'
            })
        }

        // Delete them one by one with small delays
        let deleted = 0
        for (const key of keys) {
            await KV.delete(key.name)
            deleted++
        }

        // Check how many remain
        const remaining = await KV.list({ prefix: 'cadlink:order:', limit: 1 })
        const hasMore = (remaining.keys || []).length > 0

        return NextResponse.json({
            success: true,
            deleted,
            hasMore,
            message: hasMore
                ? `Deleted ${deleted} orders. Call again to delete more.`
                : `Deleted ${deleted} orders. All done!`
        })
    } catch (err) {
        console.error('Batch delete failed', err)
        return NextResponse.json({
            error: 'Failed to delete batch',
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}
