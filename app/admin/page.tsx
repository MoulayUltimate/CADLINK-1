"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    BarChart2,
    MessageCircle,
    X
} from "lucide-react"
import Image from "next/image"

import { AnalyticsView } from "@/components/admin/analytics-view"

import { DashboardView } from "@/components/admin/dashboard-view"
import { ProductManagement } from "@/components/admin/product-management"
import { UserInspector } from "@/components/admin/user-inspector"
import { PaymentsView } from "@/components/admin/payments-view"
import { IntegrationsView } from "@/components/admin/integrations-view"
import { AbandonedCheckoutsView } from "@/components/admin/abandoned-checkouts-view"
import { LiveChatView } from "@/components/admin/live-chat-view"
import { OrdersView } from "@/components/admin/orders-view"
import { Package, CreditCard, Code2, AlertCircle, ShoppingBag } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    )
}

function AdminDashboardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    useEffect(() => {
        const view = searchParams.get("view")
        if (view) {
            setActiveTab(view)
        }
    }, [searchParams])

    useEffect(() => {
        // Check for auth session via API (since cookie is HttpOnly)
        fetch('/api/auth/check')
            .then(res => {
                if (!res.ok) {
                    router.push("/admin/login")
                }
            })
            .catch(() => router.push("/admin/login"))
    }, [router])

    const handleTabChange = (id: string) => {
        setActiveTab(id)
        setSidebarOpen(false)
        router.push(`/admin?view=${id}`, { scroll: false })
    }

    const menuItems = [
        { id: "chat", icon: MessageCircle, label: "Live Chat" },
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "orders", icon: ShoppingBag, label: "Orders" },
        { id: "analytics", icon: BarChart2, label: "Analytics" },
        { id: "abandoned", icon: AlertCircle, label: "Abandoned Checkouts" },
        { id: "products", icon: Package, label: "Products" },
        { id: "payments", icon: CreditCard, label: "Monetization" },
        { id: "integrations", icon: Code2, label: "Integrations" },
    ]

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push("/admin/login")
            router.refresh()
        } catch (error) {
            console.error('Logout failed', error)
            router.push("/admin/login")
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardView />
            case "orders":
                return <OrdersView />
            case "analytics":
                return <AnalyticsView />
            case "abandoned":
                return <AbandonedCheckoutsView />
            case "products":
                return <ProductManagement />
            case "payments":
                return <PaymentsView />
            case "integrations":
                return <IntegrationsView />
            case "chat":
                return <LiveChatView />
            default:
                return <DashboardView />
        }
    }

    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="h-24 flex items-center justify-center border-b border-border px-6 relative">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                            alt="CADLINK"
                            width={140}
                            height={40}
                            className="object-contain dark:brightness-0 dark:invert"
                        />
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute right-4 lg:hidden text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-4">Menu</div>
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${isActive
                                    ? "bg-[#0168A0] text-white shadow-lg shadow-[#0168A0]/30"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                                {item.label}
                            </button>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-border">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 rotate-180" />
                            Back to Store
                        </button>
                    </div>
                </nav>

                <div className="p-6 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="bg-card border-b border-border h-20 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-black text-foreground capitalize hidden sm:block">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-3 pl-6 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-foreground">Admin User</p>
                                <p className="text-xs text-muted-foreground">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-[#0168A0] rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-[#0168A0]/20">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* User Inspector Overlay */}
            <UserInspector
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <AdminDashboardContent />
            </ThemeProvider>
        </Suspense>
    )
}
