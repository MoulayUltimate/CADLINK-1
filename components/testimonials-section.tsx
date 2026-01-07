import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Digital Factory 11 has transformed our production workflow. The automation features alone have saved us 15 hours per week, and the color accuracy is unmatched.",
      author: "Sarah Mitchell",
      role: "Production Manager",
      company: "PrintPro Solutions",
    },
    {
      quote:
        "The new light UI is a game-changer. Our operators report less eye fatigue, and the intuitive design means new staff are productive within days, not weeks.",
      author: "Michael Chen",
      role: "Operations Director",
      company: "SignMasters Inc.",
    },
    {
      quote:
        "We've been using Cadlink for over a decade. Version 11 is their best yet—faster, smarter, and more reliable. It's the backbone of our multi-site operation.",
      author: "Jennifer Rodriguez",
      role: "VP of Manufacturing",
      company: "Graphics International",
    },
  ]

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Trusted by Industry Leaders
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            See what production professionals are saying about Digital Factory 11.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card shadow-sm">
              <CardContent className="p-8">
                <Quote className="mb-4 h-8 w-8 text-primary/30" />
                <p className="mb-6 text-base leading-relaxed text-foreground">{testimonial.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
          <div className="text-2xl font-bold text-foreground">3M</div>
          <div className="text-2xl font-bold text-foreground">Roland</div>
          <div className="text-2xl font-bold text-foreground">Mimaki</div>
          <div className="text-2xl font-bold text-foreground">HP</div>
          <div className="text-2xl font-bold text-foreground">Epson</div>
          <div className="text-2xl font-bold text-foreground">Canon</div>
        </div>
      </div>
    </section>
  )
}
