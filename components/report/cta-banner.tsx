"use client"

import { useState, useRef } from "react"
import { CheckCircle2, Upload, X, FileSpreadsheet, AlertCircle } from "lucide-react"

export function CtaBanner() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [info, setInfo] = useState("")
  const [consent, setConsent] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim()) {
      setError("Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.")
      return
    }
    if (!consent) {
      setError("Bitte best\u00E4tigen Sie die Einwilligung zur Datenfreigabe.")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("info", info)
      formData.append("consent", String(consent))
      files.forEach((file) => formData.append("files", file))

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        let msg = "Fehler beim Senden"
        try {
          const data = await res.json()
          msg = data.error || msg
        } catch {
          const text = await res.text().catch(() => "")
          if (text.toLowerCase().includes("entity too large") || text.toLowerCase().includes("too large")) {
            msg = "Die Datei ist zu gro\u00DF. Bitte laden Sie Dateien unter 50 MB hoch."
          } else {
            msg = `Serverfehler (${res.status}). Bitte versuchen Sie es erneut.`
          }
        }
        throw new Error(msg)
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section style={{ backgroundColor: "#00095B" }}>
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-16 text-center md:px-12"
            style={{ backgroundColor: "#0D1166", border: "1px solid rgba(226,236,43,0.15)" }}
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.15)" }}>
              <CheckCircle2 className="size-8" style={{ color: "#22c55e" }} />
            </div>
            <h2 className="mt-6 text-2xl font-bold" style={{ color: "#FFFFFF" }}>
              Vielen Dank f{"\u00FC"}r Ihre Anmeldung!
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed" style={{ color: "#AEAEAE" }}>
              Wir haben Ihre Daten erhalten und melden uns in K{"\u00FC"}rze bei Ihnen.
              Ihr Ansprechpartner bei N-ERGIE wird den n{"\u00E4"}chsten Schritt mit Ihnen abstimmen.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={{ backgroundColor: "#00095B" }}>
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-12 md:px-12 md:py-14"
          style={{ backgroundColor: "#0D1166", border: "1px solid rgba(226,236,43,0.15)" }}
        >
          {/* Logos */}
          <div className="mb-6 flex items-center gap-4">
            <img
              src="/images/ecoplanet-logo-white.png"
              alt="ecoplanet"
              className="h-6 w-auto"
            />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{"\u00D7"}</span>
            <img
              src="/images/n-ergie-logo.png"
              alt="N-ERGIE"
              className="h-6 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Header */}
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "#E2EC2B" }}
          >
            Jetzt teilnehmen
          </p>
          <h2
            className="mt-4 text-2xl font-bold leading-snug md:text-3xl"
            style={{ color: "#FFFFFF" }}
          >
            Sichern Sie sich Ihre kostenfreie Analyse
          </h2>
          <p
            className="mt-3 text-[15px] leading-relaxed"
            style={{ color: "#AEAEAE" }}
          >
            N-ERGIE bietet ausgew{"\u00E4"}hlten Kunden diesen exklusiven Service kostenfrei an {"\u2013"} gemeinsam mit ecoplanet identifizieren wir verborgene Einsparpotenziale in Ihrem Unternehmen.
          </p>
          <p
            className="mt-2 text-sm leading-relaxed italic"
            style={{ color: "#888888" }}
          >
            Hinweis: Die Analyse bezieht sich idealerweise auf einen einzelnen Standort. Ein sinnvolles Ergebnis ist nur bei guter Informationslage m{"\u00F6"}glich {"\u2013"} je mehr Daten Sie bereitstellen, desto pr{"\u00E4"}ziser die Auswertung.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10">

            {/* Name + Email row */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium" style={{ color: "#FFFFFF" }}>
                  Name <span style={{ color: "#E2EC2B" }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: "#FFFFFF" }}>
                  E-Mail-Adresse <span style={{ color: "#E2EC2B" }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max.mustermann@firma.de"
                  className="mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                  }}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium" style={{ color: "#FFFFFF" }}>
                Lastgangdaten hochladen
              </label>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "#AEAEAE" }}>
                Sie k{"\u00F6"}nnen beliebig viele Lastg{"\u00E4"}nge von Haupt- und Untermessungen hinzuf{"\u00FC"}gen (.csv, .xlsx, .xls).
              </p>
              <div
                className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-6 text-center transition-colors hover:border-opacity-40"
                style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-6" style={{ color: "#AEAEAE" }} />
                <p className="text-sm" style={{ color: "#AEAEAE" }}>
                  Dateien hier ablegen oder <span className="font-medium underline" style={{ color: "#E2EC2B" }}>durchsuchen</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={handleFiles}
                  className="hidden"
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="size-4 shrink-0" style={{ color: "#E2EC2B" }} />
                        <span className="text-sm" style={{ color: "#FFFFFF" }}>
                          {file.name}
                        </span>
                        <span className="text-xs" style={{ color: "#AEAEAE" }}>
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="rounded p-1 transition-colors hover:bg-white/10"
                      >
                        <X className="size-3.5" style={{ color: "#AEAEAE" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Free text */}
            <div className="mt-6">
              <label className="block text-sm font-medium" style={{ color: "#FFFFFF" }}>
                Weitere relevante Informationen zum Standort
              </label>
              <textarea
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={3}
                placeholder="z.B. Branche, Anzahl Standorte, besondere Verbrauchsmuster, vorhandene Messinfrastruktur ..."
                className="mt-1.5 block w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                }}
              />
            </div>

            {/* Consent checkbox */}
            <div className="mt-6 flex items-start gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={consent}
                onClick={() => setConsent(!consent)}
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: consent ? "#E2EC2B" : "rgba(255,255,255,0.25)",
                  backgroundColor: consent ? "#E2EC2B" : "transparent",
                }}
              >
                {consent && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#00095B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <label
                className="cursor-pointer text-sm leading-snug"
                style={{ color: "#AEAEAE" }}
                onClick={() => setConsent(!consent)}
              >
                Ich m{"\u00F6"}chte an der kostenfreien Analyse teilnehmen und willige ein, dass N-ERGIE meine Lastgangdaten an ecoplanet weitergeben darf und ecoplanet diese Daten zum Zweck der Energieanalyse verarbeiten darf. <span style={{ color: "#E2EC2B" }}>*</span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2.5" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
                <AlertCircle className="size-4 shrink-0" style={{ color: "#ef4444" }} />
                <p className="text-sm" style={{ color: "#fca5a5" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#E2EC2B", color: "#00095B" }}
            >
              {submitting ? "Wird gesendet\u2026" : "Anfrage absenden"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
