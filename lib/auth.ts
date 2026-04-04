import { NextRequest, NextResponse } from 'next/server'

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
    const token = req.cookies.get('admin_session')?.value

    if (!token) return false

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
    const STATELESS_TOKEN = `stateless_v1_${ADMIN_PASSWORD}`

    if (token === STATELESS_TOKEN) return true

    try {
        const kv = (process.env as any).KV
        if (!kv) {
            if (process.env.NODE_ENV === 'development') {
                return true
            }
            return false
        }

        const session = await kv.get(`session:${token}`)
        return !!session
    } catch (error) {
        console.error('Auth check failed:', error)
        return false
    }
}

export async function verifyAdmin(req: NextRequest) {
    const isAuth = await isAuthenticated(req)
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return null // Authorized
}
