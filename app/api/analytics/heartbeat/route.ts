import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const kv = (process.env as any).KV;
        if (!kv) {
            return NextResponse.json({ success: false });
        }

        const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
        const country = req.headers.get('CF-IPCountry') || 'Unknown';
        const timestamp = Date.now();

        // Store user presence with country info (60 second TTL)
        await kv.put(`presence:${ip}`, JSON.stringify({ timestamp, country }), { expirationTtl: 60 });

        // Update country stats for Active Regions
        try {
            const countryStatsStr = await kv.get('analytics:countries', 'text');
            const countryStats: Record<string, number> = countryStatsStr ? JSON.parse(countryStatsStr) : {};
            countryStats[country] = (countryStats[country] || 0) + 1;
            await kv.put('analytics:countries', JSON.stringify(countryStats));
        } catch {
            // Ignore country tracking errors
        }

        return NextResponse.json({ success: true, country });

    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
