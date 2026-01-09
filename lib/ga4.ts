import { SignJWT, importPKCS8 } from 'jose'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GA4_API_URL = 'https://analyticsdata.googleapis.com/v1beta'

interface GA4Config {
    clientEmail: string
    privateKey: string
    propertyId: string
}

async function getAccessToken(config: GA4Config): Promise<string> {
    try {
        const privateKey = await importPKCS8(config.privateKey.replace(/\\n/g, '\n'), 'RS256')

        const jwt = await new SignJWT({
            scope: 'https://www.googleapis.com/auth/analytics.readonly'
        })
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            .setIssuer(config.clientEmail)
            .setAudience(GOOGLE_TOKEN_URL)
            .setExpirationTime('1h')
            .setIssuedAt()
            .sign(privateKey)

        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        })

        const data = await response.json()
        return data.access_token
    } catch (error) {
        console.error('Failed to get Google Access Token:', error)
        throw error
    }
}

export async function getGA4Data(startDate: string = '7daysAgo', endDate: string = 'today') {
    const config: GA4Config = {
        clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
        privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
        propertyId: process.env.GOOGLE_ANALYTICS_PROPERTY_ID || ''
    }

    if (!config.clientEmail || !config.privateKey || !config.propertyId) {
        return null
    }

    try {
        const accessToken = await getAccessToken(config)

        // Fetch Basic Stats
        const reportResponse = await fetch(`${GA4_API_URL}/properties/${config.propertyId}:runReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateRanges: [{ startDate, endDate }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'totalRevenue' },
                    { name: 'transactions' },
                    { name: 'averagePurchaseRevenue' }
                ]
            })
        })

        const reportData = await reportResponse.json()

        // 1. Fetch Realtime Active Users (Last 30 mins) by Country
        const realtime30mResponse = await fetch(`${GA4_API_URL}/properties/${config.propertyId}:runRealtimeReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dimensions: [{ name: 'country' }],
                metrics: [{ name: 'activeUsers' }]
            })
        })

        const realtime30mData = await realtime30mResponse.json()

        // 2. Fetch Realtime Active Users (Last 5 mins)
        // We filter for minutesAgo 00-04 to get the last 5 minutes unique count
        const realtime5mResponse = await fetch(`${GA4_API_URL}/properties/${config.propertyId}:runRealtimeReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metrics: [{ name: 'activeUsers' }],
                dimensionFilter: {
                    filter: {
                        fieldName: 'minutesAgo',
                        inListFilter: {
                            values: ['00', '01', '02', '03', '04'],
                            caseSensitive: false
                        }
                    }
                }
            })
        })

        const realtime5mData = await realtime5mResponse.json()

        // Parse 30m Data (Countries)
        let activeUsers30Min = 0
        const activeRegions: { country: string; count: number }[] = []

        if (realtime30mData.rows) {
            for (const row of realtime30mData.rows) {
                const country = row.dimensionValues?.[0]?.value || 'Unknown'
                const count = parseInt(row.metricValues?.[0]?.value || '0')
                activeUsers30Min += count
                activeRegions.push({ country, count })
            }
            // Sort by count descending
            activeRegions.sort((a, b) => b.count - a.count)
        }

        // Parse 5m Data (Total)
        let activeUsers5Min = 0
        if (realtime5mData.rows && realtime5mData.rows.length > 0) {
            activeUsers5Min = parseInt(realtime5mData.rows[0].metricValues?.[0]?.value || '0')
        }

        // Fetch City Report
        const cityResponse = await fetch(`${GA4_API_URL}/properties/${config.propertyId}:runReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'city' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'newUsers' },
                    { name: 'sessions' },
                    { name: 'bounceRate' },
                    { name: 'screenPageViewsPerSession' },
                    { name: 'averageSessionDuration' }
                ]
            })
        })
        const cityData = await cityResponse.json()

        // Parse City Data
        const cityStats = cityData.rows?.map((row: any) => ({
            city: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value),
            newUsers: parseInt(row.metricValues[1].value),
            sessions: parseInt(row.metricValues[2].value),
            bounceRate: parseFloat(row.metricValues[3].value),
            pagesPerSession: parseFloat(row.metricValues[4].value),
            avgSessionDuration: parseFloat(row.metricValues[5].value)
        })) || []

        // Parse Data
        const stats = {
            activeUsers: activeUsers5Min, // "Online Now" (5 min)
            activeUsers30Min: activeUsers30Min, // New metric for 30 min
            visits: parseInt(reportData.rows?.[0]?.metricValues?.[1]?.value || '0'),
            totalRevenue: parseFloat(reportData.rows?.[0]?.metricValues?.[2]?.value || '0'),
            totalOrders: parseInt(reportData.rows?.[0]?.metricValues?.[3]?.value || '0'),
            avgOrderValue: parseFloat(reportData.rows?.[0]?.metricValues?.[4]?.value || '0'),
            activeRegions,
            cityStats
        }

        return stats

    } catch (error) {
        console.error('GA4 Fetch Error:', error)
        return null
    }
}
