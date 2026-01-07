import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy for Cadlink.us</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Effective Date:</strong> November 5, 2025
            </p>

            <p className="text-muted-foreground mb-6">
              Welcome to <strong>Cadlink.us</strong>. Your privacy is very important to us. This Privacy Policy explains
              how we collect, use, and protect your personal information when you visit our website or make a purchase
              from us.
            </p>

            <p className="text-muted-foreground mb-8">
              By using our website, you agree to the terms of this Privacy Policy.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h3>
            <p className="text-muted-foreground mb-4">
              We may collect the following information from you when you visit or purchase from our website:
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Personal Information:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Name, email address, billing address, and payment details.</li>
            </ul>
            <p className="text-muted-foreground mb-2">
              <strong>Technical Information:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>IP address, browser type, operating system, and website usage data.</li>
            </ul>
            <p className="text-muted-foreground mb-2">
              <strong>Order Information:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Details about products purchased, download links, and order history.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              We collect this information to process your orders, provide support, and improve our services.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h3>
            <p className="text-muted-foreground mb-4">Your information is used for purposes including:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Processing and delivering your orders.</li>
              <li>Sending confirmation emails and product download links.</li>
              <li>Providing customer support.</li>
              <li>Improving our website and user experience.</li>
              <li>Complying with legal obligations.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              We <strong>do not sell or rent your personal data</strong> to third parties.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Data Protection and Security</h3>
            <p className="text-muted-foreground mb-6">
              We use secure payment gateways and SSL encryption to protect your information. All personal and payment
              data is handled with strict confidentiality and safeguarded against unauthorized access, alteration, or
              disclosure.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Cookies</h3>
            <p className="text-muted-foreground mb-6">
              Our website uses cookies to enhance your browsing experience, analyze traffic, and remember your
              preferences. You can disable cookies in your browser settings, but some website features may not function
              properly without them.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Third-Party Services</h3>
            <p className="text-muted-foreground mb-6">
              We may use trusted third-party services such as payment processors or analytics providers. These services
              receive only the minimum necessary information to perform their functions and are required to protect your
              data.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">6. Your Rights</h3>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Access or request a copy of your personal data.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent for data processing at any time.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              To exercise these rights, please contact us at <strong>contact@cadlink.us</strong>.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">7. Data Retention</h3>
            <p className="text-muted-foreground mb-6">
              We retain your information only as long as necessary to provide our services and comply with legal
              obligations.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">8. Changes to This Policy</h3>
            <p className="text-muted-foreground mb-6">
              We may update this Privacy Policy periodically. All changes will be posted on this page with an updated
              effective date.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">9. Contact Us</h3>
            <p className="text-muted-foreground mb-2">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Cadlink.us</strong>
            </p>
            <p className="text-muted-foreground mb-2">Email: contact@cadlink.us</p>
            <p className="text-muted-foreground">Address: 1702 Gordon Street, Colton, CA 92324, United States</p>
          </div>

          <div className="mt-12">
            <Link href="/" className="text-[#0168A0] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
