import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export function PrivacyPolicyPage({ lang }: { lang: string }) {
    return (
        <div className="min-h-screen bg-white">
            <Header lang={lang} />
            <main className="pt-12 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                            <Shield className="w-8 h-8 text-[#0168A0]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Privacy Policy</h1>
                        <p className="text-xl text-gray-500">Last Updated: March 24, 2024</p>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Eye className="w-6 h-6 text-[#0168A0]" />
                                1. Information We Collect
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                At CADLINK, we are committed to protecting your privacy. We collect information that you provide directly to us when you make a purchase, create an account, or contact our support team.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Account information (name, email, organization)</li>
                                <li>Transaction details and purchase history</li>
                                <li>Device information and technical logs</li>
                                <li>Communication history with our support desk</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-[#0168A0]" />
                                2. How We Use Your Data
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Your information is used primarily to provide and improve our sign-making software services. This includes:
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">Service Delivery</h4>
                                    <p className="text-sm text-gray-500">Managing licenses, processing payments, and delivering digital products.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">Product Improvement</h4>
                                    <p className="text-sm text-gray-500">Analyzing usage patterns to optimize performance and develop new features.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#0168A0]" />
                                3. Data Security
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                We implement industry-standard security measures to protect your data. All financial transactions are processed through secure, PCI-compliant payment gateways (like Stripe), and we never store your full payment card details on our servers.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-400 text-center italic">
                                For any questions regarding this policy, please contact our Data Protection Officer at privacy@cadlink.store
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
