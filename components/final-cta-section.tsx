import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"
import { BuyNowButton } from "./buy-now-button"

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_oklch(0.95_0.08_210)_0%,_transparent_70%)]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
            Join thousands of production facilities worldwide using Digital Factory 11. Schedule a personalized demo and
            see how we can optimize your operations.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BuyNowButton
              productId="prod_cadlink_v11"
              size="lg"
              className="text-base font-semibold shadow-lg shadow-primary/20"
            />
            <Button size="lg" variant="outline" className="text-base font-semibold border-2 bg-transparent">
              <Download className="mr-2 h-5 w-5" />
              Download Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            30-day free trial • No credit card required • Expert support included
          </p>
        </div>
      </div>
    </section>
  )
}
