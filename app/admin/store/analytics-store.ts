import { create } from 'zustand'
import type { Visitor, LiveVisitorData, AnalyticsDashboardData } from '@/types/analytics'

interface AnalyticsStore {
    // Live data
    liveData: LiveVisitorData | null
    dashboardData: AnalyticsDashboardData | null

    // UI state
    dateRange: { start: Date; end: Date }
    selectedMetric: 'visitors' | 'revenue' | 'conversions'

    // Actions
    setLiveData: (data: LiveVisitorData) => void
    setDashboardData: (data: AnalyticsDashboardData) => void
    setDateRange: (range: { start: Date; end: Date }) => void
    setSelectedMetric: (metric: 'visitors' | 'revenue' | 'conversions') => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
    liveData: null,
    dashboardData: null,
    dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end: new Date(),
    },
    selectedMetric: 'visitors',

    setLiveData: (data) => set({ liveData: data }),
    setDashboardData: (data) => set({ dashboardData: data }),
    setDateRange: (range) => set({ dateRange: range }),
    setSelectedMetric: (metric) => set({ selectedMetric: metric }),
}))
