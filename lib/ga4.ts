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

        // Fetch Realtime Active Users
        const realtimeResponse = await fetch(`${GA4_API_URL}/properties/${config.propertyId}:runRealtimeReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metrics: [{ name: 'activeUsers' }]
            })
        })

        const realtimeData = await realtimeResponse.json()

        // Parse Data
        const stats = {
            activeUsers: parseInt(realtimeData.rows?.[0]?.metricValues?.[0]?.value || '0'),
            visits: parseInt(reportData.rows?.[0]?.metricValues?.[1]?.value || '0'),
            totalRevenue: parseFloat(reportData.rows?.[0]?.metricValues?.[2]?.value || '0'),
            totalOrders: parseInt(reportData.rows?.[0]?.metricValues?.[3]?.value || '0'),
            avgOrderValue: parseFloat(reportData.rows?.[0]?.metricValues?.[4]?.value || '0')
        }

        return stats

    } catch (error) {
        console.error('GA4 Fetch Error:', error)
        return null
    }
}
