"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Globe, CreditCard, BarChart, Lock, Mail, Shield } from "lucide-react"
import { getSettings, updateSettings, type Settings } from "@/app/actions/settings"
import { toast } from "sonner"

export function SettingsView() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState<Settings | null>(null)
    const [activeTab, setActiveTab] = useState("payment")

    useEffect(() => {
        const loadSettings = async () => {
            const data = await getSettings()
            setSettings(data)
            setIsLoading(false)
        }
        loadSettings()
    }, [])

    const handleSave = async () => {
        if (!settings) return
        setIsSaving(true)
        const result = await updateSettings(settings)
        setIsSaving(false)
        if (result.success) {
            toast.success("Settings saved successfully")
        } else {
            toast.error("Failed to save settings")
        }
    }

    if (isLoading || !settings) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#0168A0]" />
            </div>
        )
    }

    const tabs = [
        { id: "payment", label: "Payment", icon: CreditCard },
        { id: "analytics", label: "Analytics", icon: BarChart },
        { id: "general", label: "General", icon: Globe },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-white">Store Settings</h2>
                <p className="text-gray-400">Manage your store configuration.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? "bg-[#0168A0] text-white shadow-lg shadow-[#0168A0]/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="flex-1 bg-[#1e293b] rounded-2xl border border-white/5 p-6 md:p-8">
                    {activeTab === "payment" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Payment Configuration</h3>
                                    <p className="text-sm text-gray-400">Manage payment gateways and links</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Stripe Payment Link</label>
                                    <input
                                        type="text"
                                        value={settings.payment.stripeLink}
                                        onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, stripeLink: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Dodo Payments API Key</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={settings.payment.dodoApiKey}
                                            onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, dodoApiKey: e.target.value } })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all font-mono"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Return URL</label>
                                    <input
                                        type="text"
                                        value={settings.payment.returnUrl}
                                        onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, returnUrl: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <BarChart className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Analytics & Tracking</h3>
                                    <p className="text-sm text-gray-400">Configure tracking IDs and pixels</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Google Analytics ID</label>
                                    <input
                                        type="text"
                                        value={settings.analytics.googleAnalyticsId}
                                        onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, googleAnalyticsId: e.target.value } })}
                                        placeholder="G-XXXXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Google Ads Tag</label>
                                    <input
                                        type="text"
                                        value={settings.analytics.googleAdsTag}
                                        onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, googleAdsTag: e.target.value } })}
                                        placeholder="AW-XXXXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "general" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Globe className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">General Configuration</h3>
                                    <p className="text-sm text-gray-400">Global store settings</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-white/10">
                                    <div>
                                        <h3 className="font-bold text-white">Country Detection</h3>
                                        <p className="text-sm text-gray-400">Auto-detect user location</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.general.enableCountryDetection}
                                            onChange={(e) => setSettings({ ...settings, general: { ...settings.general, enableCountryDetection: e.target.checked } })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0168A0]"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Support Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={settings.general.supportEmail}
                                            onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all pl-10"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-[#0168A0]/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
