import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-2">
              <strong>Website:</strong>{" "}
              <a href="https://www.cadlink.us" className="text-[#0168A0] hover:underline">
                https://www.cadlink.us
              </a>
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Contact Email:</strong> contact@cadlink.us
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Address:</strong> 1702 Gordon Street, Colton, CA 92324, United States
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Introduction</h3>
            <p className="text-muted-foreground mb-6">
              Welcome to <strong>Cadlink.us</strong>. These Terms and Conditions govern your access to and use of our
              website, products, and services. By using our website or making a purchase, you agree to be bound by these
              terms. Please read them carefully before placing an order.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Digital Products</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Cadlink.us</strong> specializes in the sale of digital software licenses and downloadable products
              related to design and digital printing, including CADlink Digital Factory software.
            </p>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>All products are delivered digitally via email or direct download link after successful payment.</li>
              <li>
                <strong>No physical item</strong> will be shipped.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Account and Purchases</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>
                You must provide <strong>accurate and complete information</strong> when placing an order.
              </li>
              <li>
                You are responsible for maintaining the <strong>confidentiality</strong> of your purchase details and
                download links.
              </li>
              <li>
                Purchases made on our site are for <strong>personal or business use only</strong> and may{" "}
                <strong>not be resold or distributed</strong>.
              </li>
              <li>
                We reserve the right to <strong>refuse or cancel any order</strong> if fraudulent activity or misuse is
                suspected.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Delivery</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>
                After payment confirmation, your digital product and license information will be sent to the email
                address provided during checkout.
              </li>
              <li>
                Delivery typically occurs <strong>instantly or within a few minutes</strong>, but in some cases may take
                up to 24 hours.
              </li>
              <li>
                If you do not receive your product within this time frame, please contact us at{" "}
                <strong>contact@cadlink.us</strong>.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. License Activation</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>
                Each software license is intended for <strong>one user or one device</strong> (unless otherwise stated).
              </li>
              <li>
                Once the license is activated, it becomes <strong>permanently registered</strong> to the device or
                account.
              </li>
              <li>
                Please verify your <strong>system compatibility and software version</strong> before activation, as
                refunds <strong>cannot be processed after activation</strong>.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">6. Refund Policy</h3>
            <p className="text-muted-foreground mb-6">
              Refunds are granted only if the product has <strong>not been activated</strong> or delivered incorrectly.
              For full details, please review our{" "}
              <Link href="/refund-returns" className="text-[#0168A0] hover:underline">
                Return and Refund Policy
              </Link>
              .
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">7. Prohibited Activities</h3>
            <p className="text-muted-foreground mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Share, resell, or distribute software or license keys.</li>
              <li>Reverse-engineer, copy, or modify the software.</li>
              <li>Misrepresent your identity or payment information.</li>
              <li>Use the software for illegal or unauthorized purposes.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              Violation of these terms may result in <strong>license termination</strong> and possible legal action.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">8. Intellectual Property Rights</h3>
            <p className="text-muted-foreground mb-6">
              All content on <strong>Cadlink.us</strong> — including text, graphics, images, logos, and software — is
              the property of Cadlink.us or its respective owners. You may{" "}
              <strong>not reproduce, distribute, or use any content</strong> without prior written consent.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">9. Limitation of Liability</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Cadlink.us</strong> shall not be held responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Any direct, indirect, or incidental damages resulting from product use or inability to use.</li>
              <li>Compatibility issues with your device or system.</li>
              <li>Loss of data, profits, or business interruption.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              All software is provided <strong>"as is"</strong> without any guarantees or warranties beyond those
              provided by the software developer.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">10. Privacy</h3>
            <p className="text-muted-foreground mb-6">
              Your privacy is important to us. Please refer to our{" "}
              <Link href="/privacy-policy" className="text-[#0168A0] hover:underline">
                Privacy Policy
              </Link>{" "}
              to learn how we collect, use, and protect your information.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">11. Changes to These Terms</h3>
            <p className="text-muted-foreground mb-6">
              <strong>Cadlink.us</strong> reserves the right to update or modify these Terms and Conditions at any time
              without prior notice. All updates will be effective immediately upon posting on this page.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">12. Contact Us</h3>
            <p className="text-muted-foreground mb-2">
              If you have any questions about these Terms and Conditions, please contact us:
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
