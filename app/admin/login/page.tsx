"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { toast } from "sonner"

export default function AdminLogin() {
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simple hardcoded auth for demo purposes - in production use NextAuth or real backend
        if (password === "admin123") {
            document.cookie = "admin_token=valid; path=/"
            toast.success("Login successful")
            router.push("/admin")
        } else {
            toast.error("Invalid password")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[#0168A0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-[#0168A0]" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Admin Access</h1>
                    <p className="text-gray-500">Enter your password to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0168A0] focus:ring-2 focus:ring-[#0168A0]/20 outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Checking..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}
