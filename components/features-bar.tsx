"use client"

import { Zap, ShieldCheck, CreditCard, Headphones } from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"

export function FeaturesBar() {
    const t = useTranslation()

    const features = [
        {
            icon: <Zap className="w-5 h-5 text-[#0168A0]" />,
            title: t.features_bar?.instant_delivery,
            subtitle: t.features_bar?.instant_delivery_sub,
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-[#0168A0]" />,
            title: t.features_bar?.no_extra_charges,
            subtitle: t.features_bar?.no_extra_charges_sub,
        },
        {
            icon: <CreditCard className="w-5 h-5 text-[#0168A0]" />,
            title: t.features_bar?.safe_payments,
            subtitle: t.features_bar?.safe_payments_sub,
        },
        {
            icon: <Headphones className="w-5 h-5 text-[#0168A0]" />,
            title: t.features_bar?.support_24_7,
            subtitle: t.features_bar?.support_24_7_sub,
        },
    ]

    return (
        <div className="bg-white border-y border-gray-100 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 justify-start md:justify-start">
                            <div className="bg-[#0168A0]/10 p-2.5 rounded-full">
                                {feature.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{feature.title}</p>
                                <p className="text-xs text-gray-500 leading-none">{feature.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
