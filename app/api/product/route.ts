import { NextResponse } from "next/server"

export const runtime = 'edge'

const DEFAULT_PRODUCT = {
    id: "prod_cadlink_v11",
    name: "CADLINK Digital Factory 11 DTF Edition",
    price: 75.19,
    image: "/images/cadlink-product.png",
    cogs: 0, // Digital product - no cost of goods
    adCost: 0, // Google Ads cost per purchase
    stock: 999,
    description: "The world's most powerful DTF RIP software. Engineered for precision color management and high-volume production."
}

export async function GET() {
    try {
        const kv = (process.env as any).KV
        if (!kv) {
            return NextResponse.json(DEFAULT_PRODUCT)
        }

        const productData = await kv.get("product:prod_cadlink_v11")
        if (!productData) {
            // Initialize with default if not found
            await kv.put("product:prod_cadlink_v11", JSON.stringify(DEFAULT_PRODUCT))
            return NextResponse.json(DEFAULT_PRODUCT)
        }

        return NextResponse.json(JSON.parse(productData))
    } catch (error) {
        console.error("Error fetching product:", error)
        return NextResponse.json(DEFAULT_PRODUCT)
    }
}

import { verifyAdmin } from '@/lib/auth'

export async function POST(req: any) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    try {
        const kv = (process.env as any).KV
        if (!kv) {
            return NextResponse.json({ error: "KV not configured" }, { status: 500 })
        }

        const updatedProduct = await req.json()
        await kv.put("product:prod_cadlink_v11", JSON.stringify(updatedProduct))

        return NextResponse.json({ success: true, product: updatedProduct })
    } catch (error: any) {
        console.error("Error updating product:", error)
        return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
    }
}
