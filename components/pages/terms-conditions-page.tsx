import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, Scale, Gavel, AlertCircle } from "lucide-react"

export function TermsConditionsPage({ lang }: { lang: string }) {
    return (
        <div className="min-h-screen bg-white">
            <Header lang={lang} />
            <main className="pt-12 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6">
                            <Scale className="w-8 h-8 text-gray-900" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Terms & Conditions</h1>
                        <p className="text-xl text-gray-500">Agreement Between User and CADLINK</p>
                    </div>

                    <div className="space-y-12 bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Gavel className="w-6 h-6 text-[#0168A0]" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                By accessing or using the CADLINK store and software, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, you may not use our services.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-[#0168A0]" />
                                2. Software License
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                CADLINK software is licensed, not sold. We grant you a limited, non-exclusive, non-transferable license to use the software according to the specific edition purchased (e.g., DTF Edition).
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>No unauthorized redistribution or reselling of license keys.</li>
                                <li>No reverse engineering or modification of the binary code.</li>
                                <li>One license per machine unless otherwise specified.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#0168A0]" />
                                3. Payment and Fees
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                You agree to pay all charges incurred by you or any users of your account and credit card at the prices in effect when such charges are incurred. You are responsible for any taxes applicable to your purchase.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-400 text-center">
                                These terms are governed by the laws of Ontario, Canada without regard to conflict of law principles.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
