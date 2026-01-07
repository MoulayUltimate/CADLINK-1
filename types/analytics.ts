// Database schema types (Prisma-ready)

export interface Visitor {
    id: string
    sessionId: string
    ip: string
    country: string
    city: string
    device: string
    browser: string
    os: string
    firstVisit: Date
    lastSeen: Date
    pageViews: number
    status: 'active' | 'idle' | 'offline'
}

export interface Session {
    id: string
    visitorId: string
    startedAt: Date
    endedAt?: Date
    duration: number
    pages: PageView[]
    events: AnalyticsEvent[]
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    isConverted: boolean
    revenue?: number
}

export interface PageView {
    id: string
    sessionId: string
    url: string
    title: string
    duration: number
    timestamp: Date
    scrollDepth: number
    exitPage: boolean
}

export interface AnalyticsEvent {
    id: string
    sessionId: string
    type: 'page_view' | 'cart_add' | 'cart_remove' | 'checkout_start' | 'purchase' | 'custom'
    page: string
    timestamp: Date
    metadata?: Record<string, any>
}

export interface Product {
    id: string
    name: string
    price: number
    cost: number
    currency: string
    stock: number
    status: 'active' | 'draft' | 'archived'
    createdAt: Date
    updatedAt: Date
    analytics: ProductAnalytics
}

export interface ProductAnalytics {
    views: number
    cartAdds: number
    purchases: number
    conversionRate: number
    revenue: number
}

export interface Order {
    id: string
    userId?: string
    sessionId: string
    total: number
    currency: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    stripePaymentId?: string
    createdAt: Date
    items: OrderItem[]
}

export interface OrderItem {
    productId: string
    quantity: number
    price: number
}

export interface TrackingScript {
    id: string
    name: string
    code: string
    location: 'head' | 'body_start' | 'body_end'
    enabled: boolean
    version: number
    createdAt: Date
    updatedAt: Date
}

export interface AdminUser {
    id: string
    email: string
    name: string
    role: 'super_admin' | 'admin' | 'analyst' | 'manager'
    twoFactorEnabled: boolean
    lastLogin?: Date
    createdAt: Date
}

export interface AuditLog {
    id: string
    adminId: string
    action: string
    details: Record<string, any>
    ip: string
    timestamp: Date
}

// API Response types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    meta?: {
        total?: number
        page?: number
        limit?: number
    }
}

// Real-time data types
export interface LiveVisitorData {
    totalActive: number
    visitors: Visitor[]
    recentEvents: AnalyticsEvent[]
    topPages: Array<{ url: string; count: number }>
    countriesMap: Record<string, number>
}

export interface AnalyticsDashboardData {
    visitors: {
        total: number
        new: number
        returning: number
        trend: number
    }
    sessions: {
        total: number
        avgDuration: number
        bounceRate: number
    }
    conversions: {
        rate: number
        total: number
        revenue: number
    }
    timeSeriesData: Array<{
        timestamp: Date
        visitors: number
        pageViews: number
        conversions: number
    }>
}
