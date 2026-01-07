import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        const propertyId = process.env.GA_PROPERTY_ID; // e.g. '3456789'

        if (!credentialsJson || !propertyId) {
            return NextResponse.json({
                error: 'Missing Google Analytics credentials or Property ID',
                isConfigured: false
            }, { status: 500 });
        }

        const credentials = JSON.parse(credentialsJson);
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials,
        });

        // Fetch Realtime Data (Last 30 mins)
        const [response] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${propertyId}`,
            dimensions: [
                { name: 'country' },
            ],
            metrics: [
                { name: 'activeUsers' },
            ],
        });

        // Process data
        const totalActiveUsers = response.rows?.reduce((sum, row) => {
            return sum + parseInt(row.metricValues?.[0]?.value || '0');
        }, 0) || 0;

        return NextResponse.json({
            activeUsers: totalActiveUsers,
            isConfigured: true
        });

    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: error.message, isConfigured: true }, { status: 500 });
    }
}
