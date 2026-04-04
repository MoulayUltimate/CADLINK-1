"use client"

import { CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"

export function AboutSection() {
  const t = useTranslation()
  const points = t.about?.points || []

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t.about?.title_prefix} <br />
                <span className="text-[#0168A0]">{t.about?.title_highlight}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t.about?.description}
              </p>
              <div className="space-y-4">
                {points.map((point: string, index: number) => (
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
                  <h4 className="font-bold text-gray-900 mb-2">{t.about?.card_1_title}</h4>
                  <p className="text-sm text-gray-500">{t.about?.card_1_desc}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">{t.about?.card_2_title}</h4>
                  <p className="text-sm text-gray-500">{t.about?.card_2_desc}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">{t.about?.card_3_title}</h4>
                  <p className="text-sm text-gray-500">{t.about?.card_3_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
