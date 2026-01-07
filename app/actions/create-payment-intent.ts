"use server"

import Stripe from "stripe"
import { getSettings } from "./settings"

// Initialize Stripe with a placeholder or env variable
// In a real app, use process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    // apiVersion: "2024-12-18.acacia",
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
    } catch (error: any) {
        console.error("Error creating payment intent:", error)
        console.log("Stripe Key Present:", !!process.env.STRIPE_SECRET_KEY)
        console.log("Stripe Key Prefix:", process.env.STRIPE_SECRET_KEY?.substring(0, 7))
        return { error: error.message || "Failed to create payment intent" }
    }
}
