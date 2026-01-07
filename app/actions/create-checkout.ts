"use server"

export async function createCheckoutSession(productId: string) {
  const DODO_API_KEY = "P0c86c1_BpTz3iBB.SJzEo1lpujXhg5IID2MmyhMUws4FYqMvEwgg4wLAfEoA7FNn"

  try {
    const response = await fetch("https://api.dodopayments.com/checkout-sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DODO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        return_url: "https://yoursite.com/success",
      }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error("[v0] API Error Response:", responseText)
      throw new Error(`API Error: ${responseText}`)
    }

    const data = JSON.parse(responseText)

    return { success: true, checkoutUrl: data.checkout_url }
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}
