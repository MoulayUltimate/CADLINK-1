import { Badge } from "@/components/ui/badge"

export function ProductShowcaseSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Experience the Modern Interface
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Redesigned from the ground up with a light, intuitive UI that keeps operators focused and productive.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
            <img
              src="/modern-light-themed-cad-software-interface-with-aq.jpg"
              alt="Digital Factory 11 Light UI"
              className="h-full w-full object-cover"
            />

            <div className="absolute top-6 left-6">
              <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                Clean, Modern Design
              </Badge>
            </div>

            <div className="absolute top-6 right-6">
              <Badge className="bg-card/90 text-foreground border border-border shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                Reduced Eye Strain
              </Badge>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent/90 text-accent-foreground border-0 shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                Optimized for Productivity
              </Badge>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">60%</div>
              <div className="text-sm font-medium text-muted-foreground">Faster Processing</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">700+</div>
              <div className="text-sm font-medium text-muted-foreground">Device Support</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">40%</div>
              <div className="text-sm font-medium text-muted-foreground">Less Manual Work</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
