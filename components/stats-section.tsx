export function StatsSection() {
  const stats = [
    {
      value: "50K+",
      label: "Active Users",
      sublabel: "Worldwide",
    },
    {
      value: "99.9%",
      label: "Uptime",
      sublabel: "Guaranteed",
    },
    {
      value: "3x",
      label: "Faster",
      sublabel: "Workflow",
    },
    {
      value: "24/7",
      label: "Support",
      sublabel: "Available",
    },
  ]

  return (
    <section className="border-y border-border bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
