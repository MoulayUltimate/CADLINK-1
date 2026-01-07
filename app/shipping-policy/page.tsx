import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Shipping Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-2">
              <strong>Policy Name:</strong> Shipping Policy
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Country:</strong> United States
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Shipping Cost:</strong> Free Shipping
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Estimated Delivery Time:</strong> 0–2 business days
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Overview</h3>
            <p className="text-muted-foreground mb-6">
              We offer <strong>fast and free shipping</strong> for all orders delivered within the{" "}
              <strong>United States</strong>. Orders are handled with priority to ensure the quickest possible delivery.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Processing & Delivery Times</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>Orders are processed immediately after purchase.</li>
              <li>
                Estimated delivery time is <strong>0 to 2 business days</strong>.
              </li>
              <li>
                Delivery times may vary slightly based on the destination and carrier capacity, but we always aim to
                meet the published timeframe.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Shipping Cost</h3>
            <ul className="list-disc pl-6 mb-6 text-muted-foreground">
              <li>
                All orders shipped within the United States qualify for <strong>free shipping</strong>.
              </li>
              <li>No additional delivery charges or hidden fees will be added at checkout.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Order Tracking</h3>
            <p className="text-muted-foreground mb-6">
              Once your order is shipped, you will receive a confirmation email. If tracking is available, the tracking
              link will be included so you can monitor your shipment.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Support</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about your order or encounter any shipping issues, our support team is ready to
              assist you.
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
