import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-background to-background p-12 md:p-20">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Ready to Transform Your Workflow?
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">
              Join thousands of professionals who trust CADLINK for their sign making needs. Start your free 30-day
              trial today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="text-base">
                <Download className="mr-2 h-4 w-4" />
                Download Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Windows & Mac • No installation required • Cancel anytime
            </p>
          </div>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
