"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsHeartbeat() {
    const pathname = usePathname()

    useEffect(() => {
        // Function to send heartbeat
        const sendHeartbeat = async () => {
            try {
                await fetch('/api/analytics/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname })
                })
            } catch (err) {
                // Ignore errors to avoid spamming console
            }
        }

        // Send immediately on mount/path change
        sendHeartbeat()

        // Send every 30 seconds
        const interval = setInterval(sendHeartbeat, 30000)

        return () => clearInterval(interval)
    }, [pathname])

    return null
}
