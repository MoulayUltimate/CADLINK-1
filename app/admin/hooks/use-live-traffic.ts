import { useState, useEffect } from 'react'

export function useLiveTraffic() {
    const [activeUsers, setActiveUsers] = useState(124)
    const [cartEvents, setCartEvents] = useState<number[]>([])

    useEffect(() => {
        // Simulate heartbeat
        const interval = setInterval(() => {
            setActiveUsers(prev => {
                const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
                return Math.max(50, prev + change)
            })
        }, 2000)

        // Simulate random cart adds
        const cartInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setCartEvents(prev => [...prev.slice(-19), Date.now()])
            }
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(cartInterval)
        }
    }, [])

    return { activeUsers, cartEvents }
}
