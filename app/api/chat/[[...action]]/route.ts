import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

export const runtime = 'edge'

const OFFLINE_THRESHOLD = 30000 // 30 seconds

export async function GET(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    const isAdmin = searchParams.get('admin') === 'true'

    if (isAdmin) {
        const authError = await verifyAdmin(req)
        if (authError) return authError
    }

    const KV = (process.env as any).KV
    if (!KV) return NextResponse.json({ error: 'KV not found' }, { status: 500 })

    if (action.length === 0) {
        if (isAdmin && !sessionId) {
            const { keys } = await KV.list({ prefix: 'chat:session:' })
            const sessions = await Promise.all(keys.map(async (key: any) => {
                const data = await KV.get(key.name, 'json')
                if (!data) return null
                return {
                    id: data.id,
                    lastMessage: data.lastMessage,
                    lastTimestamp: data.lastTimestamp,
                    unreadCount: data.unreadByAdmin || 0,
                    isOnline: data.lastSeen && (Date.now() - data.lastSeen) < OFFLINE_THRESHOLD,
                    lastSeen: data.lastSeen
                }
            }))
            return NextResponse.json(sessions.filter((s: any) => s !== null).sort((a: any, b: any) => b.lastTimestamp - a.lastTimestamp))
        }

        if (sessionId) {
            const data = await KV.get(`chat:session:${sessionId}`, 'json')
            if (!data) return NextResponse.json({ messages: [] })
            let needsUpdate = false
            if (isAdmin && data.unreadByAdmin > 0) {
                data.unreadByAdmin = 0
                data.unreadCount = 0
                data.messages = data.messages.map((m: any) => (m.sender === 'user' && !m.readAt) ? { ...m, readAt: Date.now() } : m)
                needsUpdate = true
            }
            if (!isAdmin) {
                data.messages = data.messages.map((m: any) => {
                    if (m.sender === 'admin' && !m.readAt) { needsUpdate = true; return { ...m, readAt: Date.now() } }
                    return m
                })
            }
            if (needsUpdate) await KV.put(`chat:session:${sessionId}`, JSON.stringify(data))
            return NextResponse.json({ ...data, isOnline: data.lastSeen && (Date.now() - data.lastSeen) < OFFLINE_THRESHOLD, unreadCount: data.unreadByAdmin || 0 })
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ action?: string[] }> }) {
    const { action = [] } = await params
    const body = await req.json()
    const { sessionId, text, sender } = body
    const KV = (process.env as any).KV
    if (!KV) return NextResponse.json({ error: 'KV not found' }, { status: 500 })

    if (action[0] === 'presence') {
        if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
        const session = await KV.get(`chat:session:${sessionId}`, 'json')
        if (session) {
            session.isOnline = true; session.lastSeen = Date.now()
            await KV.put(`chat:session:${sessionId}`, JSON.stringify(session))
        }
        return NextResponse.json({ success: true })
    }

    if (action.length === 0) {
        if (sender === 'admin') {
            const authError = await verifyAdmin(req)
            if (authError) return authError
        }
        if (!sessionId || !text || !sender) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        const key = `chat:session:${sessionId}`
        let session = await KV.get(key, 'json')
        const newMessage = { id: Math.random().toString(36).substring(7), sender, text, timestamp: Date.now(), readAt: null }
        if (!session) {
            session = { id: sessionId, lastMessage: text, lastTimestamp: Date.now(), unreadCount: sender === 'user' ? 1 : 0, unreadByAdmin: sender === 'user' ? 1 : 0, messages: [newMessage], isOnline: true, lastSeen: Date.now() }
        } else {
            session.messages.push(newMessage)
            session.lastMessage = text; session.lastTimestamp = Date.now(); session.lastSeen = Date.now(); session.isOnline = true
            if (sender === 'user') { session.unreadByAdmin = (session.unreadByAdmin || 0) + 1; session.unreadCount = session.unreadByAdmin }
        }
        await KV.put(key, JSON.stringify(session))
        return NextResponse.json({ ...session, newMessage: sender === 'user' })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
