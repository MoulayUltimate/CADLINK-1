import { CheckCircle2 } from "lucide-react"

export function AboutSection() {
  const points = [
    "Advanced Color Management & White Ink Control",
    "Automated Production Tools for High Volume",
    "Powerful RIP Technology for Consistent Quality",
    "Purpose-built for Direct-to-Film (DTF) Printing",
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Why Choose CADlink <br />
                <span className="text-[#0168A0]">Digital Factory 11?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                CADLINK Digital Factory 11 DTF is the ultimate professional printing software for DTF producers, apparel
                decorators, and digital print shops. It's engineered to provide the most precise color accuracy and
                production efficiency in the industry.
              </p>
              <div className="space-y-4">
                {points.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#0168A0]" />
                    <span className="text-gray-700 font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#f9fafb] rounded-3xl p-8 md:p-12 border border-gray-100">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Professional-Grade RIP</h4>
                  <p className="text-sm text-gray-500">
                    Industry-leading processing speeds and halftone control for the most demanding production
                    environments.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Universal Compatibility</h4>
                  <p className="text-sm text-gray-500">
                    Supports a wide range of DTF printers, from desktop conversions to large-format industrial machines.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Instant Activation</h4>
                  <p className="text-sm text-gray-500">
                    Receive your genuine license key within minutes of purchase and start printing immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
