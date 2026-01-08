import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_TTL = 60 * 60 * 24 // 24 hours

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json()

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
        }

        const kv = (process.env as any).KV

        // Generate a secure session token
        const token = crypto.randomUUID()
        const sessionKey = `session:${token}`

        if (kv) {
            // Store session in KV
            await kv.put(sessionKey, 'valid', { expirationTtl: SESSION_TTL })
        } else if (process.env.NODE_ENV === 'development') {
            console.warn('KV not found, skipping session storage (DEV MODE)')
        } else {
            return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
        }

        // Create response with HttpOnly cookie
        const response = NextResponse.json({ success: true })

        response.cookies.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,
            secure: true, // Always secure in production (Cloudflare Pages is HTTPS)
            sameSite: 'strict',
            path: '/',
            maxAge: SESSION_TTL
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
