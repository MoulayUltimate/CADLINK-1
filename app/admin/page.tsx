"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    BarChart2,
    Activity,
    X
} from "lucide-react"
import Image from "next/image"

import { AnalyticsView } from "@/components/admin/analytics-view"
import { LiveTraceView } from "@/components/admin/live-trace-view"
import { DashboardView } from "@/components/admin/dashboard-view"
import { ProductManagement } from "@/components/admin/product-management"
import { UserInspector } from "@/components/admin/user-inspector"
import { PaymentsView } from "@/components/admin/payments-view"
import { IntegrationsView } from "@/components/admin/integrations-view"
import { AbandonedCheckoutsView } from "@/components/admin/abandoned-checkouts-view"
import { Package, CreditCard, Code2, AlertCircle } from "lucide-react"

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
        // Check for auth token
        const token = document.cookie.split("; ").find((row) => row.startsWith("admin_token="))
        if (!token) {
            router.push("/admin/login")
        }
    }, [router])

    const handleTabChange = (id: string) => {
        setActiveTab(id)
        setSidebarOpen(false)
        router.push(`/admin?view=${id}`, { scroll: false })
    }

    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "analytics", icon: BarChart2, label: "Analytics" },
        { id: "live-trace", icon: Activity, label: "User Trace" },
        { id: "abandoned", icon: AlertCircle, label: "Abandoned Checkouts" },
        { id: "products", icon: Package, label: "Products" },
        { id: "payments", icon: CreditCard, label: "Monetization" },
        { id: "integrations", icon: Code2, label: "Integrations" },

    ]

    const handleLogout = () => {
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        router.push("/admin/login")
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardView />
            case "analytics":
                return <AnalyticsView />
            case "live-trace":
                return <LiveTraceView onInspectUser={(id: string) => setSelectedUserId(id)} />
            case "abandoned":
                return <AbandonedCheckoutsView />
            case "products":
                return <ProductManagement />
            case "payments":
                return <PaymentsView />
            case "integrations":
                return <IntegrationsView />
            default:
                return <DashboardView />
        }
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex font-sans text-white">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="h-24 flex items-center justify-center border-b border-white/5 px-6 relative">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/cropped-ixtzd985wxrrucij9vkr.avif"
                            alt="CADLINK"
                            width={140}
                            height={40}
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute right-4 lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</div>
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${isActive
                                    ? "bg-[#0168A0] text-white shadow-lg shadow-[#0168A0]/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                                {item.label}
                            </button>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 rotate-180" />
                            Back to Store
                        </button>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/5">
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
                <header className="bg-[#1e293b] border-b border-white/5 h-20 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-black text-white capitalize hidden sm:block">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white">Admin User</p>
                                <p className="text-xs text-gray-400">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-[#0168A0] rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-[#0168A0]/20">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#0f172a] p-4 lg:p-8">
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
            <AdminDashboardContent />
        </Suspense>
    )
}
