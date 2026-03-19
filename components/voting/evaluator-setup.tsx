'use client'

import { useState } from 'react'

interface EvaluatorSetupProps {
  onConfirm: (name: string) => void
}

export function EvaluatorSetup({ onConfirm }: EvaluatorSetupProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F5F7' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="px-8 pt-8 pb-6" style={{ backgroundColor: '#00095B' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">⚡</div>
              <div className="text-xs font-medium tracking-wider uppercase" style={{ color: '#E2EC2B' }}>
                Maßnahmen-Bewertung
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Herzlich willkommen
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Bitte geben Sie Ihren Namen ein, damit wir Ihre Bewertungen zuordnen können.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6 bg-white">
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                Ihr Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Max Mustermann"
                autoFocus
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: name.trim() ? '#00095B' : '#E0E0E0',
                  color: '#1a1a1a',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#00095B' }}
                onBlur={(e) => { e.target.style.borderColor = name.trim() ? '#00095B' : '#E0E0E0' }}
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="mt-4 w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: name.trim() ? '#E2EC2B' : '#E2EC2B',
                  color: '#00095B',
                }}
              >
                Bewertung starten →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
