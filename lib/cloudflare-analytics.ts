/**
 * Cloudflare Web Analytics API Client
 * Fetches analytics data from Cloudflare's GraphQL API
 */

const CF_GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql'

interface CloudflareAnalyticsData {
    visits: number
    pageViews: number
    uniqueVisitors: number
    topPages: { path: string; views: number }[]
    topCountries: { country: string; visits: number }[]
    topBrowsers: { browser: string; visits: number }[]
}

export async function getCloudflareAnalytics(days: number = 7): Promise<CloudflareAnalyticsData | null> {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const zoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!apiToken || !zoneId) {
        console.log('Cloudflare Analytics not configured (missing API_TOKEN or ZONE_ID)')
        return null
    }

    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const query = `
        query GetZoneAnalytics($zoneTag: string!, $since: Date!, $until: Date!) {
            viewer {
                zones(filter: { zoneTag: $zoneTag }) {
                    httpRequests1dGroups(
                        limit: 1
                        filter: { date_geq: $since, date_leq: $until }
                    ) {
                        sum {
                            requests
                            pageViews
                        }
                        uniq {
                            uniques
                        }
                    }
                    httpRequestsAdaptiveGroups(
                        limit: 10
                        filter: { date_geq: $since, date_leq: $until }
                        orderBy: [sum_requests_DESC]
                    ) {
                        dimensions {
                            clientRequestPath
                            clientCountryName
                            clientRequestHTTPHost
                        }
                        sum {
                            requests
                        }
                    }
                }
            }
        }
    `

    try {
        const response = await fetch(CF_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: {
                    zoneTag: zoneId,
                    since: startDate,
                    until: endDate
                }
            })
        })

        const data = await response.json()

        if (data.errors) {
            console.error('Cloudflare API Error:', data.errors)
            return null
        }

        const zones = data?.data?.viewer?.zones?.[0]
        if (!zones) {
            console.log('No zone data found')
            return null
        }

        const httpData = zones.httpRequests1dGroups?.[0]
        const adaptiveData = zones.httpRequestsAdaptiveGroups || []

        // Process top pages and countries
        const pageMap = new Map<string, number>()
        const countryMap = new Map<string, number>()

        for (const group of adaptiveData) {
            const path = group.dimensions?.clientRequestPath || '/'
            const country = group.dimensions?.clientCountryName || 'Unknown'
            const requests = group.sum?.requests || 0

            pageMap.set(path, (pageMap.get(path) || 0) + requests)
            countryMap.set(country, (countryMap.get(country) || 0) + requests)
        }

        const topPages = Array.from(pageMap.entries())
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)

        const topCountries = Array.from(countryMap.entries())
            .map(([country, visits]) => ({ country, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5)

        return {
            visits: httpData?.sum?.requests || 0,
            pageViews: httpData?.sum?.pageViews || 0,
            uniqueVisitors: httpData?.uniq?.uniques || 0,
            topPages,
            topCountries,
            topBrowsers: [] // Would need separate query
        }

    } catch (error) {
        console.error('Cloudflare Analytics fetch error:', error)
        return null
    }
}

/**
 * Get real-time visitor count (last 30 minutes)
 * Uses a simpler query for near-realtime data
 */
export async function getRealtimeVisitors(): Promise<number> {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const zoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!apiToken || !zoneId) {
        return 0
    }

    // Cloudflare's minimum granularity is 1 minute for real-time data
    const query = `
        query GetRealtimeData($zoneTag: string!) {
            viewer {
                zones(filter: { zoneTag: $zoneTag }) {
                    httpRequests1mGroups(
                        limit: 30
                        filter: { datetime_geq: "${new Date(Date.now() - 30 * 60 * 1000).toISOString()}" }
                    ) {
                        uniq {
                            uniques
                        }
                    }
                }
            }
        }
    `

    try {
        const response = await fetch(CF_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: { zoneTag: zoneId }
            })
        })

        const data = await response.json()
        const groups = data?.data?.viewer?.zones?.[0]?.httpRequests1mGroups || []

        // Sum unique visitors from last 30 minutes
        let totalUniques = 0
        for (const group of groups) {
            totalUniques += group.uniq?.uniques || 0
        }

        return totalUniques

    } catch (error) {
        console.error('Realtime fetch error:', error)
        return 0
    }
}
