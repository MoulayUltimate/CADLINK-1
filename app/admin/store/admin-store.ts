import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminState {
    // Global Config
    maintenanceMode: boolean
    toggleMaintenanceMode: () => void

    // Script Injection
    scripts: {
        head: string
        body: string
    }
    updateScripts: (location: 'head' | 'body', code: string) => void

    // Stripe Config
    stripeConfig: {
        publishableKey: string
        secretKey: string
        webhookSecret: string
    }
    updateStripeConfig: (config: Partial<AdminState['stripeConfig']>) => void

    // God Mode
    godModeUser: string | null
    setGodModeUser: (userId: string | null) => void
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            maintenanceMode: false,
            toggleMaintenanceMode: () => set((state) => ({ maintenanceMode: !state.maintenanceMode })),

            scripts: {
                head: '',
                body: ''
            },
            updateScripts: (location, code) =>
                set((state) => ({
                    scripts: { ...state.scripts, [location]: code }
                })),

            stripeConfig: {
                publishableKey: '',
                secretKey: '',
                webhookSecret: ''
            },
            updateStripeConfig: (config) =>
                set((state) => ({
                    stripeConfig: { ...state.stripeConfig, ...config }
                })),

            godModeUser: null,
            setGodModeUser: (userId) => set({ godModeUser: userId }),
        }),
        {
            name: 'antigravity-admin-storage',
        }
    )
)
