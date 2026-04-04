import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"

export function ContactPage({ lang }: { lang: string }) {
    return (
        <div className="min-h-screen bg-white">
            <Header lang={lang} />
            <main className="pt-12 pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Contact Us</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Have questions about CADLINK? Our expert team is here to help you optimize your print production.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 bg-[#0168A0] rounded-2xl flex items-center justify-center mb-6">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                                <p className="text-gray-500 mb-4">Support available 24/7</p>
                                <a href="mailto:support@cadlink.store" className="text-[#0168A0] font-bold hover:underline">
                                    support@cadlink.store
                                </a>
                            </div>

                            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 bg-[#0168A0] rounded-2xl flex items-center justify-center mb-6">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                                <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm EST</p>
                                <a href="tel:+18005550199" className="text-[#0168A0] font-bold hover:underline">
                                    +1 (800) 555-0199
                                </a>
                            </div>

                            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 bg-[#0168A0] rounded-2xl flex items-center justify-center mb-6">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Office</h3>
                                <p className="text-gray-500 mb-4">Main Headquarters</p>
                                <p className="text-gray-900 font-bold">
                                    100 Technology Drive<br />
                                    Suite 400<br />
                                    Ottawa, ON K2K 2C5 Canada
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-100/50">
                            <form className="grid md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0168A0] transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0168A0] transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0168A0] transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Subject</label>
                                    <select className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0168A0] transition-colors appearance-none">
                                        <option>Technical Support</option>
                                        <option>Licensing Question</option>
                                        <option>Sales Inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Message</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0168A0] transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-12 py-5 bg-[#0168A0] text-white font-black rounded-2xl hover:bg-[#015580] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#0168A0]/20"
                                    >
                                        Send Message <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Support Channels */}
                    <div className="mt-24 grid md:grid-cols-2 gap-8 px-4">
                        <div className="flex gap-6 p-8 bg-[#F8FAFC] rounded-3xl border border-gray-100 items-start">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <MessageSquare className="w-6 h-6 text-[#0168A0]" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h4>
                                <p className="text-gray-500 mb-4">Talk to our support engineers in real-time for immediate assistance.</p>
                                <button className="text-[#0168A0] font-black text-sm uppercase tracking-wider hover:underline">Start Chat Now</button>
                            </div>
                        </div>
                        <div className="flex gap-6 p-8 bg-[#F8FAFC] rounded-3xl border border-gray-100 items-start">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-[#0168A0]" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Knowledge Base</h4>
                                <p className="text-gray-500 mb-4">Browse our extensive library of guides, tutorials, and common fixes.</p>
                                <button className="text-[#0168A0] font-black text-sm uppercase tracking-wider hover:underline">Browse Guides</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

import { ShieldCheck } from "lucide-react"
