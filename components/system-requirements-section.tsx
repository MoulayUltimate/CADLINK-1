"use client"

import { Cpu, HardDrive, Monitor, Zap, LayoutGrid } from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"

export function SystemRequirementsSection() {
  const t = useTranslation()

  const specs = [
    {
      icon: <LayoutGrid className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.os_label,
      value: t.system_requirements?.os_value,
      detail: t.system_requirements?.os_detail,
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.cpu_label,
      value: t.system_requirements?.cpu_value,
      detail: t.system_requirements?.cpu_detail,
    },
    {
      icon: <Zap className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.ram_label,
      value: t.system_requirements?.ram_value,
      detail: t.system_requirements?.ram_detail,
    },
    {
      icon: <Monitor className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.display_label,
      value: t.system_requirements?.display_value,
      detail: t.system_requirements?.display_detail,
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.gpu_label,
      value: t.system_requirements?.gpu_value,
      detail: t.system_requirements?.gpu_detail,
    },
    {
      icon: <HardDrive className="w-6 h-6 text-[#0168A0]" />,
      label: t.system_requirements?.disk_label,
      value: t.system_requirements?.disk_value,
      detail: t.system_requirements?.disk_detail,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              {t.system_requirements?.title}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t.system_requirements?.description}
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
                <h4 className="font-bold text-gray-900">{t.system_requirements?.pro_tip_title}</h4>
                <p className="text-sm text-gray-600">
                  {t.system_requirements?.pro_tip_desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
