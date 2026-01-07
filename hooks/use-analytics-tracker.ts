"use client"

import { useEffect, useRef } from 'react'

export function useAnalyticsTracker() {
    const hasTracked = useRef(false)

    useEffect(() => {
        if (hasTracked.current) return

        const trackVisit = async () => {
            try {
                // Check session storage to avoid counting same session multiple times if desired
                // For now, we count every page load as a visit or use a simple session check
                const sessionKey = 'analytics_session_' + new Date().toDateString()
                if (!sessionStorage.getItem(sessionKey)) {
                    await fetch('/api/analytics', { method: 'POST' })
                    sessionStorage.setItem(sessionKey, 'true')
                    hasTracked.current = true
                }
            } catch (err) {
                console.error('Failed to track visit', err)
            }
        }

        trackVisit()
    }, [])
}
