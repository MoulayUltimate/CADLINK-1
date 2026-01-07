import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    get(key: string, type: 'text'): Promise<string | null>
    put(key: string, value: string): Promise<void>
}

export async function GET(req: NextRequest) {
    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        const visits = await KV.get('analytics:visits', 'text')
        return NextResponse.json({
            visits: parseInt(visits || '0'),
            activeUsers: Math.floor(Math.random() * 5) + 1 // Simple simulation for active users
        })
    } catch (err) {
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
