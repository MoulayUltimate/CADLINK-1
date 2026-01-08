import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const kv = (process.env as any).KV;
        if (!kv) {
            return NextResponse.json({ success: false });
        }

        // In a real implementation with high traffic, you would use Durable Objects.
        // For this simple KV implementation, we'll just increment a counter or update a timestamp.
        // A better approach for "active users" in KV is to store a key per user with an expiration.

        const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
        const timestamp = Date.now();

        // Store user presence with a short expiration (e.g., 60 seconds)
        await kv.put(`presence:${ip}`, timestamp.toString(), { expirationTtl: 60 });

        // To get the count, we would list these keys.
        // However, listing is expensive. For a small store, it's fine.
        // For a larger store, we'd use a counter that increments/decrements (hard with stateless).
        // Let's stick to the "list" approach for accuracy on small scale.

        // Update the cached count periodically or just let the GET route handle counting.
        // Here we just acknowledge the heartbeat.

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
