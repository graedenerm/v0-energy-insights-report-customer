export function Footer() {
  return (
    <footer style={{ backgroundColor: "#00095B" }}>
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-4 px-6 py-12 text-center md:px-16">
        <a href="https://www.ecoplanet.tech/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold transition-opacity hover:opacity-80" style={{ color: "#FFFFFF" }}>
          ecoplanet
        </a>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: "#AEAEAE" }}>
          Von Transparenz zu Ma{"\u00DF"}nahmen {"\u2013"} Unterst{"\u00FC"}tzung bei Identifikation,
          Quantifizierung und Umsetzung konkreter Energieeinsparungen.
        </p>
        <p className="mt-4 text-xs" style={{ color: "#AEAEAE" }}>
          {`M\u00E4rz 2026`}
        </p>
      </div>
    </footer>
  )
}
