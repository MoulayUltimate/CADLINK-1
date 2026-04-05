"use client"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { CURRENCY_CONFIG, DEFAULT_CURRENCY, type CurrencyInfo } from "@/lib/currency-config"
import { useLang } from "@/contexts/translation-context"

export function useCurrency() {
    const params = useParams()
    const pathname = usePathname()
    const contextLang = useLang()

    // Extract lang from context, params or pathname
    const getLang = () => {
        if (contextLang) return contextLang
        if (params?.lang) return params.lang as string
        const segments = pathname?.split("/") || []
        if (segments[1] && CURRENCY_CONFIG[segments[1]]) return segments[1]
        return "gb" // Default to gb instead of us since the project uses gb
    }

    const lang = getLang()
    const [currency, setCurrency] = useState<CurrencyInfo>(
        CURRENCY_CONFIG[lang] || DEFAULT_CURRENCY
    )

    useEffect(() => {
        // 1. Check URL locale first (already in state initial value)
        const urlCurrency = CURRENCY_CONFIG[lang] || DEFAULT_CURRENCY

        // 2. Check for Google Translate detection (googtrans cookie)
        const getGoogleTranslateLang = () => {
            if (typeof document === 'undefined') return null

            // Check googtrans cookie
            const match = document.cookie.match(/googtrans=\/([^/]+)\/([^/]+)/)
            if (match && match[2]) {
                return match[2].toLowerCase()
            }

            // Check for 'goog-te-menu-value' if using the standard widget
            // Or just look for the class added by Google Translate
            if (document.body.classList.contains('translated-ltr') || document.body.classList.contains('translated-rtl')) {
                const htmlLang = document.documentElement.getAttribute('lang')
                if (htmlLang && htmlLang !== 'en') return htmlLang.toLowerCase()
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
