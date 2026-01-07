"use server"

import Stripe from "stripe"
import { getSettings } from "./settings"

// Initialize Stripe with a placeholder or env variable
// In a real app, use process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-01-27.acacia", // Use latest API version
})

export async function createPaymentIntent(amount: number, currency: string = "usd") {
    try {
        // In a real app, you might fetch the API key from settings if stored there
        // const settings = await getSettings()
        // const stripe = new Stripe(settings.payment.stripeSecretKey, ...)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return { clientSecret: paymentIntent.client_secret }
    } catch (error) {
        console.error("Error creating payment intent:", error)
        return { error: "Failed to create payment intent" }
    }
}
