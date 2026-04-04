import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RotateCcw, AlertTriangle, CheckCircle2, FileText } from "lucide-react"

export function RefundReturnsPage({ lang }: { lang: string }) {
    return (
        <div className="min-h-screen bg-white">
            <Header lang={lang} />
            <main className="pt-12 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl mb-6">
                            <RotateCcw className="w-8 h-8 text-orange-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Refund & Returns</h1>
                        <p className="text-xl text-gray-500">Effective Date: January 1, 2024</p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 flex gap-6 items-start">
                            <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-orange-900 mb-2">Digital Product Policy</h3>
                                <p className="text-orange-800/80 leading-relaxed">
                                    Since CADLINK is a digital software product delivered via instant download and license key, we generally do not offer refunds once the software has been activated or the license key has been revealed.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8">
                                <CheckCircle2 className="w-10 h-10 text-[#0168A0] mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Eligible for Refund</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-[#0168A0] rounded-full mt-2" />
                                        Duplicate purchases made by mistake.
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-[#0168A0] rounded-full mt-2" />
                                        Unactivated software within 14 days.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8">
                                <AlertTriangle className="w-10 h-10 text-red-500 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Non-Refundable</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                                        Activated license keys.
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                                        Software used for production.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#0168A0]" />
                                Refund Process
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                To request a refund, please contact our support team at <strong>support@cadlink.store</strong> with your order number and reason for the request. All requests are reviewed within 48 business hours.
                            </p>
                            <div className="p-6 bg-white rounded-2xl border border-gray-100 italic text-sm text-gray-500 text-center">
                                "Our goal is your complete satisfaction with CADLINK. If you're experiencing technical difficulties, we'll work tirelessly to resolve them before processing any return."
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
