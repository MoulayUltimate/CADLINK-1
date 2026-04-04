import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_TTL = 60 * 60 * 24 // 24 hours
const STATELESS_TOKEN = `stateless_v1_${ADMIN_PASSWORD}`

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
    const { action } = await params

    if (action === 'login') {
        try {
            const { password } = await req.json()
            if (password !== ADMIN_PASSWORD) {
                return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
            }
            const kv = (process.env as any).KV
            let token = crypto.randomUUID()
            let isStateless = false
            if (kv) {
                try {
                    await kv.put(`session:${token}`, 'valid', { expirationTtl: SESSION_TTL })
                } catch (err) {
                    isStateless = true
                }
            } else {
                isStateless = true
            }
            if (isStateless) token = STATELESS_TOKEN
            const response = NextResponse.json({ success: true })
            response.cookies.set({
                name: 'admin_session',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: SESSION_TTL
            })
            return response
        } catch (error: any) {
            return NextResponse.json({ error: 'Login failed' }, { status: 500 })
        }
    }

    if (action === 'logout') {
        const token = req.cookies.get('admin_session')?.value
        if (token) {
            const kv = (process.env as any).KV
            if (kv) await kv.delete(`session:${token}`)
        }
        const response = NextResponse.json({ success: true })
        response.cookies.set({
            name: 'admin_session',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0
        })
        return response
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
    const { action } = await params
    if (action === 'check') {
        const token = req.cookies.get('admin_session')?.value
        if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })
        if (token === STATELESS_TOKEN) return NextResponse.json({ authenticated: true })
        const kv = (process.env as any).KV
        if (!kv) {
            // In dev or local without KV, consider it authenticated if token is present
            return NextResponse.json({ authenticated: true })
        }
        try {
            const session = await kv.get(`session:${token}`)
            return NextResponse.json({ authenticated: !!session }, { status: session ? 200 : 401 })
        } catch (err) {
            return NextResponse.json({ authenticated: false }, { status: 401 })
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
