"use server"

import Stripe from "stripe"

// Stripe initialized inside function to ensure env vars are ready


export async function createPaymentIntent(amount: number, currency: string = "usd") {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
            // apiVersion: "2024-12-18.acacia",
        })

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
        return {
            error: error.message || "Failed to create payment intent",
            debug: {
                keyPresent: !!process.env.STRIPE_SECRET_KEY,
                isPlaceholder: process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY
            }
        }
    }
}
