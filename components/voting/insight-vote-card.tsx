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

  const hypothesisColor = (type: string) => {
    switch (type) {
      case 'problem': return { bg: '#FEF2F2', text: '#DC2626', label: 'Problem' }
      case 'opportunity': return { bg: '#EFF6FF', text: '#2563EB', label: 'Möglichkeit' }
      case 'benign': return { bg: '#F0FFF4', text: '#16A34A', label: 'Ungefährlich' }
      default: return { bg: '#F5F5F7', text: '#374151', label: type }
    }
  }

  const locationStr = insight.location
    ? [insight.location.title, insight.location.street_name, insight.location.street_number]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ border: '1px solid #E0E0E0', borderLeft: '4px solid #00095B' }}
    >
      {/* Insight content */}
      <div className="p-5 bg-white">
        <div className="flex items-start gap-4">
          {/* Left: content */}
          <div className="flex-1 min-w-0">
            {/* Type badge + location */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#EEF0FF', color: '#1A2FEE' }}
              >
                {typeLabel(insight.type)}
              </span>
              {insight.confidence !== null && (
                <span className="text-xs" style={{ color: '#737373' }}>
                  {Math.round(insight.confidence * 100)}% Konfidenz
                </span>
              )}
              {locationStr && (
                <span className="text-xs" style={{ color: '#737373' }}>
                  📍 {locationStr}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold leading-snug mb-2" style={{ color: '#00095B' }}>
              {insight.title}
            </h3>

            {/* Savings */}
            {insight.savings_eur_per_year !== null && (
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: '#16a34a' }}
                >
                  {formatEur(insight.savings_eur_per_year)}/Jahr
                </span>
                {insight.savings_kwh_per_year !== null && (
                  <span className="text-xs" style={{ color: '#737373' }}>
                    ({Math.round(insight.savings_kwh_per_year).toLocaleString('de-DE')} kWh)
                  </span>
                )}
              </div>
            )}

            {/* Description preview */}
            {insight.description && (
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#555' }}>
                {insight.description}
              </p>
            )}

            {/* Expand toggle */}
            {(hypotheses.length > 0 || insight.description) && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-xs font-medium"
                style={{ color: '#1A2FEE' }}
              >
                {expanded ? '▲ Weniger' : '▼ Vollständige Analyse'}
              </button>
            )}

            {/* Expanded: hypotheses */}
            {expanded && hypotheses.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold" style={{ color: '#374151' }}>Hypothesen</div>
                {hypotheses.map((h, i) => {
                  const colors = hypothesisColor(h.type)
                  return (
                    <div key={i} className="flex gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 h-fit mt-0.5"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {colors.label}
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                        {h.explanation}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {expanded && insight.description && (
              <div className="mt-3">
                <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                  {insight.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: rating panel */}
          <div className="flex flex-col gap-2 shrink-0" style={{ width: '160px' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#374151' }}>Befund bewerten</div>
            <ImpressionSelector
              value={insightEvalState.impression}
              onChange={onInsightImpression}
              disabled={insightEvalState.saving}
            />

            {insightEvalState.saving && (
              <div className="text-xs text-center" style={{ color: '#737373' }}>Speichert…</div>
            )}
            {insightEvalState.saved && !insightEvalState.saving && insightEvalState.impression && (
              <div className="text-xs text-center" style={{ color: '#16a34a' }}>✓ Gespeichert</div>
            )}

            {insightEvalState.impression && (
              <button
                type="button"
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-xs font-medium text-center"
                style={{ color: '#737373' }}
              >
                {showMetrics ? '▲ Weniger' : '▼ Details'}
              </button>
            )}

            {showMetrics && insightEvalState.impression && (
              <div className="space-y-2 pt-1 border-t" style={{ borderColor: '#F0F0F0' }}>
                <MetricRow
                  label="Verständlichkeit"
                  value={insightEvalState.comprehensibility}
                  onChange={(v) => onInsightMetric('comprehensibility', v)}
                />
                <MetricRow
                  label="Relevanz"
                  value={insightEvalState.relevance}
                  onChange={(v) => onInsightMetric('relevance', v)}
                />
                <MetricRow
                  label="Plausibilität"
                  value={insightEvalState.plausibility}
                  onChange={(v) => onInsightMetric('plausibility', v)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Measures section */}
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
                evalState={measureEvalStates[measure.id] ?? {
                  impression: null, comprehensibility: null, relevance: null,
                  plausibility: null, notes: '', saved: false, saving: false
                }}
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
