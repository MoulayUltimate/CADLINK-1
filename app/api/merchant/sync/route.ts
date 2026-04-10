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

// ─── GET: debug key info ───────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const raw = process.env.GOOGLE_PRIVATE_KEY ?? ""
  const normalized = raw.replace(/\\n/g, "\n").trim()
  const b64 = normalized.replace(/[^A-Za-z0-9+/=]/g, "")

  let importError = ""
  try {
    const binary = atob(b64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    await crypto.subtle.importKey(
      "pkcs8",
      bytes.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    )
    importError = "SUCCESS"
  } catch (e: unknown) {
    importError = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
  }

  return NextResponse.json({
    rawLength: raw.length,
    normalizedLength: normalized.length,
    b64Length: b64.length,
    startsCorrectly: normalized.startsWith("-----BEGIN PRIVATE KEY-----"),
    endsCorrectly: normalized.endsWith("-----END PRIVATE KEY-----"),
    first30: normalized.slice(0, 30),
    importResult: importError,
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "NOT SET",
  })
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
