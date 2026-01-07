import { Cpu, HardDrive, Monitor, Zap, LayoutGrid, AlertCircle } from "lucide-react"

export function SystemRequirementsSection() {
  const specs = [
    {
      icon: <LayoutGrid className="w-6 h-6 text-[#0168A0]" />,
      label: "Operating System",
      value: "Windows 11 / 10",
      detail: "64-bit (Version 1809 or higher)",
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#0168A0]" />,
      label: "Processor",
      value: "3+ GHz Processor",
      detail: "Recommended (2.5 GHz Minimum)",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#0168A0]" />,
      label: "Memory (RAM)",
      value: "16 GB Recommended",
      detail: "8 GB Minimum required",
    },
    {
      icon: <Monitor className="w-6 h-6 text-[#0168A0]" />,
      label: "Display Resolution",
      value: "1920 x 1080",
      detail: "True Color display supported",
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-[#0168A0]" />,
      label: "Graphics Card",
      value: "4 GB GPU (DX12)",
      detail: "DirectX 11 compatible minimum",
    },
    {
      icon: <HardDrive className="w-6 h-6 text-[#0168A0]" />,
      label: "Disk Space",
      value: "10 GB Free Space",
      detail: "SSD recommended for best performance",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              System Requirements
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Ensure smooth performance and fast rendering with these recommended specifications for CADlink Digital Factory 11.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 hover:border-[#0168A0]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {spec.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{spec.label}</h3>
                <p className="text-xl font-black text-gray-900 mb-2">{spec.value}</p>
                <p className="text-sm text-gray-500 font-medium">{spec.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#0168A0]/5 rounded-2xl border border-[#0168A0]/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0168A0] flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Pro Tip: Use an SSD</h4>
                <p className="text-sm text-gray-600">
                  Installing Digital Factory 11 on a Solid State Drive (SSD) significantly improves processing and ripping speeds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
