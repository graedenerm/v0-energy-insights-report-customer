'use client'

import { useState } from 'react'
import type { VotingMeasure, ImpressionValue, MetricValue, LocalEvaluationState } from '@/lib/voting-types'
import { ImpressionSelector } from './impression-selector'
import { MetricRow } from './metric-row'

interface MeasureVoteCardProps {
  measure: VotingMeasure
  evalState: LocalEvaluationState
  onImpression: (impression: ImpressionValue) => void
  onMetric: (key: 'comprehensibility' | 'relevance' | 'plausibility', value: MetricValue) => void
}

function formatEur(value: number | null) {
  if (value === null) return '–'
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function effortLabel(level: string | null) {
  switch (level) {
    case 'LOW': return 'Geringer Aufwand'
    case 'MEDIUM': return 'Mittlerer Aufwand'
    case 'HIGH': return 'Hoher Aufwand'
    default: return level ?? ''
  }
}

export function MeasureVoteCard({ measure, evalState, onImpression, onMetric }: MeasureVoteCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  const raw = measure.raw_json as Record<string, unknown>
  const reasoning = typeof raw?.reasoning === 'string' ? raw.reasoning : null
  const evidences = Array.isArray(raw?.evidences) ? raw.evidences as string[] : []

  const hasSavings = measure.yearly_savings_eur_from !== null || measure.yearly_savings_eur_to !== null
  const hasInvestment = measure.investment_from !== null || measure.investment_to !== null

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E2EC2B', borderLeftWidth: '4px' }}>
      <div className="p-4 bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {measure.effort_level && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#F5F5F7', color: '#374151' }}
                >
                  {effortLabel(measure.effort_level)}
                </span>
              )}
              {measure.confidence !== null && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#F5F5F7', color: '#374151' }}
                >
                  {measure.confidence}% Konfidenz
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="text-sm font-semibold leading-snug mb-1" style={{ color: '#00095B' }}>
              {measure.title}
            </h4>

            {/* Short description */}
            {measure.short_description && (
              <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                {measure.short_description}
              </p>
            )}

            {/* Financial grid */}
            {(hasSavings || hasInvestment || measure.amortisation_months !== null) && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {hasSavings && (
                  <div className="rounded-lg p-2 text-center" style={{ backgroundColor: '#F0FFF4' }}>
                    <div className="text-xs font-medium" style={{ color: '#16a34a' }}>
                      {formatEur(measure.yearly_savings_eur_from)}
                      {measure.yearly_savings_eur_to && measure.yearly_savings_eur_to !== measure.yearly_savings_eur_from
                        ? ` – ${formatEur(measure.yearly_savings_eur_to)}`
                        : ''}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#737373' }}>Einsparung/Jahr</div>
                  </div>
                )}
                {hasInvestment && (
                  <div className="rounded-lg p-2 text-center" style={{ backgroundColor: '#F5F5F7' }}>
                    <div className="text-xs font-medium" style={{ color: '#1a1a1a' }}>
                      {formatEur(measure.investment_from)}
                      {measure.investment_to && measure.investment_to !== measure.investment_from
                        ? ` – ${formatEur(measure.investment_to)}`
                        : ''}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#737373' }}>Investition</div>
                  </div>
                )}
                {measure.amortisation_months !== null && (
                  <div className="rounded-lg p-2 text-center" style={{ backgroundColor: '#F5F5F7' }}>
                    <div className="text-xs font-medium" style={{ color: '#1a1a1a' }}>
                      {measure.amortisation_months < 12
                        ? `${measure.amortisation_months} Mon.`
                        : `${Math.round(measure.amortisation_months / 12 * 10) / 10} J.`}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#737373' }}>Amortisation</div>
                  </div>
                )}
              </div>
            )}

            {/* Expand toggle */}
            {(measure.description || reasoning || evidences.length > 0) && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-xs font-medium transition-colors"
                style={{ color: '#1A2FEE' }}
              >
                {expanded ? '▲ Weniger anzeigen' : '▼ Beschreibung & Begründung'}
              </button>
            )}

            {/* Expanded content */}
            {expanded && (
              <div className="mt-3 space-y-3">
                {measure.description && (
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#374151' }}>Beschreibung</div>
                    <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                      {measure.description}
                    </p>
                  </div>
                )}
                {reasoning && (
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#374151' }}>Begründung</div>
                    <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{reasoning}</p>
                  </div>
                )}
                {evidences.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#374151' }}>Belege</div>
                    <ul className="space-y-1">
                      {evidences.map((ev, i) => (
                        <li key={i} className="text-xs flex gap-1.5" style={{ color: '#555' }}>
                          <span style={{ color: '#E2EC2B', flexShrink: 0 }}>•</span>
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rating panel */}
          <div className="flex flex-col gap-2 shrink-0" style={{ width: '160px' }}>
            <ImpressionSelector
              value={evalState.impression}
              onChange={onImpression}
              disabled={evalState.saving}
            />

            {evalState.saving && (
              <div className="text-xs text-center" style={{ color: '#737373' }}>Speichert…</div>
            )}
            {evalState.saved && !evalState.saving && evalState.impression && (
              <div className="text-xs text-center" style={{ color: '#16a34a' }}>✓ Gespeichert</div>
            )}

            {evalState.impression && (
              <button
                type="button"
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-xs font-medium text-center transition-colors"
                style={{ color: '#737373' }}
              >
                {showMetrics ? '▲ Weniger' : '▼ Details'}
              </button>
            )}

            {showMetrics && evalState.impression && (
              <div className="space-y-2 pt-1 border-t" style={{ borderColor: '#F0F0F0' }}>
                <MetricRow
                  label="Verständlichkeit"
                  value={evalState.comprehensibility}
                  onChange={(v) => onMetric('comprehensibility', v)}
                />
                <MetricRow
                  label="Relevanz"
                  value={evalState.relevance}
                  onChange={(v) => onMetric('relevance', v)}
                />
                <MetricRow
                  label="Plausibilität"
                  value={evalState.plausibility}
                  onChange={(v) => onMetric('plausibility', v)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
