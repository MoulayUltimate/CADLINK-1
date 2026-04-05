import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/dictionary"
import { TranslationProvider } from "@/contexts/translation-context"
import { blogs } from "@/lib/blog-data"

// Import components
import { HomePage } from "@/components/pages/home-page"
import { ContactPage } from "@/components/pages/contact-page"
import { PrivacyPolicyPage } from "@/components/pages/privacy-policy-page"
import { RefundReturnsPage } from "@/components/pages/refund-returns-page"
import { ShippingPolicyPage } from "@/components/pages/shipping-policy-page"
import { TermsConditionsPage } from "@/components/pages/terms-conditions-page"
import { BlogPostPage } from "@/components/pages/blog-post-page"
import { CheckoutPage } from "@/components/pages/checkout-page"
import { SuccessPage } from "@/components/pages/success-page"

export const runtime = 'edge'

export default async function UnifiedPage({ params }: { params: Promise<{ lang: string; slug?: string[] }> }) {
    const { lang, slug = [] } = await params
    const dict = await getDictionary(lang)

    // Routing Logics
    if (slug.length === 0) {
        return <TranslationProvider dictionary={dict} lang={lang}><HomePage lang={lang} /></TranslationProvider>
    }

    const first = slug[0]
    const second = slug[1]

    if (first === 'contact') return <TranslationProvider dictionary={dict} lang={lang}><ContactPage lang={lang} /></TranslationProvider>
    if (first === 'privacy-policy') return <TranslationProvider dictionary={dict} lang={lang}><PrivacyPolicyPage lang={lang} /></TranslationProvider>
    if (first === 'refund-returns') return <TranslationProvider dictionary={dict} lang={lang}><RefundReturnsPage lang={lang} /></TranslationProvider>
    if (first === 'shipping-policy') return <TranslationProvider dictionary={dict} lang={lang}><ShippingPolicyPage lang={lang} /></TranslationProvider>
    if (first === 'terms-conditions') return <TranslationProvider dictionary={dict} lang={lang}><TermsConditionsPage lang={lang} /></TranslationProvider>

    if (first === 'checkout') {
        if (second === 'success') return <TranslationProvider dictionary={dict} lang={lang}><SuccessPage /></TranslationProvider>
        return <TranslationProvider dictionary={dict} lang={lang}><CheckoutPage /></TranslationProvider>
    }

    if (first === 'blog' && second) {
        const post = blogs.find(b => b.slug === second)
        if (!post) notFound()
        return <TranslationProvider dictionary={dict} lang={lang}><BlogPostPage lang={lang} post={post} /></TranslationProvider>
    }

    notFound()
}
