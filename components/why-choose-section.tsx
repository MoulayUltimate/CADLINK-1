import { Card, CardContent } from "@/components/ui/card"
import { Award, Building2, ShieldCheck } from "lucide-react"

export function WhyChooseSection() {
  const reasons = [
    {
      icon: Award,
      title: "Trusted Across Industries",
      description:
        "25+ years serving print, signage, and production facilities worldwide with proven reliability and expertise.",
    },
    {
      icon: Building2,
      title: "Scalable Multi-Facility Solution",
      description:
        "Seamlessly connect and manage multiple production sites with centralized workflow control and reporting.",
    },
    {
      icon: ShieldCheck,
      title: "Reliable + Secure Backbone",
      description:
        "Enterprise-grade security and 99.9% uptime ensure your production never stops, with automatic failover protection.",
    },
  ]

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Why Choose Digital Factory 11
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            The trusted workflow platform for production facilities that demand excellence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Card key={index} className="border-border/50 bg-card shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <reason.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
