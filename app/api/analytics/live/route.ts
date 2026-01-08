import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const kv = (process.env as any).KV;
        if (!kv) {
            return NextResponse.json({ activeUsers: 0, cartEvents: [] });
        }

        // In a real app, you might use Durable Objects for better live state.
        // Here we'll simulate "live" users by counting recent page view events stored in KV
        // or by using a specific "live_users" key that gets updated by a heartbeat.

        // Count active users by listing 'presence:*' keys
        // Note: KV list is eventually consistent and has limits, but works for small scale.
        const { keys } = await kv.list({ prefix: 'presence:' });
        const activeUsers = keys.length;

        // Get recent cart events (last 5 mins)
        // This is a simplification. In production, you'd query a time-series list.
        const cartEventsStr = await kv.get('analytics:recent_cart_events');
        const cartEvents = cartEventsStr ? JSON.parse(cartEventsStr) : [];

        return NextResponse.json({ activeUsers, cartEvents });
    } catch (error) {
        return NextResponse.json({ activeUsers: 0, cartEvents: [] });
    }
}
