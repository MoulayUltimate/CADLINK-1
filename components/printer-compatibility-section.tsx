export function PrinterCompatibilitySection() {
  const printers = [
    "Epson SureColor 8550 (Epson 8550)",
    "Epson SureColor F2100 Series",
    "Roland DG Series (models compatible via driver)",
    "Mimaki UJF Series",
    "Ricoh Ri 1000 / Ri 2000",
    "Brother GTX / GTX Pro",
    "DTG M2 / M6 Industrial Series",
    "Any printer supported via Cadlink driver set",
  ]

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Printers Compatible with <span className="text-primary">Cadlink v11</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Below is a list of printers confirmed to work with Cadlink v11. Update this list based on your supported
            devices.
          </p>
          <ul className="grid md:grid-cols-2 gap-3">
            {printers.map((printer, index) => (
              <li key={index} className="flex items-center gap-3 text-foreground">
                <span className="text-primary text-lg">•</span>
                {printer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
