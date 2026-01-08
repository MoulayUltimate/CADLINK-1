import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { email, cartValue, items, stage } = await req.json();
        const id = crypto.randomUUID();
        const timestamp = Date.now();

        const checkoutData = {
            id,
            email,
            cartValue,
            items,
            stage,
            status: 'Not Recovered',
            created_at: timestamp
        };

        // Access KV binding from the environment
        const kv = (process.env as any).KV;

        if (!kv) {
            console.warn("KV Namespace 'KV' not found. Ensure it is bound in wrangler.toml.");
            return NextResponse.json({ error: 'KV not configured' }, { status: 500 });
        }

        // Store with a prefix to easily list them later
        // Key format: abandoned:timestamp:id
        await kv.put(`abandoned:${timestamp}:${id}`, JSON.stringify(checkoutData));

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Error saving abandoned checkout:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

import { verifyAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const authError = await verifyAdmin(req);
    if (authError) return authError;

    try {
        const kv = (process.env as any).KV;

        if (!kv) {
            return NextResponse.json({ checkouts: [] });
        }

        // List keys starting with "abandoned:"
        const { keys } = await kv.list({ prefix: "abandoned:", limit: 100 });

        const checkouts = [];

        // Fetch values for each key (in parallel)
        // Note: For production with many keys, you'd want pagination
        for (const key of keys) {
            const value = await kv.get(key.name);
            if (value) {
                const data = JSON.parse(value);
                checkouts.push({
                    ...data,
                    // Ensure date is formatted for the frontend
                    date: new Date(data.created_at).toISOString(),
                    value: data.cartValue // Map cartValue to value for frontend compatibility
                });
            }
        }

        // Sort by newest first
        checkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ checkouts });
    } catch (error) {
        console.error("Error fetching abandoned checkouts:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
