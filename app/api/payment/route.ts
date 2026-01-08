import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        const { currency = "usd" } = await req.json()

        // Securely fetch price from KV or use default
        let amount = 75.19 // Default price

        try {
            const kv = (process.env as any).KV
            if (kv) {
                const productData = await kv.get("product:prod_cadlink_v11")
                if (productData) {
                    const product = JSON.parse(productData)
                    if (product.price) {
                        amount = Number(product.price)
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch price from KV, using default:", e)
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
            httpClient: Stripe.createFetchHttpClient(),
        })

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error: any) {
        console.error("Error creating payment intent:", error)
        return NextResponse.json({
            error: error.message || "Failed to create payment intent",
            debug: {
                keyPresent: !!process.env.STRIPE_SECRET_KEY,
                isPlaceholder: process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY
            }
        }, { status: 500 })
    }
}
