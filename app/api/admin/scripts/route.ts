import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Script {
    id: string
    name: string
    code: string
    location: 'head' | 'body'
    enabled: boolean
}

const SCRIPTS_KEY = 'cadlink:scripts'

export async function GET(req: NextRequest) {
    const KV = (process.env as any).KV
    if (!KV) {
        return NextResponse.json([])
    }

    try {
        const scriptsStr = await KV.get(SCRIPTS_KEY)
        const scripts = scriptsStr ? JSON.parse(scriptsStr) : []
        return NextResponse.json(scripts)
    } catch (err) {
        console.error('Failed to fetch scripts', err)
        return NextResponse.json([])
    }
}

import { verifyAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    const KV = (process.env as any).KV
    if (!KV) {
        return NextResponse.json({ error: 'KV binding not found' }, { status: 500 })
    }

    try {
        const scripts = await req.json()
        await KV.put(SCRIPTS_KEY, JSON.stringify(scripts))
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Failed to save scripts', err)
        return NextResponse.json({ error: 'Failed to save scripts' }, { status: 500 })
    }
}
