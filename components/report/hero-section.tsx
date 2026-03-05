"use client"

import { motion } from "framer-motion"
import { Factory, UtensilsCrossed } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#00095B" }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,47,238,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-screen-xl px-6 pb-16 pt-20 md:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Title and description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl"
          >
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ color: "#FFFFFF" }}>
              Wir identifizieren{" "}
              <span style={{ color: "#E2EC2B" }}>verborgene Potenziale</span>
              , die klassische Energie-Audits {"\u00FC"}bersehen.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed" style={{ color: "#AEAEAE" }}>
              Automatisierte Identifikation, Quantifizierung und
              Priorisierung konkreter Energieeinsparma{"\u00DF"}nahmen {"\u2013"}{" "}
              anhand zweier anonymisierter Kundenbeispiele aus
              unterschiedlichen Branchen.
            </p>
          </motion.div>

          {/* Created by card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="shrink-0 rounded-lg border p-6"
            style={{ backgroundColor: "#0D1166", borderColor: "rgba(26,47,238,0.2)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#AEAEAE" }}>
              Erstellt von
            </p>
            <p className="mt-1 text-xl font-bold" style={{ color: "#FFFFFF" }}>ecoplanet</p>
            <div className="my-3 h-px" style={{ backgroundColor: "rgba(26,47,238,0.2)" }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#AEAEAE" }}>
              Beispiele
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              2 Kundenstandorte
            </p>
          </motion.div>
        </div>

        {/* Two example cards instead of combined metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <a
            href="#example-1"
            className="group block rounded-xl border p-6 transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "#0D1166", borderColor: "rgba(26,47,238,0.25)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex size-12 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(226,236,43,0.12)" }}>
                <UtensilsCrossed className="size-5" style={{ color: "#E2EC2B" }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: "#FFFFFF" }}>Beispiel 1</p>
                <p className="text-sm" style={{ color: "#AEAEAE" }}>Lebensmittelproduktion</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#AEAEAE" }}>Jahresverbrauch</p>
                <p className="mt-1 text-2xl font-bold font-mono" style={{ color: "#FFFFFF" }}>12 GWh</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#AEAEAE" }}>Messung</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: "#FFFFFF" }}>Hauptlastgang</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: "#E2EC2B" }}>
              Zur Analyse
              <span className="transition-transform group-hover:translate-x-1">{"\u2192"}</span>
            </div>
          </a>

          <a
            href="#example-2"
            className="group block rounded-xl border p-6 transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "#0D1166", borderColor: "rgba(26,47,238,0.25)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex size-12 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(226,236,43,0.12)" }}>
                <Factory className="size-5" style={{ color: "#E2EC2B" }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: "#FFFFFF" }}>Beispiel 2</p>
                <p className="text-sm" style={{ color: "#AEAEAE" }}>Industrieunternehmen</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#AEAEAE" }}>Jahresverbrauch</p>
                <p className="mt-1 text-2xl font-bold font-mono" style={{ color: "#FFFFFF" }}>20 GWh</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#AEAEAE" }}>Messung</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: "#FFFFFF" }}>Kompressor + Hauptlastgang</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: "#E2EC2B" }}>
              Zur Analyse
              <span className="transition-transform group-hover:translate-x-1">{"\u2192"}</span>
            </div>
          </a>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="relative h-16">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 32C240 64 480 64 720 32C960 0 1200 0 1440 32V64H0V32Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  )
}
