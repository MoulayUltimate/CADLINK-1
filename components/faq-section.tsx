"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { useTranslation } from "@/contexts/translation-context"

export function FAQSection() {
  const t = useTranslation()
  const faqs = t.faq?.questions || []

  const midPoint = Math.ceil(faqs.length / 2)
  const leftFaqs = faqs.slice(0, midPoint)
  const rightFaqs = faqs.slice(midPoint)

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#0168A0]/5 border border-[#0168A0]/10 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-[#0168A0]" />
              <span className="text-xs font-bold text-[#0168A0] uppercase tracking-widest">{t.faq?.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              {t.faq?.title_prefix} <span className="text-[#0168A0]">{t.faq?.title_highlight}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium">{t.faq?.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Accordion type="single" collapsible className="space-y-4">
              {leftFaqs.map((faq: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`faq-left-${index}`}
                  className="bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 transition-all duration-200 hover:border-[#0168A0]/30 hover:shadow-sm data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-[#0168A0]/20"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:no-underline py-6 text-lg [&[data-state=open]]:text-[#0168A0]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="space-y-4">
              {rightFaqs.map((faq: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`faq-right-${index}`}
                  className="bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 transition-all duration-200 hover:border-[#0168A0]/30 hover:shadow-sm data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-[#0168A0]/20"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:no-underline py-6 text-lg [&[data-state=open]]:text-[#0168A0]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
