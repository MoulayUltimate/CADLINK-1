import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowRight, CheckCircle } from "lucide-react"

export function ProblemSolutionSection() {
  const comparisons = [
    {
      problem: "Production Bottlenecks",
      solution: "Automated Workflows",
      problemDetail: "Manual handoffs slow down production and create errors",
      solutionDetail: "Smart automation connects every step seamlessly",
    },
    {
      problem: "Output Inconsistency",
      solution: "Improved Color Engine",
      problemDetail: "Color variations waste materials and time",
      solutionDetail: "G7-certified color management ensures perfect accuracy",
    },
    {
      problem: "Manual Repetitive Steps",
      solution: "Smart Automation",
      problemDetail: "Operators waste hours on repetitive tasks",
      solutionDetail: "AI learns your patterns and automates the routine",
    },
  ]

  return (
    <section id="solutions" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Transform Production Challenges into Solutions
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            See how Digital Factory 11 solves the most common production workflow problems.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12">
          {comparisons.map((item, index) => (
            <div key={index} className="grid gap-6 md:grid-cols-2 items-center">
              <Card className="border-2 border-destructive/20 bg-destructive/5 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{item.problem}</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.problemDetail}</p>
                </CardContent>
              </Card>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>

              <Card className="border-2 border-primary/30 bg-primary/5 shadow-sm md:order-last">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{item.solution}</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.solutionDetail}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
