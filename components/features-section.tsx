import { Workflow, Zap, Palette, Monitor, Settings, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Workflow,
      title: "Unified Workflow Automation",
      description:
        "Streamline your entire production pipeline with intelligent automation that connects every step from design to delivery.",
    },
    {
      icon: Zap,
      title: "Faster RIP Performance",
      description:
        "Experience lightning-fast raster image processing with our redesigned engine, cutting processing times by up to 60%.",
    },
    {
      icon: Monitor,
      title: "New Light-Themed UI",
      description:
        "Work comfortably for longer with our bright, modern interface designed for better operator focus and reduced eye strain.",
    },
    {
      icon: Settings,
      title: "Expanded Device Support",
      description:
        "Connect to 700+ printers, cutters, and production devices from all major manufacturers with plug-and-play simplicity.",
    },
    {
      icon: Palette,
      title: "Enhanced Color Management",
      description:
        "Achieve perfect color accuracy with our advanced color engine featuring G7 certification and spot color matching.",
    },
    {
      icon: Shield,
      title: "Smart Automation",
      description:
        "Eliminate repetitive manual tasks with AI-powered automation that learns your workflow patterns and optimizes accordingly.",
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Key Features of Digital Factory 11
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Powerful improvements designed to transform your production workflow and maximize efficiency.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
