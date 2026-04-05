"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CURRENCY_CONFIG, DEFAULT_CURRENCY, type CurrencyInfo } from "@/lib/currency-config"

export function useCurrency() {
    const params = useParams()
    const lang = (params?.lang as string) || "us"
    const [currency, setCurrency] = useState<CurrencyInfo>(
        CURRENCY_CONFIG[lang] || DEFAULT_CURRENCY
    )

    useEffect(() => {
        // 1. Check URL locale first (already in state initial value)
        const urlCurrency = CURRENCY_CONFIG[lang] || DEFAULT_CURRENCY

        // 2. Check for Google Translate detection (googtrans cookie)
        const getGoogleTranslateLang = () => {
            if (typeof document === 'undefined') return null
            const match = document.cookie.match(/googtrans=\/([^/]+)\/([^/]+)/)
            if (match && match[2]) {
                return match[2].toLowerCase()
            }
            // Also check html lang attribute which Google Translate updates
            const htmlLang = document.documentElement.getAttribute('lang')
            if (htmlLang && htmlLang !== 'en' && htmlLang.length === 2) {
                return htmlLang.toLowerCase()
            }
            return null
        }

        const gLang = getGoogleTranslateLang()
        if (gLang && CURRENCY_CONFIG[gLang]) {
            setCurrency(CURRENCY_CONFIG[gLang])
        } else {
            setCurrency(urlCurrency)
        }

        // Set up an observer to watch for lang attribute changes (Google Translate)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    const newGLang = getGoogleTranslateLang()
                    if (newGLang && CURRENCY_CONFIG[newGLang]) {
                        setCurrency(CURRENCY_CONFIG[newGLang])
                    }
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })

        return () => observer.disconnect()
    }, [lang])

    const formatPrice = (priceInUsd: number) => {
        // If it's a fixed price requested by user, we could just return a mapped value
        // For now, we apply the rate from config
        const converted = priceInUsd * currency.rate

        return new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.currency,
        }).format(converted)
    }

    return {
        ...currency,
        formatPrice,
    }
}
