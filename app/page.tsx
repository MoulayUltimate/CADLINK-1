import { Header } from "@/components/header"
import { SaleBanner } from "@/components/sale-banner"
import { HeroSection } from "@/components/hero-section"
import { TrustedPartnersSection } from "@/components/trusted-partners-section"
import { AboutSection } from "@/components/about-section"
import { ProductCardSection } from "@/components/product-card-section"
import { PrinterCompatibilitySection } from "@/components/printer-compatibility-section"
import { TrustpilotReviewsSection } from "@/components/trustpilot-reviews-section"
import { SystemRequirementsSection } from "@/components/system-requirements-section"
import { ProductSummarySection } from "@/components/product-summary-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { FeaturesBar } from "@/components/features-bar"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import { BlogSection } from "@/components/blog-section"
import { VideoSection } from "@/components/video-section"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SaleBanner />
      <Header />
      <main>
        <HeroSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <FeaturesBar />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <TrustedPartnersSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <AboutSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <ProblemSolutionSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <FeaturesSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <VideoSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <WhyChooseSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <CTASection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <ProductCardSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <PrinterCompatibilitySection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <TestimonialsSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <TrustpilotReviewsSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <SystemRequirementsSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <ProductSummarySection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <FAQSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <PricingSection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <FinalCTASection />
        <div className="h-px bg-gray-100 w-full max-w-7xl mx-auto" />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}
