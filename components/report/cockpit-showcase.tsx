"use client"

import { motion } from "framer-motion"
import { Inbox, Lightbulb, ClipboardCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    label: "Insight Inbox",
    icon: Inbox,
    description:
      "Automatisch generierte Energie-Insights werden priorisiert in Ihrer pers\u00F6nlichen Inbox dargestellt.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Insight%20Inbox-5WYkIawlOYBdw8DU52M9VpzH4niZn7.png",
    imageAlt: "ecoplanet Cockpit \u2013 Insight Inbox Ansicht",
  },
  {
    number: "02",
    label: "Ideenspeicher",
    icon: Lightbulb,
    description:
      "Validierte Insights werden zu konkreten Ma\u00DFnahmenvorschl\u00E4gen weiterentwickelt. Im Ideenspeicher sehen Sie Einsparsch\u00E4tzungen, Investitionskosten und Amortisationszeiten auf einen Blick.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ideenspeicher-liitjAkvp0lWnBpWX8seDQIDrhaI5T.png",
    imageAlt: "ecoplanet Cockpit \u2013 Ideenspeicher Ansicht",
  },
  {
    number: "03",
    label: "Empfohlene Ma\u00DFnahme",
    icon: ClipboardCheck,
    description:
      "Jede Ma\u00DFnahme wird mit KI-Begr\u00FCndung, relevanten Datenpunkten und einem interaktiven Fragebogen zur Pr\u00E4zisierung bereitgestellt \u2013 bereit f\u00FCr Ihre Entscheidung.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Empfohlene%20Ma%C3%9Fnahme-7FQ834QCXIx0NaBavwRlcAsNr9uQde.png",
    imageAlt: "ecoplanet Cockpit \u2013 Empfohlene Ma\u00DFnahme Detailansicht",
  },
]

export function CockpitShowcase() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-16">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: "#E2EC2B", color: "#00095B" }}
          >
            ecoplanet Cockpit
          </span>
          <h2
            className="mt-4 text-3xl font-bold md:text-4xl"
            style={{ color: "#00095B" }}
          >
            So sieht es f{"\u00FC"}r{" "}
            <span style={{ color: "#1A2FEE" }}>Sie</span> aus
          </h2>
          <p
            className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed"
            style={{ color: "#737373" }}
          >
            Von der automatischen Erkennung bis zur entscheidungsreifen
            Ma{"\u00DF"}nahme {"\u2013"} drei Schritte in unserem Cockpit.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 1

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex flex-col items-center gap-10 lg:flex-row lg:gap-16 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1">
                  {/* Step number + connector */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#00095B" }}
                    >
                      <Icon className="size-5" style={{ color: "#E2EC2B" }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "#1A2FEE" }}
                    >
                      Schritt {step.number}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "#00095B" }}
                  >
                    {step.label}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-relaxed"
                    style={{ color: "#444444" }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Screenshot side */}
                <div className="flex-1">
                  <div
                    className="overflow-hidden rounded-xl shadow-lg"
                    style={{ border: "1px solid #E5E5E5" }}
                  >
                    <img
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      className="block w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
