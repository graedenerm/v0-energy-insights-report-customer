'use client'

import { useState } from 'react'
import type { VotingInsight, ImpressionValue, MetricValue, LocalEvaluationState } from '@/lib/voting-types'
import { ImpressionSelector } from './impression-selector'
import { MetricRow } from './metric-row'
import { MeasureVoteCard } from './measure-vote-card'

interface InsightVoteCardProps {
  insight: VotingInsight
  insightEvalState: LocalEvaluationState
  measureEvalStates: Record<string, LocalEvaluationState>
  onInsightImpression: (impression: ImpressionValue) => void
  onInsightMetric: (key: 'comprehensibility' | 'relevance' | 'plausibility', value: MetricValue) => void
  onMeasureImpression: (measureId: string, impression: ImpressionValue) => void
  onMeasureMetric: (measureId: string, key: 'comprehensibility' | 'relevance' | 'plausibility', value: MetricValue) => void
}

function typeLabel(type: string) {
  switch (type) {
    case 'baseload_structural': return 'Strukturelle Grundlast'
    case 'period_anomaly': return 'Perioden-Anomalie'
    default: return type.replace(/_/g, ' ')
  }
}

function formatEur(value: number | null) {
  if (value === null) return null
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function hypothesisColor(type: string) {
  switch (type) {
    case 'problem':     return { bg: '#FEF2F2', text: '#DC2626', label: 'Problem' }
    case 'opportunity': return { bg: '#EFF6FF', text: '#2563EB', label: 'Möglichkeit' }
    case 'benign':      return { bg: '#F0FFF4', text: '#16A34A', label: 'Ungefährlich' }
    default:            return { bg: '#F5F5F7', text: '#374151', label: type }
  }
}

export function InsightVoteCard({
  insight,
  insightEvalState,
  measureEvalStates,
  onInsightImpression,
  onInsightMetric,
  onMeasureImpression,
  onMeasureMetric,
}: InsightVoteCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  const raw = insight.raw_json as Record<string, unknown>
  const hypotheses = Array.isArray(raw?.hypotheses)
    ? (raw.hypotheses as Array<{ type: string; explanation: string }>)
    : []

  const locationStr = insight.location
    ? [insight.location.title, insight.location.street_name, insight.location.street_number]
        .filter(Boolean).join(', ')
    : null

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E0E0E0', borderLeft: '4px solid #00095B' }}>
      <div className="p-5 bg-white">

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#EEF0FF', color: '#1A2FEE' }}>
            {typeLabel(insight.type)}
          </span>
          {insight.confidence !== null && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F7', color: '#737373' }}>
              {Math.round(insight.confidence * 100)}% Konfidenz
            </span>
          )}
          {locationStr && (
            <span className="text-xs" style={{ color: '#737373' }}>📍 {locationStr}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug mb-2" style={{ color: '#00095B' }}>
          {insight.title}
        </h3>

        {/* Savings */}
        {insight.savings_eur_per_year !== null && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-bold" style={{ color: '#16a34a' }}>
              {formatEur(insight.savings_eur_per_year)}/Jahr
            </span>
            {insight.savings_kwh_per_year !== null && (
              <span className="text-xs" style={{ color: '#737373' }}>
                ({Math.round(insight.savings_kwh_per_year).toLocaleString('de-DE')} kWh)
              </span>
            )}
          </div>
        )}

        {/* Description — always fully visible, no clipping */}
        {insight.description && (
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#555' }}>
            {expanded ? insight.description : `${insight.description.slice(0, 200)}${insight.description.length > 200 ? '…' : ''}`}
          </p>
        )}

        {/* Hypotheses (expanded only) */}
        {expanded && hypotheses.length > 0 && (
          <div className="mt-3 mb-2 space-y-2">
            <div className="text-xs font-semibold" style={{ color: '#374151' }}>Hypothesen</div>
            {hypotheses.map((h, i) => {
              const colors = hypothesisColor(h.type)
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {colors.label}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{h.explanation}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Expand toggle */}
        {(hypotheses.length > 0 || (insight.description && insight.description.length > 200)) && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="text-xs font-medium mb-4" style={{ color: '#1A2FEE' }}>
            {expanded ? '▲ Weniger anzeigen' : '▼ Vollständige Analyse lesen'}
          </button>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #F0F0F0', marginBottom: '16px' }} />

        {/* Rating section — stacks on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">

          {/* Impression buttons */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold" style={{ color: '#374151' }}>Befund bewerten</div>
            <ImpressionSelector
              value={insightEvalState.impression}
              onChange={onInsightImpression}
              disabled={insightEvalState.saving}
            />
            <div className="flex items-center gap-3 min-h-[20px]">
              {insightEvalState.saving && (
                <span className="text-xs" style={{ color: '#737373' }}>Speichert…</span>
              )}
              {insightEvalState.saved && !insightEvalState.saving && insightEvalState.impression && (
                <span className="text-xs" style={{ color: '#16a34a' }}>✓ Gespeichert</span>
              )}
              {insightEvalState.impression && (
                <button type="button" onClick={() => setShowMetrics(!showMetrics)} className="text-xs font-medium" style={{ color: '#737373' }}>
                  {showMetrics ? '▲ Details ausblenden' : '▼ Detailbewertung'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Full-width detail metrics */}
        {showMetrics && insightEvalState.impression && (
          <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid #F0F0F0' }}>
            <div className="text-xs font-semibold" style={{ color: '#374151' }}>Detailbewertung (optional)</div>
            <MetricRow label="Verständlichkeit" value={insightEvalState.comprehensibility} onChange={(v) => onInsightMetric('comprehensibility', v)} />
            <MetricRow label="Relevanz"          value={insightEvalState.relevance}          onChange={(v) => onInsightMetric('relevance', v)} />
            <MetricRow label="Plausibilität"     value={insightEvalState.plausibility}       onChange={(v) => onInsightMetric('plausibility', v)} />
          </div>
        )}
      </div>

      {/* Measures */}
      {insight.measures.length > 0 && (
        <div className="px-5 py-4" style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #F0F0F0' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: '#737373' }}>
            {insight.measures.length} EMPFOHLENE MAẞNAHME{insight.measures.length !== 1 ? 'N' : ''}
          </div>
          <div className="space-y-3">
            {insight.measures.map((measure) => (
              <MeasureVoteCard
                key={measure.id}
                measure={measure}
                evalState={measureEvalStates[measure.id] ?? { impression: null, comprehensibility: null, relevance: null, plausibility: null, notes: '', saved: false, saving: false }}
                onImpression={(imp) => onMeasureImpression(measure.id, imp)}
                onMetric={(key, val) => onMeasureMetric(measure.id, key, val)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
