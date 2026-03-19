const WOLFF_RUN_ID = 'a8c3cee6-12cc-419b-abdb-922a58a9bfbb'

export function VotingCta() {
  return (
    <section
      className="px-6 py-16 md:px-16"
      style={{ backgroundColor: '#00095B' }}
    >
      <div className="mx-auto max-w-screen-xl">
        <div
          className="rounded-2xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center gap-8"
          style={{ backgroundColor: '#0D1166' }}
        >
          {/* Left */}
          <div className="flex-1">
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-3"
              style={{ color: '#E2EC2B' }}
            >
              Ihre Analyse ist fertig
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Bewerten Sie Ihre<br />Einsparpotenziale
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Wir haben 4 Befunde und 10 konkrete Maßnahmen für Ihren Standort identifiziert.
              Teilen Sie uns mit, wie realistisch und umsetzbar diese Empfehlungen aus Ihrer Sicht sind —
              damit wir die Analyse gemeinsam verfeinern können.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>⚡ 4 Energie-Befunde</span>
              <span>·</span>
              <span>🔧 10 Maßnahmen</span>
              <span>·</span>
              <span>⏱ ca. 10–15 Min.</span>
            </div>
          </div>

          {/* Right: CTA button */}
          <div className="shrink-0 text-center">
            <a
              href={`/bewertung/${WOLFF_RUN_ID}`}
              className="inline-block rounded-xl px-8 py-4 text-base font-bold transition-all hover:brightness-110"
              style={{ backgroundColor: '#E2EC2B', color: '#00095B' }}
            >
              Jetzt bewerten →
            </a>
            <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Kein Login erforderlich
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
