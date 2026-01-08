import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const kv = (process.env as any).KV;
        if (!kv) {
            return NextResponse.json({ activeUsers: 0, cartEvents: [], activeRegions: [] });
        }

        // Count active users by listing 'presence:*' keys
        const { keys } = await kv.list({ prefix: 'presence:' });
        const activeUsers = keys.length;

        // Get country data from presence entries
        const activeRegions: { country: string; count: number }[] = [];
        const countryMap: Record<string, number> = {};

        for (const key of keys) {
            try {
                const data = await kv.get(key.name, 'text');
                if (data) {
                    const parsed = JSON.parse(data);
                    const country = parsed.country || 'Unknown';
                    countryMap[country] = (countryMap[country] || 0) + 1;
                }
            } catch {
                // Skip invalid entries
            }
        }

        // Convert to array and sort by count
        for (const [country, count] of Object.entries(countryMap)) {
            activeRegions.push({ country, count });
        }
        activeRegions.sort((a, b) => b.count - a.count);

        // Get recent cart events (last 5 mins)
        const cartEventsStr = await kv.get('analytics:recent_cart_events', 'text');
        const cartEvents = cartEventsStr ? JSON.parse(cartEventsStr) : [];

        return NextResponse.json({ activeUsers, cartEvents, activeRegions });
    } catch (error) {
        return NextResponse.json({ activeUsers: 0, cartEvents: [], activeRegions: [] });
    }
}
