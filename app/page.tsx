import { HeroSection } from "@/components/report/hero-section"
import { ExecutiveSummary } from "@/components/report/executive-summary"
import { DataVisualization } from "@/components/report/data-visualization"
import { CockpitShowcase } from "@/components/report/cockpit-showcase"
import { VotingCta } from "@/components/report/voting-cta"
import { CtaBanner } from "@/components/report/cta-banner"
import { Footer } from "@/components/report/footer"

const WOLFF_RUN_ID = 'a8c3cee6-12cc-419b-abdb-922a58a9bfbb'

export default function Page() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#00095B", borderBottom: "1px solid rgba(26,47,238,0.1)" }}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3 md:px-16">
          <div className="flex items-center gap-4">
            <img
              src="/images/ecoplanet-logo-white.png"
              alt="ecoplanet"
              className="h-5 w-auto"
            />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{"\u00D7"}</span>
            <img
              src="/images/n-ergie-logo.png"
              alt="N-ERGIE"
              className="h-5 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs" style={{ color: "#AEAEAE" }}>
              {`Exklusivangebot M\u00E4rz 2026`}
            </div>
            <a
              href={`/bewertung/${WOLFF_RUN_ID}`}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all hover:brightness-110"
              style={{ backgroundColor: "#E2EC2B", color: "#00095B" }}
            >
              Zur Bewertung →
            </a>
          </div>
        </div>
      </nav>

      <HeroSection />

      <div id="summary">
        <ExecutiveSummary />
      </div>

      <div id="analysis">
        <DataVisualization />
      </div>

      <CockpitShowcase />
      <VotingCta />
      <CtaBanner />
      <Footer />
    </main>
  )
}
