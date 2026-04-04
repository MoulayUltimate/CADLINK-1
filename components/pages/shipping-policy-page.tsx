import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Truck, Zap, Globe, ShieldCheck } from "lucide-react"

export function ShippingPolicyPage({ lang }: { lang: string }) {
    return (
        <div className="min-h-screen bg-white">
            <Header lang={lang} />
            <main className="pt-12 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-6">
                            <Zap className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Digital Delivery Policy</h1>
                        <p className="text-xl text-gray-500">Fast, secure, and environmentally friendly.</p>
                    </div>

                    <div className="space-y-12">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 bg-[#F8FAFC] border border-gray-100 rounded-3xl">
                                <Zap className="w-10 h-10 text-[#0168A0] mx-auto mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">Instant Access</h3>
                                <p className="text-sm text-gray-500">Download link available immediately after payment.</p>
                            </div>
                            <div className="text-center p-8 bg-[#F8FAFC] border border-gray-100 rounded-3xl">
                                <Globe className="w-10 h-10 text-[#0168A0] mx-auto mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">Global Delivery</h3>
                                <p className="text-sm text-gray-500">No physical boundaries. Delivered via email worldwide.</p>
                            </div>
                            <div className="text-center p-8 bg-[#F8FAFC] border border-gray-100 rounded-3xl">
                                <ShieldCheck className="w-10 h-10 text-[#0168A0] mx-auto mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">Verified Keys</h3>
                                <p className="text-sm text-gray-500">All license keys are securely generated and verified.</p>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">How it Works</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Upon successful completion of your order, you will receive an automatic email containing your unique CADLINK V11 license key and a direct link to the software installer. Please ensure your email address is correct during checkout.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Missing Emails</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    If you haven't received your download link within 10 minutes, please check your spam or junk folder. If it's still missing, contact our support team with your receipt number, and we will manually re-send your credentials immediately.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
