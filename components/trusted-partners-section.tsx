import Image from "next/image"
import { Shield } from "lucide-react"

export function TrustedPartnersSection() {
  const partners = [
    {
      name: "Verified by Google",
      description: "Reliable online verification & authenticity",
      logo: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg",
    },
    {
      name: "Secured by PayPal",
      description: "Safe digital payments & buyer protection",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    },
    {
      name: "Integrated with Autodesk",
      description: "Seamless CAD & design file compatibility",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg",
    },
    {
      name: "Powered by CorelDRAW",
      description: "Professional vector & printing workflow",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/CorelDraw_logo.svg",
    },
    {
      name: "Connected with Adobe",
      description: "Industry-standard design workflow support",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg",
    },
    {
      name: "Official Digital Factory Partner",
      description: "We provide genuine license keys & solutions",
      logo: "/images/cadlink-product.png",
    },
  ]

  return (
    <section className="py-20 bg-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 justify-center md:justify-start">
            <Shield className="w-8 h-8 text-[#0168A0]" fill="currentColor" fillOpacity={0.1} />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trusted by Global Software & Verification Leaders
            </h3>
          </div>

          {/* Trust Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl p-2">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={`${partner.name} logo`}
                    width={48}
                    height={48}
                    className="max-h-full max-w-full object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{partner.name}</div>
                  <div className="text-sm text-gray-500 leading-snug">{partner.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Note paragraph */}
          <p className="mt-10 text-gray-500 text-center md:text-left text-sm leading-relaxed max-w-4xl">
            Our store is trusted by global creative and manufacturing professionals. We deliver{" "}
            <strong className="text-gray-900">official Digital Factory 11 license keys</strong> and provide secure,
            verified transactions through <strong className="text-gray-900">PayPal</strong>. Our software integrates
            seamlessly with <strong className="text-gray-900">CorelDRAW</strong>,{" "}
            <strong className="text-gray-900">Autodesk</strong>, and <strong className="text-gray-900">Adobe</strong>{" "}
            design environments — ensuring smooth and efficient production workflows.
          </p>
        </div>
      </div>
    </section>
  )
}
