import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function RefundReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Refund and Returns Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-2">
              <strong>Effective Date:</strong> November 5, 2025
            </p>
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

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Overview</h3>
            <p className="text-muted-foreground mb-6">
              At <strong>Cadlink.us</strong>, we take pride in delivering high-quality digital software and ensuring
              customer satisfaction. Because our products are digital downloads, refunds and returns are subject to
              specific conditions outlined below.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Eligibility for Refunds</h3>
            <p className="text-muted-foreground mb-4">We offer refunds only under the following conditions:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>
                The software license has <strong>not been activated or used</strong>.
              </li>
              <li>
                The product file or download link was <strong>missing, corrupted, or inaccessible</strong>.
              </li>
              <li>
                You received the <strong>wrong software version or license key</strong> due to a technical error.
              </li>
              <li>
                The product cannot be downloaded due to an <strong>issue on our side</strong> (server or delivery
                error).
              </li>
            </ul>
            <p className="text-muted-foreground mb-6">
              If one or more of the above apply, please contact us <strong>within 7 days of your purchase</strong>.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Non-Refundable Cases</h3>
            <p className="text-muted-foreground mb-4">We cannot issue refunds in the following cases:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>
                The software has been <strong>activated, registered, or used</strong>.
              </li>
              <li>You no longer need or want the software after download.</li>
              <li>
                Your system does not meet the <strong>minimum technical requirements</strong>.
              </li>
              <li>
                You purchased by mistake but already received the <strong>license key or download link</strong>.
              </li>
            </ul>
            <p className="text-muted-foreground mb-6">
              <strong>Important:</strong> Once a license key is activated, it is permanently linked to your device and
              cannot be resold or reused — therefore, no refunds can be processed after activation.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. How to Request a Refund</h3>
            <p className="text-muted-foreground mb-4">
              To request a refund, please contact our support team at: <strong>contact@cadlink.us</strong>
            </p>
            <p className="text-muted-foreground mb-2">Include the following details in your email:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Order number</li>
              <li>Purchase email address</li>
              <li>Reason for refund request</li>
              <li>Screenshots or evidence (if applicable)</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              Our team will review your request <strong>within 24–48 hours</strong> and contact you regarding the next
              steps.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Replacement Policy</h3>
            <p className="text-muted-foreground mb-6">
              If you received the wrong file, version, or an invalid license key, we will issue a{" "}
              <strong>replacement at no extra cost</strong>. In cases where a replacement cannot be provided, a{" "}
              <strong>full refund</strong> will be issued.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">6. Processing Time</h3>
            <p className="text-muted-foreground mb-6">
              Approved refunds are processed <strong>within 3–5 business days</strong> after confirmation. Depending on
              your payment method, funds may take additional time to appear in your account.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">7. Contact Us</h3>
            <p className="text-muted-foreground mb-2">For any refund or return inquiries, please contact:</p>
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
