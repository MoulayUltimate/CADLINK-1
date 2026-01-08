import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Message {
    id: string
    sender: 'user' | 'admin'
    text: string
    timestamp: number
    readAt?: number | null
}

interface ChatSession {
    id: string
    lastMessage: string
    lastTimestamp: number
    unreadCount: number
    messages: Message[]
    isOnline: boolean
    lastSeen: number
    unreadByAdmin: number
}

// Cloudflare KV type definition
interface KVNamespace {
    get(key: string, type: 'json'): Promise<any>
    get(key: string, type: 'text'): Promise<string | null>
    put(key: string, value: string): Promise<void>
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[] }>
}

const OFFLINE_THRESHOLD = 30000 // 30 seconds

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
                if (!data) return null

                // Calculate online status based on lastSeen
                const isOnline = data.lastSeen && (Date.now() - data.lastSeen) < OFFLINE_THRESHOLD

                return {
                    id: data.id,
                    lastMessage: data.lastMessage,
                    lastTimestamp: data.lastTimestamp,
                    unreadCount: data.unreadByAdmin || data.unreadCount || 0,
                    isOnline,
                    lastSeen: data.lastSeen
                }
            })
        )
        const validSessions = sessions.filter(s => s !== null)
        return NextResponse.json(validSessions.sort((a: any, b: any) => b.lastTimestamp - a.lastTimestamp))
    }

    if (sessionId) {
        // Fetching messages for a specific session
        const data = await KV.get(`chat:session:${sessionId}`, 'json') as ChatSession
        if (!data) {
            return NextResponse.json({ messages: [] })
        }

        // If admin is reading, clear unread count and mark messages as read
        if (isAdmin) {
            let needsUpdate = data.unreadByAdmin > 0
            data.unreadByAdmin = 0
            data.unreadCount = 0
            // Mark all user messages as read by admin
            data.messages = data.messages.map(msg => {
                if (msg.sender === 'user' && !msg.readAt) {
                    needsUpdate = true
                    return { ...msg, readAt: Date.now() }
                }
                return msg
            })
            if (needsUpdate) {
                await KV.put(`chat:session:${sessionId}`, JSON.stringify(data))
            }
        }

        // If user is reading, mark admin messages as read
        if (!isAdmin) {
            let hasUnread = false
            data.messages = data.messages.map(msg => {
                if (msg.sender === 'admin' && !msg.readAt) {
                    hasUnread = true
                    return { ...msg, readAt: Date.now() }
                }
                return msg
            })
            if (hasUnread) {
                await KV.put(`chat:session:${sessionId}`, JSON.stringify(data))
            }
        }

        // Calculate online status
        const isOnline = data.lastSeen && (Date.now() - data.lastSeen) < OFFLINE_THRESHOLD

        return NextResponse.json({
            ...data,
            isOnline,
            unreadCount: data.unreadByAdmin || 0
        })
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
        timestamp: Date.now(),
        readAt: null
    }

    if (!session) {
        session = {
            id: sessionId,
            lastMessage: text,
            lastTimestamp: Date.now(),
            unreadCount: sender === 'user' ? 1 : 0,
            unreadByAdmin: sender === 'user' ? 1 : 0,
            messages: [newMessage],
            isOnline: true,
            lastSeen: Date.now()
        }
    } else {
        session.messages.push(newMessage)
        session.lastMessage = text
        session.lastTimestamp = Date.now()
        session.lastSeen = Date.now()
        session.isOnline = true

        if (sender === 'user') {
            session.unreadByAdmin = (session.unreadByAdmin || 0) + 1
            session.unreadCount = session.unreadByAdmin
        }
    }

    await KV.put(key, JSON.stringify(session))

    return NextResponse.json({
        ...session,
        newMessage: sender === 'user' // Flag that there's a new user message for notifications
    })
}
