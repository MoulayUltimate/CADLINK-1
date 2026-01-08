import { useState, useEffect } from 'react'

interface ActiveRegion {
    country: string
    count: number
}

export function useLiveTraffic() {
    const [activeUsers, setActiveUsers] = useState(0)
    const [cartEvents, setCartEvents] = useState<number[]>([])
    const [activeRegions, setActiveRegions] = useState<ActiveRegion[]>([])

    useEffect(() => {
        const fetchLiveTraffic = async () => {
            try {
                const res = await fetch('/api/analytics/live')
                if (res.ok) {
                    const data = await res.json()
                    setActiveUsers(data.activeUsers || 0)
                    setCartEvents(data.cartEvents || [])
                    setActiveRegions(data.activeRegions || [])
                }
            } catch (err) {
                console.error('Failed to fetch live traffic', err)
            }
        }

        fetchLiveTraffic()
        const interval = setInterval(fetchLiveTraffic, 5000) // Poll every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return { activeUsers, cartEvents, activeRegions }
}

