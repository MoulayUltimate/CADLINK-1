import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface KVNamespace {
    get(key: string, type: 'text'): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export async function POST(req: NextRequest) {
    try {
        const kv = (process.env as any).KV as KVNamespace;
        if (!kv) {
            return NextResponse.json({ success: false, error: 'KV not available' });
        }

        const body = await req.json();
        const { action, productId } = body;

        // Increment the cart events counter
        const currentCount = await kv.get('analytics:cart_events', 'text');
        const count = parseInt(currentCount || '0') + 1;
        await kv.put('analytics:cart_events', count.toString());

        // Store recent cart events for live feed (last 5 minutes = 300 seconds)
        const recentEventsStr = await kv.get('analytics:recent_cart_events', 'text');
        let recentEvents: number[] = recentEventsStr ? JSON.parse(recentEventsStr) : [];

        // Add current timestamp
        const now = Date.now();
        recentEvents.push(now);

        // Filter to keep only events from the last 5 minutes
        const fiveMinutesAgo = now - (5 * 60 * 1000);
        recentEvents = recentEvents.filter(ts => ts > fiveMinutesAgo);

        await kv.put('analytics:recent_cart_events', JSON.stringify(recentEvents));

        return NextResponse.json({
            success: true,
            totalCartEvents: count,
            recentCount: recentEvents.length
        });

    } catch (error) {
        console.error('Cart analytics error:', error);
        return NextResponse.json({ success: false });
    }
}
