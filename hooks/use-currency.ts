"use client"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { CURRENCY_CONFIG, DEFAULT_CURRENCY, type CurrencyInfo } from "@/lib/currency-config"
import { useLang } from "@/contexts/translation-context"

/**
 * useCurrency Hook
 * 
 * This hook manages the current currency selection based on:
 * 1. The translation context (from the [lang] URL prefix)
 * 2. Google Translate detection (via cookies and DOM attributes)
 * 
 * It provides:
 * - currency: The ISO code (GBP, EUR, etc.)
 * - symbol: The currency symbol (£, €, etc.)
 * - stripeLink: The locale-aware checkout link
 * - formatPrice: A function to convert and format USD prices
 */
export function useCurrency() {
    const params = useParams()
    const pathname = usePathname()
    const contextLang = useLang()
    const [gLang, setGLang] = useState<string | null>(null)

    // Extract base lang from context, params or pathname
    const baseLang = (() => {
        if (contextLang) return contextLang
        if (params?.lang) return params.lang as string
        const segments = pathname?.split("/") || []
        if (segments[1] && CURRENCY_CONFIG[segments[1]]) return segments[1]
        return "us"
    })()

    // Detection logic for Google Translate
    useEffect(() => {
        const detectGoogleTranslate = () => {
            if (typeof document === 'undefined') return

            // Check googtrans cookie
            const match = document.cookie.match(/googtrans=\/([^/]+)\/([^/]+)/)
            if (match && match[2]) {
                const detected = match[2].toLowerCase()
                if (CURRENCY_CONFIG[detected]) {
                    setGLang(detected)
                    return
                }
            }

            // Check for translated classes or lang attribute
            const htmlLang = document.documentElement.getAttribute('lang')
            if (htmlLang && htmlLang !== 'en' && CURRENCY_CONFIG[htmlLang.toLowerCase()]) {
                setGLang(htmlLang.toLowerCase())
            }
        }

        detectGoogleTranslate()

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'lang' || mutation.attributeName === 'class')) {
                    detectGoogleTranslate()
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })
        observer.observe(document.body, { attributes: true })

        return () => observer.disconnect()
    }, [])

    // Final lang: prioritized Google Translate, then base lang
    const activeLang = (gLang && CURRENCY_CONFIG[gLang]) ? gLang : baseLang
    const currency = CURRENCY_CONFIG[activeLang] || DEFAULT_CURRENCY

    const formatPrice = (priceInUsd: number) => {
        const converted = priceInUsd * currency.rate
        return new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.currency,
        }).format(converted)
    }

    return {
        currency: currency.currency,
        symbol: currency.symbol,
        stripeLink: currency.stripeLink,
        formatPrice,
        activeLang
    }
}
