import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('admin_session')?.value

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const kv = (process.env as any).KV
    if (!kv) {
        return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }

    const session = await kv.get(`session:${token}`)

    if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
}
