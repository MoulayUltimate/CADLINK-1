"use server"

import fs from "fs/promises"
import path from "path"

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json")

export type Settings = {
    payment: {
        stripeLink: string
        dodoApiKey: string
        returnUrl: string
    }
    analytics: {
        googleAnalyticsId: string
        googleAdsTag: string
    }
    general: {
        enableCountryDetection: boolean
        supportEmail: string
    }
}

export async function getSettings(): Promise<Settings> {
    try {
        const data = await fs.readFile(SETTINGS_PATH, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        // Return default settings if file doesn't exist
        return {
            payment: {
                stripeLink: "",
                dodoApiKey: "",
                returnUrl: "",
            },
            analytics: {
                googleAnalyticsId: "",
                googleAdsTag: "",
            },
            general: {
                enableCountryDetection: true,
                supportEmail: "",
            },
        }
    }
}

export async function updateSettings(newSettings: Settings) {
    try {
        await fs.writeFile(SETTINGS_PATH, JSON.stringify(newSettings, null, 2))
        return { success: true }
    } catch (error) {
        console.error("Failed to save settings:", error)
        return { success: false, error: "Failed to save settings" }
    }
}
