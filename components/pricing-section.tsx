import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small shops",
      features: [
        "Single workstation license",
        "Core RIP functionality",
        "Basic device support",
        "Email support",
        "Quarterly updates",
      ],
    },
    {
      name: "Professional",
      description: "For growing businesses",
      popular: true,
      features: [
        "Up to 5 workstation licenses",
        "Advanced workflow automation",
        "700+ device support",
        "Priority support",
        "Monthly updates",
        "Color management tools",
      ],
    },
    {
      name: "Enterprise",
      description: "Multi-facility solutions",
      features: [
        "Unlimited workstations",
        "Full automation suite",
        "Multi-site management",
        "24/7 dedicated support",
        "Custom integrations",
        "On-site training",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Flexible Plans for Every Business
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your production needs. All plans include core features and regular updates.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 shadow-sm ${
                plan.popular ? "border-2 border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="pb-8 pt-8">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full font-semibold" variant={plan.popular ? "default" : "outline"} size="lg">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include 30-day money-back guarantee • Volume discounts available
        </p>
      </div>
    </section>
  )
}
