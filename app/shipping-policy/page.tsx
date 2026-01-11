import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Digital Delivery Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-2">
              <strong>Policy Name:</strong> Digital Delivery Policy
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Delivery Method:</strong> Email Delivery
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Delivery Cost:</strong> Free
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Estimated Delivery Time:</strong> Instant (0–10 minutes)
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Overview</h3>
            <p className="text-muted-foreground mb-6">
              We offer <strong>instant digital delivery</strong> for all software licenses. Since our products are digital, there is no physical shipping involved. You will receive your license key and download instructions via email immediately after purchase.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Processing & Delivery Times</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>Orders are processed automatically by our system 24/7.</li>
              <li>
                <strong>Instant Delivery:</strong> In most cases, you will receive your email within minutes of purchase.
              </li>
              <li>
                Please allow up to 10 minutes for the email to arrive. If you don't see it, please check your spam or junk folder.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Delivery Cost</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>
                Digital delivery is always <strong>free of charge</strong>.
              </li>
              <li>There are no handling fees or hidden charges.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Order Access</h3>
            <p className="text-muted-foreground mb-6">
              Once your order is confirmed, we will send an email to the address you provided at checkout. This email contains:
            </p>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>Your unique software license key.</li>
              <li>Official download links for the software.</li>
              <li>Installation and activation instructions.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Support</h3>
            <p className="text-muted-foreground mb-6">
              If you haven't received your email within 10 minutes, or if you encounter any issues with your download or activation, our support team is ready to assist you.
            </p>

            <div className="bg-[#f5f5f5] p-6 rounded-lg mt-8">
              <p className="text-muted-foreground mb-2">
                <strong>Contact Us:</strong>
              </p>
              <p className="text-muted-foreground mb-2">Email: contact@cadlink.us</p>
              <p className="text-muted-foreground">Address: 1702 Gordon Street, Colton, CA 92324, United States</p>
            </div>
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
