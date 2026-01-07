import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function FAQSection() {
  const faqs = [
    {
      question: "How do I Download my purchased software?",
      answer:
        "After completing your purchase, a download link will appear on your order confirmation page. Click on this link to download the software instantly.",
    },
    {
      question: "What types of software do you offer?",
      answer:
        "We offer a wide range of software, including productivity tools, design software, security programs, and more. Visit our store to explore the available products.",
    },
    {
      question: "Will I receive installation instructions?",
      answer:
        "Yes! Along with the download link, you will also find a step-by-step video tutorial that guides you through the installation and activation process.",
    },
    {
      question: "Are there dongles or activation keys?",
      answer: "No dongles, no complicated activations! Just install the software and start creating.",
    },
    {
      question: "Can I upgrade my software after purchasing?",
      answer:
        "The ability to upgrade depends on the specific software provider. Some software may require a new purchase for an upgrade, while others allow free updates. Check the product details for more information.",
    },
    {
      question: "What if I don't like the software?",
      answer: "No worries — there's a 90-day refund policy if you're not satisfied with your purchase.",
    },
    {
      question: "How do I buy the software?",
      answer:
        "It's easy! Just add it to your cart, fill in your details, and you'll get your activation code right after completing your purchase.",
    },
    {
      question: "Can I reinstall the software in the future?",
      answer:
        "Yes, you can reinstall the software, but we suggest keeping a backup of the installation file. If you need to reinstall, use the same file and follow the video tutorial steps.",
    },
    {
      question: "What if I don't see the download link after purchasing?",
      answer:
        "If the download link does not appear immediately, please check your email for the order confirmation. If the link is still missing, contact us via email for assistance.",
    },
    {
      question: "I'm facing issues with downloading or installing the software. What should I do?",
      answer:
        "If you experience any difficulties, first refer to the video tutorial for guidance. If the issue persists, send us an email with details of the problem, and our support team will assist you as soon as possible.",
    },
    {
      question: "What should I do if I don't receive an order confirmation email?",
      answer:
        "Check your spam or junk folder in case the email was filtered there. If you still haven't received it, contact us via email with your order details.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "If you need any assistance, feel free to send us an email at contact@Cadlink.us. Our team is ready to help!",
    },
    {
      question: "How long is the download link available?",
      answer:
        "The download link will be available immediately after purchase, but we recommend downloading the software as soon as possible to avoid any inconvenience.",
    },
  ]

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
              <span className="text-xs font-bold text-[#0168A0] uppercase tracking-widest">Support Center</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              FAQ for <span className="text-[#0168A0]">CADlink</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium">Digital Factory 11</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Accordion type="single" collapsible className="space-y-4">
              {leftFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-left-${index}`}
                  className="bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 transition-all duration-200 hover:border-[#0168A0]/30 hover:shadow-sm data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-[#0168A0]/20"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:no-underline py-6 text-lg [&[data-state=open]]:text-[#0168A0]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="space-y-4">
              {rightFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-right-${index}`}
                  className="bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 transition-all duration-200 hover:border-[#0168A0]/30 hover:shadow-sm data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-[#0168A0]/20"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:no-underline py-6 text-lg [&[data-state=open]]:text-[#0168A0]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {faq.answer}
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
