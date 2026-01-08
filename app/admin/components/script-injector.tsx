"use client"

import { useEffect, useState } from 'react'

interface Script {
    id: string
    name: string
    code: string
    location: 'head' | 'body'
    enabled: boolean
}

export function ScriptInjector() {
    const [scripts, setScripts] = useState<Script[]>([])

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const res = await fetch('/api/admin/scripts')
                if (res.ok) {
                    const data = await res.json()
                    setScripts(data.filter((s: Script) => s.enabled))
                }
            } catch (err) {
                console.error('Failed to fetch scripts for injection', err)
            }
        }
        fetchScripts()
    }, [])

    useEffect(() => {
        if (scripts.length === 0) return

        scripts.forEach(script => {
            if (!script.code) return

            try {
                const range = document.createRange()
                const fragment = range.createContextualFragment(script.code)

                if (script.location === 'head') {
                    document.head.appendChild(fragment)
                } else {
                    document.body.appendChild(fragment)
                }
            } catch (error) {
                console.error(`Failed to inject script: ${script.name}`, error)
            }
        })
    }, [scripts])

    return null
}
