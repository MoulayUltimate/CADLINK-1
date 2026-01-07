"use client"

import { useAnalyticsTracker } from "@/hooks/use-analytics-tracker"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    useAnalyticsTracker()
    return <>{children}</>
}
