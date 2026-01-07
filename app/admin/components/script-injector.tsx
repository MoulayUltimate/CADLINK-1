"use client"

import { useAdminStore } from '@/app/admin/store/admin-store'
import { useEffect } from 'react'

export function ScriptInjector() {
    const { scripts } = useAdminStore()

    useEffect(() => {
        try {
            // Head Scripts
            if (scripts.head) {
                const headRange = document.createRange()
                const headFragment = headRange.createContextualFragment(scripts.head)
                document.head.appendChild(headFragment)
            }

            // Body Scripts
            if (scripts.body) {
                const bodyRange = document.createRange()
                const bodyFragment = bodyRange.createContextualFragment(scripts.body)
                document.body.appendChild(bodyFragment)
            }
        } catch (error) {
            console.error("Script Injection Failed:", error)
        }
    }, [scripts])

    return null
}
