/**
 * POST /api/merchant/sync
 * Syncs all CADLINK products to Google Merchant Center.
 *
 * GET  /api/merchant/sync
 * Lists all products currently in Merchant Center.
 *
 * Protected by a secret token via Authorization header:
 *   Authorization: Bearer <MERCHANT_SYNC_SECRET>
 */

import { type NextRequest, NextResponse } from "next/server"
import { insertProducts, listProducts } from "@/lib/merchant-api"
import { CADLINK_PRODUCTS } from "@/data/merchant-products"

export const runtime = "edge" // Cloudflare Pages uses Edge runtime; crypto.subtle is available natively

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.MERCHANT_SYNC_SECRET
  // If no secret is set, only allow in development
  if (!secret) return process.env.NODE_ENV === "development"
  const auth = req.headers.get("authorization")
  return auth === `Bearer ${secret}`
}

// ─── GET: list products ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const products = await listProducts()
    return NextResponse.json({ count: products.length, products })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


// ─── POST: sync products ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { inserted, errors } = await insertProducts(CADLINK_PRODUCTS)

    return NextResponse.json({
      success: true,
      inserted,
      total: CADLINK_PRODUCTS.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
