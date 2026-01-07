import { Card, CardContent } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

export function TrustpilotReviewsSection() {
  const reviews = [
    {
      initial: "S",
      name: "Sarah M.",
      time: "2 days ago",
      title: "Outstanding color accuracy and speed!",
      review:
        "I'm using the trial version while waiting on my purchase to arrive. The color accuracy is something I haven't seen before—greens, purples, pinks, all coming out almost perfect. The best part: It actually prints twice as fast!",
      badge: "Verified Purchase",
    },
    {
      initial: "J",
      name: "James R.",
      time: "1 day ago",
      title: 'Great colour accuracy and "pop"',
      review:
        'I upgraded from v10 to v11 and it\'s pretty much the same, for what I do anyway. My humble opinion is… You could have snuck into my house, upgraded 10 to 11 for me and I would not have noticed. Key praise: colour accuracy, print-speed, "pop" of colours.',
      badge: "Verified Purchase",
    },
    {
      initial: "M",
      name: "Maria L.",
      time: "8 days ago",
      title: "Worth every penny at work",
      review:
        "We have CADlink Digital Factory v11 at work—small improvements over v10, but still worth every penny. While the jump from v10 →v11 may be modest, the overall quality makes it essential for our DTF production.",
      badge: "Designer",
    },
  ]

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#00b67a] text-[#00b67a]" />
                  ))}
                </div>
                <span className="text-sm font-black text-gray-900">Trustpilot</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                What our customers <br />
                <span className="text-[#0168A0]">are saying about us</span>
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 leading-none">4.9</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Average</p>
              </div>
              <div className="h-10 w-px bg-gray-100" />
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Excellent Service</p>
                <p className="text-xs text-gray-400">Based on 4,317 reviews</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0168A0]/5 flex items-center justify-center">
                      <span className="text-xl font-black text-[#0168A0]">{review.initial}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-none mb-1">{review.name}</p>
                      <p className="text-xs font-medium text-gray-400">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex mb-4 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 leading-snug">{review.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{review.review}</p>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#00b67a] uppercase tracking-wider">
                    <div className="bg-[#00b67a]/10 p-1 rounded-full">
                      <Check className="h-3 w-3" strokeWidth={4} />
                    </div>
                    {review.badge}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
