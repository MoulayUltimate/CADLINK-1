import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    const token = req.cookies.get('admin_session')?.value

    if (token) {
        const kv = (process.env as any).KV
        if (kv) {
            await kv.delete(`session:${token}`)
        }
    }

    const response = NextResponse.json({ success: true })

    // Clear the cookie
    response.cookies.set({
        name: 'admin_session',
        value: '',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0
    })

    return response
}
