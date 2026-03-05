"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BrainCircuit,
  Wrench,
  TrendingUp,
  Factory,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

interface SectionData {
  label: string
  icon: React.ElementType
  accentColor: string
  content: React.ReactNode
}

interface ExampleData {
  id: number
  tab: string
  tabIcon: React.ElementType
  siteTitle: string
  siteSubtitle: string
  plotUrl: string
  plotAlt: string
  sections: SectionData[]
}

const examples: ExampleData[] = [
  {
    id: 1,
    tab: "Lebensmittelproduktion",
    tabIcon: UtensilsCrossed,
    siteTitle: "Lebensmittelproduktion \u2013 12 GWh",
    siteSubtitle: "Messung: Hauptlastgang",
    plotUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plot_1-rVg31ePLv8hJE6rO1SUk3X9cAQ7a1N.png",
    plotAlt:
      "Winter weekday profiles Mon/Tue vs Wed/Thu with full-year trend",
    sections: [
      {
        label: "Insight aus statistischer Analyse",
        icon: Search,
        accentColor: "#2563EB",
        content: (
          <>
            <p>
              Systematisch erh{"\u00F6"}hter Energieverbrauch an Montagen und
              Dienstagen gegen{"\u00FC"}ber Mittwoch/Donnerstag im
              Winter-Wochentags-Profil. Das tagesintegrierte Delta betr
              {"\u00E4"}gt{" "}
              <strong>+1,5&nbsp;MWh/Tag</strong> (12:00{"\u2013"}17:00&nbsp;Uhr
              Fenster).
            </p>
            <p className="mt-2">
              Im Tagesprofil sind zwei {"\u00FC"}berlagerte Effekte erkennbar:
            </p>
            <ol className="mt-1.5 list-inside list-decimal space-y-1">
              <li>
                <strong>Anlaufphase 01{"\u2013"}04h:</strong> Mo./Di.-Medianlast
                liegt um 130{"\u2013"}160&nbsp;kW oberhalb der Mi./Do.-Kurve, erkennbar
                am fr{"\u00FC"}hen Auseinanderlaufen ab ca.&nbsp;01:30h.
              </li>
              <li>
                <strong>Nachmittags-Plateau 12{"\u2013"}15h:</strong> Mo./Di.-Kurve
                verl{"\u00E4"}uft um 250{"\u2013"}350&nbsp;kW h{"\u00F6"}her, Maximum
                bei ca.&nbsp;13h (orange hervorgehoben).
              </li>
            </ol>
            <p className="mt-2">
              Das IQR-Band von Mo./Di. ist deutlich breiter {"\u2013"} ein Hinweis
              auf inkonsistentes Anlaufverhalten. Die Trendgrafik zeigt, dass
              dieses Delta {"\u00FC"}ber den gesamten Betrachtungszeitraum
              (Feb&nbsp;2025{"\u2013"}Feb&nbsp;2026) kontinuierlich w{"\u00E4"}chst.
            </p>
          </>
        ),
      },
      {
        label: "KI-gest\u00FCtzte Analyse",
        icon: BrainCircuit,
        accentColor: "#7C3AED",
        content: (
          <>
            <p>
              <strong>Prozessbedingte Effizienzverschiebung</strong> mit
              doppeltem Wirkmechanismus:
            </p>
            <ol className="mt-1.5 list-inside list-decimal space-y-1">
              <li>
                <strong>Thermische Tr{"\u00E4"}gheit der NH{"\u2083"}-K
                {"\u00E4"}lteanlage:</strong> Nach dem Wochenendbetrieb bei
                angehobenem Saugdruck-Setpoint muss die Anlage die gesamte K
                {"\u00FC"}hlinfrastruktur auf Betriebstemperatur zur{"\u00FC"}ckf
                {"\u00FC"}hren. Dies erh{"\u00F6"}ht das Druckverh{"\u00E4"}ltnis,
                senkt den COP und verl{"\u00E4"}ngert die Hochlastphase bis in den
                Nachmittag.
              </li>
              <li>
                <strong>Progressiver Effizienzverfall:</strong> Das wachsende
                Delta deutet auf Saugventilverschlei{"\u00DF"},
                Verfl{"\u00FC"}ssiger-Fouling oder gestiegenen Rohrstau hin.
              </li>
            </ol>
            <p className="mt-2" style={{ color: "#7C3AED" }}>
              <em>
                Breites IQR-Band = Fingerabdruck einer instabilen
                Wiederanlaufcharakteristik; fehlende Standardisierung des
                Anfahrprotokolls.
              </em>
            </p>
          </>
        ),
      },
      {
        label: "Ma\u00DFnahme",
        icon: Wrench,
        accentColor: "#B8A308",
        content: (
          <>
            <p>
              Anpassung der NH{"\u2083"}-K{"\u00E4"}lteanlage auf{" "}
              <strong>gleitende Saugdruckregelung</strong>: Anhebung der
              Verdampfungstemperatur von {"\u22125"}{"\u00B0"}C auf {"\u22122"}
              {"\u00B0"}C im Zeitfenster 15:00{"\u2013"}21:00h (Wochentage).
              Aktivierung der{" "}
              <strong>Sonntagabend-Vortemperierung</strong> (22:00h, 1{"\u2013"}2
              Verdichterstufen).
            </p>
            <p className="mt-2">
              Ziel: Reduzierung der Mo/Di-Mehrlast und des strukturellen
              Winter-Abend-Overloads (705&nbsp;kW Median {"\u2192"}{" "}
              Baseline&nbsp;405&nbsp;kW). Diagnostische Folgema{"\u00DF"}nahmen
              zur Ursachenkl{"\u00E4"}rung empfohlen.
            </p>
          </>
        ),
      },
      {
        label: "Impact",
        icon: TrendingUp,
        accentColor: "#059669",
        content: (
          <>
            <p>
              <strong>~18.000{"\u2013"}22.000&nbsp;{"\u20AC"}/Jahr</strong> bei
              vollst{"\u00E4"}ndiger Umsetzung:
            </p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5">
              <li>~13.200&nbsp;{"\u20AC"} Gleitende Saugdruckregelung</li>
              <li>~1.200&nbsp;{"\u20AC"} Sonntag-Vortemperierung</li>
              <li>~1.800&nbsp;{"\u20AC"} Koordiniertes Abtau-Timing</li>
              <li>
                ~2.000{"\u2013"}5.000&nbsp;{"\u20AC"} Trend-Stopp (vermiedener
                Effizienzverfall)
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 2,
    tab: "Industrieunternehmen",
    tabIcon: Factory,
    siteTitle: "Industrieunternehmen \u2013 20 GWh",
    siteSubtitle:
      "Messpunkte: Druckluftkompressor (Kaeser DSD 172, ~100 kW) + Hauptlastgang",
    plotUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plot_2-3lYGExXVS53iwV3dlFy3BHsS5JaA5h.png",
    plotAlt:
      "K1 compressor power consumption and weekly state distribution",
    sections: [
      {
        label: "Insight aus statistischer Analyse",
        icon: Search,
        accentColor: "#2563EB",
        content: (
          <>
            <p>
              Statistisch hochsignifikanter Betriebsregimewechsel des
              Kompressors unmittelbar nach Sommerstillstand (2025{"\u2013"}KW36):
            </p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5">
              <li>
                Nachtlast (00{"\u2013"}06&nbsp;Uhr):{" "}
                <strong>55,2&nbsp;kW {"\u2192"} 65,6&nbsp;kW</strong> (+10,3&nbsp;kW,
                +19&nbsp;%)
              </li>
              <li>
                Tageslast (08{"\u2013"}16&nbsp;Uhr):{" "}
                <strong>54,3&nbsp;kW {"\u2192"} 57,1&nbsp;kW</strong> (+2,9&nbsp;kW,
                +5&nbsp;%)
              </li>
            </ul>
            <p className="mt-2">
              Drei unabh{"\u00E4"}ngige Tests best{"\u00E4"}tigen den Befund:
              Pettitt p=0,003 {"\u00B7"} Welch p=0,0004 {"\u00B7"} Cohen{"\u2019"}s
              d=1,01 (gro{"\u00DF"}er Effekt).
            </p>
          </>
        ),
      },
      {
        label: "KI-gest\u00FCtzte Analyse",
        icon: BrainCircuit,
        accentColor: "#7C3AED",
        content: (
          <>
            <p>
              <strong>Nicht-produktionsbedingter Mehrverbrauch</strong> {"\u2013"}{" "}
              Ursache: <strong>Druckluftleckage</strong>.
            </p>
            <p className="mt-2">
              Die Nachtlast stieg um Faktor 3,6 st{"\u00E4"}rker als die
              Tagesleistung. Leckagen werden tags{"\u00FC"}ber durch regul
              {"\u00E4"}re Produktionsabnahme maskiert; nachts zeigt der
              Verdichter-Lastzyklus sie unverf{"\u00E4"}lscht. Best{"\u00E4"}tigt
              durch den Anstieg des LOADED-Anteils von{" "}
              <strong>13,5&nbsp;% auf 23,5&nbsp;%</strong> (+10&nbsp;Prozentpunkte){" "}
              {"\u2013"} sichtbar im unteren Diagramm ab KW36.
            </p>
          </>
        ),
      },
      {
        label: "Ma\u00DFnahme",
        icon: Wrench,
        accentColor: "#B8A308",
        content: (
          <>
            <p>
              Gezielte <strong>Leckortung (Ultraschall)</strong> in allen
              Netzbereichen mit Stillstandsarbeiten bzw. in Bereichen, an denen
              zum Regimewechsel (KW36) Arbeiten durchgef{"\u00FC"}hrt wurden.
            </p>
            <p className="mt-2">
              Priorit{"\u00E4"}t: Schnellkupplungen an Pr{"\u00FC"}fst
              {"\u00E4"}nden, Schlauchverbindungen, FRL-Einheiten.
            </p>
            <p className="mt-2">
              Parallel: Pr{"\u00FC"}fung des Drucksollwerts im
              Kompressor-Controller auf {"\u00DC"}bereinstimmung mit der
              Pre-Shutdown-Einstellung.
            </p>
          </>
        ),
      },
      {
        label: "Impact",
        icon: TrendingUp,
        accentColor: "#059669",
        content: (
          <>
            <p>
              <strong>
                ~8.000{"\u2013"}10.000&nbsp;{"\u20AC"}/Jahr
              </strong>{" "}
              (tarif- und leckratenabh{"\u00E4"}ngig).
            </p>
          </>
        ),
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Card component -- clean white card with subtle left accent         */
/* ------------------------------------------------------------------ */

function SectionCard({
  section,
  delay,
}: {
  section: SectionData
  delay: number
}) {
  const Icon = section.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex overflow-hidden rounded-lg"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E5E5",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="w-1 shrink-0"
        style={{ backgroundColor: section.accentColor }}
      />

      <div className="flex-1 px-5 py-4">
        {/* Label */}
        <div className="mb-2.5 flex items-center gap-2">
          <Icon
            className="size-4 shrink-0"
            style={{ color: section.accentColor }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: section.accentColor }}
          >
            {section.label}
          </span>
        </div>

        {/* Content -- full text, readable size */}
        <div
          className="text-[15px] leading-relaxed"
          style={{ color: "#1a1a1a" }}
        >
          {section.content}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Example layout: plot LEFT, insight RIGHT, 3 cards below            */
/* ------------------------------------------------------------------ */

function ExampleContent({ data }: { data: ExampleData }) {
  const [insight, ...rest] = data.sections

  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      {/* Sub-header */}
      <div className="mb-5">
        <h3
          className="text-xl font-bold"
          style={{ color: "#00095B" }}
        >
          {data.siteTitle}
        </h3>
        <p className="mt-0.5 text-sm" style={{ color: "#737373" }}>
          {data.siteSubtitle}
        </p>
      </div>

      {/* Row 1: Plot (left) + Insight (right) */}
      <div className="mb-5 grid items-start gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Plot */}
        <div
          className="overflow-hidden rounded-lg"
          style={{
            border: "1px solid #E5E5E5",
            backgroundColor: "#FFFFFF",
          }}
        >
          <img
            src={data.plotUrl}
            alt={data.plotAlt}
            className="block w-full"
          />
          <p
            className="px-3 py-2 text-xs italic leading-snug"
            style={{ color: "#999999", backgroundColor: "#FAFAFA", borderTop: "1px solid #E5E5E5" }}
          >
            Interne Analysegrafik {"\u2013"} die Kundenvisualisierung im ecoplanet Cockpit unterscheidet sich in Darstellung und Interaktivit{"\u00E4"}t.
          </p>
        </div>

        {/* Insight card */}
        <SectionCard section={insight} delay={0.05} />
      </div>

      {/* Row 2: remaining 3 cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {rest.map((section, i) => (
          <SectionCard key={section.label} section={section} delay={0.1 + i * 0.05} />
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function DataVisualization() {
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#example-2") setActiveTab(1)
      else if (window.location.hash === "#example-1") setActiveTab(0)
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: "#F5F5F7" }}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-16">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2
            className="mt-3 text-3xl font-bold"
            style={{ color: "#00095B" }}
          >
            Analyse{" "}
            <span style={{ color: "#1A2FEE" }}>Ergebnisse</span>
          </h2>
          <p className="mt-2 max-w-2xl text-[15px]" style={{ color: "#737373" }}>
            Detaillierte Analyse der identifizierten Anomalien mit
            kontextuellen Erkenntnissen, KI-Klassifikation und abgeleiteten
            Ma{"\u00DF"}nahmen.
          </p>
        </motion.div>

        {/* Tab toggle */}
        <div className="mb-8 flex gap-3">
          {examples.map((ex, i) => {
            const active = activeTab === i
            const TabIcon = ex.tabIcon
            return (
              <button
                key={ex.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: active ? "#00095B" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#00095B",
                  borderColor: active ? "#00095B" : "#D4D4D4",
                }}
              >
                <TabIcon className="size-4" />
                {ex.tab}
                {active && <ChevronRight className="ml-1 size-3.5" />}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div id={`example-${examples[activeTab].id}`}>
          <AnimatePresence mode="wait">
            <ExampleContent data={examples[activeTab]} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
