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
        const STATELESS_TOKEN = `stateless_v1_${ADMIN_PASSWORD}`

        let token = crypto.randomUUID()
        let isStateless = false

        if (kv) {
            try {
                // Store session in KV
                await kv.put(`session:${token}`, 'valid', { expirationTtl: SESSION_TTL })
            } catch (err) {
                console.error('KV storage failed, falling back to stateless auth', err)
                isStateless = true
            }
        } else {
            isStateless = true
        }

        if (isStateless) {
            token = STATELESS_TOKEN
        }

        // Create response with HttpOnly cookie
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
        console.error('Login error:', error)
        return NextResponse.json({
            error: `Login failed: ${error.message || 'Internal server error'}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}
