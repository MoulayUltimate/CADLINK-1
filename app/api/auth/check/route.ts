import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('admin_session')?.value

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
    const STATELESS_TOKEN = `stateless_v1_${ADMIN_PASSWORD}`

    if (token === STATELESS_TOKEN) {
        return NextResponse.json({ authenticated: true })
    }

    const kv = (process.env as any).KV
    if (!kv) {
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({ authenticated: true })
        }
        // If it's not development and no KV, but also not a stateless token, it's unauthorized
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
        const session = await kv.get(`session:${token}`)
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 })
        }
    } catch (err) {
        console.error('KV check failed', err)
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
}
