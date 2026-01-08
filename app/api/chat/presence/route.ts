import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface KVNamespace {
    get(key: string, type: 'json'): Promise<any>
    put(key: string, value: string): Promise<void>
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { sessionId } = body

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    const key = `chat:session:${sessionId}`
    const session = await KV.get(key, 'json')

    if (session) {
        session.isOnline = true
        session.lastSeen = Date.now()
        await KV.put(key, JSON.stringify(session))
    }

    return NextResponse.json({ success: true })
}
