"use client"

import { motion } from "framer-motion"

export function ExecutiveSummary() {
  const videoEmbedUrl =
    "https://drive.google.com/file/d/1hNQxZ-EuXbD-3c4NkC5MIPcRQ-_62Zd8/preview"

  return (
    <section className="py-12 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-4">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#E2EC2B", color: "#00095B" }}
            >
              Executive Summary
            </span>
          </div>
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: "#00095B" }}
          >
            Video{" "}
            <span style={{ color: "#1A2FEE" }}>Zusammenfassung</span>
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#737373" }}>
            ecoplanet Gr{"\u00FC"}nder Maximilian Dekorsy erkl{"\u00E4"}rt, wie wir verborgene Potenziale identifizieren, die klassische Energie-Audits {"\u00FC"}bersehen.
          </p>

          <div
            className="mt-8 overflow-hidden rounded-lg border shadow-md"
            style={{ borderColor: "#E5E5E5" }}
          >
            <div className="relative aspect-video w-full">
              <iframe
                src={videoEmbedUrl}
                className="absolute inset-0 size-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Executive Summary Video"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
