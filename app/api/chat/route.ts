import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Message {
    id: string
    sender: 'user' | 'admin'
    text: string
    timestamp: number
}

interface ChatSession {
    id: string
    lastMessage: string
    lastTimestamp: number
    unreadCount: number
    messages: Message[]
}

// Cloudflare KV type definition
interface KVNamespace {
    get(key: string, type: 'json'): Promise<any>
    get(key: string, type: 'text'): Promise<string | null>
    put(key: string, value: string | ArrayBuffer | ReadableStream): Promise<void>
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[] }>
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    const isAdmin = searchParams.get('admin') === 'true'

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    if (isAdmin && !sessionId) {
        // Admin fetching all active sessions
        const { keys } = await KV.list({ prefix: 'chat:session:' })
        const sessions = await Promise.all(
            keys.map(async (key: { name: string }) => {
                const data = await KV.get(key.name, 'json') as ChatSession
                return {
                    id: data.id,
                    lastMessage: data.lastMessage,
                    lastTimestamp: data.lastTimestamp,
                    unreadCount: data.unreadCount
                }
            })
        )
        return NextResponse.json(sessions.sort((a: any, b: any) => b.lastTimestamp - a.lastTimestamp))
    }

    if (sessionId) {
        // Fetching messages for a specific session
        const data = await KV.get(`chat:session:${sessionId}`, 'json') as ChatSession
        if (!data) {
            return NextResponse.json({ messages: [] })
        }

        // If admin is reading, clear unread count (simplified)
        if (isAdmin && data.unreadCount > 0) {
            data.unreadCount = 0
            await KV.put(`chat:session:${sessionId}`, JSON.stringify(data))
        }

        return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { sessionId, text, sender } = body

    if (!sessionId || !text || !sender) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const KV = (process.env as any).KV as KVNamespace
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    const key = `chat:session:${sessionId}`
    let session = await KV.get(key, 'json') as ChatSession

    const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        sender,
        text,
        timestamp: Date.now()
    }

    if (!session) {
        session = {
            id: sessionId,
            lastMessage: text,
            lastTimestamp: Date.now(),
            unreadCount: sender === 'user' ? 1 : 0,
            messages: [newMessage]
        }
    } else {
        session.messages.push(newMessage)
        session.lastMessage = text
        session.lastTimestamp = Date.now()
        if (sender === 'user') {
            session.unreadCount += 1
        }
    }

    await KV.put(key, JSON.stringify(session))
    return NextResponse.json(session)
}
