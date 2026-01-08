import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    list(options?: { prefix?: string; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>
    delete(key: string): Promise<void>
}

async function deleteAllWithPrefix(KV: KVNamespace, prefix: string): Promise<number> {
    let deleted = 0
    let cursor: string | undefined = undefined

    do {
        const result = await KV.list({ prefix, cursor })
        const keys = result.keys || []

        // Delete in batches of 10 to avoid timeouts
        for (let i = 0; i < keys.length; i += 10) {
            const batch = keys.slice(i, i + 10)
            await Promise.all(batch.map(key => KV.delete(key.name)))
            deleted += batch.length
        }

        cursor = result.list_complete ? undefined : result.cursor
    } while (cursor)

    return deleted
}

import { verifyAdmin } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        let totalDeleted = 0

        // 1. Delete New Orders
        totalDeleted += await deleteAllWithPrefix(KV, 'cadlink:order:')

        // 2. Delete Legacy Orders (to be sure)
        totalDeleted += await deleteAllWithPrefix(KV, 'order:')

        // 3. Delete Analytics (but keep visits counter)
        const analyticsResult = await KV.list({ prefix: 'analytics:' })
        for (const key of analyticsResult.keys || []) {
            await KV.delete(key.name)
            totalDeleted++
        }

        return NextResponse.json({
            success: true,
            deleted: totalDeleted,
            message: `Successfully deleted ${totalDeleted} items`
        })
    } catch (err) {
        console.error('Reset failed', err)
        return NextResponse.json({
            error: 'Failed to clear data',
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}
