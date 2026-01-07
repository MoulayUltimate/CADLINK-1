import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
    delete(key: string): Promise<void>
}

export async function DELETE(req: NextRequest) {
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        // 1. Delete New Orders
        const { keys: newOrderKeys } = await KV.list({ prefix: 'cadlink:order:' })
        await Promise.all(newOrderKeys.map(key => KV.delete(key.name)))

        // 2. Delete Legacy Orders (to be sure)
        const { keys: legacyOrderKeys } = await KV.list({ prefix: 'order:' })
        await Promise.all(legacyOrderKeys.map(key => KV.delete(key.name)))

        // 3. Delete Analytics
        const { keys: analyticsKeys } = await KV.list({ prefix: 'analytics:' })
        await Promise.all(analyticsKeys.map(key => KV.delete(key.name)))

        return NextResponse.json({
            success: true,
            deleted: newOrderKeys.length + legacyOrderKeys.length + analyticsKeys.length
        })
    } catch (err) {
        console.error('Reset failed', err)
        return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 })
    }
}
