import { Zap, ShieldCheck, CreditCard, Headphones } from "lucide-react"

export function FeaturesBar() {
    const features = [
        {
            icon: <Zap className="w-5 h-5 text-[#0168A0]" />,
            title: "Instant Delivery",
            subtitle: "1-30 min delivery",
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-[#0168A0]" />,
            title: "No Extra Charges",
            subtitle: "One-time payment",
        },
        {
            icon: <CreditCard className="w-5 h-5 text-[#0168A0]" />,
            title: "Safe Payments",
            subtitle: "Secure checkout",
        },
        {
            icon: <Headphones className="w-5 h-5 text-[#0168A0]" />,
            title: "24/7 Support",
            subtitle: "Always here to help",
        },
    ]

    return (
        <div className="bg-white border-y border-gray-100 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
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
