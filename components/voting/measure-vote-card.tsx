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
  if (value === null) return null
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function effortLabel(level: string | null) {
  switch (level) {
    case 'LOW':    return 'Geringer Aufwand'
    case 'MEDIUM': return 'Mittlerer Aufwand'
    case 'HIGH':   return 'Hoher Aufwand'
    default:       return level ?? ''
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
  const hasFinancials = hasSavings || hasInvestment || measure.amortisation_months !== null
  const hasExpandable = measure.description || reasoning || evidences.length > 0

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8E8E8', borderLeft: '4px solid #E2EC2B' }}>
      <div className="p-4 bg-white">

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {measure.effort_level && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#F5F5F7', color: '#374151' }}>
              {effortLabel(measure.effort_level)}
            </span>
          )}
          {measure.confidence !== null && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#F5F5F7', color: '#374151' }}>
              {measure.confidence}% Konfidenz
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold leading-snug mb-1" style={{ color: '#00095B' }}>
          {measure.title}
        </h4>

        {/* Short description — always fully shown */}
        {measure.short_description && (
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#555' }}>
            {measure.short_description}
          </p>
        )}

        {/* Financial grid */}
        {hasFinancials && (
          <div className="flex flex-wrap gap-2 mb-3">
            {hasSavings && (
              <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#F0FFF4' }}>
                <div className="text-xs font-semibold" style={{ color: '#16a34a' }}>
                  {formatEur(measure.yearly_savings_eur_from)}
                  {measure.yearly_savings_eur_to && measure.yearly_savings_eur_to !== measure.yearly_savings_eur_from
                    ? ` – ${formatEur(measure.yearly_savings_eur_to)}`
                    : ''}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#737373' }}>Einsparung/Jahr</div>
              </div>
            )}
            {hasInvestment && (
              <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>
                  {formatEur(measure.investment_from)}
                  {measure.investment_to && measure.investment_to !== measure.investment_from
                    ? ` – ${formatEur(measure.investment_to)}`
                    : ''}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#737373' }}>Investition</div>
              </div>
            )}
            {measure.amortisation_months !== null && (
              <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>
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
        {hasExpandable && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="text-xs font-medium mb-3" style={{ color: '#1A2FEE' }}>
            {expanded ? '▲ Weniger' : '▼ Beschreibung & Begründung'}
          </button>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="mb-3 space-y-3">
            {measure.description && (
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#374151' }}>Beschreibung</div>
                <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{measure.description}</p>
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
                    <li key={i} className="text-xs flex gap-1.5 items-start" style={{ color: '#555' }}>
                      <span className="shrink-0 mt-0.5" style={{ color: '#E2EC2B' }}>•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #F0F0F0', marginBottom: '12px' }} />

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold" style={{ color: '#374151' }}>Maßnahme bewerten</div>
          <ImpressionSelector
            value={evalState.impression}
            onChange={onImpression}
            disabled={evalState.saving}
          />
          <div className="flex items-center gap-3 min-h-[20px]">
            {evalState.saving && (
              <span className="text-xs" style={{ color: '#737373' }}>Speichert…</span>
            )}
            {evalState.saved && !evalState.saving && evalState.impression && (
              <span className="text-xs" style={{ color: '#16a34a' }}>✓ Gespeichert</span>
            )}
            {evalState.impression && (
              <button type="button" onClick={() => setShowMetrics(!showMetrics)} className="text-xs font-medium" style={{ color: '#737373' }}>
                {showMetrics ? '▲ Details ausblenden' : '▼ Detailbewertung'}
              </button>
            )}
          </div>
        </div>

        {/* Full-width detail metrics */}
        {showMetrics && evalState.impression && (
          <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid #F0F0F0' }}>
            <div className="text-xs font-semibold" style={{ color: '#374151' }}>Detailbewertung (optional)</div>
            <MetricRow label="Verständlichkeit" value={evalState.comprehensibility} onChange={(v) => onMetric('comprehensibility', v)} />
            <MetricRow label="Relevanz"          value={evalState.relevance}          onChange={(v) => onMetric('relevance', v)} />
            <MetricRow label="Plausibilität"     value={evalState.plausibility}       onChange={(v) => onMetric('plausibility', v)} />
          </div>
        )}
      </div>
    </div>
  )
}
