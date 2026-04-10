/**
 * Google Merchant Center – Content API v2.1 Client
 *
 * Authenticates via the existing Google Service Account and uploads
 * products to the configured Merchant Center data source.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   – already set
 *   GOOGLE_PRIVATE_KEY             – already set
 *   GOOGLE_MERCHANT_ID             – your Merchant Center account ID
 */

const MERCHANT_API_BASE = "https://shoppingcontent.googleapis.com/content/v2.1"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MerchantProduct {
  id?: string
  offerId: string
  title: string
  description: string
  link: string
  imageLink: string
  contentLanguage: string
  targetCountry: string
  channel: "online" | "local"
  availability: "in stock" | "out of stock" | "preorder"
  condition: "new" | "refurbished" | "used"
  price: { value: string; currency: string }
  brand: string
  googleProductCategory: string
  productTypes?: string[]
}

export interface MerchantApiResponse {
  kind: string
  id?: string
  errors?: { message: string; reason: string }[]
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
  const rawKey = process.env.GOOGLE_PRIVATE_KEY!

  const privateKey = rawKey.replace(/\\n/g, "\n")

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: email,
    scope: "https://www.googleapis.com/auth/content",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }

  // Build JWT
  const header = { alg: "RS256", typ: "JWT" }
  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")

  const headerB64 = encode(header)
  const payloadB64 = encode(payload)
  const signingInput = `${headerB64}.${payloadB64}`

  // Import private key and sign
  const keyData = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "")

  const binaryKey = Buffer.from(keyData, "base64")

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    Buffer.from(signingInput)
  )

  const signatureB64 = Buffer.from(signature)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  const jwt = `${signingInput}.${signatureB64}`

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text()
    throw new Error(`Failed to get access token: ${err}`)
  }

  const { access_token } = await tokenResponse.json()
  return access_token
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Insert (create or update) a single product in Merchant Center.
 */
export async function insertProduct(
  product: MerchantProduct
): Promise<MerchantApiResponse> {
  const merchantId = process.env.GOOGLE_MERCHANT_ID
  if (!merchantId) throw new Error("GOOGLE_MERCHANT_ID env var is not set")

  const token = await getAccessToken()

  const response = await fetch(
    `${MERCHANT_API_BASE}/${merchantId}/products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("[MerchantAPI] Insert failed:", JSON.stringify(data))
    throw new Error(data?.error?.message ?? "Unknown error from Merchant API")
  }

  return data
}

/**
 * Insert multiple products (batch).
 */
export async function insertProducts(
  products: MerchantProduct[]
): Promise<{ inserted: number; errors: string[] }> {
  const results = await Promise.allSettled(products.map(insertProduct))

  let inserted = 0
  const errors: string[] = []

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      inserted++
    } else {
      errors.push(`Product[${i}] (${products[i].offerId}): ${result.reason}`)
    }
  })

  return { inserted, errors }
}

/**
 * List all products in Merchant Center.
 */
export async function listProducts(): Promise<MerchantProduct[]> {
  const merchantId = process.env.GOOGLE_MERCHANT_ID
  if (!merchantId) throw new Error("GOOGLE_MERCHANT_ID env var is not set")

  const token = await getAccessToken()

  const response = await fetch(
    `${MERCHANT_API_BASE}/${merchantId}/products?maxResults=250`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to list products: ${err}`)
  }

  const data = await response.json()
  return data.resources ?? []
}

/**
 * Delete a product from Merchant Center by its full product ID.
 * productId format: "online:en:US:your-offer-id"
 */
export async function deleteProduct(productId: string): Promise<void> {
  const merchantId = process.env.GOOGLE_MERCHANT_ID
  if (!merchantId) throw new Error("GOOGLE_MERCHANT_ID env var is not set")

  const token = await getAccessToken()

  const encoded = encodeURIComponent(productId)
  const response = await fetch(
    `${MERCHANT_API_BASE}/${merchantId}/products/${encoded}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok && response.status !== 404) {
    const err = await response.text()
    throw new Error(`Failed to delete product: ${err}`)
  }
}
